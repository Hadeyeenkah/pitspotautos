// ========================================
// FIREBASE INITIALIZATION
// ========================================
// Wait for Firebase to be available from HTML
let db, storage, auth;
let vehicles = [];

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      db = firebase.firestore();
      storage = firebase.storage();
      auth = firebase.auth();
      console.log('✅ Firebase services initialized');
      return true;
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
  console.error('❌ Firebase not loaded');
  return false;
}

// ========================================
// STATE MANAGEMENT
// ========================================
let state = {
  currentPage: 1,
  itemsPerPage: 9,
  filters: {
    search: '',
    priceMax: 100000000,
    makes: [],
    bodyTypes: [],
    transmissions: [],
    fuels: []
  },
  sortBy: 'relevant',
  quickFilter: 'all',
  isAdmin: false,
  savedVehicles: [],
  loading: false
};

// ========================================
// FIREBASE FUNCTIONS
// ========================================
async function loadVehiclesFromFirebase() {
  try {
    state.loading = true;
    showLoadingSpinner();
    
    const snapshot = await db.collection('vehicles').orderBy('createdAt', 'desc').get();
    vehicles = [];
    
    snapshot.forEach(doc => {
      vehicles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Loaded ${vehicles.length} vehicles from Firebase`);
    state.loading = false;
    hideLoadingSpinner();
    renderVehicles();
    updateStats();
  } catch (error) {
    console.error('❌ Error loading vehicles:', error);
    state.loading = false;
    hideLoadingSpinner();
    showError('Failed to load vehicles. Please refresh the page.');
  }
}

async function saveVehicleToFirebase(vehicleData) {
  try {
    const docRef = await db.collection('vehicles').add({
      ...vehicleData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Vehicle saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving vehicle:', error);
    throw error;
  }
}

async function updateVehicleInFirebase(vehicleId, vehicleData) {
  try {
    await db.collection('vehicles').doc(vehicleId).update({
      ...vehicleData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Vehicle updated:', vehicleId);
  } catch (error) {
    console.error('❌ Error updating vehicle:', error);
    throw error;
  }
}

async function deleteVehicleFromFirebase(vehicleId) {
  try {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    // Delete vehicle document
    await db.collection('vehicles').doc(vehicleId).delete();
    
    // Delete associated images from storage
    if (vehicle && vehicle.images) {
      for (const imageUrl of vehicle.images) {
        if (imageUrl.includes('firebasestorage')) {
          try {
            const imageRef = storage.refFromURL(imageUrl);
            await imageRef.delete();
            console.log('✅ Image deleted from storage');
          } catch (err) {
            console.warn('Could not delete image:', err);
          }
        }
      }
    }
    
    console.log('✅ Vehicle deleted:', vehicleId);
  } catch (error) {
    console.error('❌ Error deleting vehicle:', error);
    throw error;
  }
}

async function uploadImageToFirebase(file, vehicleId) {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image size must be less than 10MB');
    }

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `vehicles/${vehicleId}/${timestamp}_${sanitizedFileName}`;
    const storageRef = storage.ref(fileName);
    
    // Upload file with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'vehicleId': vehicleId,
        'uploadedAt': new Date().toISOString()
      }
    };
    
    console.log(`⏳ Uploading ${file.name} to Firebase Storage...`);
    const uploadTask = await storageRef.put(file, metadata);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    
    console.log('✅ Image uploaded:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw error;
  }
}

// Enhanced batch upload function
async function uploadMultipleImages(files, vehicleId, progressCallback) {
  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      if (progressCallback) {
        progressCallback(i + 1, files.length, file.name);
      }
      
      const url = await uploadImageToFirebase(file, vehicleId);
      results.success.push({ file: file.name, url });
    } catch (error) {
      results.failed.push({ file: file.name, error: error.message });
    }
  }

  return results;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatPrice(price) {
  return '₦' + new Intl.NumberFormat('en-NG').format(price);
}

function formatMileage(miles) {
  return new Intl.NumberFormat('en-US').format(miles);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function showLoadingSpinner() {
  const grid = document.getElementById('vehicle-grid');
  grid.innerHTML = `
    <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; min-height: 400px;">
      <div style="width: 60px; height: 60px; border: 4px solid #f3f3f3; border-top: 4px solid #e63946; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1.5rem;"></div>
      <p style="font-size: 1.1rem; color: #666; font-weight: 500;">Loading vehicles...</p>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
}

function hideLoadingSpinner() {
  // Spinner will be replaced by vehicle cards
}

function showError(message) {
  const grid = document.getElementById('vehicle-grid');
  grid.innerHTML = `
    <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; min-height: 400px;">
      <h3 style="font-size: 2rem; color: #e63946; margin-bottom: 1rem;">⚠️ Error</h3>
      <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem; max-width: 500px;">${message}</p>
      <button class="btn-primary" onclick="loadVehiclesFromFirebase()" style="background: linear-gradient(135deg, #e63946 0%, #c62828 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.9rem;">Retry</button>
    </div>
  `;
}

function updateStats() {
  const suvCount = vehicles.filter(v => v.bodyType === 'suv').length;
  const sedanCount = vehicles.filter(v => v.bodyType === 'sedan').length;
  const truckCount = vehicles.filter(v => v.bodyType === 'truck').length;
  
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    statsBar.innerHTML = `
      <div class="stat-item" onclick="filterByType('suv')">
        <span class="stat-number">${suvCount}</span>
        <span class="stat-label">SUVs</span>
      </div>
      <div class="stat-item" onclick="filterByType('sedan')">
        <span class="stat-number">${sedanCount}</span>
        <span class="stat-label">Sedans</span>
      </div>
      <div class="stat-item" onclick="filterByType('truck')">
        <span class="stat-number">${truckCount}</span>
        <span class="stat-label">Trucks</span>
      </div>
    `;
  }
}

// ========================================
// FILTER & SORT FUNCTIONS
// ========================================
function getFilteredVehicles() {
  return vehicles.filter(vehicle => {
    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase();
      const searchString = `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase();
      if (!searchString.includes(searchTerm)) return false;
    }

    if (vehicle.price > state.filters.priceMax) return false;

    if (state.filters.makes.length > 0) {
      if (!state.filters.makes.includes(vehicle.make.toLowerCase())) return false;
    }

    if (state.filters.bodyTypes.length > 0) {
      if (!state.filters.bodyTypes.includes(vehicle.bodyType)) return false;
    }

    if (state.filters.transmissions.length > 0) {
      if (!state.filters.transmissions.includes(vehicle.transmission.toLowerCase())) return false;
    }

    if (state.filters.fuels.length > 0) {
      if (!state.filters.fuels.includes(vehicle.fuel.toLowerCase())) return false;
    }

    if (state.quickFilter !== 'all') {
      switch(state.quickFilter) {
        case 'new':
          if (!vehicle.badges || !vehicle.badges.includes('new')) return false;
          break;
        case 'certified':
          if (!vehicle.badges || !vehicle.badges.includes('certified')) return false;
          break;
        case 'under30k':
          if (vehicle.price >= 30000000) return false;
          break;
        case 'low-miles':
          if (vehicle.mileage > 20000) return false;
          break;
      }
    }

    return true;
  });
}

function getSortedVehicles(vehiclesToSort) {
  const sorted = [...vehiclesToSort];
  
  switch(state.sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'year-new':
      return sorted.sort((a, b) => b.year - a.year);
    case 'mileage-low':
      return sorted.sort((a, b) => a.mileage - b.mileage);
    default:
      return sorted;
  }
}

function getPaginatedVehicles(vehiclesToPaginate) {
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  return vehiclesToPaginate.slice(start, end);
}

// ========================================
// RENDER FUNCTIONS
// ========================================
function renderVehicleCard(vehicle) {
  const badgesHTML = vehicle.badges ? vehicle.badges.map(badge => 
    `<span class="badge badge-${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span>`
  ).join('') : '';

  const isSaved = state.savedVehicles.includes(vehicle.id);
  const firstImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://via.placeholder.com/400x300?text=No+Image';

  return `
    <div class="vehicle-card" data-id="${vehicle.id}">
      <div class="card-image-container" onclick="viewDetails('${vehicle.id}')">
        <img src="${firstImage}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}" class="card-image" loading="lazy">
        <div class="card-badges">${badgesHTML}</div>
        <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(event, '${vehicle.id}')">
          ${isSaved ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-content">
        <h3 class="card-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
        <p class="card-subtitle">${vehicle.color}</p>
        <div class="card-specs">
          <span class="spec-item">📍 ${formatMileage(vehicle.mileage)} mi</span>
          <span class="spec-item">⚙️ ${vehicle.transmission}</span>
          <span class="spec-item">⛽ ${vehicle.fuel}</span>
        </div>
        <div class="card-footer">
          <div class="card-price">${formatPrice(vehicle.price)}</div>
          <button class="btn-details" onclick="viewDetails('${vehicle.id}')">View Details</button>
        </div>
      </div>
    </div>
  `;
}

function renderVehicles() {
  const grid = document.getElementById('vehicle-grid');
  const filtered = getFilteredVehicles();
  const sorted = getSortedVehicles(filtered);
  const paginated = getPaginatedVehicles(sorted);

  if (paginated.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No Vehicles Found</h3>
        <p>Try adjusting your filters or search criteria</p>
        ${state.isAdmin ? '<button class="btn-primary" onclick="openAddVehicleModal()" style="margin-top: 1rem; background: linear-gradient(135deg, #e63946 0%, #c62828 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 700;">➕ Add New Vehicle</button>' : ''}
      </div>
    `;
  } else {
    grid.innerHTML = paginated.map(renderVehicleCard).join('');
  }

  updateCounts(paginated.length, filtered.length);
  renderPagination(filtered.length);
}

function updateCounts(showing, total) {
  document.getElementById('showing-count').textContent = showing;
  document.getElementById('results-count').textContent = total;
  document.getElementById('total-count').textContent = vehicles.length;
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / state.itemsPerPage);
  const pageNumbersContainer = document.getElementById('page-numbers');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  prevBtn.disabled = state.currentPage === 1;
  nextBtn.disabled = state.currentPage === totalPages || totalPages === 0;

  let pages = [];
  if (totalPages <= 7) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (state.currentPage <= 3) {
      pages = [1, 2, 3, 4, '...', totalPages];
    } else if (state.currentPage >= totalPages - 2) {
      pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', state.currentPage - 1, state.currentPage, state.currentPage + 1, '...', totalPages];
    }
  }

  pageNumbersContainer.innerHTML = pages.map(page => {
    if (page === '...') return '<span class="page-ellipsis">...</span>';
    return `<button class="page-number ${page === state.currentPage ? 'active' : ''}" onclick="goToPage(${page})">${page}</button>`;
  }).join('');
}

// ========================================
// MODAL FUNCTIONS
// ========================================
function viewDetails(id) {
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) return;

  const badgesHTML = vehicle.badges ? vehicle.badges.map(badge => 
    `<span class="badge badge-${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span>`
  ).join('') : '';

  const thumbnailsHTML = vehicle.images && vehicle.images.length > 0 ? vehicle.images.map((img, index) =>
    `<div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(${index}, '${img}')">
      <img src="${img}" alt="View ${index + 1}" loading="lazy">
    </div>`
  ).join('') : '';

  const featuresHTML = vehicle.features ? vehicle.features.map(feature =>
    `<div class="feature-item">${feature}</div>`
  ).join('') : '';

  const firstImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://via.placeholder.com/800x600?text=No+Image';

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div class="modal-gallery">
      <div class="main-image-container">
        <img id="modal-main-image" src="${firstImage}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}">
      </div>
      <div class="thumbnail-grid">
        ${thumbnailsHTML}
      </div>
    </div>
    
    <div class="modal-info">
      <div class="modal-header-section">
        <h2 class="modal-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
        <div class="modal-badges">${badgesHTML}</div>
      </div>

      <div class="price-section">
        <div class="modal-price">${formatPrice(vehicle.price)}</div>
        <div class="modal-price-label">Best price guaranteed</div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Year</span>
          <span class="info-value">${vehicle.year}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Mileage</span>
          <span class="info-value">${formatMileage(vehicle.mileage)} mi</span>
        </div>
        <div class="info-item">
          <span class="info-label">Color</span>
          <span class="info-value">${vehicle.color}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Body Type</span>
          <span class="info-value">${vehicle.bodyType.toUpperCase()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Transmission</span>
          <span class="info-value">${vehicle.transmission}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Fuel Type</span>
          <span class="info-value">${vehicle.fuel}</span>
        </div>
      </div>

      <div class="description-section">
        <h3 class="section-title">Description</h3>
        <p class="description-text">${vehicle.description || 'No description available'}</p>
      </div>

      ${vehicle.engine || vehicle.horsepower ? `
      <div class="specs-section">
        <h3 class="section-title">Vehicle Specifications</h3>
        <div class="specs-grid">
          ${vehicle.engine ? `<div class="spec-row"><span class="spec-label">Engine</span><span class="spec-value">${vehicle.engine}</span></div>` : ''}
          ${vehicle.horsepower ? `<div class="spec-row"><span class="spec-label">Horsepower</span><span class="spec-value">${vehicle.horsepower}</span></div>` : ''}
          ${vehicle.acceleration ? `<div class="spec-row"><span class="spec-label">Acceleration</span><span class="spec-value">${vehicle.acceleration}</span></div>` : ''}
          ${vehicle.warranty ? `<div class="spec-row"><span class="spec-label">Warranty</span><span class="spec-value">${vehicle.warranty}</span></div>` : ''}
        </div>
      </div>
      ` : ''}

      ${vehicle.features && vehicle.features.length > 0 ? `
      <div class="features-section">
        <h3 class="section-title">Key Features</h3>
        <div class="features-grid">
          ${featuresHTML}
        </div>
      </div>
      ` : ''}

      <div class="modal-actions">
        <button class="btn-primary" onclick="contactDealer('${vehicle.id}')">Contact Dealer</button>
        <button class="btn-secondary" onclick="scheduleTestDrive('${vehicle.id}')">Schedule Test Drive</button>
        ${state.isAdmin ? `<button class="btn-edit" onclick="openEditModal('${vehicle.id}')">Edit Vehicle</button>` : ''}
      </div>
    </div>
  `;

  const modal = document.getElementById('vehicle-modal');
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function changeMainImage(index, src) {
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.thumbnail')[index].classList.add('active');
  document.getElementById('modal-main-image').src = src;
}

function closeModal() {
  const modal = document.getElementById('vehicle-modal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 300);
}

function contactDealer(id) {
  const vehicle = vehicles.find(v => v.id === id);
  alert(`Contact dealer about: ${vehicle.year} ${vehicle.make} ${vehicle.model}\n\nThis feature will be available soon!`);
}

function scheduleTestDrive(id) {
  const vehicle = vehicles.find(v => v.id === id);
  alert(`Schedule test drive for: ${vehicle.year} ${vehicle.make} ${vehicle.model}\n\nThis feature will be available soon!`);
}

// ========================================
// FILTER FUNCTIONS
// ========================================
function applyFilters() {
  state.filters.search = document.getElementById('search-input').value.trim();
  state.filters.priceMax = parseInt(document.getElementById('price-slider').value);
  state.filters.makes = Array.from(document.querySelectorAll('input[name="make"]:checked')).map(cb => cb.value);
  state.filters.bodyTypes = Array.from(document.querySelectorAll('input[name="body"]:checked')).map(cb => cb.value);
  state.filters.transmissions = Array.from(document.querySelectorAll('input[name="transmission"]:checked')).map(cb => cb.value);
  state.filters.fuels = Array.from(document.querySelectorAll('input[name="fuel"]:checked')).map(cb => cb.value);
  state.currentPage = 1;
  renderVehicles();
  closeMobileFilters();
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('price-slider').value = 100000000;
  document.getElementById('max-price-display').value = formatPrice(100000000);
  document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);

  state.filters = {
    search: '',
    priceMax: 100000000,
    makes: [],
    bodyTypes: [],
    transmissions: [],
    fuels: []
  };
  state.currentPage = 1;
  state.quickFilter = 'all';

  document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');

  renderVehicles();
}

function filterByType(type) {
  clearFilters();
  const checkbox = document.querySelector(`input[name="body"][value="${type}"]`);
  if (checkbox) {
    checkbox.checked = true;
    applyFilters();
  }
}

function goToPage(page) {
  state.currentPage = page;
  renderVehicles();
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

function toggleSave(event, id) {
  event.stopPropagation();
  const index = state.savedVehicles.indexOf(id);
  if (index > -1) {
    state.savedVehicles.splice(index, 1);
  } else {
    state.savedVehicles.push(id);
  }
  renderVehicles();
}

// ========================================
// ADMIN CONFIGURATION
// ========================================
const ADMIN_PASSWORD = 'Aa123123Aa';

// ========================================
// ADMIN FUNCTIONS
// ========================================
function toggleAdminMode() {
  if (!state.isAdmin) {
    showPasswordModal();
  } else {
    state.isAdmin = false;
    const btn = document.getElementById('admin-toggle');
    btn.innerHTML = '<span class="admin-icon">🔐</span> Admin';
    btn.classList.remove('active');
    
    // Remove FAB if exists
    const fab = document.getElementById('add-vehicle-fab');
    if (fab) fab.remove();
    
    renderVehicles();
    alert('👋 Admin Mode Deactivated');
  }
}

function showPasswordModal() {
  const modal = document.getElementById('edit-modal');
  const editBody = document.getElementById('edit-body');
  
  editBody.innerHTML = `
    <div class="edit-form-container">
      <div class="form-header">
        <h2>🔐 Admin Authentication</h2>
        <p style="color: #666; margin-top: 0.5rem;">Enter admin password to access control panel</p>
      </div>
      
      <form id="password-form" class="edit-form">
        <div class="form-group">
          <label>Admin Password</label>
          <input 
            type="password" 
            id="admin-password-input" 
            placeholder="Enter password" 
            required
            autocomplete="off"
            style="font-size: 1.2rem; padding: 1rem;">
        </div>
        
        <div id="password-error" style="display: none; padding: 12px; background: #f8d7da; color: #721c24; border-radius: 8px; margin-bottom: 1rem; font-weight: 600;">
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" style="min-width: 100%;">
            🔓 Unlock Admin Panel
          </button>
          <button type="button" class="btn-secondary" onclick="closePasswordModal()" style="min-width: 100%;">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    verifyAdminPassword();
  });

  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    document.getElementById('admin-password-input').focus();
  }, 100);
}

function verifyAdminPassword() {
  const passwordInput = document.getElementById('admin-password-input');
  const errorDiv = document.getElementById('password-error');
  const enteredPassword = passwordInput.value;

  if (enteredPassword === ADMIN_PASSWORD) {
    state.isAdmin = true;
    const btn = document.getElementById('admin-toggle');
    btn.innerHTML = '👤 Exit Admin';
    btn.classList.add('active');
    
    closePasswordModal();
    renderVehicles();
    
    // Show add button
    const addBtnHtml = '<button class="btn-primary" onclick="openAddVehicleModal()" style="position: fixed; bottom: 80px; right: 24px; z-index: 9998; padding: 12px 24px; background: linear-gradient(135deg, #28a745 0%, #218838 100%); color: white; border: none; border-radius: 25px; font-weight: 700; cursor: pointer; box-shadow: 0 5px 18px rgba(40, 167, 69, 0.3);">➕ Add Vehicle</button>';
    if (!document.getElementById('add-vehicle-fab')) {
      const fabDiv = document.createElement('div');
      fabDiv.id = 'add-vehicle-fab';
      fabDiv.innerHTML = addBtnHtml;
      document.body.appendChild(fabDiv);
    }
    
    alert('✅ Admin Mode Activated!\n\nYou can now:\n• Add new vehicles\n• Edit vehicle details\n• Upload images to Firebase\n• Delete vehicles');
  } else {
    errorDiv.textContent = '❌ Incorrect password. Please try again.';
    errorDiv.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
    
    passwordInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
      passwordInput.style.animation = '';
    }, 500);
  }
}

function closePasswordModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 300);
}

// ========================================
// ADD VEHICLE MODAL WITH ENHANCED UPLOAD
// ========================================
function openAddVehicleModal() {
  closeModal();

  const editBody = document.getElementById('edit-body');
  const newVehicleImages = [];

  editBody.innerHTML = `
    <div class="edit-form-container">
      <div class="form-header">
        <h2>➕ Add New Vehicle</h2>
        <p>Fill in the details and upload images to Firebase Storage</p>
      </div>
      
      <form id="add-form" class="edit-form">
        <div class="form-row">
          <div class="form-group">
            <label>Make *</label>
            <input type="text" name="make" required placeholder="e.g., Toyota">
          </div>
          <div class="form-group">
            <label>Model *</label>
            <input type="text" name="model" required placeholder="e.g., Camry">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Year *</label>
            <input type="number" name="year" value="2024" min="2000" max="2025" required>
          </div>
          <div class="form-group">
            <label>Price (₦) *</label>
            <input type="number" name="price" required placeholder="e.g., 15000000">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Mileage *</label>
            <input type="number" name="mileage" required placeholder="e.g., 5000">
          </div>
          <div class="form-group">
            <label>Color *</label>
            <input type="text" name="color" required placeholder="e.g., Silver">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Transmission *</label>
            <select name="transmission" required>
              <option value="">Select...</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div class="form-group">
            <label>Fuel Type *</label>
            <select name="fuel" required>
              <option value="">Select...</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="Diesel">Diesel</option>
              <option value="Fuel">Fuel</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Body Type *</label>
            <select name="bodyType" required>
              <option value="">Select...</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="coupe">Coupe</option>
              <option value="van">Van</option>
            </select>
          </div>
          <div class="form-group">
            <label>Engine</label>
            <input type="text" name="engine" placeholder="e.g., 2.0L Turbo">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Horsepower</label>
            <input type="text" name="horsepower" placeholder="e.g., 300 hp">
          </div>
          <div class="form-group">
            <label>Warranty</label>
            <input type="text" name="warranty" placeholder="e.g., 3 years/36,000 miles">
          </div>
        </div>

        <div class="form-group">
          <label>Description *</label>
          <textarea name="description" required placeholder="Describe the vehicle's condition, features, history..."></textarea>
        </div>

        <div class="form-group">
          <label>Features (comma-separated)</label>
          <input type="text" name="features" placeholder="e.g., Bluetooth, Backup Camera, Sunroof, Leather Seats">
        </div>

        <div class="form-group">
          <label>Badges</label>
          <div class="checkbox-group" style="display: flex; gap: 20px; flex-wrap: wrap;">
            <label class="checkbox-item">
              <input type="checkbox" name="badges" value="new">
              <span class="checkbox-label">New</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" name="badges" value="featured">
              <span class="checkbox-label">Featured</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" name="badges" value="certified">
              <span class="checkbox-label">Certified</span>
            </label>
          </div>
        </div>

        <div class="image-upload-section">
          <h3 style="display: flex; align-items: center; gap: 10px;">
            📸 Vehicle Images (<span id="new-vehicle-image-count">0</span>/7)
            <span style="font-size: 0.8rem; color: #666; font-weight: 400;">Upload to Firebase Storage</span>
          </h3>
          
          <div class="image-upload-grid" id="new-vehicle-images">
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">📷</div>
              <p>No images uploaded yet. Click "Select Images" below.</p>
            </div>
          </div>
          
          <div class="upload-control">
            <div class="file-input-wrapper">
              <input type="file" id="new-vehicle-image-input" accept="image/jpeg,image/jpg,image/png,image/webp" multiple>
            </div>
            <button type="button" class="upload-btn" onclick="uploadNewVehicleImages()" id="new-vehicle-upload-btn">
              📤 Upload Selected Images
            </button>
          </div>
          
          <div id="new-vehicle-upload-status" class="upload-status" style="display: none;"></div>
          
          <div style="margin-top: 1rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; font-size: 0.85rem; color: #1565c0;">
            <strong>💡 Tips:</strong>
            <ul style="margin: 0.5rem 0 0 1.5rem; line-height: 1.6;">
              <li>Upload 3-7 high-quality images for best results</li>
              <li>Maximum file size: 10MB per image</li>
              <li>Accepted formats: JPG, PNG, WEBP</li>
              <li>First image will be the main display image</li>
            </ul>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" id="add-vehicle-submit-btn">
            💾 Save Vehicle to Database
          </button>
          <button type="button" class="btn-secondary" onclick="closeEditModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  // Enhanced upload function with progress tracking
  window.uploadNewVehicleImages = async function() {
    const fileInput = document.getElementById('new-vehicle-image-input');
    const uploadBtn = document.getElementById('new-vehicle-upload-btn');
    const statusDiv = document.getElementById('new-vehicle-upload-status');
    const files = fileInput.files;

    if (!files || files.length === 0) {
      statusDiv.textContent = '⚠️ Please select at least one image first';
      statusDiv.className = 'upload-status error';
      statusDiv.style.display = 'block';
      return;
    }

    const remainingSlots = 7 - newVehicleImages.length;
    if (files.length > remainingSlots) {
      statusDiv.textContent = `⚠️ You can only upload ${remainingSlots} more image(s). Maximum is 7 images total.`;
      statusDiv.className = 'upload-status error';
      statusDiv.style.display = 'block';
      return;
    }

    // Validate file types and sizes
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        statusDiv.textContent = `⚠️ "${file.name}" is not a valid image file`;
        statusDiv.className = 'upload-status error';
        statusDiv.style.display = 'block';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        statusDiv.textContent = `⚠️ "${file.name}" exceeds 10MB limit`;
        statusDiv.className = 'upload-status error';
        statusDiv.style.display = 'block';
        return;
      }
    }

    uploadBtn.disabled = true;
    uploadBtn.textContent = '⏳ Uploading...';
    statusDiv.style.display = 'block';

    try {
      const tempId = 'temp_' + Date.now();
      
      const results = await uploadMultipleImages(
        Array.from(files), 
        tempId,
        (current, total, fileName) => {
          statusDiv.textContent = `📤 Uploading ${current}/${total}: ${fileName}...`;
          statusDiv.className = 'upload-status uploading';
        }
      );

      // Add successful uploads
      results.success.forEach(result => {
        newVehicleImages.push(result.url);
      });

      // Show results
      if (results.failed.length > 0) {
        statusDiv.textContent = `⚠️ ${results.success.length} uploaded, ${results.failed.length} failed`;
        statusDiv.className = 'upload-status error';
        console.error('Failed uploads:', results.failed);
      } else {
        statusDiv.textContent = `✅ All ${results.success.length} image(s) uploaded successfully!`;
        statusDiv.className = 'upload-status success';
      }

      fileInput.value = '';
      updateNewVehicleImagePreview();

      // Hide success message after 3 seconds
      if (results.failed.length === 0) {
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 3000);
      }
    } catch (error) {
      statusDiv.textContent = '❌ Upload failed: ' + error.message;
      statusDiv.className = 'upload-status error';
      console.error('Upload error:', error);
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = '📤 Upload Selected Images';
    }
  };

  function updateNewVehicleImagePreview() {
    const container = document.getElementById('new-vehicle-images');
    const countSpan = document.getElementById('new-vehicle-image-count');
    
    countSpan.textContent = newVehicleImages.length;

    if (newVehicleImages.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📷</div>
          <p>No images uploaded yet. Click "Select Images" below.</p>
        </div>
      `;
      return;
    }

    const imagesHTML = newVehicleImages.map((img, index) => `
      <div class="current-image">
        <img src="${img}" alt="Image ${index + 1}">
        <button class="remove-image-btn" onclick="removeNewVehicleImage(${index})" type="button" title="Remove image">×</button>
        ${index === 0 ? '<div style="position: absolute; bottom: 8px; left: 8px; background: rgba(230, 57, 70, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;">MAIN</div>' : ''}
      </div>
    `).join('');

    container.innerHTML = imagesHTML;
  }

  window.removeNewVehicleImage = function(index) {
    if (confirm('Remove this image?')) {
      newVehicleImages.splice(index, 1);
      updateNewVehicleImagePreview();
    }
  };

  // Form submission
  document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (newVehicleImages.length === 0) {
      alert('⚠️ Please upload at least one image for the vehicle');
      return;
    }

    const submitBtn = document.getElementById('add-vehicle-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Saving to Firebase...';

    const formData = new FormData(e.target);
    const featuresInput = formData.get('features').trim();
    const featuresArray = featuresInput ? featuresInput.split(',').map(f => f.trim()).filter(f => f) : [];
    
    const badges = Array.from(document.querySelectorAll('input[name="badges"]:checked')).map(cb => cb.value);

    const vehicleData = {
      make: formData.get('make').trim(),
      model: formData.get('model').trim(),
      year: parseInt(formData.get('year')),
      price: parseInt(formData.get('price')),
      mileage: parseInt(formData.get('mileage')),
      color: formData.get('color').trim(),
      transmission: formData.get('transmission'),
      fuel: formData.get('fuel'),
      bodyType: formData.get('bodyType'),
      description: formData.get('description').trim(),
      engine: formData.get('engine')?.trim() || '',
      horsepower: formData.get('horsepower')?.trim() || '',
      warranty: formData.get('warranty')?.trim() || '',
      features: featuresArray,
      badges: badges,
      images: newVehicleImages
    };

    try {
      await saveVehicleToFirebase(vehicleData);
      closeEditModal();
      await loadVehiclesFromFirebase();
      alert('✅ Vehicle added successfully!\n\n' + 
            `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}\n` +
            `${newVehicleImages.length} image(s) uploaded to Firebase Storage`);
    } catch (error) {
      alert('❌ Failed to save vehicle: ' + error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Save Vehicle to Database';
    }
  });

  const modal = document.getElementById('edit-modal');
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ========================================
// EDIT VEHICLE MODAL WITH ENHANCED UPLOAD
// ========================================
function openEditModal(id) {
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) return;

  closeModal();

  const currentImagesHTML = vehicle.images && vehicle.images.length > 0 ? vehicle.images.map((img, index) => `
    <div class="current-image">
      <img src="${img}" alt="Image ${index + 1}">
      <button class="remove-image-btn" onclick="removeVehicleImage('${id}', ${index})" type="button" title="Remove image">×</button>
      ${index === 0 ? '<div style="position: absolute; bottom: 8px; left: 8px; background: rgba(230, 57, 70, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;">MAIN</div>' : ''}
    </div>
  `).join('') : '<p style="text-align: center; color: #666; grid-column: 1 / -1;">No images</p>';

  const featuresStr = vehicle.features ? vehicle.features.join(', ') : '';

  const editBody = document.getElementById('edit-body');
  editBody.innerHTML = `
    <div class="edit-form-container">
      <div class="form-header">
        <h2>✏️ Edit Vehicle Details</h2>
        <p>Update information and manage Firebase Storage images</p>
      </div>
      
      <form id="edit-form" class="edit-form">
        <div class="form-row">
          <div class="form-group">
            <label>Make</label>
            <input type="text" name="make" value="${vehicle.make}" required>
          </div>
          <div class="form-group">
            <label>Model</label>
            <input type="text" name="model" value="${vehicle.model}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Year</label>
            <input type="number" name="year" value="${vehicle.year}" min="2000" max="2025" required>
          </div>
          <div class="form-group">
            <label>Price (₦)</label>
            <input type="number" name="price" value="${vehicle.price}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Mileage</label>
            <input type="number" name="mileage" value="${vehicle.mileage}" required>
          </div>
          <div class="form-group">
            <label>Color</label>
            <input type="text" name="color" value="${vehicle.color}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Transmission</label>
            <select name="transmission" required>
              <option value="Automatic" ${vehicle.transmission === 'Automatic' ? 'selected' : ''}>Automatic</option>
              <option value="Manual" ${vehicle.transmission === 'Manual' ? 'selected' : ''}>Manual</option>
            </select>
          </div>
          <div class="form-group">
            <label>Fuel Type</label>
            <select name="fuel" required>
              <option value="Gasoline" ${vehicle.fuel === 'Gasoline' ? 'selected' : ''}>Gasoline</option>
              <option value="Hybrid" ${vehicle.fuel === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
              <option value="Electric" ${vehicle.fuel === 'Electric' ? 'selected' : ''}>Electric</option>
              <option value="Diesel" ${vehicle.fuel === 'Diesel' ? 'selected' : ''}>Diesel</option>
              <option value="Fuel" ${vehicle.fuel === 'Fuel' ? 'selected' : ''}>Fuel</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Body Type</label>
            <select name="bodyType" required>
              <option value="sedan" ${vehicle.bodyType === 'sedan' ? 'selected' : ''}>Sedan</option>
              <option value="suv" ${vehicle.bodyType === 'suv' ? 'selected' : ''}>SUV</option>
              <option value="truck" ${vehicle.bodyType === 'truck' ? 'selected' : ''}>Truck</option>
              <option value="coupe" ${vehicle.bodyType === 'coupe' ? 'selected' : ''}>Coupe</option>
              <option value="van" ${vehicle.bodyType === 'van' ? 'selected' : ''}>Van</option>
            </select>
          </div>
          <div class="form-group">
            <label>Engine</label>
            <input type="text" name="engine" value="${vehicle.engine || ''}" placeholder="e.g., 2.0L Turbo">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Horsepower</label>
            <input type="text" name="horsepower" value="${vehicle.horsepower || ''}" placeholder="e.g., 300 hp">
          </div>
          <div class="form-group">
            <label>Warranty</label>
            <input type="text" name="warranty" value="${vehicle.warranty || ''}" placeholder="e.g., 3 years/36,000 miles">
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea name="description" required>${vehicle.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label>Features (comma-separated)</label>
          <input type="text" name="features" value="${featuresStr}" placeholder="e.g., Bluetooth, Backup Camera, Sunroof">
        </div>

        <div class="form-group">
          <label>Badges</label>
          <div class="checkbox-group" style="display: flex; gap: 20px; flex-wrap: wrap;">
            <label class="checkbox-item">
              <input type="checkbox" name="badges" value="new" ${vehicle.badges && vehicle.badges.includes('new') ? 'checked' : ''}>
              <span class="checkbox-label">New</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" name="badges" value="featured" ${vehicle.badges && vehicle.badges.includes('featured') ? 'checked' : ''}>
              <span class="checkbox-label">Featured</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" name="badges" value="certified" ${vehicle.badges && vehicle.badges.includes('certified') ? 'checked' : ''}>
              <span class="checkbox-label">Certified</span>
            </label>
          </div>
        </div>

        <div class="image-upload-section">
          <h3 style="display: flex; align-items: center; gap: 10px;">
            📸 Firebase Storage Images (${vehicle.images ? vehicle.images.length : 0}/7)
          </h3>
          <div class="image-upload-grid">
            ${currentImagesHTML}
          </div>
          
          ${!vehicle.images || vehicle.images.length < 7 ? `
            <div class="upload-control">
              <div class="file-input-wrapper">
                <input type="file" id="image-input-${id}" accept="image/jpeg,image/jpg,image/png,image/webp" multiple>
              </div>
              <button type="button" class="upload-btn" onclick="uploadToFirebase('${id}')" id="upload-btn-${id}">
                📤 Upload to Firebase
              </button>
            </div>
            <div id="upload-status-${id}" class="upload-status" style="display: none;"></div>
          ` : '<p style="color: #e63946; font-weight: 600; text-align: center; padding: 1rem; background: #ffe8e8; border-radius: 8px;">⚠️ Maximum 7 images reached</p>'}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" id="edit-submit-btn">💾 Update in Firebase</button>
          <button type="button" class="btn-secondary" onclick="closeEditModal()">Cancel</button>
          <button type="button" class="btn-danger" onclick="deleteVehicle('${id}')">🗑️ Delete Vehicle</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('edit-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Updating Firebase...';

    const formData = new FormData(e.target);
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    const featuresInput = formData.get('features').trim();
    const featuresArray = featuresInput ? featuresInput.split(',').map(f => f.trim()).filter(f => f) : [];
    
    const badges = Array.from(document.querySelectorAll('input[name="badges"]:checked')).map(cb => cb.value);
    
    const updatedData = {
      make: formData.get('make').trim(),
      model: formData.get('model').trim(),
      year: parseInt(formData.get('year')),
      price: parseInt(formData.get('price')),
      mileage: parseInt(formData.get('mileage')),
      color: formData.get('color').trim(),
      transmission: formData.get('transmission'),
      fuel: formData.get('fuel'),
      bodyType: formData.get('bodyType'),
      description: formData.get('description').trim(),
      engine: formData.get('engine')?.trim() || '',
      horsepower: formData.get('horsepower')?.trim() || '',
      warranty: formData.get('warranty')?.trim() || '',
      features: featuresArray,
      badges: badges,
      images: vehicles[vehicleIndex].images
    };

    try {
      await updateVehicleInFirebase(id, updatedData);
      vehicles[vehicleIndex] = { id, ...updatedData };
      closeEditModal();
      renderVehicles();
      alert('✅ Vehicle updated successfully in Firebase!');
    } catch (error) {
      alert('❌ Failed to update vehicle: ' + error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Update in Firebase';
    }
  });

  const modal = document.getElementById('edit-modal');
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

async function removeVehicleImage(vehicleId, imageIndex) {
  if (!confirm('⚠️ Remove this image from Firebase Storage?\n\nThis action cannot be undone.')) return;
  
  const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
  if (!vehicles[vehicleIndex].images || vehicles[vehicleIndex].images.length <= 1) {
    alert('⚠️ Cannot remove the last image. Vehicle must have at least one image.');
    return;
  }
  
  try {
    const imageUrl = vehicles[vehicleIndex].images[imageIndex];
    
    // Delete from Firebase Storage
    if (imageUrl.includes('firebasestorage')) {
      try {
        const imageRef = storage.refFromURL(imageUrl);
        await imageRef.delete();
        console.log('✅ Image deleted from Firebase Storage');
      } catch (err) {
        console.warn('Could not delete image from storage:', err);
      }
    }
    
    // Remove from array
    vehicles[vehicleIndex].images.splice(imageIndex, 1);
    
    // Update in Firestore
    await updateVehicleInFirebase(vehicleId, { images: vehicles[vehicleIndex].images });
    
    openEditModal(vehicleId);
    alert('✅ Image removed from Firebase!');
  } catch (error) {
    alert('❌ Failed to remove image: ' + error.message);
  }
}

async function uploadToFirebase(vehicleId) {
  const fileInput = document.getElementById(`image-input-${vehicleId}`);
  const uploadBtn = document.getElementById(`upload-btn-${vehicleId}`);
  const statusDiv = document.getElementById(`upload-status-${vehicleId}`);
  const files = fileInput.files;

  if (!files || files.length === 0) {
    statusDiv.textContent = '⚠️ Please select at least one image';
    statusDiv.className = 'upload-status error';
    statusDiv.style.display = 'block';
    return;
  }

  const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
  const currentImageCount = vehicles[vehicleIndex].images ? vehicles[vehicleIndex].images.length : 0;

  if (currentImageCount + files.length > 7) {
    statusDiv.textContent = `⚠️ Maximum 7 images allowed. You can upload ${7 - currentImageCount} more.`;
    statusDiv.className = 'upload-status error';
    statusDiv.style.display = 'block';
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = '⏳ Uploading...';
  statusDiv.style.display = 'block';

  try {
    const results = await uploadMultipleImages(
      Array.from(files),
      vehicleId,
      (current, total, fileName) => {
        statusDiv.textContent = `📤 Uploading ${current}/${total}: ${fileName}...`;
        statusDiv.className = 'upload-status uploading';
      }
    );

    // Update vehicle images
    if (!vehicles[vehicleIndex].images) {
      vehicles[vehicleIndex].images = [];
    }
    results.success.forEach(result => {
      vehicles[vehicleIndex].images.push(result.url);
    });
    
    // Update in Firestore
    await updateVehicleInFirebase(vehicleId, { images: vehicles[vehicleIndex].images });

    if (results.failed.length > 0) {
      statusDiv.textContent = `⚠️ ${results.success.length} uploaded, ${results.failed.length} failed`;
      statusDiv.className = 'upload-status error';
    } else {
      statusDiv.textContent = `✅ ${results.success.length} image(s) uploaded successfully!`;
      statusDiv.className = 'upload-status success';
    }
    
    fileInput.value = '';
    
    setTimeout(() => {
      openEditModal(vehicleId);
    }, 1500);
  } catch (error) {
    statusDiv.textContent = '❌ Upload failed: ' + error.message;
    statusDiv.className = 'upload-status error';
    uploadBtn.disabled = false;
    uploadBtn.textContent = '📤 Upload to Firebase';
  }
}

async function deleteVehicle(id) {
  if (!confirm('⚠️ Are you sure you want to delete this vehicle from Firebase?\n\nThis will permanently delete:\n• Vehicle information from Firestore\n• All associated images from Storage\n\nThis action CANNOT be undone!')) return;
  
  try {
    await deleteVehicleFromFirebase(id);
    vehicles = vehicles.filter(v => v.id !== id);
    closeEditModal();
    renderVehicles();
    updateStats();
    alert('✅ Vehicle and all images deleted successfully from Firebase!');
  } catch (error) {
    alert('❌ Failed to delete vehicle: ' + error.message);
  }
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 300);
}

// ========================================
// MOBILE FUNCTIONS
// ========================================
function toggleMobileFilters() {
  const sidebar = document.getElementById('filter-sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileFilters() {
  document.getElementById('filter-sidebar').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
  console.log('🚀 Initializing PitSpot Auto Inventory System...');
  
  if (!initFirebase()) {
    showError('Firebase not initialized. Please check your configuration.');
    return;
  }

  // Load vehicles from Firebase
  loadVehiclesFromFirebase();

  // Price slider
  const priceSlider = document.getElementById('price-slider');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      document.getElementById('max-price-display').value = formatPrice(parseInt(e.target.value));
    });
  }

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 500));
  }

  // Quick filters
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.quickFilter = pill.dataset.filter;
      state.currentPage = 1;
      renderVehicles();
    });
  });

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      state.currentPage = 1;
      renderVehicles();
    });
  }

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('vehicle-grid');
      if (btn.dataset.view === 'list') {
        grid.style.gridTemplateColumns = '1fr';
      } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
      }
    });
  });

  // Pagination
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (state.currentPage > 1) goToPage(state.currentPage - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredVehicles();
      const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
      if (state.currentPage < totalPages) goToPage(state.currentPage + 1);
    });
  }

  // Mobile
  const mobileFilterBtn = document.getElementById('mobile-filter-btn');
  const closeSidebar = document.getElementById('close-sidebar');
  const overlay = document.getElementById('overlay');
  
  if (mobileFilterBtn) {
    mobileFilterBtn.addEventListener('click', toggleMobileFilters);
  }
  
  if (closeSidebar) {
    closeSidebar.addEventListener('click', closeMobileFilters);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeMobileFilters);
  }

  // Mobile menu
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Admin toggle - FIXED
  const adminToggle = document.getElementById('admin-toggle');
  if (adminToggle) {
    console.log('✅ Admin toggle button found');
    adminToggle.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🔐 Admin toggle clicked');
      toggleAdminMode();
    });
  } else {
    console.error('❌ Admin toggle button not found');
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeEditModal();
      closeMobileFilters();
    }
  });

  console.log('✅ PitSpot Auto Inventory System initialized successfully!');
  console.log('📊 Firebase Storage enabled for image uploads');
  console.log('🔐 Admin Mode: Click "Admin" button and enter password');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready
  init();
}
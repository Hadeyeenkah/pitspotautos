// ========================================
// VEHICLE DATA WITH 7 IMAGES EACH
// ========================================
let vehicles = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry Se',
    year: 2013,
    price: 12000000,
    mileage: 550,
    color: 'White',
    transmission: 'Automatic',
    fuel: 'Fuel',
    bodyType: 'sedan',
    images: [
      "https://i.ibb.co/39zz7kfS/Whats-App-Image-2025-10-18-at-7-34-50-PM.jpg",
      "https://i.ibb.co/9RhF2vV/Whats-App-Image-2025-10-18-at-7-34-50-PM-4.jpg",
      "https://i.ibb.co/JwGZxmTD/Whats-App-Image-2025-10-18-at-7-34-50-PM-5.jpg",
      "https://i.ibb.co/jkqvMWXq/Whats-App-Image-2025-10-18-at-7-34-50-PM-3.jpg",
      "https://i.ibb.co/WNLP629g/Whats-App-Image-2025-10-18-at-7-34-50-PM-2.jpg",
      "https://i.ibb.co/nMCSyp5C/Whats-App-Image-2025-10-18-at-7-34-50-PM-1.jpg",
    ],
    badges: ['featured', 'new'],
    description: '2013 Toyota Camry Se (White)',
    features: ['Premium Audio', 'Glass Roof', 'Heated Seats', 'Supercharger Access', 'Mobile App Control'],
    engine: 'Dual Motor AWD',
    acceleration: '3.1s 0-60mph',
    warranty: '4 years/50,000 miles'
  },
  {
    id: 2,
    make: 'Mercedes',
    model: 'Benz GLE',
    year: 2021,
    price: 100000000,
    mileage: 550,
    color: 'White',
    transmission: 'Automatic',
    fuel: 'Fuel',
    bodyType: 'sedan',
    images: [
      "https://i.ibb.co/Qjn1FM4G/Whats-App-Image-2025-10-18-at-7-23-39-PM-4.jpg",
      "https://i.ibb.co/v4jc9vxB/Whats-App-Image-2025-10-18-at-7-23-39-PM-1.jpg",
      "https://i.ibb.co/nqfBKk0F/Whats-App-Image-2025-10-18-at-7-23-39-PM-3.jpg",
      "https://i.ibb.co/xtMSDD7g/Whats-App-Image-2025-10-18-at-7-23-39-PM.jpg",
    ],
    badges: ['featured', 'new'],
    description: '2021 Mercedes GLE (White)',
    features: ['Premium Audio', 'Glass Roof', 'Heated Seats', 'Supercharger Access', 'Mobile App Control'],
    engine: 'Dual Motor AWD',
    acceleration: '3.1s 0-60mph',
    warranty: '4 years/50,000 miles'
  },
  {
    id: 3,
    make: 'Toyota',
    model: 'Camry Se',
    year: 2013,
    price: 12000000,
    mileage: 550,
    color: 'Black',
    transmission: 'Automatic',
    fuel: 'Fuel',
    bodyType: 'sedan',
    images: [
      "https://i.ibb.co/9HrCmgMQ/Whats-App-Image-2025-10-18-at-7-25-01-PM.jpg",
      "https://i.ibb.co/N6P2xncZ/Whats-App-Image-2025-10-18-at-7-25-01-PM-5.jpg",
      "https://i.ibb.co/V0gcMq63/Whats-App-Image-2025-10-18-at-7-34-18-PM-3.jpg",
      "https://i.ibb.co/5XvFDNYk/Whats-App-Image-2025-10-18-at-7-34-18-PM-2.jpg",
      "https://i.ibb.co/KgqWtrb/Whats-App-Image-2025-10-18-at-7-25-01-PM-2.jpg",
      "https://i.ibb.co/pvkmQ5NW/Whats-App-Image-2025-10-18-at-7-25-01-PM-1.jpg",
    ],
    badges: ['featured', 'new'],
    description: '2013 Toyota Camry Se (Black)',
    features: ['Premium Audio', 'Glass Roof', 'Heated Seats', 'Supercharger Access', 'Mobile App Control'],
    engine: 'Dual Motor AWD',
    acceleration: '3.1s 0-60mph',
    warranty: '2 years'
  },
  {
    id: 4,
    make: 'Toyota',
    model: 'Corolla SE',
    year: 2014,
    price: 13000000,
    mileage: 550,
    color: 'Grey',
    transmission: 'Automatic',
    fuel: 'Fuel',
    bodyType: 'sedan',
    images: [
      "https://i.ibb.co/3yxy10RF/Whats-App-Image-2025-10-23-at-11-00-15-AM-3.jpg",
      "https://i.ibb.co/Kc6rpPJn/Whats-App-Image-2025-10-23-at-11-00-15-AM-2.jpg",
"https://i.ibb.co/Q7St0thz/Whats-App-Image-2025-10-23-at-11-00-15-AM-1.jpg",
"https://i.ibb.co/spBPM0xf/Whats-App-Image-2025-10-23-at-11-00-15-AM.jpg",
    ],
    badges: ['featured', 'new'],
    description: '2014 Toyota Corolla SE (Grey)',
    features: ['Premium Audio', 'Glass Roof', 'Heated Seats', 'Supercharger Access', 'Mobile App Control'],
    engine: 'Dual Motor AWD',
    acceleration: '3.1s 0-60mph',
    warranty: '2 years'
  },
  {
    id: 5,
    make: 'Lexus',
    model: 'RX 350',
    year: 2004,
    price: 11000000,
    mileage: 550,
    color: 'Blue',
    transmission: 'Automatic',
    fuel: 'Fuel',
    bodyType: 'sedan',
    images: [
      "https://i.ibb.co/3m3h92Xb/Whats-App-Image-2025-10-23-at-10-59-19-AM-1.jpg",
      "https://i.ibb.co/Y78gtHnK/Whats-App-Image-2025-10-23-at-10-59-19-AM-3.jpg",
"https://i.ibb.co/ZpLWR1vs/Whats-App-Image-2025-10-23-at-10-59-19-AM-2.jpg",
"https://i.ibb.co/3m3h92Xb/Whats-App-Image-2025-10-23-at-10-59-19-AM-1.jpg",
"https://i.ibb.co/35wN5Dd6/Whats-App-Image-2025-10-23-at-10-59-19-AM.jpg",
    ],
    badges: ['featured', 'new'],
    description: '2004 lexus Rx350 (Blue)',
    features: ['Premium Audio', 'Glass Roof', 'Heated Seats', 'Supercharger Access', 'Mobile App Control'],
    engine: 'Dual Motor AWD',
    acceleration: '3.1s 0-60mph',
    warranty: '2 years'
  },
  {
    id: 6,
   make: 'Toyota',
    model: 'Camry',
    year: 2004,
    price: 13000000,
    mileage: 550,
    color: 'Black',
    transmission: 'Automatic',
    fuel: 'Fuel',
    bodyType: 'sedan',
    images: [
      "https://i.ibb.co/spx0K0dr/Whats-App-Image-2025-10-23-at-10-58-47-AM.jpg",
      "https://i.ibb.co/jPSwVLnG/Whats-App-Image-2025-10-23-at-10-58-47-AM-1.jpg",
"https://i.ibb.co/F46sfsGs/Whats-App-Image-2025-10-23-at-10-58-46-AM.jpg",
"https://i.ibb.co/spx0K0dr/Whats-App-Image-2025-10-23-at-10-58-47-AM.jpg",
    ],
    badges: ['featured', 'new'],
    description: '2014 Toyota Corolla SE (Black)',
    features: ['Premium Audio', 'Glass Roof', 'Heated Seats', 'Supercharger Access', 'Mobile App Control'],
    engine: 'Dual Motor AWD',
    acceleration: '3.1s 0-60mph',
    warranty: '2 years'
  },
  {
    id: 7,
    make: 'Honda ',
    model: 'Accord',
    year: 2016,
    price: 12000000,
    mileage: 550,
    color: 'Black',
    transmission: 'Automatic',
    fuel: 'Fuel',
    bodyType: 'sedan',
    images: [
      "https://i.ibb.co/0RX1XQ87/Whats-App-Image-2025-10-23-at-11-00-41-AM.jpg",
      "https://i.ibb.co/tpQY0n9G/Whats-App-Image-2025-10-23-at-11-00-41-AM-1.jpg",

    ],
    badges: ['featured', 'new'],
    description: '2016 Honda Accord (Black)',
    features: ['Premium Audio', 'Glass Roof', 'Heated Seats', 'Supercharger Access', 'Mobile App Control'],
    engine: 'Dual Motor AWD',
    acceleration: '3.1s 0-60mph',
    warranty: '2 years'
  }
];

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
  savedVehicles: []
};

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
          if (!vehicle.badges.includes('new')) return false;
          break;
        case 'certified':
          if (!vehicle.badges.includes('certified')) return false;
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
  const badgesHTML = vehicle.badges.map(badge => 
    `<span class="badge badge-${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span>`
  ).join('');

  const isSaved = state.savedVehicles.includes(vehicle.id);

  return `
    <div class="vehicle-card" data-id="${vehicle.id}">
      <div class="card-image-container" onclick="viewDetails(${vehicle.id})">
        <img src="${vehicle.images[0]}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}" class="card-image" loading="lazy">
        <div class="card-badges">${badgesHTML}</div>
        <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(event, ${vehicle.id})">
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
          <button class="btn-details" onclick="viewDetails(${vehicle.id})">View Details</button>
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

  const badgesHTML = vehicle.badges.map(badge => 
    `<span class="badge badge-${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span>`
  ).join('');

  const thumbnailsHTML = vehicle.images.map((img, index) =>
    `<div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(${index}, '${img}')">
      <img src="${img}" alt="View ${index + 1}" loading="lazy">
    </div>`
  ).join('');

  const featuresHTML = vehicle.features.map(feature =>
    `<div class="feature-item">${feature}</div>`
  ).join('');

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div class="modal-gallery">
      <div class="main-image-container">
        <img id="modal-main-image" src="${vehicle.images[0]}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}">
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
        <p class="description-text">${vehicle.description}</p>
      </div>

      <div class="specs-section">
        <h3 class="section-title">Vehicle Specifications</h3>
        <div class="specs-grid">
          ${vehicle.engine ? `
            <div class="spec-row">
              <span class="spec-label">Engine</span>
              <span class="spec-value">${vehicle.engine}</span>
            </div>
          ` : ''}
          ${vehicle.horsepower ? `
            <div class="spec-row">
              <span class="spec-label">Horsepower</span>
              <span class="spec-value">${vehicle.horsepower}</span>
            </div>
          ` : ''}
          ${vehicle.acceleration ? `
            <div class="spec-row">
              <span class="spec-label">Acceleration</span>
              <span class="spec-value">${vehicle.acceleration}</span>
            </div>
          ` : ''}
          ${vehicle.topSpeed ? `
            <div class="spec-row">
              <span class="spec-label">Top Speed</span>
              <span class="spec-value">${vehicle.topSpeed}</span>
            </div>
          ` : ''}
          ${vehicle.mpg ? `
            <div class="spec-row">
              <span class="spec-label">Fuel Economy</span>
              <span class="spec-value">${vehicle.mpg}</span>
            </div>
          ` : ''}
          ${vehicle.range ? `
            <div class="spec-row">
              <span class="spec-label">Range</span>
              <span class="spec-value">${vehicle.range}</span>
            </div>
          ` : ''}
          ${vehicle.towingCapacity ? `
            <div class="spec-row">
              <span class="spec-label">Towing Capacity</span>
              <span class="spec-value">${vehicle.towingCapacity}</span>
            </div>
          ` : ''}
          ${vehicle.warranty ? `
            <div class="spec-row">
              <span class="spec-label">Warranty</span>
              <span class="spec-value">${vehicle.warranty}</span>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="features-section">
        <h3 class="section-title">Key Features</h3>
        <div class="features-grid">
          ${featuresHTML}
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-primary" onclick="contactDealer(${vehicle.id})">Contact Dealer</button>
        <button class="btn-secondary" onclick="scheduleTestDrive(${vehicle.id})">Schedule Test Drive</button>
        ${state.isAdmin ? `<button class="btn-edit" onclick="openEditModal(${vehicle.id})">Edit Vehicle</button>` : ''}
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
const ADMIN_PASSWORD = 'Aa123123Aa'; // Change this to your secure password

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
    btn.textContent = '👤 Exit Admin';
    btn.classList.add('active');
    
    closePasswordModal();
    renderVehicles();
    
    alert('✅ Admin Mode Activated!\n\nYou can now:\n• Edit vehicle details\n• Upload new images\n• Delete vehicles');
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

function openEditModal(id) {
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) return;

  closeModal();

  const currentImagesHTML = vehicle.images.map((img, index) => `
    <div class="current-image">
      <img src="${img}" alt="Image ${index + 1}">
      <button class="remove-image-btn" onclick="removeVehicleImage(${id}, ${index})" type="button">×</button>
    </div>
  `).join('');

  const featuresStr = vehicle.features ? vehicle.features.join(', ') : '';

  const editBody = document.getElementById('edit-body');
  editBody.innerHTML = `
    <div class="edit-form-container">
      <div class="form-header">
        <h2>Edit Vehicle Details</h2>
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
          <textarea name="description" required>${vehicle.description}</textarea>
        </div>

        <div class="form-group">
          <label>Features (comma-separated)</label>
          <input type="text" name="features" value="${featuresStr}" placeholder="e.g., Bluetooth, Backup Camera, Sunroof">
        </div>

        <div class="image-upload-section">
          <h3>Vehicle Images (${vehicle.images.length}/7)</h3>
          <div class="image-upload-grid">
            ${currentImagesHTML}
          </div>
          
          ${vehicle.images.length < 7 ? `
            <div class="upload-control">
              <div class="file-input-wrapper">
                <input type="file" id="image-input-${id}" accept="image/*">
              </div>
              <button type="button" class="upload-btn" onclick="uploadToImgur(${id})" id="upload-btn-${id}">
                Upload Image
              </button>
            </div>
            <div id="upload-status-${id}" class="upload-status" style="display: none;"></div>
          ` : '<p style="color: #666; font-weight: 600; text-align: center;">Maximum 7 images reached</p>'}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Save Changes</button>
          <button type="button" class="btn-secondary" onclick="closeEditModal()">Cancel</button>
          <button type="button" class="btn-danger" onclick="deleteVehicle(${id})">Delete Vehicle</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    const featuresInput = formData.get('features').trim();
    const featuresArray = featuresInput ? featuresInput.split(',').map(f => f.trim()).filter(f => f) : [];
    
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      make: formData.get('make'),
      model: formData.get('model'),
      year: parseInt(formData.get('year')),
      price: parseInt(formData.get('price')),
      mileage: parseInt(formData.get('mileage')),
      color: formData.get('color'),
      transmission: formData.get('transmission'),
      fuel: formData.get('fuel'),
      bodyType: formData.get('bodyType'),
      description: formData.get('description'),
      engine: formData.get('engine') || vehicles[vehicleIndex].engine,
      horsepower: formData.get('horsepower') || vehicles[vehicleIndex].horsepower,
      warranty: formData.get('warranty') || vehicles[vehicleIndex].warranty,
      features: featuresArray.length > 0 ? featuresArray : vehicles[vehicleIndex].features
    };

    closeEditModal();
    renderVehicles();
    alert('✅ Vehicle updated successfully!');
  });

  const modal = document.getElementById('edit-modal');
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function removeVehicleImage(vehicleId, imageIndex) {
  if (!confirm('Remove this image?')) return;
  
  const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
  if (vehicles[vehicleIndex].images.length <= 1) {
    alert('⚠️ Cannot remove the last image. Vehicle must have at least one image.');
    return;
  }
  
  vehicles[vehicleIndex].images.splice(imageIndex, 1);
  openEditModal(vehicleId);
}

function uploadToImgur(vehicleId) {
  const fileInput = document.getElementById(`image-input-${vehicleId}`);
  const uploadBtn = document.getElementById(`upload-btn-${vehicleId}`);
  const statusDiv = document.getElementById(`upload-status-${vehicleId}`);
  const file = fileInput.files[0];

  if (!file) {
    statusDiv.textContent = '⚠️ Please select an image file';
    statusDiv.className = 'upload-status error';
    statusDiv.style.display = 'block';
    return;
  }

  if (!file.type.startsWith('image/')) {
    statusDiv.textContent = '⚠️ Please select a valid image file';
    statusDiv.className = 'upload-status error';
    statusDiv.style.display = 'block';
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    statusDiv.textContent = '⚠️ Image size must be less than 10MB';
    statusDiv.className = 'upload-status error';
    statusDiv.style.display = 'block';
    return;
  }

  const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
  if (vehicles[vehicleIndex].images.length >= 7) {
    statusDiv.textContent = '⚠️ Maximum 7 images allowed per vehicle';
    statusDiv.className = 'upload-status error';
    statusDiv.style.display = 'block';
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  statusDiv.textContent = '⏳ Uploading image...';
  statusDiv.className = 'upload-status uploading';
  statusDiv.style.display = 'block';
  uploadBtn.disabled = true;
  uploadBtn.textContent = 'Uploading...';

  const IMGBB_API_KEY = '2029f5b57fefec48cf03bd6f58c2de8b';
  
  if (!IMGBB_API_KEY || IMGBB_API_KEY === '2029f5b57fefec48cf03bd6f58c2de8b') {
    const reader = new FileReader();
    reader.onload = function(e) {
      vehicles[vehicleIndex].images.push(e.target.result);
      
      statusDiv.textContent = '✅ Image loaded successfully!';
      statusDiv.className = 'upload-status success';
      fileInput.value = '';
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload Image';
      
      setTimeout(() => {
        openEditModal(vehicleId);
      }, 1500);
    };
    reader.onerror = function() {
      statusDiv.textContent = '❌ Failed to load image';
      statusDiv.className = 'upload-status error';
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload Image';
    };
    reader.readAsDataURL(file);
    return;
  }

  fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      vehicles[vehicleIndex].images.push(data.data.url);
      
      statusDiv.textContent = '✅ Image uploaded successfully!';
      statusDiv.className = 'upload-status success';
      fileInput.value = '';
      
      setTimeout(() => {
        openEditModal(vehicleId);
      }, 1500);
    } else {
      throw new Error(data.error.message || 'Upload failed');
    }
  })
  .catch(err => {
    statusDiv.textContent = '❌ Upload failed: ' + err.message;
    statusDiv.className = 'upload-status error';
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Upload Image';
  });
}

function deleteVehicle(id) {
  if (!confirm('⚠️ Are you sure you want to delete this vehicle?\n\nThis action cannot be undone.')) return;
  
  vehicles = vehicles.filter(v => v.id !== id);
  closeEditModal();
  renderVehicles();
  alert('✅ Vehicle deleted successfully!');
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
  renderVehicles();

  const priceSlider = document.getElementById('price-slider');
  priceSlider.addEventListener('input', (e) => {
    document.getElementById('max-price-display').value = formatPrice(parseInt(e.target.value));
  });

  document.getElementById('search-input').addEventListener('input', debounce(applyFilters, 500));

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.quickFilter = pill.dataset.filter;
      state.currentPage = 1;
      renderVehicles();
    });
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    state.currentPage = 1;
    renderVehicles();
  });

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

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (state.currentPage > 1) goToPage(state.currentPage - 1);
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    const filtered = getFilteredVehicles();
    const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
    if (state.currentPage < totalPages) goToPage(state.currentPage + 1);
  });

  document.getElementById('mobile-filter-btn').addEventListener('click', toggleMobileFilters);
  document.getElementById('close-sidebar').addEventListener('click', closeMobileFilters);
  document.getElementById('overlay').addEventListener('click', closeMobileFilters);

  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  document.getElementById('admin-toggle').addEventListener('click', toggleAdminMode);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeEditModal();
      closeMobileFilters();
    }
  });

  console.log('✅ PitSpot Auto Inventory System initialized successfully!');
  console.log(`📊 Total vehicles: ${vehicles.length}`);
  console.log(`🖼️  Total images: ${vehicles.reduce((sum, v) => sum + v.images.length, 0)}`);
}

document.addEventListener('DOMContentLoaded', init);
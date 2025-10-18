import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, query, onSnapshot, getDocs, addDoc, doc, limit } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/**
 * PitSpot Auto Inventory Script
 *
 * NOW USING FIREBASE FIRESTORE FOR REAL-TIME DATA (Nigerian Naira Edition)
 * Vehicles must contain an 'image' field with the URL (e.g., an Imgur Direct Link).
 */

// --- GLOBAL FIREBASE VARIABLES ---
let db;
let auth;
let userId; // For security pathing, though we use a public collection here.

// IMPORTANT: Define the public collection path using the provided APP_ID
// NOTE: Assuming __app_id and __firebase_config are globally available/injected by the environment.
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// This is the collection where all vehicle data must be stored for the app to function.
const VEHICLES_COLLECTION = `artifacts/${APP_ID}/public/data/vehicles`;


// --- Currency Formatting Helper ---
/**
 * Formats a number as Nigerian Naira (NGN) currency.
 * @param {number} price
 * @returns {string} Formatted currency string (e.g., "₦32,500").
 */
function formatNaira(price) {
    // Use the Nigerian locale 'en-NG' for Naira formatting
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN', // Nigerian Naira
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

// --- 2. GLOBAL STATE MANAGEMENT ---
const state = {
    vehiclesPerPage: 6,
    currentPage: 1,
    currentView: 'grid', // 'grid' or 'list'
    filters: {
        search: '',
        priceMax: 100000000, // Adjusted to a more realistic NGN max price for filtering
        make: [],
        body: [],
        yearFrom: 0,
        yearTo: 9999,
        mileage: [], // e.g., ['0-20000']
        color: [],
        transmission: [],
        fuel: [],
        features: [],
        quickFilter: 'all', // all, new, price-drop, etc.
    },
    sort: 'relevant', // price-low, year-new, etc.
    inventoryData: [], // Holds ALL vehicles fetched from Firestore
    filteredVehicles: [], // Holds the currently filtered/sorted vehicles
};

// --- 3. UI ELEMENT REFERENCES ---
const ui = {
    gridContainer: document.getElementById('vehicle-grid'),
    totalCount: document.getElementById('total-count'),
    showingCount: document.getElementById('showing-count'),
    resultsCount: document.getElementById('results-count'),
    pagination: document.getElementById('pagination'),
    pageNumbers: document.getElementById('page-numbers'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    sortSelect: document.getElementById('sort-select'),
    priceSlider: document.getElementById('price-slider'),
    maxPriceDisplay: document.getElementById('max-price-display'),
    quickFiltersContainer: document.querySelector('.quick-filters'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    navLinks: document.querySelector('.nav-links'),
    filterSidebar: document.getElementById('filter-sidebar'),
    mobileFilterBtn: document.getElementById('mobile-filter-btn'),
    closeSidebarBtn: document.getElementById('close-sidebar'),
    overlay: document.getElementById('overlay'),
    activeFiltersContainer: document.getElementById('active-filters'),
    filterCountBadge: document.getElementById('filter-count'),
    // Ensure search input is referenced
    searchInput: document.getElementById('search-input') 
};

// --- 4. CORE LOGIC FUNCTIONS ---

/**
 * Updates the filter count badge on the mobile button.
 */
function updateFilterCount() {
    let count = 0;
    const { filters } = state;
    const maxFilterPrice = 100000000; // Assuming this is the max price for the slider

    // Check sidebar filters (arrays)
    ['make', 'body', 'transmission', 'fuel', 'features', 'mileage', 'color'].forEach(key => {
        count += filters[key].length;
    });

    // Check price slider (if not max)
    if (filters.priceMax < maxFilterPrice) {
        count += 1;
    }

    // Check search input
    if (filters.search.length > 0) {
        count += 1;
    }

    // Check if a quick filter other than 'all' is active
    if (filters.quickFilter !== 'all') {
        count += 1;
    }

    ui.filterCountBadge.textContent = count;
}


/**
 * Filters the data from Firestore (state.inventoryData) based on current state.filters and then sorts it.
 * @returns {Array} The filtered and sorted array of vehicles.
 */
function filterAndSortVehicles() {
    // Filter against the real-time data source
    let filtered = state.inventoryData.filter(car => {
        const { filters } = state;

        // 1. Search Filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const carText = `${car.make} ${car.model} ${car.year}`.toLowerCase();
            if (!carText.includes(searchTerm)) return false;
        }

        // 2. Quick Filter
        if (filters.quickFilter !== 'all' && car.status !== filters.quickFilter) {
            return false;
        }

        // 3. Price Filter
        if (car.price > filters.priceMax) return false;

        // 4. Checkbox/Radio Filters (If an array is non-empty, the car must match at least one value)
        if (filters.make.length > 0 && !filters.make.includes(car.make?.toLowerCase())) return false;
        if (filters.body.length > 0 && !filters.body.includes(car.body?.toLowerCase())) return false;
        if (filters.color.length > 0 && !filters.color.includes(car.color?.toLowerCase())) return false;
        if (filters.transmission.length > 0 && !filters.transmission.includes(car.transmission?.toLowerCase())) return false;
        if (filters.fuel.length > 0 && !filters.fuel.includes(car.fuel?.toLowerCase())) return false;

        // 5. Features Filter (Car must have all selected features)
        if (filters.features.length > 0) {
            const carFeatures = car.features?.map(f => f.toLowerCase().replace(/\s/g, '-')) || [];
            for (const feature of filters.features) {
                if (!carFeatures.includes(feature)) {
                    return false;
                }
            }
        }

        // 6. Mileage Filter (Handles range string: '20000-50000' or '100000+')
        if (filters.mileage.length > 0) {
            const mileageFilter = filters.mileage[0]; // Assuming only one radio can be selected
            const parts = mileageFilter.split('-').map(p => p.replace('+', ''));
            const min = parseInt(parts[0]);
            let max = parts[1] ? parseInt(parts[1]) : Infinity;

            if (car.mileage < min || car.mileage > max) {
                return false;
            }
        }

        // 7. Year Range Filter
        if (car.year < filters.yearFrom || car.year > filters.yearTo) return false;


        return true;
    });

    // --- Sorting ---
    filtered.sort((a, b) => {
        switch (state.sort) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'year-new': return b.year - a.year;
            case 'mileage-low': return a.mileage - b.mileage;
            case 'relevant':
            default: return 0; // Keep current order if relevant
        }
    });

    state.filteredVehicles = filtered;
    return filtered;
}

/**
 * Renders the vehicle cards for the current page.
 * NOTE: The car.image field is expected to be an Imgur direct link or any publicly accessible URL.
 */
function renderVehicleGrid(vehicles) {
    if (!ui.gridContainer) return;

    ui.gridContainer.innerHTML = ''; // Clear previous results

    const start = (state.currentPage - 1) * state.vehiclesPerPage;
    const end = start + state.vehiclesPerPage;
    const vehiclesOnPage = vehicles.slice(start, end);

    if (vehiclesOnPage.length === 0) {
        ui.gridContainer.innerHTML = '<div class="text-center p-8 text-gray-500 col-span-full">No vehicles match your current filter selection. Try adjusting your criteria!</div>';
    }

    vehiclesOnPage.forEach(car => {
        // --- Imgur/External Image Integration ---
        // The car.image field holds the URL (e.g., 'https://i.imgur.com/example.jpg')
        const imageUrl = car.image || 'https://placehold.co/400x200/999999/FFFFFF?text=Image+Unavailable';
        
        const featuresHtml = (car.features || []).map(f => `<span class="feature-chip">${f}</span>`).join('');
        const carPrice = car.price || 0; 
        const carMileage = (car.mileage || 0).toLocaleString();
        
        const cardHtml = `
            <div class="car-card">
                <div class="card-media">
                    <img src="${imageUrl}" alt="${car.make} ${car.model}" onerror="this.onerror=null;this.src='https://placehold.co/400x200/999999/FFFFFF?text=Image+Unavailable';">
                    <span class="card-year">${car.year || 'N/A'}</span>
                </div>
                <div class="card-details">
                    <h3 class="card-title">${car.make || 'Unknown'} ${car.model || 'Model'}</h3>
                    <div class="card-specs">
                        ${carMileage} mi <span class="spec-divider">|</span> ${car.body || 'N/A'} <span class="spec-divider">|</span> ${car.fuel || 'N/A'}
                    </div>
                    <div class="card-features">
                        ${featuresHtml}
                    </div>
                </div>
                <div class="card-footer">
                    <span class="card-price">${formatNaira(carPrice)}</span>
                    <button class="inquire-button">Inquire Now</button>
                </div>
            </div>
        `;
        ui.gridContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    updatePaginationControls(vehicles.length);
    updateResultCounts(vehicles.length);
    renderActiveFilters();
}

/**
 * Updates the total and currently showing result counts.
 * @param {number} totalFiltered The count of vehicles after filtering/sorting.
 */
function updateResultCounts(totalFiltered) {
    if (!ui.totalCount || !ui.resultsCount || !ui.showingCount) return;
    
    // Total count now reflects the full inventory from Firestore
    const totalInventory = state.inventoryData.length.toLocaleString();
    const start = (state.currentPage - 1) * state.vehiclesPerPage + 1;
    const end = Math.min(state.currentPage * state.vehiclesPerPage, totalFiltered);

    ui.totalCount.textContent = totalInventory;
    ui.resultsCount.textContent = totalFiltered.toLocaleString();
    ui.showingCount.textContent = totalFiltered > 0 ? `${start} - ${end}` : '0';
}

/**
 * Handles the display of pagination links and buttons.
 * @param {number} totalCount The count of vehicles after filtering/sorting.
 */
function updatePaginationControls(totalCount) {
    if (!ui.pagination || !ui.pageNumbers || !ui.prevBtn || !ui.nextBtn) return;
    
    const totalPages = Math.ceil(totalCount / state.vehiclesPerPage);
    ui.pageNumbers.innerHTML = '';

    if (totalPages <= 1) {
        ui.pagination.style.display = 'none';
        return;
    }

    ui.pagination.style.display = 'flex';
    ui.prevBtn.disabled = state.currentPage === 1;
    ui.nextBtn.disabled = state.currentPage === totalPages;

    for (let i = 1; i <= totalPages; i++) {
        const pageSpan = document.createElement('span');
        pageSpan.textContent = i;
        pageSpan.classList.add('page-number');
        if (i === state.currentPage) {
            pageSpan.classList.add('active');
        }
        pageSpan.addEventListener('click', () => goToPage(i));
        ui.pageNumbers.appendChild(pageSpan);
    }
}

/**
 * Changes the current page and re-renders the grid.
 * @param {number} page The page number to go to.
 */
function goToPage(page) {
    const totalPages = Math.ceil(state.filteredVehicles.length / state.vehiclesPerPage);
    if (page >= 1 && page <= totalPages) {
        state.currentPage = page;
        renderVehicleGrid(state.filteredVehicles);
    }
}

/**
 * Renders active filter chips above the vehicle grid.
 */
function renderActiveFilters() {
    if (!ui.activeFiltersContainer) return;
    
    ui.activeFiltersContainer.innerHTML = '';
    const { filters } = state;
    const activeChips = [];

    // Expose removeFilter globally for the inline onclick handler
    // This allows the chip's '✕' button to work
    window.removeFilter = applyFilters; 

    // Helper to create and append a chip
    const createChip = (label, key, value) => {
        const chip = document.createElement('div');
        chip.classList.add('filter-chip');
        chip.innerHTML = `
            ${label}
            <button onclick="window.removeFilter('${key}', '${value}')">✕</button>
        `;
        activeChips.push(chip);
    };

    // 1. Search Chip
    if (filters.search) {
        createChip(`Search: "${filters.search}"`, 'search', '');
    }

    // 2. Quick Filter Chip
    if (filters.quickFilter !== 'all') {
        const label = filters.quickFilter.charAt(0).toUpperCase() + filters.quickFilter.slice(1).replace('-', ' ');
        createChip(label, 'quickFilter', 'all');
    }

    // 3. Price Chip (Updated to Naira)
    const maxFilterPrice = parseInt(ui.priceSlider?.max || 100000000);
    if (filters.priceMax < maxFilterPrice) {
        createChip(`Max Price: ${formatNaira(filters.priceMax)}`, 'priceMax', maxFilterPrice.toString());
    }

    // 4. Checkbox/Radio Chips
    ['make', 'body', 'transmission', 'fuel', 'features', 'color', 'mileage'].forEach(key => {
        filters[key].forEach(value => {
            const label = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');
            createChip(label, key, value);
        });
    });

    activeChips.forEach(chip => ui.activeFiltersContainer.appendChild(chip));
}

/**
 * Main function to update state, re-filter, and re-render.
 * Can be called with (key, value) to specifically toggle/clear one filter.
 * @param {string} [key] Filter key to target (e.g., 'make', 'quickFilter').
 * @param {string} [value] New value for the filter (e.g., 'toyota', 'all').
 */
function applyFilters(key = null, value = null) {
    const maxFilterPrice = parseInt(ui.priceSlider?.max || 100000000);
    
    if (key === 'quickFilter' && value !== null) {
        state.filters.quickFilter = value;
        
        // Update quick filter pill UI
        ui.quickFiltersContainer.querySelectorAll('.filter-pill').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === value) {
                btn.classList.add('active');
            }
        });

        // If a quick filter is selected, reset sidebar checkboxes (for a cleaner UX)
        if (value !== 'all') {
            document.querySelectorAll('.filter-sidebar input[type="checkbox"], .filter-sidebar input[type="radio"]').forEach(input => {
                input.checked = false;
            });
            // Clear other complex filters in state
            state.filters.make = [];
            state.filters.body = [];
            state.filters.mileage = [];
            state.filters.color = [];
            state.filters.transmission = [];
            state.filters.fuel = [];
            state.filters.features = [];
        }


    } else if (key && value !== null) {
        // Handle specific filter removal/toggle from active chip
        if (Array.isArray(state.filters[key])) {
            // Checkbox arrays: remove the value
            state.filters[key] = state.filters[key].filter(v => v !== value);
            // Update checkbox UI to reflect removal
            const checkbox = document.querySelector(`input[name="${key}"][value="${value}"]`);
            if (checkbox) checkbox.checked = false;
        } else if (key === 'search') {
            state.filters.search = '';
            if(ui.searchInput) ui.searchInput.value = '';
        } else if (key === 'priceMax') {
            state.filters.priceMax = maxFilterPrice;
            if(ui.priceSlider) ui.priceSlider.value = maxFilterPrice;
            if(ui.maxPriceDisplay) ui.maxPriceDisplay.value = formatNaira(maxFilterPrice);
        }
    }


    // Recalculate based on current state
    state.currentPage = 1;
    const vehicles = filterAndSortVehicles();
    renderVehicleGrid(vehicles);
    updateFilterCount();

    // Close sidebar if on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar(false);
    }
}

/**
 * Clears all sidebar filters.
 */
function clearFilters() {
    const maxFilterPrice = parseInt(ui.priceSlider?.max || 100000000);
    
    // Reset all filter state
    state.filters = {
        search: '',
        priceMax: maxFilterPrice,
        make: [],
        body: [],
        yearFrom: 0,
        yearTo: 9999,
        mileage: [],
        color: [],
        transmission: [],
        fuel: [],
        features: [],
        quickFilter: 'all',
    };

    // Reset all UI elements to match state
    document.querySelectorAll('.filter-sidebar input[type="checkbox"], .filter-sidebar input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    if(ui.searchInput) ui.searchInput.value = '';
    if(ui.priceSlider) ui.priceSlider.value = maxFilterPrice;
    if(ui.maxPriceDisplay) ui.maxPriceDisplay.value = formatNaira(maxFilterPrice); 
    
    const yearFromInput = document.getElementById('year-from');
    const yearToInput = document.getElementById('year-to');
    if(yearFromInput) yearFromInput.value = '';
    if(yearToInput) yearToInput.value = '';
    
    document.querySelectorAll('.color-swatch').forEach(swatch => swatch.classList.remove('active'));

    // Reset quick filters UI
    ui.quickFiltersContainer.querySelectorAll('.filter-pill').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        }
    });

    applyFilters();
}

// --- 5. UI INTERACTION HANDLERS ---

/**
 * Handles changes in checkbox, radio, and select inputs in the sidebar.
 */
function handleSidebarInput() {
    const input = this;
    const groupName = input.name;
    const value = input.value.toLowerCase().replace(/\s/g, '-');

    if (input.type === 'checkbox') {
        if (input.checked) {
            if (!state.filters[groupName].includes(value)) {
                state.filters[groupName].push(value);
            }
        } else {
            state.filters[groupName] = state.filters[groupName].filter(v => v !== value);
        }
    } else if (input.type === 'radio') {
        // Radio groups are always single-select arrays
        state.filters[groupName] = [value];
    } else if (input.tagName === 'SELECT') {
        if (input.id === 'year-from') {
            state.filters.yearFrom = parseInt(input.value) || 0;
        } else if (input.id === 'year-to') {
            state.filters.yearTo = parseInt(input.value) || 9999;
        }
    }

    applyFilters();
}

/**
 * Handles the price range slider input.
 */
function handlePriceSlider() {
    const price = parseInt(ui.priceSlider.value);
    state.filters.priceMax = price;
    ui.maxPriceDisplay.value = formatNaira(price); 
    applyFilters(); // Re-filter immediately
}

/**
 * Handles the main sort dropdown selection.
 */
function handleSortChange() {
    state.sort = ui.sortSelect.value;
    // Keep current page, but re-render sorted results
    renderVehicleGrid(filterAndSortVehicles());
}

/**
 * Handles the quick filter pills (e.g., New Arrivals, Price Drop).
 */
function handleQuickFilter(event) {
    const pill = event.target.closest('.filter-pill');
    if (!pill) return;

    const filterValue = pill.getAttribute('data-filter');

    // Toggle active classes
    ui.quickFiltersContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    // Apply filter via main logic function
    applyFilters('quickFilter', filterValue);
}

/**
 * Handles the body type filtering from the stats bar in the page header.
 */
window.filterByType = (type) => {
    // Clear all previous filters first, then apply body type filter
    clearFilters();

    const bodyCheckbox = document.querySelector(`input[name="body"][value="${type}"]`);
    if (bodyCheckbox) {
        bodyCheckbox.checked = true;
        state.filters.body.push(type);
    }

    // Also set the quick filter to 'all' and re-render
    applyFilters();
};


/**
 * Toggles the main navigation menu (for mobile).
 */
function toggleMobileMenu() {
    if (!ui.navLinks || !ui.mobileMenuToggle) return;
    ui.navLinks.classList.toggle('active');
    ui.mobileMenuToggle.classList.toggle('active');
}

/**
 * Toggles the visibility of the filter sidebar (for mobile).
 */
function toggleSidebar(open) {
    if (!ui.filterSidebar || !ui.overlay) return;
    
    if (open === true) {
        ui.filterSidebar.classList.add('open');
        ui.overlay.style.display = 'block';
    } else if (open === false) {
        ui.filterSidebar.classList.remove('open');
        ui.overlay.style.display = 'none';
    } else {
        // Toggle if no argument provided
        const isOpen = ui.filterSidebar.classList.toggle('open');
        ui.overlay.style.display = isOpen ? 'block' : 'none';
    }
}

/**
 * Handles the grid/list view toggle buttons.
 */
function handleViewToggle(event) {
    const btn = event.target.closest('.view-btn');
    if (!btn || !ui.gridContainer) return;

    const newView = btn.getAttribute('data-view');
    state.currentView = newView;

    // Toggle active state on buttons
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Apply the view class to the container
    ui.gridContainer.classList.remove('vehicle-grid', 'vehicle-list');
    ui.gridContainer.classList.add(newView === 'grid' ? 'vehicle-grid' : 'vehicle-list');
}

/**
 * Handles the color swatch selection.
 */
function handleColorSwatch(event) {
    const swatch = event.target.closest('.color-swatch');
    if (!swatch) return;

    const colorValue = swatch.getAttribute('data-color');
    const isActive = swatch.classList.contains('active');

    if (isActive) {
        swatch.classList.remove('active');
        state.filters.color = state.filters.color.filter(c => c !== colorValue);
    } else {
        swatch.classList.add('active');
        state.filters.color.push(colorValue);
    }
    applyFilters();
}

// --- FIREBASE LOGIC ---

/**
 * Sets up a real-time listener to fetch and update inventory data whenever changes occur in Firestore.
 */
function setupInventoryListener() {
    // Query the public collection path
    const q = query(collection(db, VEHICLES_COLLECTION));

    // onSnapshot listener provides real-time updates
    onSnapshot(q, (snapshot) => {
        const vehicles = [];
        snapshot.forEach((doc) => {
            // Include the Firestore doc.id for potential future updates/deletes
            // This is where car.image containing the Imgur link is loaded from Firestore.
            vehicles.push({ id: doc.id, ...doc.data() });
        });

        // 1. Update the application's source of truth with the new data
        state.inventoryData = vehicles;
        console.log(`Fetched ${vehicles.length} vehicles from Firestore in real-time.`);

        // 2. Re-filter and re-render the UI based on the newly fetched data
        applyFilters();

    }, (error) => {
        console.error("Error setting up inventory listener:", error);
    });
}

// --- 6. INITIALIZATION AND EVENT LISTENERS ---

function setupEventListeners() {
    // Mobile Menu
    ui.mobileMenuToggle?.addEventListener('click', toggleMobileMenu);

    // Sidebar Visibility (Mobile)
    ui.mobileFilterBtn?.addEventListener('click', () => toggleSidebar(true));
    ui.closeSidebarBtn?.addEventListener('click', () => toggleSidebar(false));
    ui.overlay?.addEventListener('click', () => toggleSidebar(false));

    // Sort Dropdown
    ui.sortSelect?.addEventListener('change', handleSortChange);

    // Filter Inputs (Generic listener for checkboxes, radios, and year selects)
    document.querySelectorAll('.filter-sidebar input[type="checkbox"], .filter-sidebar input[type="radio"], .filter-sidebar select').forEach(input => {
        input.addEventListener('change', handleSidebarInput);
    });

    // Price Slider
    ui.priceSlider?.addEventListener('input', handlePriceSlider);

    // Quick Filters
    ui.quickFiltersContainer?.addEventListener('click', handleQuickFilter);

    // Color Swatches
    document.querySelector('.color-grid')?.addEventListener('click', handleColorSwatch);

    // View Toggle
    document.querySelector('.view-toggle')?.addEventListener('click', handleViewToggle);

    // Pagination Buttons
    ui.prevBtn?.addEventListener('click', () => goToPage(state.currentPage - 1));
    ui.nextBtn?.addEventListener('click', () => goToPage(state.currentPage + 1));

    // Search Input (Use 'input' for live filtering)
    ui.searchInput?.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        applyFilters();
    });

    // Global clear button handler
    window.clearFilters = clearFilters;

    // Apply filters button
    document.querySelector('.btn-apply')?.addEventListener('click', () => applyFilters());
}

/**
 * Initializes Firebase, authentication, and the real-time data listener.
 */
async function init() {
    console.log("Initializing Firebase and Inventory...");

    try {
        // The environment must inject these global variables
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        if (Object.keys(firebaseConfig).length === 0) {
             throw new Error("Firebase config not found or is empty.");
        }
        
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Authentication: Use custom token if available, otherwise sign in anonymously
        if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
        userId = auth.currentUser?.uid || 'anonymous';
        console.log(`Authenticated with ID: ${userId}`);

        // 1. Set initial prices on the display (Updated to Naira)
        const initialPrice = parseInt(ui.priceSlider?.value || 0);
        if(ui.maxPriceDisplay) ui.maxPriceDisplay.value = formatNaira(initialPrice);

        // 2. Set event listeners
        setupEventListeners();

        // 3. Set up the real-time listener. This triggers the first render.
        setupInventoryListener();

    } catch (error) {
        console.error("Firebase Initialization failed:", error);
    }
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
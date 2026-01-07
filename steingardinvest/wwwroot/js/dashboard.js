// Mock data for properties
const propertiesData = [
    {
        id: 1,
        title: "Luxury Downtown Apartment",
        location: "New York, NY",
        price: 1250000,
        type: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        year: 2020,
        description: "Stunning luxury apartment in the heart of Manhattan with panoramic city views. Features modern amenities, high-end finishes, and premium location. Perfect for investment or personal use.",
        features: ["Parking", "Gym", "Pool", "Concierge"],
        investmentReturn: 8.5,
        status: "Available"
    },
    {
        id: 2,
        title: "Modern Beach House",
        location: "Miami, FL",
        price: 2850000,
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        year: 2022,
        description: "Beautiful modern beachfront property with direct ocean access and private pool. Designed with contemporary architecture and premium materials. Ideal for luxury living or rental income.",
        features: ["Beach Access", "Pool", "Garden", "Parking"],
        investmentReturn: 12.3,
        status: "Available"
    },
    {
        id: 3,
        title: "Commercial Office Space",
        location: "Los Angeles, CA",
        price: 4500000,
        type: "commercial",
        bedrooms: 0,
        bathrooms: 8,
        area: 8500,
        year: 2018,
        description: "Prime commercial office space in downtown LA, fully leased with long-term tenants. Excellent location with high foot traffic and strong rental yields. Stable income-generating asset.",
        features: ["Parking", "Elevator", "Security", "Cafeteria"],
        investmentReturn: 9.2,
        status: "Leased"
    },
    {
        id: 4,
        title: "Elegant Villa",
        location: "Paris, France",
        price: 3200000,
        type: "villa",
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        year: 2019,
        description: "Magnificent villa in prestigious Parisian district with private garden and garage. Classic French architecture combined with modern amenities. Exclusive location with high appreciation potential.",
        features: ["Garden", "Garage", "Security", "Wine Cellar"],
        investmentReturn: 10.5,
        status: "Available"
    },
    {
        id: 5,
        title: "Urban Loft",
        location: "Chicago, IL",
        price: 850000,
        type: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area: 1400,
        year: 2021,
        description: "Stylish converted loft in trendy neighborhood with high ceilings and modern finishes. Great investment opportunity in up-and-coming area with strong rental demand.",
        features: ["High Ceilings", "Parking", "Rooftop Access"],
        investmentReturn: 7.8,
        status: "Available"
    },
    {
        id: 6,
        title: "Development Land",
        location: "London, UK",
        price: 1800000,
        type: "land",
        bedrooms: 0,
        bathrooms: 0,
        area: 12000,
        year: null,
        description: "Prime development land in growing London suburb, approved for residential development. Excellent opportunity for capital appreciation and development potential.",
        features: ["Zoning Approved", "Utilities Available"],
        investmentReturn: 15.0,
        status: "Available"
    },
    {
        id: 7,
        title: "Penthouse Suite",
        location: "Miami, FL",
        price: 5500000,
        type: "apartment",
        bedrooms: 4,
        bathrooms: 3,
        area: 4200,
        year: 2023,
        description: "Ultra-luxury penthouse with private terrace, infinity pool, and 360-degree ocean views. World-class amenities and finishes. The ultimate luxury living experience.",
        features: ["Private Pool", "Terrace", "Concierge", "Gym", "Parking"],
        investmentReturn: 11.2,
        status: "Available"
    },
    {
        id: 8,
        title: "Family Home",
        location: "Los Angeles, CA",
        price: 1950000,
        type: "house",
        bedrooms: 5,
        bathrooms: 4,
        area: 3800,
        year: 2020,
        description: "Spacious family home in quiet residential area with large backyard and pool. Perfect for families seeking comfort and space. Strong rental potential in desirable neighborhood.",
        features: ["Pool", "Garden", "Garage", "Playground"],
        investmentReturn: 8.9,
        status: "Available"
    }
];

let filteredProperties = [...propertiesData];
let currentFilters = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderProperties(filteredProperties);
    updateResultsCount(filteredProperties.length);
    
    // Add event listeners
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    document.getElementById('sortBy').addEventListener('change', function() {
        applyFilters();
    });
});

// Render properties grid
function renderProperties(properties) {
    const grid = document.getElementById('propertiesGrid');
    
    if (properties.length === 0) {
        grid.innerHTML = '<div class="no-results"><p>No properties found matching your criteria.</p></div>';
        return;
    }
    
    grid.innerHTML = properties.map(property => `
        <div class="property-card" onclick="showPropertyDetails(${property.id})">
            <div class="property-image">
                ${getPropertyIcon(property.type)}
                <div class="property-badge">${property.status}</div>
            </div>
            <div class="property-content">
                <div class="property-header">
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-price">$${formatPrice(property.price)}</div>
                </div>
                <div class="property-location">
                    📍 ${property.location}
                </div>
                <div class="property-features">
                    ${property.bedrooms > 0 ? `<div class="property-feature">🛏️ ${property.bedrooms} bed</div>` : ''}
                    ${property.bathrooms > 0 ? `<div class="property-feature">🚿 ${property.bathrooms} bath</div>` : ''}
                    <div class="property-feature">📐 ${property.area} sqft</div>
                </div>
                <div class="property-type">${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</div>
                <div class="property-footer">
                    <span class="property-id">ID: ${property.id}</span>
                    <button class="btn-view-details" onclick="event.stopPropagation(); showPropertyDetails(${property.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get property icon based on type
function getPropertyIcon(type) {
    const icons = {
        apartment: '🏢',
        house: '🏠',
        commercial: '🏬',
        land: '🌳',
        villa: '🏰'
    };
    return icons[type] || '🏘️';
}

// Format price
function formatPrice(price) {
    if (price >= 1000000) {
        return (price / 1000000).toFixed(1) + 'M';
    } else if (price >= 1000) {
        return (price / 1000).toFixed(0) + 'K';
    }
    return price.toString();
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        applyFilters();
        return;
    }
    
    filteredProperties = propertiesData.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.type.toLowerCase().includes(searchTerm)
    );
    
    applySorting();
    renderProperties(filteredProperties);
    updateResultsCount(filteredProperties.length);
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('filterType').value;
    const location = document.getElementById('filterLocation').value;
    const priceMin = document.getElementById('priceMin').value;
    const priceMax = document.getElementById('priceMax').value;
    const bedrooms = document.getElementById('filterBedrooms').value;
    
    filteredProperties = propertiesData.filter(property => {
        if (searchTerm && 
            !property.title.toLowerCase().includes(searchTerm) &&
            !property.location.toLowerCase().includes(searchTerm) &&
            !property.type.toLowerCase().includes(searchTerm)) {
            return false;
        }
        if (type && property.type !== type) return false;
        if (location && !property.location.toLowerCase().includes(location.replace('-', ' '))) return false;
        if (priceMin && property.price < parseInt(priceMin)) return false;
        if (priceMax && property.price > parseInt(priceMax)) return false;
        if (bedrooms && property.bedrooms < parseInt(bedrooms)) return false;
        return true;
    });
    
    applySorting();
    renderProperties(filteredProperties);
    updateResultsCount(filteredProperties.length);
}

// Apply sorting
function applySorting() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredProperties.sort((a, b) => {
        switch(sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'newest':
                return (b.year || 0) - (a.year || 0);
            case 'oldest':
                return (a.year || 0) - (b.year || 0);
            default:
                return 0;
        }
    });
}

// Clear filters
function clearFilters() {
    document.getElementById('filterType').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('filterBedrooms').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortBy').value = 'price-asc';
    
    filteredProperties = [...propertiesData];
    applySorting();
    renderProperties(filteredProperties);
    updateResultsCount(filteredProperties.length);
}

// Toggle filters panel
function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    panel.classList.toggle('active');
}

// Update results count
function updateResultsCount(count) {
    document.getElementById('resultsCount').textContent = count;
}

// Show property details
function showPropertyDetails(id) {
    const property = propertiesData.find(p => p.id === id);
    if (!property) return;
    
    const modal = document.getElementById('propertyModal');
    const details = document.getElementById('propertyDetails');
    
    details.innerHTML = `
        <div class="property-details-header">
            <div class="property-details-image">
                ${getPropertyIcon(property.type)}
            </div>
            <div class="property-details-info">
                <h2>${property.title}</h2>
                <div class="property-details-price">$${formatPrice(property.price)}</div>
                <div class="property-details-meta">
                    <div class="property-details-meta-item">
                        📍 ${property.location}
                    </div>
                    <div class="property-details-meta-item">
                        🏷️ ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </div>
                    <div class="property-details-meta-item">
                        ✅ ${property.status}
                    </div>
                </div>
                <div class="property-specs">
                    ${property.bedrooms > 0 ? `
                        <div class="property-spec">
                            <div class="property-spec-label">Bedrooms</div>
                            <div class="property-spec-value">${property.bedrooms}</div>
                        </div>
                    ` : ''}
                    ${property.bathrooms > 0 ? `
                        <div class="property-spec">
                            <div class="property-spec-label">Bathrooms</div>
                            <div class="property-spec-value">${property.bathrooms}</div>
                        </div>
                    ` : ''}
                    <div class="property-spec">
                        <div class="property-spec-label">Area</div>
                        <div class="property-spec-value">${property.area} sqft</div>
                    </div>
                    ${property.year ? `
                        <div class="property-spec">
                            <div class="property-spec-label">Year Built</div>
                            <div class="property-spec-value">${property.year}</div>
                        </div>
                    ` : ''}
                    <div class="property-spec">
                        <div class="property-spec-label">Investment Return</div>
                        <div class="property-spec-value">${property.investmentReturn}%</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="property-details-section">
            <h3>Description</h3>
            <p>${property.description}</p>
        </div>
        
        <div class="property-details-section">
            <h3>Features</h3>
            <div class="property-specs">
                ${property.features.map(feature => `
                    <div class="property-spec">
                        <div class="property-spec-value">${feature}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="property-actions">
            <button class="btn-invest" onclick="handleInvest(${property.id})">
                Invest Now
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close property modal
function closePropertyModal() {
    const modal = document.getElementById('propertyModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle invest button
function handleInvest(id) {
    const property = propertiesData.find(p => p.id === id);
    alert(`Investment process for "${property.title}" will be implemented. Property ID: ${id}`);
    // Here you would implement the actual investment logic
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('propertyModal');
    if (event.target === modal) {
        closePropertyModal();
    }
}

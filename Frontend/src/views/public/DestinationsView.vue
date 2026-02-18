<template>
  <div class="destinations-view">
    <!-- Header Section -->
    <section class="destinations-header">
      <div class="container">
        <h1 class="page-title">Explore <span>Destinations</span></h1>
        <p class="page-subtitle">Discover where your next mystery adventure could take you</p>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-wrapper">
          <!-- Search Bar -->
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search destinations..."
              class="search-input"
            >
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">✕</button>
          </div>

          <!-- Filter Dropdowns -->
          <div class="filter-controls">
            <!-- Region Filter -->
            <div class="filter-dropdown">
              <button class="filter-btn" @click="toggleFilter('region')">
                <span>Region</span>
                <span class="dropdown-icon">{{ activeFilter === 'region' ? '▲' : '▼' }}</span>
              </button>
              <div v-if="activeFilter === 'region'" class="filter-menu">
                <label v-for="region in regions" :key="region" class="filter-option">
                  <input 
                    type="checkbox" 
                    :value="region" 
                    v-model="selectedRegions"
                  >
                  {{ region }}
                </label>
              </div>
            </div>

            <!-- Price Filter -->
            <div class="filter-dropdown">
              <button class="filter-btn" @click="toggleFilter('price')">
                <span>Price Range</span>
                <span class="dropdown-icon">{{ activeFilter === 'price' ? '▲' : '▼' }}</span>
              </button>
              <div v-if="activeFilter === 'price'" class="filter-menu price-menu">
                <div class="price-range">
                  <input 
                    type="range" 
                    v-model.number="priceRange.max" 
                    :min="priceRange.min" 
                    :max="3000" 
                    step="100"
                  >
                  <div class="price-values">
                    <span>R{{ priceRange.min }}</span>
                    <span>R{{ priceRange.max }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Duration Filter -->
            <div class="filter-dropdown">
              <button class="filter-btn" @click="toggleFilter('duration')">
                <span>Duration</span>
                <span class="dropdown-icon">{{ activeFilter === 'duration' ? '▲' : '▼' }}</span>
              </button>
              <div v-if="activeFilter === 'duration'" class="filter-menu">
                <label v-for="duration in durations" :key="duration" class="filter-option">
                  <input 
                    type="checkbox" 
                    :value="duration" 
                    v-model="selectedDurations"
                  >
                  {{ duration }}
                </label>
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="filter-dropdown">
              <button class="filter-btn" @click="toggleFilter('rating')">
                <span>Rating</span>
                <span class="dropdown-icon">{{ activeFilter === 'rating' ? '▲' : '▼' }}</span>
              </button>
              <div v-if="activeFilter === 'rating'" class="filter-menu">
                <label v-for="rating in ratings" :key="rating" class="filter-option">
                  <input 
                    type="radio" 
                    name="rating" 
                    :value="rating" 
                    v-model="selectedRating"
                  >
                  {{ rating }} {{ rating === 5 ? '⭐' : '⭐ and up' }}
                </label>
              </div>
            </div>

            <!-- Revealed/Mystery Toggle -->
            <div class="filter-toggle">
              <button 
                class="toggle-btn" 
                :class="{ active: showRevealed }"
                @click="showRevealed = true"
              >
                Revealed
              </button>
              <button 
                class="toggle-btn" 
                :class="{ active: !showRevealed }"
                @click="showRevealed = false"
              >
                Mystery
              </button>
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="hasActiveFilters" class="active-filters">
            <span class="active-filters-label">Active filters:</span>
            <div class="filter-tags">
              <span v-for="region in selectedRegions" :key="region" class="filter-tag">
                {{ region }}
                <button @click="removeFilter('region', region)" class="remove-tag">✕</button>
              </span>
              <span v-if="priceRange.max < 3000" class="filter-tag">
                Up to R{{ priceRange.max }}
                <button @click="resetPriceFilter" class="remove-tag">✕</button>
              </span>
              <span v-for="duration in selectedDurations" :key="duration" class="filter-tag">
                {{ duration }}
                <button @click="removeFilter('duration', duration)" class="remove-tag">✕</button>
              </span>
              <span v-if="selectedRating" class="filter-tag">
                {{ selectedRating }}+ ⭐
                <button @click="selectedRating = null" class="remove-tag">✕</button>
              </span>
            </div>
            <button @click="clearAllFilters" class="clear-all-btn">Clear all</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Count -->
    <section class="results-section">
      <div class="container">
        <div class="results-header">
          <p class="results-count">
            Showing <strong>{{ filteredDestinations.length }}</strong> 
            {{ filteredDestinations.length === 1 ? 'destination' : 'destinations' }}
          </p>
          <select v-model="sortBy" class="sort-select">
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="duration-asc">Shortest Trips</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Destinations Grid -->
    <section class="destinations-grid-section">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading destinations...</p>
        </div>

        <!-- No Results -->
        <div v-else-if="filteredDestinations.length === 0" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No destinations found</h3>
          <p>Try adjusting your filters or search query</p>
          <button @click="clearAllFilters" class="btn btn-primary">Clear Filters</button>
        </div>

        <!-- Destinations Grid -->
        <div v-else class="destinations-grid">
          <DestinationCard 
            v-for="dest in sortedDestinations" 
            :key="dest.id"
            :destination="dest"
            @selected="handleDestinationSelected"
            @click="handleCardClick"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreDestinations" class="load-more">
          <button @click="loadMore" class="btn btn-outline" :disabled="loadingMore">
            <span v-if="loadingMore" class="spinner-small"></span>
            <span v-else>Load More Destinations</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Mystery Call to Action -->
    <section class="mystery-cta">
      <div class="container">
        <div class="cta-content">
          <h2>Can't decide?</h2>
          <p>Let fate choose for you. Spin the globe and let us surprise you!</p>
          <router-link to="/spin" class="btn btn-primary btn-large">
            <span class="btn-icon">🎲</span>
            Spin the Globe
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DestinationCard from '@/components/common/ui/DestinationCard.vue'

export default {
  name: 'DestinationsView',
  components: {
    DestinationCard
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    
    // State
    const loading = ref(false)
    const loadingMore = ref(false)
    const searchQuery = ref('')
    const activeFilter = ref(null)
    const showRevealed = ref(true) // true for revealed, false for mystery
    
    // Filter states
    const selectedRegions = ref([])
    const priceRange = ref({ min: 0, max: 3000 })
    const selectedDurations = ref([])
    const selectedRating = ref(null)
    const sortBy = ref('default')
    
    // Filter options
    const regions = [
      'Africa',
      'Asia',
      'Europe',
      'North America',
      'South America',
      'Oceania',
      'Middle East'
    ]
    
    const durations = [
      'Weekend (2-3 days)',
      'Short Break (4-5 days)',
      'Week Long (6-7 days)',
      'Extended (8+ days)'
    ]
    
    const ratings = [5, 4, 3]
    
    // Mock destinations data (replace with API call)
    const allDestinations = ref([])
    
    // Computed
    const hasActiveFilters = computed(() => {
      return selectedRegions.value.length > 0 ||
             priceRange.value.max < 3000 ||
             selectedDurations.value.length > 0 ||
             selectedRating.value !== null ||
             searchQuery.value !== ''
    })
    
    const filteredDestinations = computed(() => {
      return allDestinations.value.filter(dest => {
        // Search filter
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          const matchesSearch = dest.name?.toLowerCase().includes(query) ||
                               dest.country?.toLowerCase().includes(query) ||
                               dest.tags?.some(tag => tag.toLowerCase().includes(query))
          if (!matchesSearch) return false
        }
        
        // Region filter
        if (selectedRegions.value.length > 0) {
          if (!dest.region || !selectedRegions.value.includes(dest.region)) return false
        }
        
        // Price filter
        if (dest.price > priceRange.value.max) return false
        
        // Duration filter
        if (selectedDurations.value.length > 0) {
          const durationMatch = selectedDurations.value.some(duration => {
            if (duration.includes('2-3') && dest.days <= 3) return true
            if (duration.includes('4-5') && dest.days >= 4 && dest.days <= 5) return true
            if (duration.includes('6-7') && dest.days >= 6 && dest.days <= 7) return true
            if (duration.includes('8+') && dest.days >= 8) return true
            return false
          })
          if (!durationMatch) return false
        }
        
        // Rating filter
        if (selectedRating.value !== null) {
          if (!dest.rating || dest.rating < selectedRating.value) return false
        }
        
        // Revealed/Mystery filter
        if (dest.revealed !== showRevealed.value) return false
        
        return true
      })
    })
    
    const sortedDestinations = computed(() => {
      const sorted = [...filteredDestinations.value]
      
      switch (sortBy.value) {
        case 'price-asc':
          return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        case 'price-desc':
          return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        case 'rating-desc':
          return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        case 'duration-asc':
          return sorted.sort((a, b) => (a.days || 0) - (b.days || 0))
        default:
          return sorted
      }
    })
    
    const hasMoreDestinations = computed(() => {
      // Implement pagination logic
      return false
    })
    
    // Methods
    const toggleFilter = (filter) => {
      activeFilter.value = activeFilter.value === filter ? null : filter
    }
    
    const removeFilter = (type, value) => {
      if (type === 'region') {
        selectedRegions.value = selectedRegions.value.filter(r => r !== value)
      } else if (type === 'duration') {
        selectedDurations.value = selectedDurations.value.filter(d => d !== value)
      }
    }
    
    const resetPriceFilter = () => {
      priceRange.value.max = 3000
    }
    
    const clearAllFilters = () => {
      searchQuery.value = ''
      selectedRegions.value = []
      priceRange.value.max = 3000
      selectedDurations.value = []
      selectedRating.value = null
    }
    
    const handleDestinationSelected = (destination) => {
      if (destination.revealed) {
        router.push(`/destination/${destination.id}`)
      } else {
        router.push('/spin')
      }
    }
    
    const handleCardClick = (destination) => {
      console.log('Card clicked:', destination)
    }
    
    const loadMore = async () => {
      loadingMore.value = true
      // Implement load more logic
      setTimeout(() => {
        loadingMore.value = false
      }, 1000)
    }
    
    const fetchDestinations = async () => {
      loading.value = true
      try {
        // Simulate API call - replace with actual API
        setTimeout(() => {
          allDestinations.value = [
            {
              id: 1,
              name: 'Tokyo',
              country: 'Japan',
              region: 'Asia',
              image: 'tokyo.jpg',
              price: 1299,
              days: 5,
              rating: 4.8,
              tags: ['Culture', 'Food', 'City', 'Technology'],
              revealed: true
            },
            {
              id: 2,
              name: 'Mystery Asia',
              region: 'Asia',
              image: 'mystery-asia.jpg',
              price: 899,
              days: 4,
              tags: ['Mystery', 'Adventure', 'Culture'],
              revealed: false
            },
            {
              id: 3,
              name: 'Cape Town',
              country: 'South Africa',
              region: 'Africa',
              image: 'cape-town.jpg',
              price: 799,
              days: 4,
              rating: 4.9,
              tags: ['Beach', 'Mountain', 'Wine', 'Adventure'],
              revealed: true
            },
            {
              id: 4,
              name: 'Mystery Africa',
              region: 'Africa',
              image: 'mystery-africa.jpg',
              price: 699,
              days: 5,
              tags: ['Mystery', 'Safari', 'Adventure'],
              revealed: false
            },
            {
              id: 5,
              name: 'Paris',
              country: 'France',
              region: 'Europe',
              image: 'paris.jpg',
              price: 999,
              days: 4,
              rating: 4.7,
              tags: ['Romance', 'Food', 'Culture', 'Art'],
              revealed: true
            },
            {
              id: 6,
              name: 'Mystery Europe',
              region: 'Europe',
              image: 'mystery-europe.jpg',
              price: 849,
              days: 5,
              tags: ['Mystery', 'History', 'Culture'],
              revealed: false
            },
            {
              id: 7,
              name: 'New York',
              country: 'USA',
              region: 'North America',
              image: 'nyc.jpg',
              price: 1199,
              days: 4,
              rating: 4.8,
              tags: ['City', 'Culture', 'Food', 'Shopping'],
              revealed: true
            },
            {
              id: 8,
              name: 'Rio de Janeiro',
              country: 'Brazil',
              region: 'South America',
              image: 'rio.jpg',
              price: 1099,
              days: 6,
              rating: 4.6,
              tags: ['Beach', 'Party', 'Nature'],
              revealed: true
            }
          ]
          loading.value = false
        }, 1000)
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
        loading.value = false
      }
    }
    
    // Lifecycle
    onMounted(() => {
      fetchDestinations()
    })
    
    return {
      // State
      loading,
      loadingMore,
      searchQuery,
      activeFilter,
      showRevealed,
      selectedRegions,
      priceRange,
      selectedDurations,
      selectedRating,
      sortBy,
      regions,
      durations,
      ratings,
      filteredDestinations,
      sortedDestinations,
      hasActiveFilters,
      hasMoreDestinations,
      
      // Methods
      toggleFilter,
      removeFilter,
      resetPriceFilter,
      clearAllFilters,
      handleDestinationSelected,
      handleCardClick,
      loadMore
    }
  }
}
</script>

<style scoped>
.destinations-view {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Section */
.destinations-header {
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
              url('/images/destinations-header.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.page-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 800;
}

.page-title span {
  color: #FF6B6B;
  position: relative;
}

.page-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.3);
  z-index: -1;
}

.page-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Filters Section */
.filters-section {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 90;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.filters-wrapper {
  padding: 20px 0;
}

/* Search Box */
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #999;
}

.search-input {
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  padding: 5px;
}

.clear-search:hover {
  color: #FF6B6B;
}

/* Filter Controls */
.filter-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
}

.filter-dropdown {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #e0e0e0;
}

.dropdown-icon {
  font-size: 0.8rem;
}

.filter-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  padding: 15px;
  min-width: 200px;
  z-index: 100;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  cursor: pointer;
}

.filter-option input {
  cursor: pointer;
}

/* Price Menu */
.price-menu {
  width: 250px;
}

.price-range {
  padding: 10px 0;
}

.price-range input {
  width: 100%;
  margin: 10px 0;
}

.price-values {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
}

/* Filter Toggle */
.filter-toggle {
  display: flex;
  background: #f5f5f5;
  border-radius: 50px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.toggle-btn {
  padding: 10px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: #FF6B6B;
  color: white;
}

/* Active Filters */
.active-filters {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 10px 0;
}

.active-filters-label {
  color: #666;
  font-size: 0.9rem;
}

.filter-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: #f0f0f0;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #333;
}

.remove-tag {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #999;
  padding: 0 2px;
}

.remove-tag:hover {
  color: #FF6B6B;
}

.clear-all-btn {
  background: none;
  border: none;
  color: #FF6B6B;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.clear-all-btn:hover {
  color: #FF5252;
}

/* Results Section */
.results-section {
  padding: 20px 0;
  background: #f9f9f9;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  color: #666;
}

.sort-select {
  padding: 8px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
}

.sort-select:focus {
  outline: none;
  border-color: #FF6B6B;
}

/* Destinations Grid */
.destinations-grid-section {
  padding: 40px 20px;
  min-height: 500px;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

/* Loading States */
.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-small {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 80px 20px;
  background: #f9f9f9;
  border-radius: 20px;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.no-results p {
  color: #666;
  margin-bottom: 30px;
}

/* Load More */
.load-more {
  text-align: center;
  margin-top: 50px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #FF6B6B;
  color: white;
}

.btn-primary:hover {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
}

.btn-outline {
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
  background: transparent;
}

.btn-outline:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

.btn-large {
  padding: 15px 40px;
  font-size: 1.1rem;
}

.btn-icon {
  font-size: 1.2rem;
}

/* Mystery CTA */
.mystery-cta {
  background: linear-gradient(135deg, #FF6B6B 0%, #9B6B9E 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: white;
}

.cta-content p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

/* Dark Mode Styles */
:root.dark-mode .filters-section {
  background: #0B1E33;
  border-bottom-color: #1A334D;
}

:root.dark-mode .search-input {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .search-input::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .filter-btn {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .filter-btn:hover {
  background: #1A334D;
}

:root.dark-mode .filter-menu {
  background: #0B1E33;
  border: 1px solid #00D4FF;
}

:root.dark-mode .filter-option {
  color: #F5F9FF;
}

:root.dark-mode .filter-toggle {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .toggle-btn {
  color: #B0C4DE;
}

:root.dark-mode .toggle-btn.active {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .results-section {
  background: #122B44;
}

:root.dark-mode .results-count {
  color: #B0C4DE;
}

:root.dark-mode .sort-select {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .filter-tag {
  background: #122B44;
  color: #F5F9FF;
  border: 1px solid #00D4FF;
}

:root.dark-mode .no-results {
  background: #122B44;
}

:root.dark-mode .no-results h3 {
  color: #F5F9FF;
}

:root.dark-mode .btn-outline {
  border-color: #00D4FF;
  color: #00D4FF;
}

:root.dark-mode .btn-outline:hover {
  background: #00D4FF;
  color: #0B1E33;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-dropdown {
    width: 100%;
  }
  
  .filter-btn {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-menu {
    width: 100%;
    left: 0;
  }
  
  .filter-toggle {
    width: 100%;
  }
  
  .toggle-btn {
    flex: 1;
    text-align: center;
  }
  
  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .destinations-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .destinations-header {
    padding: 60px 20px;
  }
  
  .active-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-tags {
    width: 100%;
  }
  
  .destinations-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
}
</style>
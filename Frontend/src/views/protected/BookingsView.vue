<template>
  <div class="bookings-view">
    <!-- Header -->
    <div class="bookings-header">
      <h1 class="page-title">My <span>Bookings</span></h1>
      <p class="page-subtitle">Manage your upcoming and past adventures</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading your bookings...</p>
    </div>

    <div v-else>
      <!-- Tabs -->
      <div class="bookings-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'upcoming' }"
          @click="activeTab = 'upcoming'"
        >
          <span class="tab-icon">📅</span>
          Upcoming ({{ upcomingBookings.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'past' }"
          @click="activeTab = 'past'"
        >
          <span class="tab-icon">📦</span>
          Past ({{ pastBookings.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'cancelled' }"
          @click="activeTab = 'cancelled'"
        >
          <span class="tab-icon">❌</span>
          Cancelled ({{ cancelledBookings.length }})
        </button>
      </div>

      <!-- Filters -->
      <div class="bookings-filters">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by destination or booking #"
          >
        </div>
        
        <select v-model="sortBy" class="sort-select">
          <option value="date-desc">Most Recent</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
        </select>
      </div>

      <!-- No Bookings State -->
      <div v-if="filteredBookings.length === 0" class="no-bookings">
        <div class="no-bookings-icon">🧳</div>
        <h3>No {{ activeTab }} bookings found</h3>
        <p v-if="searchQuery">Try adjusting your search or filters</p>
        <p v-else-if="activeTab === 'upcoming'">Ready to plan your next adventure?</p>
        <p v-else-if="activeTab === 'past'">Your past trips will appear here</p>
        <p v-else>No cancelled bookings to show</p>
        
        <div class="no-bookings-actions" v-if="activeTab === 'upcoming' && !searchQuery">
          <router-link to="/spin" class="btn btn-primary">
            <span class="btn-icon">🎲</span>
            Spin the Globe
          </router-link>
          <router-link to="/destinations" class="btn btn-outline">
            <span class="btn-icon">🌍</span>
            Browse Destinations
          </router-link>
        </div>
        
        <button v-else-if="searchQuery" @click="clearSearch" class="btn btn-outline">
          Clear Search
        </button>
      </div>

      <!-- Bookings List -->
      <div v-else class="bookings-list">
        <div v-for="booking in filteredBookings" :key="booking.id" class="booking-card">
          <!-- Status Banner -->
          <div class="booking-status" :class="booking.status">
            <div class="status-left">
              <span class="status-icon">{{ getStatusIcon(booking.status) }}</span>
              <span class="status-text">{{ booking.status.toUpperCase() }}</span>
            </div>
            <div class="status-right">
              <span class="booking-number">#{{ booking.bookingNumber }}</span>
            </div>
          </div>

          <div class="booking-content">
            <!-- Image -->
            <div class="booking-image" :style="{ backgroundImage: `url(${booking.image})` }">
              <div v-if="!booking.revealed" class="mystery-overlay">
                <span class="mystery-icon">❓</span>
                <span>Mystery Destination</span>
              </div>
            </div>

            <!-- Details -->
            <div class="booking-details">
              <div class="details-header">
                <h3 class="booking-title">
                  {{ booking.revealed ? booking.destination : 'Mystery Adventure' }}
                </h3>
                <p v-if="booking.revealed" class="booking-country">{{ booking.country }}</p>
                <p v-else class="booking-region">{{ booking.region }} Mystery</p>
              </div>

              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Departure</span>
                  <span class="detail-value">{{ formatDateTime(booking.departure) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Return</span>
                  <span class="detail-value">{{ formatDateTime(booking.return) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Airline</span>
                  <span class="detail-value">{{ booking.airline }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Accommodation</span>
                  <span class="detail-value">{{ booking.accommodation }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Total Paid</span>
                  <span class="detail-value price">R{{ booking.totalPrice.toLocaleString() }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Booked On</span>
                  <span class="detail-value">{{ formatDate(booking.bookedDate) }}</span>
                </div>
              </div>

              <!-- Tags -->
              <div class="booking-tags" v-if="booking.tags">
                <span v-for="tag in booking.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>

              <!-- Actions -->
              <div class="booking-actions">
                <button @click="viewBookingDetails(booking.id)" class="btn-view">
                  <span class="btn-icon">👁️</span>
                  View Details
                </button>
                
                <button v-if="booking.status === 'confirmed'" @click="downloadItinerary(booking)" class="btn-download">
                  <span class="btn-icon">📄</span>
                  Itinerary
                </button>
                
                <button v-if="canCancel(booking)" @click="cancelBooking(booking)" class="btn-cancel">
                  <span class="btn-icon">❌</span>
                  Cancel
                </button>
                
                <button v-if="booking.status === 'cancelled'" @click="rebookBooking(booking)" class="btn-rebook">
                  <span class="btn-icon">🔄</span>
                  Rebook
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="load-more">
          <button @click="loadMore" class="btn btn-outline" :disabled="loadingMore">
            <span v-if="loadingMore" class="spinner-small"></span>
            <span v-else>Load More Bookings</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'BookingsView',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    // State
    const isLoading = ref(false)
    const loadingMore = ref(false)
    const activeTab = ref('upcoming')
    const searchQuery = ref('')
    const sortBy = ref('date-desc')
    const page = ref(1)
    const hasMore = ref(false)
    
    // Mock bookings data
    const allBookings = ref([
      {
        id: 1,
        bookingNumber: 'SWT123456',
        destination: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        image: '/images/tokyo.jpg',
        status: 'confirmed',
        revealed: true,
        departure: '2026-04-15T10:30:00',
        return: '2026-04-22T18:45:00',
        airline: 'Emirates',
        accommodation: 'Khaosan Tokyo Hostel',
        totalPrice: 1299,
        bookedDate: '2026-02-01',
        tags: ['Culture', 'Food', 'City'],
        daysUntil: 45
      },
      {
        id: 2,
        bookingNumber: 'SWT789012',
        region: 'Asia',
        image: '/images/mystery-asia.jpg',
        status: 'confirmed',
        revealed: false,
        departure: '2026-05-20T14:15:00',
        return: '2026-05-27T09:30:00',
        airline: 'Singapore Airlines',
        accommodation: 'Mystery Hostel',
        totalPrice: 899,
        bookedDate: '2026-02-10',
        tags: ['Mystery', 'Adventure'],
        daysUntil: 80
      },
      {
        id: 3,
        bookingNumber: 'SWT345678',
        destination: 'Cape Town',
        country: 'South Africa',
        region: 'Africa',
        image: '/images/cape-town.jpg',
        status: 'completed',
        revealed: true,
        departure: '2026-01-10T08:00:00',
        return: '2026-01-17T20:15:00',
        airline: 'SAA',
        accommodation: 'Once in Cape Town',
        totalPrice: 799,
        bookedDate: '2025-12-15',
        tags: ['Beach', 'Mountain', 'Wine'],
        daysUntil: -30
      },
      {
        id: 4,
        bookingNumber: 'SWT901234',
        destination: 'Paris',
        country: 'France',
        region: 'Europe',
        image: '/images/paris.jpg',
        status: 'cancelled',
        revealed: true,
        departure: '2026-03-05T12:30:00',
        return: '2026-03-12T16:45:00',
        airline: 'Air France',
        accommodation: 'Generator Paris',
        totalPrice: 999,
        bookedDate: '2026-01-20',
        tags: ['Romance', 'Art', 'Food'],
        daysUntil: 10
      },
      {
        id: 5,
        bookingNumber: 'SWT567890',
        destination: 'New York',
        country: 'USA',
        region: 'North America',
        image: '/images/nyc.jpg',
        status: 'confirmed',
        revealed: true,
        departure: '2026-06-15T19:30:00',
        return: '2026-06-22T22:15:00',
        airline: 'Delta',
        accommodation: 'HI NYC Hostel',
        totalPrice: 1199,
        bookedDate: '2026-02-18',
        tags: ['City', 'Culture', 'Shopping'],
        daysUntil: 112
      },
      {
        id: 6,
        bookingNumber: 'SWT678901',
        region: 'Europe',
        image: '/images/mystery-europe.jpg',
        status: 'pending',
        revealed: false,
        departure: '2026-07-08T09:45:00',
        return: '2026-07-15T13:30:00',
        airline: 'Lufthansa',
        accommodation: 'Mystery Hotel',
        totalPrice: 849,
        bookedDate: '2026-02-20',
        tags: ['Mystery', 'History'],
        daysUntil: 135
      }
    ])
    
    // Computed
    const upcomingBookings = computed(() => {
      return allBookings.value.filter(b => 
        (b.status === 'confirmed' || b.status === 'pending') && 
        new Date(b.departure) > new Date()
      )
    })
    
    const pastBookings = computed(() => {
      return allBookings.value.filter(b => 
        b.status === 'completed' || 
        (b.status === 'confirmed' && new Date(b.departure) < new Date())
      )
    })
    
    const cancelledBookings = computed(() => {
      return allBookings.value.filter(b => b.status === 'cancelled')
    })
    
    const activeBookings = computed(() => {
      switch (activeTab.value) {
        case 'upcoming':
          return upcomingBookings.value
        case 'past':
          return pastBookings.value
        case 'cancelled':
          return cancelledBookings.value
        default:
          return []
      }
    })
    
    const filteredBookings = computed(() => {
      let bookings = [...activeBookings.value]
      
      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        bookings = bookings.filter(b => {
          return b.bookingNumber.toLowerCase().includes(query) ||
                 (b.destination && b.destination.toLowerCase().includes(query)) ||
                 (b.country && b.country.toLowerCase().includes(query)) ||
                 (b.region && b.region.toLowerCase().includes(query))
        })
      }
      
      // Sort
      bookings.sort((a, b) => {
        switch (sortBy.value) {
          case 'date-desc':
            return new Date(b.departure) - new Date(a.departure)
          case 'date-asc':
            return new Date(a.departure) - new Date(b.departure)
          case 'price-desc':
            return b.totalPrice - a.totalPrice
          case 'price-asc':
            return a.totalPrice - b.totalPrice
          default:
            return 0
        }
      })
      
      return bookings
    })
    
    // Methods
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
    
    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString('en-ZA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getStatusIcon = (status) => {
      const icons = {
        confirmed: '✅',
        pending: '⏳',
        completed: '🎉',
        cancelled: '❌'
      }
      return icons[status] || '📅'
    }
    
    const canCancel = (booking) => {
      return booking.status === 'confirmed' && new Date(booking.departure) > new Date()
    }
    
    const viewBookingDetails = (id) => {
      router.push(`/booking/${id}`)
    }
    
    const downloadItinerary = (booking) => {
      console.log('Downloading itinerary for:', booking.bookingNumber)
      store.commit('SHOW_NOTIFICATION', {
        message: 'Downloading itinerary...',
        type: 'info'
      })
    }
    
    const cancelBooking = (booking) => {
      if (confirm(`Are you sure you want to cancel booking #${booking.bookingNumber}?`)) {
        booking.status = 'cancelled'
        store.commit('SHOW_NOTIFICATION', {
          message: 'Booking cancelled successfully',
          type: 'success'
        })
      }
    }
    
    const rebookBooking = (booking) => {
      store.commit('SHOW_NOTIFICATION', {
        message: 'Redirecting to rebooking...',
        type: 'info'
      })
      // Navigate to similar destination or spin
      router.push('/spin')
    }
    
    const clearSearch = () => {
      searchQuery.value = ''
    }
    
    const loadMore = async () => {
      loadingMore.value = true
      // Simulate loading more
      setTimeout(() => {
        loadingMore.value = false
        page.value++
      }, 1000)
    }
    
    onMounted(() => {
      // Fetch bookings from API
    })
    
    return {
      isLoading,
      loadingMore,
      activeTab,
      searchQuery,
      sortBy,
      hasMore,
      upcomingBookings,
      pastBookings,
      cancelledBookings,
      filteredBookings,
      formatDate,
      formatDateTime,
      getStatusIcon,
      canCancel,
      viewBookingDetails,
      downloadItinerary,
      cancelBooking,
      rebookBooking,
      clearSearch,
      loadMore
    }
  }
}
</script>

<style scoped>
.bookings-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header */
.bookings-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 3rem;
  color: #333333;
  margin-bottom: 10px;
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
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.page-subtitle {
  color: #666666;
  font-size: 1.1rem;
}

/* Loading State */
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

/* Tabs */
.bookings-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 25px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border-radius: 50px 50px 0 0;
}

.tab-btn.active {
  color: #FF6B6B;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  right: 0;
  height: 3px;
  background: #FF6B6B;
  border-radius: 3px 3px 0 0;
}

.tab-icon {
  font-size: 1.2rem;
}

/* Filters */
.bookings-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.sort-select {
  padding: 12px 25px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  min-width: 200px;
}

.sort-select:focus {
  outline: none;
  border-color: #FF6B6B;
}

/* No Bookings */
.no-bookings {
  text-align: center;
  padding: 80px 20px;
  background: #f9f9f9;
  border-radius: 20px;
}

.no-bookings-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-bookings h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.no-bookings p {
  color: #666;
  margin-bottom: 30px;
}

.no-bookings-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* Bookings List */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.3s;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.15);
}

/* Status Banner */
.booking-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: white;
}

.booking-status.confirmed {
  background: #28A745;
}

.booking-status.pending {
  background: #FFC107;
  color: #333;
}

.booking-status.completed {
  background: #6C757D;
}

.booking-status.cancelled {
  background: #DC3545;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  font-size: 1.2rem;
}

.status-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.booking-number {
  font-family: monospace;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Booking Content */
.booking-content {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.booking-image {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

.mystery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.mystery-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.booking-details {
  flex: 1;
}

.details-header {
  margin-bottom: 15px;
}

.booking-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 5px;
}

.booking-country,
.booking-region {
  color: #FF6B6B;
  font-weight: 500;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 3px;
}

.detail-value {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.detail-value.price {
  color: #28A745;
  font-weight: 700;
}

.booking-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tag {
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  color: #666;
}

.booking-actions {
  display: flex;
  gap: 10px;
}

.btn-view,
.btn-download,
.btn-cancel,
.btn-rebook {
  padding: 8px 20px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.btn-view {
  background: #4A6FA5;
  color: white;
}

.btn-view:hover {
  background: #3A5A84;
  transform: translateY(-2px);
}

.btn-download {
  background: #6C757D;
  color: white;
}

.btn-download:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #DC3545;
  color: white;
}

.btn-cancel:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-rebook {
  background: #28A745;
  color: white;
}

.btn-rebook:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1rem;
}

/* Load More */
.load-more {
  text-align: center;
  margin-top: 40px;
}

.btn-outline {
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
  background: transparent;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-outline:hover {
  background: #FF6B6B;
  color: white;
}

.spinner-small {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #FF6B6B;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Dark Mode */
:root.dark-mode .bookings-header h1 {
  color: #F5F9FF;
}

:root.dark-mode .page-subtitle {
  color: #B0C4DE;
}

:root.dark-mode .tab-btn {
  color: #B0C4DE;
}

:root.dark-mode .tab-btn.active {
  color: #00D4FF;
}

:root.dark-mode .tab-btn.active::after {
  background: #00D4FF;
}

:root.dark-mode .search-box input,
:root.dark-mode .sort-select {
  background: #0B1E33;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .search-box input::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .no-bookings {
  background: #122B44;
}

:root.dark-mode .no-bookings h3 {
  color: #F5F9FF;
}

:root.dark-mode .booking-card {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .booking-title {
  color: #F5F9FF;
}

:root.dark-mode .detail-value {
  color: #F5F9FF;
}

:root.dark-mode .tag {
  background: #122B44;
  color: #B0C4DE;
  border: 1px solid #1A334D;
}

/* Responsive */
@media (max-width: 968px) {
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .bookings-tabs {
    flex-direction: column;
    border-bottom: none;
    gap: 5px;
  }
  
  .tab-btn {
    border-radius: 50px;
    justify-content: center;
  }
  
  .tab-btn.active::after {
    display: none;
  }
  
  .tab-btn.active {
    background: #FF6B6B;
    color: white;
  }
  
  .bookings-filters {
    flex-direction: column;
  }
  
  .sort-select {
    width: 100%;
  }
  
  .booking-content {
    flex-direction: column;
  }
  
  .booking-image {
    width: 100%;
    height: 150px;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-actions {
    flex-direction: column;
  }
  
  .btn-view,
  .btn-download,
  .btn-cancel,
  .btn-rebook {
    width: 100%;
    justify-content: center;
  }
  
  .no-bookings-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .booking-status {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}
</style>
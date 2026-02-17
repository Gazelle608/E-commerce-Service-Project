<template>
  <div class="booking-details-view" v-if="booking">
    <!-- Header with Back Button -->
    <div class="details-header">
      <button @click="goBack" class="back-btn">
        <span class="back-icon">←</span>
        Back to Bookings
      </button>
      
      <div class="header-right">
        <span class="booking-number">Booking #: {{ booking.bookingNumber }}</span>
        <div class="header-actions">
          <button @click="downloadItinerary" class="btn-icon-only" title="Download Itinerary">
            <span>📄</span>
          </button>
          <button @click="printPage" class="btn-icon-only" title="Print">
            <span>🖨️</span>
          </button>
          <button @click="shareBooking" class="btn-icon-only" title="Share">
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading booking details...</p>
    </div>

    <div v-else class="details-content">
      <!-- Status Banner -->
      <div class="status-banner" :class="booking.status">
        <div class="status-icon">{{ statusIcon }}</div>
        <div class="status-message">
          <h3>{{ statusTitle }}</h3>
          <p>{{ statusDescription }}</p>
        </div>
        <div v-if="canCancel" class="status-action">
          <button @click="cancelBooking" class="btn-cancel-small">
            Cancel Booking
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="details-grid">
        <!-- Left Column - Destination & Countdown -->
        <div class="left-column">
          <!-- Destination Card -->
          <div class="destination-card" :class="{ mystery: !booking.revealed }">
            <div class="destination-image" :style="{ backgroundImage: `url(${booking.image})` }">
              <div v-if="!booking.revealed" class="mystery-reveal">
                <span class="mystery-icon">❓</span>
                <p class="mystery-text">Destination Hidden</p>
                <p class="reveal-date">Reveals {{ formatDate(booking.revealDate) }}</p>
              </div>
            </div>
            <div class="destination-info">
              <h2>{{ booking.revealed ? booking.destination : 'Mystery Destination' }}</h2>
              <p v-if="booking.revealed">{{ booking.country }}</p>
              <p v-else class="region-text">{{ booking.region }} Region</p>
            </div>
          </div>

          <!-- Countdown Timer -->
          <div class="countdown-card">
            <h3>Time Until Departure</h3>
            <div class="countdown-timer">
              <div class="countdown-item">
                <span class="countdown-value">{{ countdown.days }}</span>
                <span class="countdown-label">Days</span>
              </div>
              <div class="countdown-item">
                <span class="countdown-value">{{ countdown.hours }}</span>
                <span class="countdown-label">Hours</span>
              </div>
              <div class="countdown-item">
                <span class="countdown-value">{{ countdown.minutes }}</span>
                <span class="countdown-label">Mins</span>
              </div>
            </div>
            
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <p class="progress-text">{{ progressPercentage }}% of wait time complete</p>
          </div>

          <!-- Weather Widget (if revealed) -->
          <div v-if="booking.revealed && weather" class="weather-card">
            <h3>Weather in {{ booking.destination }}</h3>
            <div class="weather-info">
              <span class="weather-icon">{{ weather.icon }}</span>
              <div class="weather-details">
                <span class="weather-temp">{{ weather.temp }}°C</span>
                <span class="weather-desc">{{ weather.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Booking Details -->
        <div class="right-column">
          <!-- Flight Details -->
          <div class="details-section">
            <h3>
              <span class="section-icon">✈️</span>
              Flight Details
            </h3>
            
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-label">Airline:</span>
                <span class="detail-value">{{ booking.airline }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Flight Number:</span>
                <span class="detail-value">{{ booking.flightNumber || 'TBA' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Departure:</span>
                <span class="detail-value">{{ formatDateTime(booking.departure) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Arrival:</span>
                <span class="detail-value">{{ formatDateTime(booking.arrival) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ booking.duration || 'TBA' }}</span>
              </div>
            </div>
          </div>

          <!-- Accommodation Details -->
          <div class="details-section">
            <h3>
              <span class="section-icon">🏨</span>
              Accommodation
            </h3>
            
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ booking.accommodation }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">{{ booking.accommodationType || 'Standard' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">{{ booking.accommodationAddress || 'TBA' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span class="detail-value">{{ formatTime(booking.checkIn) || 'After 14:00' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span class="detail-value">{{ formatTime(booking.checkOut) || 'Before 10:00' }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Details -->
          <div class="details-section">
            <h3>
              <span class="section-icon">💰</span>
              Payment Details
            </h3>
            
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-label">Base Price:</span>
                <span class="detail-value">R{{ booking.basePrice?.toLocaleString() || '0' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Booking Fee:</span>
                <span class="detail-value">R{{ booking.bookingFee?.toLocaleString() || '50' }}</span>
              </div>
              <div class="detail-row total">
                <span class="detail-label">Total Paid:</span>
                <span class="detail-value price">R{{ booking.totalPrice.toLocaleString() }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">{{ booking.paymentMethod || 'Credit Card' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Date:</span>
                <span class="detail-value">{{ formatDate(booking.paymentDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Important Information -->
          <div class="info-section">
            <h3>
              <span class="section-icon">ℹ️</span>
              Important Information
            </h3>
            
            <ul class="info-list">
              <li>✓ Check-in opens 24 hours before departure</li>
              <li>✓ Valid passport required for international travel</li>
              <li>✓ Visa requirements vary by destination</li>
              <li>✓ Travel insurance is recommended</li>
              <li>✓ Contact support for special assistance</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="downloadItinerary" class="btn-action btn-primary">
          <span class="btn-icon">📄</span>
          Download Full Itinerary
        </button>
        <button @click="contactSupport" class="btn-action btn-outline">
          <span class="btn-icon">📞</span>
          Contact Support
        </button>
        <button v-if="canCancel" @click="cancelBooking" class="btn-action btn-danger">
          <span class="btn-icon">❌</span>
          Cancel Booking
        </button>
      </div>

      <!-- Similar Recommendations -->
      <div v-if="recommendations.length > 0" class="recommendations">
        <h3>You Might Also Like</h3>
        <div class="recommendations-grid">
          <div v-for="rec in recommendations" :key="rec.id" class="rec-card">
            <div class="rec-image" :style="{ backgroundImage: `url(${rec.image})` }"></div>
            <div class="rec-info">
              <h4>{{ rec.name }}</h4>
              <p>{{ rec.country }}</p>
              <span class="rec-price">R{{ rec.price.toLocaleString() }}</span>
            </div>
            <button @click="viewRecommendation(rec)" class="rec-btn">View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'BookingDetailsView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    const bookingId = route.params.id
    const timer = ref(null)
    const isLoading = ref(false)
    
    // Mock booking data
    const booking = ref({
      id: 1,
      bookingNumber: 'SWT123456',
      destination: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      image: '/images/tokyo.jpg',
      status: 'confirmed',
      revealed: true,
      revealDate: '2026-04-13T00:00:00',
      departure: '2026-04-15T10:30:00',
      arrival: '2026-04-15T20:45:00',
      return: '2026-04-22T18:45:00',
      airline: 'Emirates',
      flightNumber: 'EK 1234',
      accommodation: 'Khaosan Tokyo Hostel',
      accommodationType: 'Shared Dorm',
      accommodationAddress: '2-1-1 Asakusa, Taito-ku, Tokyo',
      checkIn: '2026-04-15T15:00:00',
      checkOut: '2026-04-22T11:00:00',
      basePrice: 1249,
      bookingFee: 50,
      totalPrice: 1299,
      paymentMethod: 'Credit Card',
      paymentDate: '2026-02-01',
      duration: '11h 15m'
    })
    
    // Weather mock
    const weather = ref({
      icon: '☀️',
      temp: 22,
      description: 'Sunny'
    })
    
    // Recommendations
    const recommendations = ref([
      {
        id: 101,
        name: 'Osaka',
        country: 'Japan',
        image: '/images/osaka.jpg',
        price: 899
      },
      {
        id: 102,
        name: 'Kyoto',
        country: 'Japan',
        image: '/images/kyoto.jpg',
        price: 949
      }
    ])
    
    // Countdown
    const countdown = ref({ days: 0, hours: 0, minutes: 0 })
    
    // Computed
    const statusIcon = computed(() => {
      const icons = {
        confirmed: '✅',
        pending: '⏳',
        completed: '🎉',
        cancelled: '❌'
      }
      return icons[booking.value?.status] || '📅'
    })
    
    const statusTitle = computed(() => {
      const titles = {
        confirmed: 'Booking Confirmed',
        pending: 'Awaiting Confirmation',
        completed: 'Trip Completed',
        cancelled: 'Booking Cancelled'
      }
      return titles[booking.value?.status] || 'Booking Status'
    })
    
    const statusDescription = computed(() => {
      if (booking.value?.status === 'confirmed') {
        return 'Your adventure is confirmed! Check your email for e-tickets.'
      } else if (booking.value?.status === 'pending') {
        return 'We\'re confirming your booking with partners. This usually takes 24 hours.'
      } else if (booking.value?.status === 'completed') {
        return 'Hope you had an amazing trip! Share your experience with us.'
      } else if (booking.value?.status === 'cancelled') {
        return 'This booking has been cancelled. Refund will be processed within 5-7 business days.'
      }
      return ''
    })
    
    const canCancel = computed(() => {
      return booking.value?.status === 'confirmed' && 
             new Date(booking.value.departure) > new Date()
    })
    
    const progressPercentage = computed(() => {
      if (!booking.value?.departure) return 0
      
      const now = new Date()
      const departure = new Date(booking.value.departure)
      const bookedDate = new Date(booking.value.paymentDate || booking.value.bookedDate)
      
      const totalTime = departure - bookedDate
      const elapsedTime = now - bookedDate
      
      if (elapsedTime < 0) return 0
      if (elapsedTime > totalTime) return 100
      
      return Math.round((elapsedTime / totalTime) * 100)
    })
    
    // Methods
    const updateCountdown = () => {
      if (!booking.value?.departure) return
      
      const now = new Date()
      const departure = new Date(booking.value.departure)
      const diff = departure - now
      
      if (diff > 0) {
        countdown.value = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60)
        }
      } else {
        countdown.value = { days: 0, hours: 0, minutes: 0 }
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
    
    const formatDateTime = (dateString) => {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const formatTime = (dateString) => {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const goBack = () => {
      router.push('/bookings')
    }
    
    const downloadItinerary = () => {
      store.commit('SHOW_NOTIFICATION', {
        message: 'Preparing your itinerary for download...',
        type: 'info'
      })
      // Implement actual download
      setTimeout(() => {
        store.commit('SHOW_NOTIFICATION', {
          message: 'Itinerary downloaded!',
          type: 'success'
        })
      }, 2000)
    }
    
    const printPage = () => {
      window.print()
    }
    
    const shareBooking = () => {
      if (navigator.share) {
        navigator.share({
          title: `Booking #${booking.value.bookingNumber}`,
          text: `My mystery adventure to ${booking.value.revealed ? booking.value.destination : '???'}`,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        store.commit('SHOW_NOTIFICATION', {
          message: 'Link copied to clipboard!',
          type: 'success'
        })
      }
    }
    
    const cancelBooking = () => {
      if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        booking.value.status = 'cancelled'
        store.commit('SHOW_NOTIFICATION', {
          message: 'Booking cancelled successfully',
          type: 'success'
        })
      }
    }
    
    const contactSupport = () => {
      router.push({
        path: '/contact',
        query: { subject: `Booking #${booking.value.bookingNumber}` }
      })
    }
    
    const viewRecommendation = (rec) => {
      router.push(`/destination/${rec.id}`)
    }
    
    // Lifecycle
    onMounted(async () => {
      isLoading.value = true
      // Fetch booking data
      setTimeout(() => {
        isLoading.value = false
      }, 1000)
      
      updateCountdown()
      timer.value = setInterval(updateCountdown, 60000) // Update every minute
    })
    
    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })
    
    return {
      isLoading,
      booking,
      weather,
      recommendations,
      countdown,
      statusIcon,
      statusTitle,
      statusDescription,
      canCancel,
      progressPercentage,
      formatDate,
      formatDateTime,
      formatTime,
      goBack,
      downloadItinerary,
      printPage,
      shareBooking,
      cancelBooking,
      contactSupport,
      viewRecommendation
    }
  }
}
</script>

<style scoped>
.booking-details-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header */
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 50px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 107, 107, 0.1);
}

.back-icon {
  font-size: 1.2rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.booking-number {
  color: #666;
  font-family: monospace;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-icon-only {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn-icon-only:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
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

/* Status Banner */
.status-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  color: white;
}

.status-banner.confirmed {
  background: #28A745;
}

.status-banner.pending {
  background: #FFC107;
  color: #333;
}

.status-banner.completed {
  background: #6C757D;
}

.status-banner.cancelled {
  background: #DC3545;
}

.status-icon {
  font-size: 2.5rem;
}

.status-message {
  flex: 1;
}

.status-message h3 {
  font-size: 1.3rem;
  margin-bottom: 5px;
  color: inherit;
}

.status-message p {
  opacity: 0.9;
  font-size: 0.95rem;
}

.btn-cancel-small {
  padding: 8px 20px;
  background: rgba(255,255,255,0.2);
  border: 1px solid white;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-cancel-small:hover {
  background: white;
  color: #DC3545;
}

/* Main Content Grid */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
  margin-bottom: 30px;
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Destination Card */
.destination-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.destination-card.mystery {
  border: 2px solid #00D4FF;
}

.destination-image {
  height: 250px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.mystery-reveal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.mystery-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.mystery-text {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.reveal-date {
  font-size: 0.95rem;
  opacity: 0.8;
}

.destination-info {
  padding: 20px;
  text-align: center;
}

.destination-info h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 5px;
}

.destination-info p {
  color: #FF6B6B;
  font-weight: 500;
}

.region-text {
  color: #00D4FF !important;
}

/* Countdown Card */
.countdown-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.countdown-card h3 {
  color: #333;
  margin-bottom: 20px;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.countdown-item {
  text-align: center;
}

.countdown-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B6B;
  line-height: 1;
}

.countdown-label {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: #FF6B6B;
  transition: width 0.3s;
}

.progress-text {
  color: #666;
  font-size: 0.9rem;
}

/* Weather Card */
.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 15px;
  color: white;
}

.weather-card h3 {
  color: white;
  margin-bottom: 15px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.weather-icon {
  font-size: 3rem;
}

.weather-details {
  flex: 1;
}

.weather-temp {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.weather-desc {
  opacity: 0.9;
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.details-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.details-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.section-icon {
  font-size: 1.3rem;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row.total {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 2px dashed #e0e0e0;
}

.detail-label {
  color: #666;
  font-weight: 500;
}

.detail-value {
  color: #333;
  font-weight: 600;
}

.detail-value.price {
  color: #28A745;
  font-size: 1.2rem;
}

/* Info Section */
.info-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
}

.info-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.info-list {
  list-style: none;
  padding: 0;
}

.info-list li {
  padding: 8px 0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-list li::before {
  content: '•';
  color: #FF6B6B;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 30px 0;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-action.btn-primary {
  background: #4A6FA5;
  color: white;
}

.btn-action.btn-primary:hover {
  background: #3A5A84;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(74, 111, 165, 0.3);
}

.btn-action.btn-outline {
  background: white;
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
}

.btn-action.btn-outline:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

.btn-action.btn-danger {
  background: #DC3545;
  color: white;
}

.btn-action.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(220, 53, 69, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Recommendations */
.recommendations {
  margin-top: 40px;
}

.recommendations h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 20px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.rec-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.rec-card:hover {
  transform: translateY(-3px);
  border-color: #FF6B6B;
}

.rec-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.rec-info {
  flex: 1;
}

.rec-info h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 3px;
}

.rec-info p {
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 3px;
}

.rec-price {
  font-weight: 700;
  color: #28A745;
  font-size: 0.9rem;
}

.rec-btn {
  padding: 5px 15px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.8rem;
}

.rec-btn:hover {
  background: #FF5252;
  transform: scale(1.05);
}

/* Dark Mode */
:root.dark-mode .booking-number {
  color: #B0C4DE;
}

:root.dark-mode .btn-icon-only {
  background: #122B44;
  color: #F5F9FF;
}

:root.dark-mode .btn-icon-only:hover {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .destination-card,
:root.dark-mode .countdown-card,
:root.dark-mode .details-section {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .destination-info h2,
:root.dark-mode .countdown-card h3,
:root.dark-mode .details-section h3 {
  color: #F5F9FF;
}

:root.dark-mode .detail-label {
  color: #B0C4DE;
}

:root.dark-mode .detail-value {
  color: #F5F9FF;
}

:root.dark-mode .info-section {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .info-section h3 {
  color: #F5F9FF;
}

:root.dark-mode .info-list li {
  color: #B0C4DE;
}

:root.dark-mode .recommendations h3 {
  color: #F5F9FF;
}

:root.dark-mode .rec-card {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .rec-info h4 {
  color: #F5F9FF;
}

/* Print Styles */
@media print {
  .back-btn,
  .header-actions,
  .status-action,
  .action-buttons,
  .recommendations {
    display: none !important;
  }
  
  .booking-details-view {
    padding: 0;
  }
  
  .status-banner {
    break-inside: avoid;
  }
  
  .destination-card,
  .countdown-card,
  .details-section {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }
}

/* Responsive */
@media (max-width: 968px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .details-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .status-banner {
    flex-direction: column;
    text-align: center;
  }
  
  .countdown-timer {
    gap: 15px;
  }
  
  .countdown-value {
    font-size: 2rem;
  }
  
  .weather-info {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .booking-number {
    font-size: 0.9rem;
  }
  
  .destination-image {
    height: 180px;
  }
  
  .destination-info h2 {
    font-size: 1.5rem;
  }
  
  .countdown-value {
    font-size: 1.5rem;
  }
  
  .btn-action {
    padding: 12px;
    font-size: 0.9rem;
  }
}
</style>
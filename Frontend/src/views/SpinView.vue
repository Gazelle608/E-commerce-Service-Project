<template>
  <div class="spin-view">
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Searching the globe for your adventure...</p>
    </div>

    <div v-else-if="currentOffer" class="offer-container">
      <div class="offer-card">
        <div class="offer-header">
          <h2>🎲 We Found Something!</h2>
          <div class="countdown">
            <CountdownTimer :initial-minutes="7" @time-up="handleTimeout" />
            <p class="countdown-text">Time to decide</p>
          </div>
        </div>
        
        <div class="mystery-box">
          <div class="mystery-icon">❓</div>
          <p class="mystery-text">Destination hidden until purchase</p>
          <span class="mystery-badge">Global Mystery</span>
        </div>

        <div class="offer-details">
          <div class="detail-row">
            <span class="detail-label">Departure:</span>
            <span class="detail-value">{{ formatDate(currentOffer.departure) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Return:</span>
            <span class="detail-value">{{ formatDate(currentOffer.return) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Airline:</span>
            <span class="detail-value">{{ currentOffer.airline }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Accommodation:</span>
            <span class="detail-value">{{ currentOffer.hostel }}</span>
          </div>
          <div class="detail-row price">
            <span class="detail-label">Total Price:</span>
            <span class="price-value">R{{ currentOffer.price }}</span>
          </div>
        </div>

        <div class="offer-features">
          <div class="feature-tag">
            <span>✈️ Flight Included</span>
          </div>
          <div class="feature-tag">
            <span>🏨 Accommodation</span>
          </div>
          <div class="feature-tag">
            <span>🌍 Worldwide</span>
          </div>
        </div>

        <div class="offer-actions">
          <button @click="acceptOffer" class="btn btn-primary">
            <span class="btn-icon">✅</span>
            Accept Mystery
          </button>
          <button @click="declineOffer" class="btn btn-outline">
            <span class="btn-icon">🔄</span>
            Spin Again
          </button>
        </div>

        <p class="guarantee-text">
          <span class="guarantee-icon">🔒</span>
          Your destination will be revealed after purchase
        </p>
      </div>
    </div>

    <div v-else class="spin-container">
      <h1 class="page-title">Spin the <span>Globe</span></h1>
      <p class="page-subtitle">Where in the world will you go?</p>
      
      <div class="globe-container" @click="spin">
        <div class="globe" :class="{ spinning: isSpinning }">
          🌍
        </div>
        <p class="click-to-spin">Click the globe to spin</p>
      </div>

      <div class="stats-container">
        <div class="stat">
          <span class="stat-value">50+</span>
          <span class="stat-label">Destinations</span>
        </div>
        <div class="stat">
          <span class="stat-value">R799</span>
          <span class="stat-label">Starting Price</span>
        </div>
        <div class="stat">
          <span class="stat-value">24h</span>
          <span class="stat-label">Reveal Time</span>
        </div>
      </div>

      <div class="blacklist-section" v-if="userBlacklist.length">
        <h3>We'll avoid:</h3>
        <div class="blacklist-tags">
          <span v-for="place in userBlacklist" :key="place" class="tag">
            {{ place }} <span class="tag-remove" @click.stop="removeFromBlacklist(place)">✕</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CountdownTimer from '@/components/ui/CountdownTimer.vue'

export default {
  name: 'SpinView',
  components: {
    CountdownTimer
  },
  data() {
    return {
      isSpinning: false
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'currentOffer', 'userBlacklist'])
  },
  methods: {
    ...mapActions(['spinGlobe', 'acceptOffer', 'declineOffer', 'updateBlacklist']),
    
    async spin() {
      this.isSpinning = true
      setTimeout(() => {
        this.isSpinning = false
      }, 1000)
      
      try {
        await this.spinGlobe()
      } catch (error) {
        alert('Failed to spin. Please try again.')
      }
    },
    
    handleTimeout() {
      alert('Time expired! Spinning again...')
      this.declineOffer()
    },
    
    formatDate(dateString) {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleString('en-ZA', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    removeFromBlacklist(city) {
      const updated = this.userBlacklist.filter(c => c !== city)
      this.updateBlacklist(updated)
    }
  }
}
</script>

<style scoped>
.spin-view {
  min-height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* Spin Container */
.spin-container {
  text-align: center;
  max-width: 600px;
}

.page-title {
  font-size: 3.5rem;
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
  font-size: 1.3rem;
  color: #666666;
  margin-bottom: 40px;
}

/* Globe */
.globe-container {
  cursor: pointer;
  margin: 40px 0;
}

.globe {
  font-size: 200px;
  transition: transform 0.5s;
  margin-bottom: 20px;
  display: inline-block;
  filter: drop-shadow(0 20px 30px rgba(255, 107, 107, 0.3));
}

.globe.spinning {
  animation: spin 1s ease-in-out;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.click-to-spin {
  font-size: 1.2rem;
  color: #999999;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Stats */
.stats-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #FF6B6B;
  line-height: 1;
}

.stat-label {
  color: #999999;
  font-size: 0.9rem;
  text-transform: uppercase;
}

/* Blacklist */
.blacklist-section {
  margin-top: 40px;
  padding: 25px;
  background: #F9F9F9;
  border-radius: 15px;
}

.blacklist-section h3 {
  margin-bottom: 15px;
  color: #333333;
}

.blacklist-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  background: #FF6B6B;
  color: white;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tag-remove {
  cursor: pointer;
  width: 18px;
  height: 18px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.3s;
}

.tag-remove:hover {
  background: rgba(255,255,255,0.5);
}

/* Offer Container */
.offer-container {
  width: 100%;
  max-width: 600px;
}

.offer-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.offer-header {
  text-align: center;
  margin-bottom: 30px;
}

.offer-header h2 {
  font-size: 2rem;
  color: #333333;
  margin-bottom: 20px;
}

.countdown {
  background: #F9F9F9;
  padding: 15px;
  border-radius: 10px;
}

.countdown-text {
  color: #666666;
  margin-top: 5px;
  font-size: 0.9rem;
}

/* Mystery Box */
.mystery-box {
  background: linear-gradient(135deg, #9B6B9E 0%, #4A6FA5 100%);
  color: white;
  padding: 40px;
  text-align: center;
  border-radius: 15px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.mystery-box::before {
  content: '?';
  position: absolute;
  top: -50px;
  right: -50px;
  font-size: 150px;
  opacity: 0.1;
  transform: rotate(15deg);
}

.mystery-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  animation: float 3s ease-in-out infinite;
}

.mystery-text {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.mystery-badge {
  display: inline-block;
  padding: 5px 15px;
  background: rgba(255,255,255,0.2);
  border-radius: 50px;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
}

/* Offer Details */
.offer-details {
  margin-bottom: 30px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #F0F0F0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row.price {
  font-size: 1.2rem;
  font-weight: bold;
}

.detail-label {
  color: #666666;
}

.detail-value {
  font-weight: 500;
  color: #333333;
}

.price-value {
  color: #28A745;
  font-size: 1.4rem;
  font-weight: 700;
}

/* Offer Features */
.offer-features {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.feature-tag {
  padding: 8px 15px;
  background: #F0F0F0;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #333333;
}

/* Offer Actions */
.offer-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #28A745;
  color: white;
}

.btn-primary:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
}

.btn-outline {
  border: 2px solid #DC3545;
  color: #DC3545;
  background: transparent;
}

.btn-outline:hover {
  background: #DC3545;
  color: white;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Guarantee Text */
.guarantee-text {
  text-align: center;
  color: #999999;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.guarantee-icon {
  font-size: 1rem;
}

/* Loading Container */
.loading-container {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #E0E0E0;
  border-top-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .globe {
    font-size: 150px;
  }
  
  .stats-container {
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .offer-card {
    padding: 30px 20px;
  }
  
  .offer-features {
    flex-wrap: wrap;
  }
  
  .offer-actions {
    flex-direction: column;
  }
  
  .mystery-box {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .globe {
    font-size: 120px;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
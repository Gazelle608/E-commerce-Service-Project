<template>
  <div class="reveal-view">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Preparing your reveal...</p>
    </div>

    <div v-else-if="revealed" class="reveal-container">
      <div class="reveal-header">
        <div class="confetti">🎉 🎊 🎈</div>
        <h1 class="reveal-title">Your Destination is <span>Revealed</span>!</h1>
        <p class="reveal-subtitle">Get ready for an amazing adventure</p>
      </div>

      <div class="destination-card">
        <div class="destination-image" :style="{ backgroundImage: `url(${revealed.image})` }">
          <div class="destination-overlay">
            <h2>{{ revealed.city }}, {{ revealed.country }}</h2>
          </div>
        </div>

        <div class="destination-info">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-icon">✈️</span>
              <span class="info-label">Airline</span>
              <span class="info-value">{{ revealed.airline }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🏨</span>
              <span class="info-label">Accommodation</span>
              <span class="info-value">{{ revealed.hostel }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">📅</span>
              <span class="info-label">Departure</span>
              <span class="info-value">{{ formatDateTime(revealed.departure) }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">↩️</span>
              <span class="info-label">Return</span>
              <span class="info-value">{{ formatDateTime(revealed.return) }}</span>
            </div>
          </div>

          <div class="weather-section" v-if="weather">
            <h3>Weather in {{ revealed.city }}</h3>
            <div class="weather-info">
              <span class="weather-icon">{{ weather.icon }}</span>
              <span class="weather-temp">{{ weather.temp }}°C</span>
              <span class="weather-desc">{{ weather.description }}</span>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-primary" @click="downloadItinerary">
              <span class="btn-icon">📄</span>
              Download Itinerary
            </button>
            <button class="btn btn-outline" @click="shareReveal">
              <span class="btn-icon">📤</span>
              Share
            </button>
          </div>

          <div class="countdown-box">
            <h4>Time until departure</h4>
            <div class="countdown">
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
          </div>
        </div>
      </div>

      <div class="recommendations">
        <h3>Things to do in {{ revealed.city }}</h3>
        <div class="recommendations-grid">
          <div v-for="activity in recommendations" :key="activity.name" class="recommendation-card">
            <div class="rec-image" :style="{ backgroundImage: `url(${activity.image})` }"></div>
            <h4>{{ activity.name }}</h4>
            <p>{{ activity.description }}</p>
            <span class="rec-price">R{{ activity.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-revealed">
      <div class="mystery-box">
        <span class="mystery-icon">❓</span>
        <h2>Destination Not Yet Revealed</h2>
        <p>Your destination will be revealed 48 hours before departure.</p>
        <div class="countdown-placeholder">
          <div class="countdown-item">
            <span class="countdown-value">48</span>
            <span class="countdown-label">Hours</span>
          </div>
        </div>
        <router-link to="/profile" class="btn btn-primary">
          View My Bookings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RevealView',
  data() {
    return {
      loading: false,
      revealed: null,
      weather: null,
      countdown: {
        days: 2,
        hours: 6,
        minutes: 30
      },
      recommendations: [
        {
          name: 'City Tour',
          description: 'Explore the main attractions',
          price: 350,
          image: '/images/tour.jpg'
        },
        {
          name: 'Food Experience',
          description: 'Taste local cuisine',
          price: 250,
          image: '/images/food.jpg'
        },
        {
          name: 'Adventure Activity',
          description: 'Get your adrenaline pumping',
          price: 450,
          image: '/images/adventure.jpg'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.loadReveal()
  },
  methods: {
    loadReveal() {
      this.loading = true
      
      // Simulate API call
      setTimeout(() => {
        this.revealed = {
          city: 'Tokyo',
          country: 'Japan',
          image: '/images/tokyo.jpg',
          airline: 'Emirates',
          hostel: 'Khaosan Tokyo',
          departure: '2026-03-15T10:30:00',
          return: '2026-03-22T18:45:00'
        }
        
        this.weather = {
          icon: '☀️',
          temp: 22,
          description: 'Sunny'
        }
        
        this.loading = false
      }, 2000)
    },
    
    formatDateTime(dateString) {
      return new Date(dateString).toLocaleString('en-ZA', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    downloadItinerary() {
      alert('Downloading itinerary...')
    },
    
    shareReveal() {
      alert('Share functionality coming soon!')
    }
  }
}
</script>

<style scoped>
.reveal-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px 20px;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Reveal Header */
.reveal-header {
  text-align: center;
  margin-bottom: 40px;
}

.confetti {
  font-size: 3rem;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.reveal-title {
  font-size: 3rem;
  color: #333333;
  margin-bottom: 10px;
}

.reveal-title span {
  color: #FF6B6B;
  position: relative;
}

.reveal-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.reveal-subtitle {
  color: #666666;
  font-size: 1.2rem;
}

/* Destination Card */
.destination-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  margin-bottom: 40px;
}

.destination-image {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.destination-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
}

.destination-overlay h2 {
  color: white;
  font-size: 2.5rem;
  margin: 0;
}

.destination-info {
  padding: 40px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  text-align: center;
  padding: 20px;
  background: #F9F9F9;
  border-radius: 10px;
  transition: transform 0.3s;
}

.info-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.info-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 10px;
}

.info-label {
  display: block;
  font-size: 0.9rem;
  color: #999999;
  margin-bottom: 5px;
}

.info-value {
  display: block;
  font-size: 1.1rem;
  color: #333333;
  font-weight: 600;
}

/* Weather Section */
.weather-section {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #4A6FA5 0%, #7A9BC2 100%);
  border-radius: 10px;
  color: white;
  margin-bottom: 30px;
}

.weather-section h3 {
  color: white;
  margin-bottom: 20px;
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.weather-icon {
  font-size: 3rem;
}

.weather-temp {
  font-size: 2.5rem;
  font-weight: 700;
}

.weather-desc {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
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
  border: 2px solid #4A6FA5;
  color: #4A6FA5;
  background: transparent;
}

.btn-outline:hover {
  background: #4A6FA5;
  color: white;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Countdown */
.countdown-box {
  text-align: center;
  padding: 20px;
  background: #F9F9F9;
  border-radius: 10px;
}

.countdown-box h4 {
  color: #333333;
  margin-bottom: 20px;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 30px;
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
  color: #999999;
  font-size: 0.9rem;
  text-transform: uppercase;
}

/* Recommendations */
.recommendations h3 {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 30px;
  text-align: center;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 107, 107, 0.15);
}

.rec-image {
  height: 150px;
  background-size: cover;
  background-position: center;
}

.recommendation-card h4 {
  padding: 15px 15px 5px;
  color: #333333;
}

.recommendation-card p {
  padding: 0 15px;
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.rec-price {
  display: block;
  padding: 0 15px 15px;
  color: #28A745;
  font-weight: 600;
  font-size: 1.2rem;
}

/* Not Revealed */
.not-revealed {
  text-align: center;
  padding: 60px 20px;
}

.mystery-box {
  background: linear-gradient(135deg, #9B6B9E 0%, #4A6FA5 100%);
  color: white;
  padding: 60px 40px;
  border-radius: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.mystery-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  display: block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.mystery-box h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 15px;
}

.mystery-box p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 30px;
}

.countdown-placeholder {
  margin: 30px 0;
}

.countdown-placeholder .countdown-item {
  display: inline-block;
}

/* Responsive */
@media (max-width: 768px) {
  .reveal-title {
    font-size: 2.2rem;
  }
  
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .destination-image {
    height: 250px;
  }
  
  .destination-overlay h2 {
    font-size: 1.8rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .countdown {
    flex-wrap: wrap;
  }
  
  .weather-info {
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .mystery-box {
    padding: 40px 20px;
  }
  
  .mystery-box h2 {
    font-size: 1.5rem;
  }
}
</style>
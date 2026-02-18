<template>
  <div class="dashboard-view">
    <!-- Welcome Header -->
    <section class="welcome-section">
      <div class="container">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">
              Welcome back, <span>{{ userFirstName }}</span>!
            </h1>
            <p class="welcome-subtitle">
              Your next adventure is waiting. Here's what's happening with your travels.
            </p>
          </div>
          <div class="welcome-actions">
            <router-link to="/spin" class="btn btn-primary">
              <span class="btn-icon">🎲</span>
              Spin the Globe
            </router-link>
            <router-link to="/destinations" class="btn btn-outline">
              <span class="btn-icon">🌍</span>
              Explore Destinations
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Grid -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-info">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
            <div class="stat-trend" :class="stat.trend">
              {{ stat.trendValue }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <div class="container">
        <h2 class="section-title">Quick <span>Actions</span></h2>
        <div class="actions-grid">
          <div class="action-card" @click="quickAction('spin')">
            <div class="action-icon">🎲</div>
            <h3>Spin the Globe</h3>
            <p>Find your next mystery destination</p>
          </div>
          <div class="action-card" @click="quickAction('bookings')">
            <div class="action-icon">📅</div>
            <h3>View Bookings</h3>
            <p>Check your upcoming adventures</p>
          </div>
          <div class="action-card" @click="quickAction('wishlist')">
            <div class="action-icon">❤️</div>
            <h3>Wishlist</h3>
            <p>{{ wishlistCount }} saved destinations</p>
          </div>
          <div class="action-card" @click="quickAction('profile')">
            <div class="action-icon">👤</div>
            <h3>Update Profile</h3>
            <p>Manage your preferences</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Bookings -->
    <section class="upcoming-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Upcoming <span>Adventures</span></h2>
          <router-link to="/bookings" class="view-all-link">
            View All <span>→</span>
          </router-link>
        </div>

        <div v-if="upcomingBookings.length === 0" class="empty-state">
          <div class="empty-icon">🧳</div>
          <h3>No upcoming bookings</h3>
          <p>Ready to plan your next mystery adventure?</p>
          <router-link to="/spin" class="btn btn-primary">
            Spin the Globe
          </router-link>
        </div>

        <div v-else class="bookings-grid">
          <div v-for="booking in upcomingBookings" :key="booking.id" class="booking-card">
            <div class="booking-image" :style="{ backgroundImage: `url(${booking.image})` }">
              <div v-if="!booking.revealed" class="mystery-badge">
                <span>🔒 Mystery</span>
              </div>
              <div class="countdown-badge" v-else>
                <span>⏰ {{ booking.daysUntil }} days</span>
              </div>
            </div>
            <div class="booking-content">
              <h3 class="booking-title">
                {{ booking.revealed ? booking.destination : 'Mystery Destination' }}
              </h3>
              <p class="booking-dates">
                {{ formatDate(booking.departure) }} - {{ formatDate(booking.return) }}
              </p>
              <div class="booking-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: booking.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ booking.progress }}% to departure</span>
              </div>
              <div class="booking-actions">
                <button @click="viewBooking(booking.id)" class="btn-view">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="activity-section">
      <div class="container">
        <h2 class="section-title">Recent <span>Activity</span></h2>
        
        <div class="activity-timeline">
          <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              {{ activity.icon }}
            </div>
            <div class="activity-content">
              <p class="activity-text">
                <strong>{{ activity.text }}</strong>
              </p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
            <div v-if="activity.action" class="activity-action">
              <button @click="handleActivityAction(activity)" class="action-btn">
                {{ activity.action }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="recentActivity.length === 0" class="no-activity">
          <p>No recent activity to show</p>
        </div>
      </div>
    </section>

    <!-- Recommended for You -->
    <section class="recommended-section">
      <div class="container">
        <h2 class="section-title">Recommended <span>for You</span></h2>
        
        <div class="recommended-grid">
          <div v-for="rec in recommendations" :key="rec.id" class="recommended-card">
            <div class="rec-image" :style="{ backgroundImage: `url(${rec.image})` }">
              <button class="rec-wishlist" @click="toggleWishlist(rec)">
                <span class="wishlist-icon" :class="{ active: rec.inWishlist }">
                  {{ rec.inWishlist ? '❤️' : '🤍' }}
                </span>
              </button>
            </div>
            <div class="rec-content">
              <h4>{{ rec.name }}</h4>
              <p>{{ rec.country }}</p>
              <div class="rec-details">
                <span class="rec-price">R{{ rec.price.toLocaleString() }}</span>
                <span class="rec-days">{{ rec.days }} days</span>
              </div>
              <div class="rec-tags">
                <span v-for="tag in rec.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <button @click="quickBook(rec)" class="btn-book">
                Quick Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup (if not subscribed) -->
    <section v-if="!isSubscribed" class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h3>Never Miss a Deal</h3>
            <p>Get exclusive offers and early access to new destinations</p>
          </div>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <input 
              type="email" 
              v-model="newsletterEmail" 
              placeholder="Enter your email"
              required
            >
            <button type="submit" class="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'DashboardView',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    // User data
    const user = computed(() => store.state.auth?.user || {
      firstName: 'Adventurer',
      lastName: '',
      email: 'adventurer@sowhereto.com'
    })
    
    const userFirstName = computed(() => user.value.firstName || 'Adventurer')
    
    // Stats
    const stats = ref([
      { icon: '✈️', value: '3', label: 'Upcoming Trips', trend: 'up', trendValue: '+2' },
      { icon: '🌍', value: '12', label: 'Countries Visited', trend: 'up', trendValue: '+3' },
      { icon: '⭐', value: '4.8', label: 'Average Rating', trend: 'same', trendValue: '0' },
      { icon: '❤️', value: '8', label: 'Wishlist Items', trend: 'up', trendValue: '+1' }
    ])
    
    const wishlistCount = ref(8)
    const isSubscribed = ref(false)
    const newsletterEmail = ref('')
    
    // Upcoming Bookings
    const upcomingBookings = ref([
      {
        id: 1,
        destination: 'Tokyo',
        country: 'Japan',
        image: '/images/tokyo.jpg',
        departure: '2026-04-15T10:30:00',
        return: '2026-04-22T18:45:00',
        revealed: true,
        daysUntil: 45,
        progress: 65
      },
      {
        id: 2,
        image: '/images/mystery-asia.jpg',
        departure: '2026-05-20T14:15:00',
        return: '2026-05-27T09:30:00',
        revealed: false,
        daysUntil: 80,
        progress: 40
      },
      {
        id: 3,
        destination: 'Cape Town',
        country: 'South Africa',
        image: '/images/cape-town.jpg',
        departure: '2026-06-10T08:00:00',
        return: '2026-06-17T20:15:00',
        revealed: true,
        daysUntil: 106,
        progress: 25
      }
    ])
    
    // Recent Activity
    const recentActivity = ref([
      {
        icon: '🎲',
        type: 'spin',
        text: 'You spun the globe and found a mystery offer',
        time: '2 hours ago',
        action: 'View Offer'
      },
      {
        icon: '❤️',
        type: 'wishlist',
        text: 'Added "Paris" to your wishlist',
        time: 'yesterday',
        action: 'View'
      },
      {
        icon: '📅',
        type: 'booking',
        text: 'Booked mystery adventure to Asia',
        time: '3 days ago',
        action: 'View Booking'
      },
      {
        icon: '✈️',
        type: 'trip',
        text: 'Your trip to Tokyo is confirmed',
        time: '1 week ago',
        action: 'Details'
      }
    ])
    
    // Recommendations
    const recommendations = ref([
      {
        id: 101,
        name: 'Bali',
        country: 'Indonesia',
        image: '/images/bali.jpg',
        price: 999,
        days: 6,
        tags: ['Beach', 'Culture', 'Temples'],
        inWishlist: false
      },
      {
        id: 102,
        name: 'Barcelona',
        country: 'Spain',
        image: '/images/barcelona.jpg',
        price: 899,
        days: 5,
        tags: ['City', 'Beach', 'Food'],
        inWishlist: true
      },
      {
        id: 103,
        name: 'Bangkok',
        country: 'Thailand',
        image: '/images/bangkok.jpg',
        price: 799,
        days: 5,
        tags: ['Food', 'Culture', 'Nightlife'],
        inWishlist: false
      },
      {
        id: 104,
        name: 'Lisbon',
        country: 'Portugal',
        image: '/images/lisbon.jpg',
        price: 849,
        days: 5,
        tags: ['City', 'History', 'Food'],
        inWishlist: false
      }
    ])
    
    // Methods
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short'
      })
    }
    
    const quickAction = (action) => {
      const routes = {
        spin: '/spin',
        bookings: '/bookings',
        wishlist: '/wishlist',
        profile: '/profile'
      }
      router.push(routes[action])
    }
    
    const viewBooking = (id) => {
      router.push(`/booking/${id}`)
    }
    
    const handleActivityAction = (activity) => {
      console.log('Activity action:', activity)
      // Handle based on activity type
    }
    
    const toggleWishlist = (item) => {
      item.inWishlist = !item.inWishlist
      store.commit('SHOW_NOTIFICATION', {
        message: item.inWishlist ? 'Added to wishlist' : 'Removed from wishlist',
        type: 'success'
      })
    }
    
    const quickBook = (item) => {
      store.commit('SHOW_NOTIFICATION', {
        message: `Quick booking for ${item.name}`,
        type: 'info'
      })
      // Navigate to booking flow
    }
    
    const subscribeNewsletter = () => {
      isSubscribed.value = true
      store.commit('SHOW_NOTIFICATION', {
        message: 'Subscribed to newsletter!',
        type: 'success'
      })
      newsletterEmail.value = ''
    }
    
    onMounted(() => {
      // Fetch user data, bookings, etc.
    })
    
    return {
      userFirstName,
      stats,
      wishlistCount,
      upcomingBookings,
      recentActivity,
      recommendations,
      isSubscribed,
      newsletterEmail,
      formatDate,
      quickAction,
      viewBooking,
      handleActivityAction,
      toggleWishlist,
      quickBook,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  color: white;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.welcome-title span {
  color: #FF6B6B;
  position: relative;
}

.welcome-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.3);
  z-index: 1;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.welcome-actions {
  display: flex;
  gap: 15px;
}

/* Stats Section */
.stats-section {
  padding: 40px 0;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: #FF6B6B;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stat-trend {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.8rem;
  padding: 3px 8px;
  border-radius: 50px;
}

.stat-trend.up {
  background: #28A745;
  color: white;
}

.stat-trend.down {
  background: #DC3545;
  color: white;
}

.stat-trend.same {
  background: #FFC107;
  color: #333;
}

/* Section Title */
.section-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

.section-title span {
  color: #FF6B6B;
  position: relative;
}

.section-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 6px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

/* Quick Actions */
.quick-actions {
  padding: 40px 0;
  background: #f8f9fa;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.action-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.action-card:hover {
  transform: translateY(-5px);
  border-color: #FF6B6B;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.15);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.action-card h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.action-card p {
  color: #666;
  font-size: 0.9rem;
}

/* Upcoming Section */
.upcoming-section {
  padding: 40px 0;
  background: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.view-all-link {
  color: #FF6B6B;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.view-all-link:hover {
  color: #FF5252;
}

.view-all-link span {
  transition: transform 0.3s;
}

.view-all-link:hover span {
  transform: translateX(5px);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 30px;
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.booking-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s;
}

.booking-card:hover {
  transform: translateY(-5px);
  border-color: #FF6B6B;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.15);
}

.booking-image {
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.mystery-badge, .countdown-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
}

.mystery-badge {
  background: rgba(255, 107, 107, 0.9);
}

.countdown-badge {
  background: #28A745;
}

.booking-content {
  padding: 20px;
}

.booking-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 5px;
}

.booking-dates {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.booking-progress {
  margin-bottom: 15px;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background: #FF6B6B;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
}

.booking-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-view {
  padding: 8px 20px;
  background: #4A6FA5;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.btn-view:hover {
  background: #3A5A84;
  transform: translateY(-2px);
}

/* Activity Section */
.activity-section {
  padding: 40px 0;
  background: #f8f9fa;
}

.activity-timeline {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.2rem;
}

.activity-icon.spin {
  background: #FF6B6B;
  color: white;
}

.activity-icon.wishlist {
  background: #DC3545;
  color: white;
}

.activity-icon.booking {
  background: #28A745;
  color: white;
}

.activity-icon.trip {
  background: #4A6FA5;
  color: white;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #333;
  margin-bottom: 5px;
}

.activity-time {
  color: #999;
  font-size: 0.8rem;
}

.action-btn {
  padding: 5px 15px;
  background: none;
  border: 1px solid #FF6B6B;
  color: #FF6B6B;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.8rem;
}

.action-btn:hover {
  background: #FF6B6B;
  color: white;
}

.no-activity {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* Recommended Section */
.recommended-section {
  padding: 40px 0;
  background: white;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.recommended-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s;
}

.recommended-card:hover {
  transform: translateY(-5px);
  border-color: #FF6B6B;
}

.rec-image {
  height: 120px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.rec-wishlist {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.wishlist-icon.active {
  color: #DC3545;
}

.rec-content {
  padding: 15px;
}

.rec-content h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 3px;
}

.rec-content p {
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.rec-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.rec-price {
  font-weight: 700;
  color: #28A745;
}

.rec-days {
  color: #666;
  font-size: 0.8rem;
}

.rec-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.tag {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  color: #666;
}

.btn-book {
  width: 100%;
  padding: 8px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.btn-book:hover {
  background: #FF5252;
}

/* Newsletter Section */
.newsletter-section {
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.newsletter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.newsletter-text h3 {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.newsletter-text p {
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  gap: 10px;
  min-width: 400px;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
}

.newsletter-form input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
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
  border: 2px solid white;
  color: white;
  background: transparent;
}

.btn-outline:hover {
  background: white;
  color: #FF6B6B;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Dark Mode */
:root.dark-mode .stats-section,
:root.dark-mode .quick-actions,
:root.dark-mode .upcoming-section,
:root.dark-mode .recommended-section {
  background: #0B1E33;
}

:root.dark-mode .stat-card,
:root.dark-mode .action-card,
:root.dark-mode .booking-card,
:root.dark-mode .activity-timeline,
:root.dark-mode .recommended-card {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .stat-value,
:root.dark-mode .action-card h3,
:root.dark-mode .booking-title,
:root.dark-mode .activity-text,
:root.dark-mode .rec-content h4 {
  color: #F5F9FF;
}

:root.dark-mode .stat-label,
:root.dark-mode .action-card p,
:root.dark-mode .booking-dates,
:root.dark-mode .activity-time,
:root.dark-mode .rec-days,
:root.dark-mode .tag {
  color: #B0C4DE;
}

:root.dark-mode .tag {
  background: #1A334D;
}

:root.dark-mode .empty-state {
  background: #122B44;
}

:root.dark-mode .empty-state h3 {
  color: #F5F9FF;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid,
  .actions-grid,
  .bookings-grid,
  .recommended-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-actions {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid,
  .actions-grid,
  .bookings-grid,
  .recommended-grid {
    grid-template-columns: 1fr;
  }
  
  .newsletter-content {
    flex-direction: column;
    text-align: center;
  }
  
  .newsletter-form {
    width: 100%;
    min-width: auto;
    flex-direction: column;
  }
  
  .activity-item {
    flex-wrap: wrap;
  }
  
  .activity-action {
    width: 100%;
    margin-top: 10px;
  }
  
  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .action-card {
    padding: 20px;
  }
}
</style>
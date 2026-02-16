<template>
  <div class="profile-view">
    <div class="profile-header">
      <h1 class="page-title">My <span>Profile</span></h1>
      <p class="page-subtitle">Manage your account and preferences</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading profile...</p>
    </div>

    <div v-else class="profile-container">
      <!-- Profile Tabs -->
      <div class="profile-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'bookings' }"
          @click="activeTab = 'bookings'"
        >
          <span class="tab-icon">📅</span>
          My Bookings
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'details' }"
          @click="activeTab = 'details'"
        >
          <span class="tab-icon">👤</span>
          Personal Details
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'blacklist' }"
          @click="activeTab = 'blacklist'"
        >
          <span class="tab-icon">🚫</span>
          Blacklist
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'preferences' }"
          @click="activeTab = 'preferences'"
        >
          <span class="tab-icon">⚙️</span>
          Preferences
        </button>
      </div>

      <!-- Tab Content: Bookings -->
      <div v-if="activeTab === 'bookings'" class="tab-content">
        <h2 class="tab-title">My Mystery Adventures</h2>
        
        <div v-if="bookings.length === 0" class="empty-state">
          <div class="empty-icon">🧳</div>
          <h3>No bookings yet</h3>
          <p>Time to spin the globe and start your first adventure!</p>
          <router-link to="/spin" class="btn btn-primary">Spin Now</router-link>
        </div>

        <div v-else class="bookings-list">
          <div v-for="booking in bookings" :key="booking.id" class="booking-card">
            <div class="booking-header">
              <div class="booking-status" :class="booking.status.toLowerCase()">
                {{ booking.status }}
              </div>
              <div class="booking-date">
                Booked: {{ formatDate(booking.bookedDate) }}
              </div>
            </div>

            <div class="booking-body">
              <div class="booking-destination">
                <div v-if="booking.revealed" class="destination-revealed">
                  <h3>{{ booking.destination }}, {{ booking.country }}</h3>
                  <img :src="booking.image" :alt="booking.destination" class="destination-image">
                </div>
                <div v-else class="destination-mystery">
                  <div class="mystery-box">
                    <span class="mystery-icon">❓</span>
                    <h3>Destination Hidden</h3>
                    <p>Reveals {{ daysUntilReveal(booking) }}</p>
                  </div>
                </div>
              </div>

              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Order #:</span>
                  <span class="detail-value">SWT-{{ booking.orderNumber }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Departure:</span>
                  <span class="detail-value">{{ formatDateTime(booking.departure) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Return:</span>
                  <span class="detail-value">{{ formatDateTime(booking.return) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Airline:</span>
                  <span class="detail-value">{{ booking.airline }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Accommodation:</span>
                  <span class="detail-value">{{ booking.hostel }}</span>
                </div>
                <div class="detail-row total">
                  <span class="detail-label">Total Paid:</span>
                  <span class="detail-value price">R{{ booking.total }}</span>
                </div>
              </div>
            </div>

            <div class="booking-footer">
              <button class="btn btn-outline-small" @click="viewBookingDetails(booking.id)">
                View Details
              </button>
              <button v-if="!booking.revealed" class="btn btn-primary-small" @click="revealEarly(booking.id)">
                Reveal Early (R50)
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Personal Details -->
      <div v-if="activeTab === 'details'" class="tab-content">
        <h2 class="tab-title">Personal Details</h2>
        
        <form @submit.prevent="updatePersonalDetails" class="profile-form">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" v-model="userDetails.firstName" required>
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input type="text" v-model="userDetails.lastName" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="userDetails.email" required disabled>
            <p class="form-hint">Email cannot be changed</p>
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="userDetails.phone" placeholder="+27 12 345 6789">
          </div>

          <div class="form-group">
            <label>Home City</label>
            <select v-model="userDetails.city" required>
              <option value="Johannesburg">Johannesburg</option>
              <option value="Cape Town">Cape Town</option>
              <option value="Durban">Durban</option>
              <option value="Pretoria">Pretoria</option>
              <option value="Port Elizabeth">Port Elizabeth</option>
            </select>
          </div>

          <div class="form-group">
            <label>Date of Birth</label>
            <input type="date" v-model="userDetails.dob">
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <button type="button" class="btn btn-outline" @click="cancelEdit">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Tab Content: Blacklist -->
      <div v-if="activeTab === 'blacklist'" class="tab-content">
        <h2 class="tab-title">Blacklist Preferences</h2>
        <p class="tab-description">
          Select destinations you want to avoid. We'll never send you here.
        </p>

        <div class="blacklist-container">
          <div class="current-blacklist" v-if="userBlacklist.length > 0">
            <h3>Currently Avoiding</h3>
            <div class="blacklist-tags">
              <div v-for="city in userBlacklist" :key="city" class="blacklist-tag">
                <span>{{ city }}</span>
                <button @click="removeFromBlacklist(city)" class="remove-tag">✕</button>
              </div>
            </div>
          </div>

          <div class="add-to-blacklist">
            <h3>Add to Blacklist</h3>
            <div class="destination-grid">
              <div 
                v-for="dest in availableDestinations" 
                :key="dest.city"
                class="destination-option"
                :class="{ disabled: isBlacklisted(dest.city) }"
                @click="addToBlacklist(dest.city)"
              >
                <img :src="dest.image" :alt="dest.city">
                <span>{{ dest.city }}, {{ dest.country }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Preferences -->
      <div v-if="activeTab === 'preferences'" class="tab-content">
        <h2 class="tab-title">Preferences</h2>

        <div class="preferences-form">
          <div class="preference-group">
            <h3>Notifications</h3>
            
            <label class="toggle-label">
              <input type="checkbox" v-model="preferences.emailOffers">
              <span class="toggle-text">Email me mystery deals and offers</span>
            </label>

            <label class="toggle-label">
              <input type="checkbox" v-model="preferences.emailBooking">
              <span class="toggle-text">Email me booking confirmations</span>
            </label>

            <label class="toggle-label">
              <input type="checkbox" v-model="preferences.smsAlerts">
              <span class="toggle-text">SMS alerts for flight changes</span>
            </label>
          </div>

          <div class="preference-group">
            <h3>Travel Preferences</h3>
            
            <div class="form-group">
              <label>Preferred Airline</label>
              <select v-model="preferences.airline">
                <option value="">No preference</option>
                <option value="FlySafair">FlySafair</option>
                <option value="Lift">Lift</option>
                <option value="Kulula">Kulula</option>
                <option value="SAA">SAA</option>
              </select>
            </div>

            <div class="form-group">
              <label>Accommodation Type</label>
              <select v-model="preferences.accommodation">
                <option value="">No preference</option>
                <option value="hostel">Hostel (Shared)</option>
                <option value="budget">Budget Hotel</option>
                <option value="private">Private Room</option>
              </select>
            </div>

            <div class="form-group">
              <label>Max Budget</label>
              <input type="range" v-model="preferences.maxBudget" min="799" max="3000" step="100">
              <span class="range-value">R{{ preferences.maxBudget }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" @click="savePreferences">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProfileView',
  data() {
    return {
      loading: false,
      activeTab: 'bookings',
      userDetails: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+27 12 345 6789',
        city: 'Johannesburg',
        dob: '1990-01-01'
      },
      bookings: [
        {
          id: 1,
          orderNumber: '123456',
          status: 'Confirmed',
          bookedDate: '2026-02-01',
          destination: 'Tokyo',
          country: 'Japan',
          revealed: true,
          image: '/images/tokyo.jpg',
          departure: '2026-03-15T10:30:00',
          return: '2026-03-22T18:45:00',
          airline: 'Emirates',
          hostel: 'Khaosan Tokyo',
          total: '1299'
        },
        {
          id: 2,
          orderNumber: '789012',
          status: 'Pending',
          bookedDate: '2026-02-10',
          revealed: false,
          departure: '2026-03-20T14:15:00',
          return: '2026-03-27T09:30:00',
          airline: 'FlySafair',
          hostel: 'Mystery Hostel',
          total: '899'
        }
      ],
      userBlacklist: ['Durban', 'Port Elizabeth'],
      availableDestinations: [
        { city: 'Cape Town', country: 'South Africa', image: '/images/cpt.jpg' },
        { city: 'Durban', country: 'South Africa', image: '/images/durban.jpg' },
        { city: 'Johannesburg', country: 'South Africa', image: '/images/jhb.jpg' },
        { city: 'Pretoria', country: 'South Africa', image: '/images/pta.jpg' }
      ],
      preferences: {
        emailOffers: true,
        emailBooking: true,
        smsAlerts: false,
        airline: '',
        accommodation: '',
        maxBudget: 1500
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['updateBlacklist']),
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    },
    
    formatDateTime(dateString) {
      return new Date(dateString).toLocaleString('en-ZA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    daysUntilReveal(booking) {
      // Mock function - replace with actual logic
      return 'in 3 days'
    },
    
    viewBookingDetails(id) {
      console.log('View booking:', id)
      // Navigate to booking details page
    },
    
    revealEarly(id) {
      console.log('Reveal early:', id)
      alert('Early reveal feature coming soon!')
    },
    
    updatePersonalDetails() {
      console.log('Updating details:', this.userDetails)
      alert('Profile updated successfully!')
    },
    
    cancelEdit() {
      // Reset form to original values
      this.activeTab = 'bookings'
    },
    
    isBlacklisted(city) {
      return this.userBlacklist.includes(city)
    },
    
    addToBlacklist(city) {
      if (!this.isBlacklisted(city)) {
        this.userBlacklist.push(city)
        // Update in store
        this.updateBlacklist(this.userBlacklist)
      }
    },
    
    removeFromBlacklist(city) {
      const index = this.userBlacklist.indexOf(city)
      if (index > -1) {
        this.userBlacklist.splice(index, 1)
        // Update in store
        this.updateBlacklist(this.userBlacklist)
      }
    },
    
    savePreferences() {
      console.log('Saving preferences:', this.preferences)
      alert('Preferences saved!')
    }
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.8rem;
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
  font-size: 1.2rem;
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

/* Profile Tabs */
.profile-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  background: white;
  padding: 10px;
  border-radius: 50px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 40px;
  background: transparent;
  color: #666666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #FF6B6B;
  color: white;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.tab-title {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #F0F0F0;
}

.tab-description {
  color: #666666;
  margin-bottom: 30px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #999999;
  margin-bottom: 30px;
}

/* Bookings */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  border: 1px solid #E0E0E0;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s;
}

.booking-card:hover {
  border-color: #FF6B6B;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.1);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #F9F9F9;
  border-bottom: 1px solid #E0E0E0;
}

.booking-status {
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
}

.booking-status.confirmed {
  background: #28A745;
  color: white;
}

.booking-status.pending {
  background: #FFC107;
  color: #333333;
}

.booking-status.cancelled {
  background: #DC3545;
  color: white;
}

.booking-date {
  color: #999999;
  font-size: 0.9rem;
}

.booking-body {
  display: flex;
  padding: 20px;
  gap: 30px;
}

.booking-destination {
  width: 200px;
}

.destination-revealed h3 {
  font-size: 1.2rem;
  color: #333333;
  margin-bottom: 10px;
}

.destination-image {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
}

.destination-mystery {
  text-align: center;
}

.mystery-box {
  background: linear-gradient(135deg, #9B6B9E 0%, #4A6FA5 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
}

.mystery-icon {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
}

.mystery-box h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.mystery-box p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.booking-details {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-row {
  display: flex;
  flex-direction: column;
}

.detail-row.total {
  grid-column: span 2;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #E0E0E0;
}

.detail-label {
  font-size: 0.8rem;
  color: #999999;
  margin-bottom: 3px;
}

.detail-value {
  font-size: 1rem;
  color: #333333;
  font-weight: 500;
}

.detail-value.price {
  color: #28A745;
  font-size: 1.2rem;
  font-weight: 700;
}

.booking-footer {
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  background: #F9F9F9;
  border-top: 1px solid #E0E0E0;
}

/* Profile Form */
.profile-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666666;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.form-group input:disabled {
  background: #F9F9F9;
  color: #999999;
  cursor: not-allowed;
}

.form-hint {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #999999;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

/* Blacklist */
.blacklist-container {
  display: grid;
  gap: 40px;
}

.current-blacklist h3,
.add-to-blacklist h3 {
  font-size: 1.2rem;
  color: #333333;
  margin-bottom: 20px;
}

.blacklist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.blacklist-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: #FF6B6B;
  color: white;
  border-radius: 50px;
  font-size: 0.95rem;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 2px;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.remove-tag:hover {
  opacity: 1;
}

.destination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.destination-option {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.destination-option:hover:not(.disabled) {
  transform: translateY(-2px);
  border-color: #FF6B6B;
}

.destination-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.destination-option img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.destination-option span {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: rgba(0,0,0,0.7);
  color: white;
  font-size: 0.8rem;
  text-align: center;
}

/* Preferences */
.preferences-form {
  max-width: 500px;
}

.preference-group {
  margin-bottom: 40px;
}

.preference-group h3 {
  font-size: 1.2rem;
  color: #333333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F0F0F0;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  cursor: pointer;
}

.toggle-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.toggle-text {
  color: #666666;
  font-size: 1rem;
}

.range-value {
  display: block;
  text-align: right;
  color: #FF6B6B;
  font-weight: 600;
  margin-top: 5px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
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

.btn-primary-small,
.btn-outline-small {
  padding: 8px 15px;
  font-size: 0.9rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary-small {
  background: #FF6B6B;
  color: white;
}

.btn-primary-small:hover {
  background: #FF5252;
}

.btn-outline-small {
  border: 1px solid #4A6FA5;
  color: #4A6FA5;
  background: transparent;
}

.btn-outline-small:hover {
  background: #4A6FA5;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .profile-tabs {
    flex-direction: column;
    border-radius: 20px;
  }
  
  .tab-content {
    padding: 30px 20px;
  }
  
  .booking-body {
    flex-direction: column;
  }
  
  .booking-destination {
    width: 100%;
  }
  
  .booking-details {
    grid-template-columns: 1fr;
  }
  
  .detail-row.total {
    grid-column: span 1;
  }
  
  .booking-footer {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .destination-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .destination-grid {
    grid-template-columns: 1fr;
  }
}
</style>
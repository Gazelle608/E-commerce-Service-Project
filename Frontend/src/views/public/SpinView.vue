<template>
  <div class="spin-view">
    <div class="spin-header">
      <h1 class="page-title">Spin the <span>Globe</span></h1>
      <p class="page-subtitle">
        {{ isAuthenticated ? 'Click any marker to book your mystery' : 'Sign in to book destinations' }}
      </p>
    </div>

    <!-- Interactive Globe -->
    <RealisticGlobe 
      :interactive="true"
      @locationSelected="handleLocationSelected"
      @spin="handleSpin"
    />

    <!-- Info Section -->
    <div class="spin-info">
      <div class="info-card">
        <div class="info-icon">🌍</div>
        <h3>50+ Destinations</h3>
        <p>Worldwide locations waiting to be discovered</p>
      </div>
      <div class="info-card">
        <div class="info-icon">💰</div>
        <h3>From R799</h3>
        <p>All-inclusive mystery bundles</p>
      </div>
      <div class="info-card">
        <div class="info-icon">🎁</div>
        <h3>Reveal Later</h3>
        <p>Destination revealed after purchase</p>
      </div>
    </div>

    <!-- CTA for non-authenticated users -->
    <div v-if="!isAuthenticated" class="spin-cta">
      <p>Ready to book your mystery adventure?</p>
      <div class="cta-buttons">
        <router-link to="/register" class="btn btn-primary">
          Create Account
        </router-link>
        <router-link to="/login" class="btn btn-outline">
          Sign In
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import RealisticGlobe from '@/components/protected/RealisticGlobe.vue'

export default {
  name: 'SpinView',
  components: {
    RealisticGlobe
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    
    const handleLocationSelected = (location) => {
      if (isAuthenticated.value) {
        // Show booking modal or add to cart
        console.log('Authenticated user selected:', location)
        // router.push(`/destination/${location.id}`)
      } else {
        // Show sign in prompt
        store.commit('SHOW_NOTIFICATION', {
          message: 'Please sign in to book destinations',
          type: 'info'
        })
      }
    }
    
    const handleSpin = () => {
      console.log('Globe spun')
    }
    
    return {
      isAuthenticated,
      handleLocationSelected,
      handleSpin
    }
  }
}
</script>

<style scoped>
.spin-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.spin-header {
  text-align: center;
  margin-bottom: 40px;
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
  font-size: 1.2rem;
  color: #666666;
}

/* Info Cards */
.spin-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 60px 0 40px;
}

.info-card {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.info-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.info-card p {
  color: #666;
  line-height: 1.5;
}

/* CTA Section */
.spin-cta {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 20px;
  margin-top: 40px;
}

.spin-cta p {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 20px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
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
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
  background: transparent;
}

.btn-outline:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

/* Dark mode */
:root.dark-mode .page-title {
  color: #F5F9FF;
}

:root.dark-mode .page-subtitle {
  color: #B0C4DE;
}

:root.dark-mode .info-card {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .info-card h3 {
  color: #F5F9FF;
}

:root.dark-mode .info-card p {
  color: #B0C4DE;
}

:root.dark-mode .spin-cta {
  background: linear-gradient(135deg, #0B1E33 0%, #1A334D 100%);
}

:root.dark-mode .spin-cta p {
  color: #F5F9FF;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .spin-info {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
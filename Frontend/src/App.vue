<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <!-- Loading Overlay -->
    <div v-if="isAppLoading" class="app-loading">
      <div class="loading-spinner"></div>
      <p>Loading So Where To?...</p>
    </div>

    <!-- Main App -->
    <div v-else class="app-container">
      <!-- Header -->
      <AppHeader />

      <!-- Main Content with Transitions -->
      <main class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition 
            :name="route.meta.transition || 'fade'" 
            mode="out-in"
            @before-enter="beforeEnter"
            @after-enter="afterEnter"
          >
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <AppFooter />

      <!-- Back to Top Button -->
      <button 
        v-show="showBackToTop" 
        class="back-to-top"
        @click="scrollToTop"
        aria-label="Back to top"
      >
        ↑
      </button>

      <!-- Global Notification -->
      <div v-if="notification.show" class="notification" :class="notification.type">
        <span class="notification-icon">{{ notificationIcon }}</span>
        <span class="notification-message">{{ notification.message }}</span>
        <button class="notification-close" @click="closeNotification">✕</button>
      </div>

      <!-- Cookie Consent Banner -->
      <div v-if="showCookieConsent" class="cookie-consent">
        <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
        <div class="cookie-actions">
          <button @click="acceptCookies" class="btn btn-primary btn-small">Accept</button>
          <button @click="declineCookies" class="btn btn-outline btn-small">Decline</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    
    // State
    const isAppLoading = ref(true)
    const showBackToTop = ref(false)
    const showCookieConsent = ref(!localStorage.getItem('cookiesAccepted'))
    const cachedViews = ref(['HomeView', 'SpinView']) // Views to keep alive
    
    // Computed
    const isDarkMode = computed(() => store.state.isDarkMode || false)
    
    const notification = computed(() => store.state.notification || {
      show: false,
      message: '',
      type: 'info'
    })
    
    const notificationIcon = computed(() => {
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      }
      return icons[notification.value.type] || 'ℹ️'
    })

    // Methods
    const beforeEnter = (el) => {
      // Optional: Add pre-enter animations
    }

    const afterEnter = (el) => {
      // Scroll to top on route change
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 300
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const closeNotification = () => {
      store.commit('HIDE_NOTIFICATION')
    }

    const acceptCookies = () => {
      localStorage.setItem('cookiesAccepted', 'true')
      showCookieConsent.value = false
    }

    const declineCookies = () => {
      localStorage.setItem('cookiesAccepted', 'false')
      showCookieConsent.value = false
    }

    const checkAuth = async () => {
      // Check if user is authenticated on app load
      const token = localStorage.getItem('token')
      if (token && !store.getters.isAuthenticated) {
        try {
          await store.dispatch('validateToken')
        } catch (error) {
          console.error('Auth validation failed:', error)
        }
      }
    }

    const loadInitialData = async () => {
      try {
        // Load initial data
        await Promise.all([
          store.dispatch('fetchDestinations'),
          store.dispatch('fetchFeaturedBundles')
        ])
      } catch (error) {
        console.error('Failed to load initial data:', error)
      } finally {
        // Hide loading after minimum 1 second for smooth UX
        setTimeout(() => {
          isAppLoading.value = false
        }, 1000)
      }
    }

    // Lifecycle
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      checkAuth()
      loadInitialData()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    // Watch for route changes
    watch(
      () => route.path,
      () => {
        // Close mobile menu if open
        store.commit('CLOSE_MOBILE_MENU')
      }
    )

    return {
      isAppLoading,
      showBackToTop,
      showCookieConsent,
      cachedViews,
      isDarkMode,
      notification,
      notificationIcon,
      beforeEnter,
      afterEnter,
      scrollToTop,
      closeNotification,
      acceptCookies,
      declineCookies
    }
  }
}
</script>

<style>
/* Global CSS Variables */
:root {
  --primary: #FF6B6B;
  --primary-dark: #FF5252;
  --primary-light: #FFB5B5;
  --secondary: #4A6FA5;
  --secondary-dark: #3A5A84;
  --secondary-light: #7A9BC2;
  --accent: #9B6B9E;
  --accent-dark: #7B4F7E;
  --accent-light: #C4A0C5;
  --success: #28A745;
  --warning: #FFC107;
  --error: #DC3545;
  --info: #17A2B8;
  --white: #F9F9F9;
  --white-pure: #FFFFFF;
  --gray-light: #E0E0E0;
  --gray: #999999;
  --gray-dark: #666666;
  --text: #333333;
  --text-dark: #222222;
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 5px 15px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.15);
  --radius-sm: 5px;
  --radius-md: 10px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  
  /* Dark mode variables */
  --dark-bg: #1a1a1a;
  --dark-surface: #2d2d2d;
  --dark-text: #ffffff;
  --dark-text-secondary: #b0b0b0;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--white);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Dark Mode */
#app.dark-mode {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}

#app.dark-mode .main-content {
  background-color: var(--dark-bg);
}

/* App Container */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Content */
.main-content {
  flex: 1;
  position: relative;
  background-color: var(--white);
  transition: background-color 0.3s ease;
}

/* Loading Screen */
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.app-loading p {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s;
  z-index: 99;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.back-to-top:hover {
  background: var(--primary-dark);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: var(--radius-md);
  background: white;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;
  border-left: 4px solid;
}

.notification.success {
  border-left-color: var(--success);
}

.notification.error {
  border-left-color: var(--error);
}

.notification.warning {
  border-left-color: var(--warning);
}

.notification.info {
  border-left-color: var(--info);
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-message {
  flex: 1;
  color: var(--text);
  font-size: 0.95rem;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--gray);
  padding: 0 5px;
  transition: color 0.3s;
}

.notification-close:hover {
  color: var(--error);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Cookie Consent */
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--text-dark);
  color: white;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  z-index: 98;
  animation: slideUp 0.5s ease-out;
  flex-wrap: wrap;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.cookie-consent p {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.cookie-actions {
  display: flex;
  gap: 10px;
}

.cookie-actions .btn {
  padding: 8px 20px;
  font-size: 0.9rem;
}

.btn-small {
  padding: 6px 15px;
  font-size: 0.85rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .notification {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .cookie-consent {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
  
  .cookie-actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .loading-spinner {
    width: 40px;
    height: 40px;
  }
  
  .app-loading p {
    font-size: 1rem;
  }
}

/* Utility Classes */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }
.mt-5 { margin-top: 3rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }
.mb-5 { margin-bottom: 3rem; }

/* Focus Styles for Accessibility */
:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}

/* Selection Style */
::selection {
  background: var(--primary);
  color: white;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--gray-light);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}
</style>
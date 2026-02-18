<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode, 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Loading Overlay (for initial app load) -->
    <template v-if="isAppLoading">
      <div class="app-loading">
        <LoadingSpinner 
          :fullscreen="true" 
          message="So Where To?" 
          submessage="Preparing your adventure..."
        />
      </div>
    </template>

    <!-- Main App Content -->
    <template v-else>
      <div class="app-container">
        <!-- Header -->
        <AppHeader />

        <!-- Main Content with Transitions -->
        <main class="main-content">
          <router-view v-slot="{ Component, route }">
            <transition 
              :name="route.meta.transition || 'fade'" 
              mode="out-in"
              @before-enter="beforeRouteEnter"
              @after-enter="afterRouteEnter"
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
        <transition name="fade">
          <button 
            v-show="showBackToTop" 
            class="back-to-top"
            @click="scrollToTop"
            aria-label="Back to top"
          >
            ↑
          </button>
        </transition>

        <!-- Global Notification -->
        <transition name="slide">
          <div v-if="notification.show" class="notification" :class="notification.type">
            <span class="notification-icon">{{ notificationIcon }}</span>
            <span class="notification-message">{{ notification.message }}</span>
            <button class="notification-close" @click="closeNotification">✕</button>
          </div>
        </transition>

        <!-- Auth Modal -->
        <AuthModal 
          :show="showAuthModal"
          :initial-tab="authModalTab"
          :return-url="authReturnUrl"
          @close="closeAuthModal"
          @success="handleAuthSuccess"
          @guest="handleGuest"
        />

        <!-- Cookie Consent Banner -->
        <transition name="slide-up">
          <div v-if="showCookieConsent" class="cookie-consent">
            <div class="cookie-content">
              <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
              <div class="cookie-actions">
                <button @click="acceptCookies" class="btn btn-primary btn-small">Accept</button>
                <button @click="declineCookies" class="btn btn-outline btn-small">Decline</button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Network Status Indicator -->
        <transition name="fade">
          <div v-if="!isOnline" class="offline-indicator">
            <span class="offline-icon">📡</span>
            <span>You are offline. Some features may be unavailable.</span>
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

// UPDATED PATHS - match your folder structure
import AppHeader from '@/components/common/layout/AppHeader.vue'
import AppFooter from '@/components/common/layout/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import AuthModal from '@/components/auth/AuthModal.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    LoadingSpinner,
    AuthModal
  },
  setup() {
    // ... rest of your setup code (keep as is)
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // State
    const isAppLoading = ref(true)
    const showBackToTop = ref(false)
    const isOnline = ref(navigator.onLine)
    const cachedViews = ref(['HomeView', 'DestinationsView'])
    const isMobileMenuOpen = ref(false)
    
    // Auth Modal state
    const showAuthModal = ref(false)
    const authModalTab = ref('login')
    const authReturnUrl = ref(null)

    // Computed
    const isDarkMode = computed(() => store.state.isDarkMode)
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

    const showCookieConsent = computed(() => {
      return !localStorage.getItem('cookiesAccepted')
    })

    // Methods
    const beforeRouteEnter = (el) => {
      // Optional: Add pre-enter animations
    }

    const afterRouteEnter = (el) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      store.commit('CLOSE_MOBILE_MENU')
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

    const openAuthModal = (tab = 'login', returnUrl = null) => {
      authModalTab.value = tab
      authReturnUrl.value = returnUrl
      showAuthModal.value = true
    }

    const closeAuthModal = () => {
      showAuthModal.value = false
      authReturnUrl.value = null
    }

    const handleAuthSuccess = (user) => {
      console.log('Auth successful:', user)
    }

    const handleGuest = () => {
      console.log('Continuing as guest')
    }

    const acceptCookies = () => {
      localStorage.setItem('cookiesAccepted', 'true')
      store.commit('SHOW_NOTIFICATION', {
        message: 'Thank you for accepting cookies!',
        type: 'success'
      })
    }

    const declineCookies = () => {
      localStorage.setItem('cookiesAccepted', 'false')
    }

    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
      store.commit('SHOW_NOTIFICATION', {
        message: isOnline.value ? 'You are back online!' : 'You are offline',
        type: isOnline.value ? 'success' : 'warning'
      })
    }

    const initializeApp = async () => {
      try {
        await store.dispatch('init')
        
        if (store.state.isDarkMode) {
          document.documentElement.classList.add('dark-mode')
        }

        const { query } = route
        if (query.redirect) {
          openAuthModal('login', query.redirect)
        }

        if (query.session === 'expired') {
          store.commit('SHOW_NOTIFICATION', {
            message: 'Your session has expired. Please log in again.',
            type: 'warning'
          })
          openAuthModal('login')
        }

      } catch (error) {
        console.error('Failed to initialize app:', error)
        store.commit('SHOW_NOTIFICATION', {
          message: 'Failed to initialize app. Please refresh the page.',
          type: 'error'
        })
      } finally {
        setTimeout(() => {
          isAppLoading.value = false
        }, 1000)
      }
    }

    watch(() => store.getters['auth/isAuthenticated'], (isAuthenticated) => {
      if (isAuthenticated && showAuthModal.value) {
        closeAuthModal()
      }
    })

    watch(() => route.query, (query) => {
      if (query.redirect) {
        openAuthModal('login', query.redirect)
      }
    })

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
      initializeApp()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    })

    return {
      isAppLoading,
      showBackToTop,
      showCookieConsent,
      isOnline,
      cachedViews,
      isDarkMode,
      isMobileMenuOpen,
      notification,
      notificationIcon,
      showAuthModal,
      authModalTab,
      authReturnUrl,
      beforeRouteEnter,
      afterRouteEnter,
      scrollToTop,
      closeNotification,
      openAuthModal,
      closeAuthModal,
      handleAuthSuccess,
      handleGuest,
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
  --dark-bg: #0B1E33;
  --dark-surface: #122B44;
  --dark-surface-light: #1A334D;
  --dark-text: #F5F9FF;
  --dark-text-secondary: #B0C4DE;
  --dark-accent: #00D4FF;
  --dark-border: #1A334D;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--white);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dark Mode */
.dark-mode {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}

.dark-mode .main-content {
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

.dark-mode .main-content {
  background-color: var(--dark-bg);
}

/* Loading Screen */
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  z-index: 9999;
}

.dark-mode .app-loading {
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-surface) 100%);
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
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

.dark-mode .back-to-top {
  background: var(--dark-accent);
  color: var(--dark-bg);
}

.dark-mode .back-to-top:hover {
  background: #80EAFF;
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

.dark-mode .notification {
  background: var(--dark-surface);
  border-color: var(--dark-border);
}

.dark-mode .notification-message {
  color: var(--dark-text);
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
  z-index: 98;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.cookie-content p {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.cookie-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.cookie-actions .btn {
  padding: 8px 20px;
  font-size: 0.9rem;
}

.btn-small {
  padding: 6px 15px;
  font-size: 0.85rem;
}

.dark-mode .cookie-consent {
  background: var(--dark-surface);
  border-top: 1px solid var(--dark-accent);
}

/* Offline Indicator */
.offline-indicator {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: var(--warning);
  color: var(--text-dark);
  padding: 10px 20px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 98;
  animation: fadeIn 0.3s ease;
}

.offline-icon {
  font-size: 1.2rem;
}

.dark-mode .offline-indicator {
  background: var(--warning);
  color: var(--dark-bg);
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

.dark-mode :focus-visible {
  outline-color: var(--dark-accent);
}

/* Selection Style */
::selection {
  background: var(--primary);
  color: white;
}

.dark-mode ::selection {
  background: var(--dark-accent);
  color: var(--dark-bg);
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

.dark-mode ::-webkit-scrollbar-track {
  background: var(--dark-surface);
}

.dark-mode ::-webkit-scrollbar-thumb {
  background: var(--dark-accent);
}

.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: #80EAFF;
}

/* Responsive */
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
  
  .cookie-content {
    flex-direction: column;
    text-align: center;
    padding: 10px;
  }
  
  .cookie-actions {
    width: 100%;
    justify-content: center;
  }
  
  .offline-indicator {
    left: 10px;
    right: 10px;
    bottom: 10px;
    text-align: center;
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
</style>
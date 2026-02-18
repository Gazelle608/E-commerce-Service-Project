// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import store from '@/stores'

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If saved position exists (browser back/forward), use it
    if (savedPosition) {
      return savedPosition
    }
    
    // If route has hash, scroll to element
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    
    // Scroll to top on new route
    return { top: 0, behavior: 'smooth' }
  }
})

// ===== NAVIGATION GUARDS =====

// Global Before Guard
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Set meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }
  
  // Check authentication status
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  // Log navigation in development
  if (import.meta.env.DEV) {
    console.log('📍 Navigation:', {
      from: from.fullPath,
      to: to.fullPath,
      authenticated: isAuthenticated,
      meta: to.meta
    })
  }
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Store the intended destination
      sessionStorage.setItem('redirectUrl', to.fullPath)
      
      // Show notification
      store.commit('SHOW_NOTIFICATION', {
        message: 'Please log in to access this page',
        type: 'info'
      })
      
      // Redirect to login with return URL
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // Check if route is for guests only (login/register)
  if (to.matched.some(record => record.meta.guestOnly)) {
    if (isAuthenticated) {
      // Redirect to home if already logged in
      next({ name: 'home' })
      return
    }
  }
  
  // Check for session expiry
  if (to.query.session === 'expired') {
    store.commit('SHOW_NOTIFICATION', {
      message: 'Your session has expired. Please log in again.',
      type: 'warning'
    })
  }
  
  // Proceed to route
  next()
})

// Global After Guard
router.afterEach((to, from) => {
  // Close mobile menu if open
  store.commit('CLOSE_MOBILE_MENU')
})

// ROUTER ERRORS
router.onError((error) => {
  console.error('Router error:', error)
  
  // Handle chunk loading errors (network issues)
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    store.commit('SHOW_NOTIFICATION', {
      message: 'Network error. Please check your connection.',
      type: 'error'
    })
    
    // Reload page after 3 seconds
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }
})

export default router
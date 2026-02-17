// stores/index.js
import { createStore } from 'vuex'
import auth from './auth.store'
import bookings from './bookings.store'
import spin from './spin.store'
import user from './user.store'

const store = createStore({
  modules: {
    auth,
    bookings,
    spin,
    user
  },
  
  state: {
    isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
    notification: {
      show: false,
      message: '',
      type: 'info',
      timeout: null
    },
    destinations: [],
    featuredDeals: [],
    isLoading: false,
    error: null,
    appVersion: '1.0.0'
  },

  getters: {
    isDarkMode: state => state.isDarkMode,
    notification: state => state.notification,
    destinations: state => state.destinations,
    featuredDeals: state => state.featuredDeals,
    isLoading: state => state.isLoading,
    error: state => state.error,
    appVersion: state => state.appVersion,
    
    // Cart related (could be moved to separate module later)
    cartItems: state => state.cart?.items || [],
    cartCount: state => state.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    cartTotal: state => state.cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  },

  mutations: {
    // Theme
    TOGGLE_THEME(state) {
      state.isDarkMode = !state.isDarkMode
      localStorage.setItem('darkMode', state.isDarkMode)
      
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    },
    
    SET_THEME(state, isDark) {
      state.isDarkMode = isDark
      localStorage.setItem('darkMode', isDark)
      
      if (isDark) {
        document.documentElement.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    },

    // Notifications
    SHOW_NOTIFICATION(state, { message, type = 'info', duration = 3000 }) {
      // Clear existing timeout
      if (state.notification.timeout) {
        clearTimeout(state.notification.timeout)
      }
      
      state.notification = {
        show: true,
        message,
        type,
        timeout: setTimeout(() => {
          state.notification.show = false
        }, duration)
      }
    },
    
    HIDE_NOTIFICATION(state) {
      if (state.notification.timeout) {
        clearTimeout(state.notification.timeout)
      }
      state.notification.show = false
    },

    // Destinations
    SET_DESTINATIONS(state, destinations) {
      state.destinations = destinations
    },
    
    ADD_DESTINATION(state, destination) {
      state.destinations.push(destination)
    },
    
    UPDATE_DESTINATION(state, updatedDestination) {
      const index = state.destinations.findIndex(d => d.id === updatedDestination.id)
      if (index !== -1) {
        state.destinations[index] = { ...state.destinations[index], ...updatedDestination }
      }
    },

    // Featured Deals
    SET_FEATURED_DEALS(state, deals) {
      state.featuredDeals = deals
    },

    // Loading
    SET_LOADING(state, status) {
      state.isLoading = status
    },

    // Error
    SET_ERROR(state, error) {
      state.error = error
    },

    // Cart (temporary - should be moved to cart module)
    ADD_TO_CART(state, item) {
      if (!state.cart) {
        state.cart = { items: [] }
      }
      
      const existing = state.cart.items.find(i => i.id === item.id)
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1
      } else {
        state.cart.items.push({ ...item, quantity: 1 })
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    
    REMOVE_FROM_CART(state, itemId) {
      if (!state.cart) return
      state.cart.items = state.cart.items.filter(i => i.id !== itemId)
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    
    UPDATE_CART_QUANTITY(state, { id, quantity }) {
      if (!state.cart) return
      const item = state.cart.items.find(i => i.id === id)
      if (item) {
        item.quantity = quantity
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }
    },
    
    CLEAR_CART(state) {
      state.cart = { items: [] }
      localStorage.removeItem('cart')
    },

    // Initialize cart from localStorage
    INIT_CART(state) {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          state.cart = JSON.parse(savedCart)
        } catch (e) {
          state.cart = { items: [] }
        }
      } else {
        state.cart = { items: [] }
      }
    }
  },

  actions: {
    // Initialize app
    async init({ commit, dispatch }) {
      commit('INIT_CART')
      await dispatch('auth/init', null, { root: true })
      await dispatch('fetchDestinations')
      await dispatch('fetchFeaturedDeals')
    },

    // Fetch destinations
    async fetchDestinations({ commit }) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 600))
        
        const destinations = [
          {
            id: 1,
            name: 'Tokyo',
            country: 'Japan',
            region: 'Asia',
            image: '/images/tokyo.jpg',
            price: 1299,
            days: 5,
            rating: 4.8,
            tags: ['Culture', 'Food', 'Technology'],
            revealed: true
          },
          {
            id: 2,
            name: 'Paris',
            country: 'France',
            region: 'Europe',
            image: '/images/paris.jpg',
            price: 999,
            days: 4,
            rating: 4.7,
            tags: ['Romance', 'Art', 'Food'],
            revealed: true
          },
          {
            id: 3,
            name: 'Cape Town',
            country: 'South Africa',
            region: 'Africa',
            image: '/images/cape-town.jpg',
            price: 799,
            days: 4,
            rating: 4.9,
            tags: ['Beach', 'Mountain', 'Wine'],
            revealed: true
          },
          {
            id: 4,
            name: 'New York',
            country: 'USA',
            region: 'North America',
            image: '/images/nyc.jpg',
            price: 1199,
            days: 4,
            rating: 4.8,
            tags: ['City', 'Culture', 'Shopping'],
            revealed: true
          },
          {
            id: 5,
            name: 'Bangkok',
            country: 'Thailand',
            region: 'Asia',
            image: '/images/bangkok.jpg',
            price: 899,
            days: 5,
            rating: 4.6,
            tags: ['Food', 'Culture', 'Nightlife'],
            revealed: true
          },
          {
            id: 6,
            name: 'Mystery Asia',
            region: 'Asia',
            image: '/images/mystery-asia.jpg',
            price: 899,
            days: 5,
            tags: ['Mystery', 'Adventure'],
            revealed: false
          }
        ]
        
        commit('SET_DESTINATIONS', destinations)
        return destinations
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Fetch featured deals
    async fetchFeaturedDeals({ commit }) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 400))
        
        const deals = [
          {
            id: 101,
            name: 'Bali Escape',
            country: 'Indonesia',
            image: '/images/bali.jpg',
            price: 899,
            originalPrice: 1399,
            discount: 36,
            days: 6
          },
          {
            id: 102,
            name: 'Greek Islands',
            country: 'Greece',
            image: '/images/greece.jpg',
            price: 1099,
            originalPrice: 1699,
            discount: 35,
            days: 7
          },
          {
            id: 103,
            name: 'Morocco Adventure',
            country: 'Morocco',
            image: '/images/morocco.jpg',
            price: 799,
            originalPrice: 1299,
            discount: 38,
            days: 5
          }
        ]
        
        commit('SET_FEATURED_DEALS', deals)
        return deals
      } catch (error) {
        console.error('Failed to fetch featured deals:', error)
        throw error
      }
    },

    // Cart actions
    addToCart({ commit }, item) {
      commit('ADD_TO_CART', item)
      commit('SHOW_NOTIFICATION', {
        message: 'Added to cart!',
        type: 'success'
      })
    },
    
    removeFromCart({ commit }, itemId) {
      commit('REMOVE_FROM_CART', itemId)
      commit('SHOW_NOTIFICATION', {
        message: 'Removed from cart',
        type: 'info'
      })
    },
    
    updateCartQuantity({ commit }, payload) {
      commit('UPDATE_CART_QUANTITY', payload)
    },
    
    clearCart({ commit }) {
      commit('CLEAR_CART')
      commit('SHOW_NOTIFICATION', {
        message: 'Cart cleared',
        type: 'info'
      })
    },

    // Checkout
    async checkout({ commit, state }, paymentDetails) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Create order
        const order = {
          id: Date.now(),
          items: state.cart?.items || [],
          total: state.cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
          paymentMethod: paymentDetails.method,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
        
        commit('CLEAR_CART')
        commit('SHOW_NOTIFICATION', {
          message: 'Order placed successfully!',
          type: 'success'
        })
        
        return { success: true, order }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SHOW_NOTIFICATION', {
          message: 'Checkout failed. Please try again.',
          type: 'error'
        })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Clear error
    clearError({ commit }) {
      commit('SET_ERROR', null)
    }
  }
})

export default store
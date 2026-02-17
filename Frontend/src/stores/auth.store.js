// stores/auth.store.js
import api from '@/services/api'

export default {
  namespaced: true,
  
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    rememberMe: false
  },

  getters: {
    isAuthenticated: state => !!state.token && !!state.user,
    currentUser: state => state.user,
    userInitials: state => {
      if (!state.user) return '👤'
      if (state.user.firstName) {
        return state.user.firstName.charAt(0).toUpperCase()
      }
      return state.user.email?.charAt(0).toUpperCase() || '👤'
    },
    userFullName: state => {
      if (!state.user) return ''
      if (state.user.firstName && state.user.lastName) {
        return `${state.user.firstName} ${state.user.lastName}`
      }
      return state.user.firstName || state.user.email || ''
    },
    authError: state => state.error,
    isLoading: state => state.isLoading
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, { token, remember }) {
      state.token = token
      state.rememberMe = remember || false
      
      if (remember) {
        localStorage.setItem('token', token)
      } else {
        sessionStorage.setItem('token', token)
      }
      
      // Set default auth header for all future requests
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    },
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.rememberMe = false
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },
    UPDATE_USER(state, userData) {
      state.user = { ...state.user, ...userData }
    }
  },

  actions: {
    // Initialize auth on app start
    async init({ commit, dispatch }) {
      // Check both localStorage and sessionStorage for token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const remember = !!localStorage.getItem('token')
      
      if (token) {
        commit('SET_TOKEN', { token, remember })
        await dispatch('fetchUser')
      }
    },

    // Fetch current user
    async fetchUser({ commit, state }) {
      if (!state.token) return
      
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock user data
        const user = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+27 12 345 6789',
          city: 'Johannesburg',
          country: 'South Africa',
          blacklist: ['Durban', 'Port Elizabeth'],
          preferences: {
            airline: '',
            accommodation: 'hostel',
            maxBudget: 1500,
            newsletter: true,
            emailNotifications: true,
            smsAlerts: false
          },
          createdAt: '2026-01-15T10:30:00Z',
          avatar: null
        }
        
        commit('SET_USER', user)
        return user
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch user'
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Login
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock response
        const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2)
        const user = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: credentials.email,
          city: 'Johannesburg',
          blacklist: []
        }
        
        commit('SET_TOKEN', { 
          token, 
          remember: credentials.remember || false 
        })
        commit('SET_USER', user)
        
        return { success: true, user }
      } catch (error) {
        const message = error.response?.data?.message || 'Invalid email or password'
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Register
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock response
        const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2)
        const user = {
          id: 1,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          city: userData.city || 'Johannesburg',
          blacklist: userData.blacklist || []
        }
        
        commit('SET_TOKEN', { token, remember: true })
        commit('SET_USER', user)
        
        return { success: true, user }
      } catch (error) {
        const message = error.response?.data?.message || 'Registration failed'
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Logout
    async logout({ commit }) {
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        commit('CLEAR_AUTH')
      }
    },

    // Update profile
    async updateProfile({ commit, state }, profileData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 800))
        
        commit('UPDATE_USER', profileData)
        
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update profile'
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Update blacklist
    async updateBlacklist({ commit, state }, blacklist) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        commit('UPDATE_USER', { blacklist })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Change password
    async changePassword({ commit }, passwords) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        if (passwords.current !== 'password123') {
          throw new Error('Current password is incorrect')
        }
        
        if (passwords.new !== passwords.confirm) {
          throw new Error('New passwords do not match')
        }
        
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Request password reset
    async requestPasswordReset({ commit }, email) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Reset password with token
    async resetPassword({ commit }, { token, password }) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}
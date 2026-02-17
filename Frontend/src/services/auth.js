// services/auth.js
import api from './api'

class AuthService {
  constructor() {
    this.tokenKey = 'token'
    this.refreshTokenKey = 'refreshToken'
    this.userKey = 'user'
    this.rememberMeKey = 'rememberMe'
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} remember - Remember me flag
   * @returns {Promise} - Login response
   */
  async login(email, password, remember = false) {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.token) {
        this.setToken(response.data.token, remember)
        
        if (response.data.refreshToken) {
          this.setRefreshToken(response.data.refreshToken, remember)
        }
        
        if (response.data.user) {
          this.setUser(response.data.user)
        }
      }
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration response
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      
      if (response.data.token) {
        this.setToken(response.data.token, true)
        
        if (response.data.refreshToken) {
          this.setRefreshToken(response.data.refreshToken, true)
        }
        
        if (response.data.user) {
          this.setUser(response.data.user)
        }
      }
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Logout user
   * @returns {Promise} - Logout response
   */
  async logout() {
    try {
      const token = this.getToken()
      if (token) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuth()
    }
  }

  /**
   * Get current user profile
   * @returns {Promise} - User profile
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      
      if (response.data.user) {
        this.setUser(response.data.user)
      }
      
      return response.data.user
    } catch (error) {
      if (error.response?.status === 401) {
        this.clearAuth()
      }
      throw this.handleError(error)
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Update response
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData)
      
      if (response.data.user) {
        this.setUser(response.data.user)
      }
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - Change password response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} - Password reset response
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} - Reset password response
   */
  async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', { token, password })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise} - Verification response
   */
  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Refresh access token
   * @returns {Promise} - New token
   */
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      
      const response = await api.post('/auth/refresh', { refreshToken })
      
      if (response.data.token) {
        this.setToken(response.data.token, this.getRememberMe())
      }
      
      return response.data.token
    } catch (error) {
      this.clearAuth()
      throw this.handleError(error)
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = payload.exp * 1000 // Convert to milliseconds
      return Date.now() < expiry
    } catch (e) {
      return false
    }
  }

  /**
   * Get stored token
   * @returns {string|null} - Auth token
   */
  getToken() {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey)
  }

  /**
   * Set auth token
   * @param {string} token - Auth token
   * @param {boolean} remember - Remember me flag
   */
  setToken(token, remember = false) {
    if (remember) {
      localStorage.setItem(this.tokenKey, token)
    } else {
      sessionStorage.setItem(this.tokenKey, token)
    }
    this.setRememberMe(remember)
  }

  /**
   * Get refresh token
   * @returns {string|null} - Refresh token
   */
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey) || sessionStorage.getItem(this.refreshTokenKey)
  }

  /**
   * Set refresh token
   * @param {string} token - Refresh token
   * @param {boolean} remember - Remember me flag
   */
  setRefreshToken(token, remember = false) {
    if (remember) {
      localStorage.setItem(this.refreshTokenKey, token)
    } else {
      sessionStorage.setItem(this.refreshTokenKey, token)
    }
  }

  /**
   * Get stored user
   * @returns {Object|null} - User object
   */
  getUser() {
    const userStr = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        return null
      }
    }
    return null
  }

  /**
   * Set user data
   * @param {Object} user - User object
   */
  setUser(user) {
    const remember = this.getRememberMe()
    const userStr = JSON.stringify(user)
    if (remember) {
      localStorage.setItem(this.userKey, userStr)
    } else {
      sessionStorage.setItem(this.userKey, userStr)
    }
  }

  /**
   * Get remember me setting
   * @returns {boolean} - Remember me flag
   */
  getRememberMe() {
    return localStorage.getItem(this.rememberMeKey) === 'true'
  }

  /**
   * Set remember me setting
   * @param {boolean} remember - Remember me flag
   */
  setRememberMe(remember) {
    if (remember) {
      localStorage.setItem(this.rememberMeKey, 'true')
    } else {
      localStorage.removeItem(this.rememberMeKey)
    }
  }

  /**
   * Clear all auth data
   */
  clearAuth() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    localStorage.removeItem(this.userKey)
    sessionStorage.removeItem(this.tokenKey)
    sessionStorage.removeItem(this.refreshTokenKey)
    sessionStorage.removeItem(this.userKey)
    // Note: rememberMe setting is preserved
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 
                     error.response.data?.error ||
                     'Authentication failed'
      const errors = error.response.data?.errors || {}
      
      const formattedError = new Error(message)
      formattedError.status = error.response.status
      formattedError.errors = errors
      formattedError.data = error.response.data
      
      return formattedError
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.')
    } else {
      // Something else happened
      return error
    }
  }

  /**
   * Get auth headers for requests
   * @returns {Object} - Headers object
   */
  getAuthHeaders() {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} - True if expired
   */
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = payload.exp * 1000
      return Date.now() >= expiry
    } catch (e) {
      return true
    }
  }

  /**
   * Decode JWT token payload
   * @param {string} token - JWT token
   * @returns {Object|null} - Decoded payload
   */
  decodeToken(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {number|null} - Expiration timestamp
   */
  getTokenExpiry(token) {
    const payload = this.decodeToken(token)
    return payload?.exp ? payload.exp * 1000 : null
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   * @param {string} token - JWT token
   * @returns {boolean} - True if expiring soon
   */
  isTokenExpiringSoon(token) {
    const expiry = this.getTokenExpiry(token)
    if (!expiry) return false
    
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() > expiry - fiveMinutes
  }
}

// Create and export singleton instance
const authService = new AuthService()
export default authService

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  isAuthenticated,
  getToken,
  setToken,
  getUser,
  setUser,
  clearAuth,
  getAuthHeaders
} = authService
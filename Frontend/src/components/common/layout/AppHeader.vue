<template>
  <header class="app-header" :class="{ 'scrolled': isScrolled, 'mobile-menu-open': mobileMenuOpen }">
    <!-- Top Bar with Contact Info -->
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-content">
          <div class="contact-info">
            <a href="tel:+27123456789" class="contact-item">
              <span class="icon">📞</span>
              <span>+27 12 345 6789</span>
            </a>
            <a href="mailto:hello@sowhereto.com" class="contact-item">
              <span class="icon">✉️</span>
              <span>hello@sowhereto.com</span>
            </a>
          </div>
          <div class="top-bar-actions">
            <div class="language-selector">
              <select v-model="currentLanguage" @change="changeLanguage">
                <option value="en">🇬🇧 EN</option>
                <option value="af">🇿🇦 AF</option>
                <option value="zu">🇿🇦 ZU</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="main-header">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <router-link to="/" class="logo">
            <img src="/images/logo.jpeg" alt="So Where To?" class="logo-img">
            <span class="logo-text">So <span class="highlight">Where To</span>?</span>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="desktop-nav">
            <router-link to="/" class="nav-link hov-un-ani" :class="{ active: isActive('/') }">
              <!-- <span class="nav-icon">🏠</span> -->
              <span>Home</span>
            </router-link>
            
            <router-link to="/how-it-works" class="nav-link hov-un-ani" :class="{ active: isActive('/how-it-works') }">
              <!-- <span class="nav-icon">❓</span> -->
              <span>How It Works</span>
            </router-link>
            
            <router-link to="/spin" class="nav-link hov-un-ani" :class="{ active: isActive('/spin') }">
              <!-- <span class="nav-icon">🎲</span> -->
              <span>Spin the Globe</span>
            </router-link>
            
            <router-link to="/destinations" class="nav-link hov-un-ani" :class="{ active: isActive('/destinations') }">
              <!-- <span class="nav-icon">🌍</span> -->
              <span>Destinations</span>
            </router-link>
            
            <router-link to="/contact" class="nav-link hov-un-ani" :class="{ active: isActive('/contact') }">
              <!-- <span class="nav-icon">📞</span> -->
              <span>Contact</span>
            </router-link>
          </nav>

          <!-- Right Side Actions -->
          <div class="header-actions">
            <!-- Cart -->
            <router-link to="/cart" class="cart-icon" :class="{ 'has-items': cartCount > 0 }">
              <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
              <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart2" viewBox="0 0 16 16">
  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
</svg></span>
            </router-link>

            <!-- User Menu (Authenticated) -->
            <div v-if="isAuthenticated" class="user-menu">
              <button class="user-menu-button" @click="toggleUserMenu">
                <span class="user-avatar">{{ userInitials }}</span>
                <span class="user-name">{{ userName }}</span>
                <span class="dropdown-icon">▼</span>
              </button>
              
              <div class="user-dropdown" v-show="userMenuOpen" @click.outside="userMenuOpen = false">
                <router-link to="/profile" class="dropdown-item" @click="userMenuOpen = false">
                  <!-- <span class="item-icon">👤</span> -->
                  <span>My Profile</span>
                </router-link>
                <router-link to="/bookings" class="dropdown-item" @click="userMenuOpen = false">
                  <!-- <span class="item-icon">📅</span> -->
                  <span>My Bookings</span>
                </router-link>
                <router-link to="/wishlist" class="dropdown-item" @click="userMenuOpen = false">
                  <!-- <span class="item-icon">❤️</span> -->
                  <span>Wishlist</span>
                </router-link>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" @click="logout">
                  <!-- <span class="item-icon">🚪</span> -->
                  <span>Logout</span>
                </button>
              </div>
            </div>

            <!-- Auth Buttons (Not Authenticated) -->
            <div v-else class="auth-buttons">
              <router-link to="/login" class="btn btn-outline-small">Login</router-link>
              <router-link to="/register" class="btn btn-primary-small">Sign Up</router-link>
            </div>

            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
              <span class="hamburger" :class="{ 'is-active': mobileMenuOpen }">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <transition name="slide-down">
      <div class="mobile-nav" v-show="mobileMenuOpen">
        <nav class="mobile-nav-links">
          <router-link to="/" class="mobile-nav-link hov-un-ani" @click="mobileMenuOpen = false">
            <!-- <span class="nav-icon">🏠</span> -->
            <span>Home</span>
          </router-link>
          
          <router-link to="/how-it-works" class="mobile-nav-link hov-un-ani" @click="mobileMenuOpen = false">
            <!-- <span class="nav-icon">❓</span> -->
            <span>How It Works</span>
          </router-link>
          
          <router-link to="/spin" class="mobile-nav-link hov-un-ani" @click="mobileMenuOpen = false">
            <!-- <span class="nav-icon">🎲</span> -->
            <span>Spin the Globe</span>
          </router-link>
          
          <router-link to="/destinations" class="mobile-nav-link hov-un-ani" @click="mobileMenuOpen = false">
            <!-- <span class="nav-icon">🌍</span> -->
            <span>Destinations</span>
          </router-link>
          
          <router-link to="/contact" class="mobile-nav-link hov-un-ani" @click="mobileMenuOpen = false">
            <!-- <span class="nav-icon">📞</span> -->
            <span>Contact</span>
          </router-link>

          <div class="mobile-nav-divider"></div>

          <template v-if="!isAuthenticated">
            <router-link to="/login" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <!-- <span class="nav-icon">🔐</span> -->
              <span>Login</span>
            </router-link>
            <router-link to="/register" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <!-- <span class="nav-icon">📝</span> -->
              <span>Register</span>
            </router-link>
          </template>

          <template v-else>
            <router-link to="/profile" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <!-- <span class="nav-icon">👤</span> -->
              <span>My Profile</span>
            </router-link>
            <router-link to="/bookings" class="mobile-nav-link hov-un-ani" @click="mobileMenuOpen = false">
              <!-- <span class="nav-icon">📅</span> -->
              <span>My Bookings</span>
            </router-link>
            <button class="mobile-nav-link logout hov-un-ani" @click="logout">
              <!-- <span class="nav-icon">🚪</span> -->
              <span>Logout</span>
            </button>
          </template>
        </nav>

        <div class="mobile-nav-footer">
          <div class="mobile-contact">
            <a href="tel:+27123456789" class="mobile-contact-item">
              <span>📞</span>
              <span>+27 12 345 6789</span>
            </a>
            <a href="mailto:hello@sowhereto.com" class="mobile-contact-item">
              <span>✉️</span>
              <span>hello@sowhereto.com</span>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'AppHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    // State
    const isScrolled = ref(false)
    const mobileMenuOpen = ref(false)
    const userMenuOpen = ref(false)
    const currentLanguage = ref('en')
    
    // Computed
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const user = computed(() => store.state.user || {})
    const cartCount = computed(() => store.getters.cartCount || 0)
    const isDarkMode = computed(() => store.state.isDarkMode || false)
    
    const userName = computed(() => {
      if (user.value?.firstName) {
        return `${user.value.firstName} ${user.value.lastName?.charAt(0) || ''}`
      }
      return user.value?.email || 'User'
    })
    
    const userInitials = computed(() => {
      if (user.value?.firstName) {
        return user.value.firstName.charAt(0).toUpperCase()
      }
      return user.value?.email?.charAt(0).toUpperCase() || '👤'
    })
    
    // Methods
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
      if (mobileMenuOpen.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    
    const toggleUserMenu = () => {
      userMenuOpen.value = !userMenuOpen.value
    }
    
    const toggleTheme = () => {
      store.commit('TOGGLE_THEME')
    }
    
    const changeLanguage = () => {
      // Implement language change logic
      console.log('Language changed to:', currentLanguage.value)
    }
    
    const logout = async () => {
      try {
        await store.dispatch('logout')
        router.push('/')
        mobileMenuOpen.value = false
        userMenuOpen.value = false
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
    
    const isActive = (path) => {
      return route.path === path
    }
    
    // Click outside handler for dropdown
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        userMenuOpen.value = false
      }
    }
    
    // Lifecycle
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = ''
    })
    
    return {
      isScrolled,
      mobileMenuOpen,
      userMenuOpen,
      currentLanguage,
      isAuthenticated,
      cartCount,
      isDarkMode,
      userName,
      userInitials,
      toggleMobileMenu,
      toggleUserMenu,
      toggleTheme,
      changeLanguage,
      logout,
      isActive
    }
  }
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.app-header.scrolled {
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.app-header.mobile-menu-open {
  box-shadow: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Top Bar */
.top-bar {
  background: var(--secondary-dark);
  color: white;
  font-size: 0.85rem;
  padding: 8px 0;
  transition: transform 0.3s ease;
}

.scrolled .top-bar {
  transform: translateY(-100%);
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info {
  display: flex;
  gap: 20px;
}

.contact-item {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.3s;
}

.contact-item:hover {
  opacity: 0.8;
}

.contact-item .icon {
  font-size: 1rem;
}

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  transition: background 0.3s;
}

.theme-toggle:hover {
  background: rgba(255,255,255,0.1);
}

.language-selector select {
  background: rgba(255,255,255,0.1);
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
}

.language-selector select option {
  background: var(--secondary-dark);
  color: white;
}

/* Main Header */
.main-header {
  padding: 15px 0;
  background: white;
  transition: padding 0.3s ease;
}

.scrolled .main-header {
  padding: 10px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-img {
  height: 40px;  /* Adjust based on your logo size */
  width: auto;
  object-fit: contain;
}

/* Dark mode adjustment for logo */
.dark-mode .logo-img {
  filter: brightness(1.2);  /* Makes logo slightly brighter in dark mode */
}

/* Optional: Add hover effect */
.logo:hover .logo-img {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.logo-text {
  color: var(--text);
}

.logo-text .highlight {
  color: var(--primary);
  position: relative;
}

.logo-text .highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 6px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .logo-img {
    height: 32px;  /* Smaller on mobile */
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .logo-img {
    height: 28px;
  }
  
  .logo-text {
    display: none;  /* Hide text on very small screens, keep only logo */
  }
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  gap: 5px;
}

@media (max-width: 968px) {
  .desktop-nav {
    display: none;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  color: var(--text);
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all 0.3s;
  font-weight: 500;
}

.nav-link:hover{
  color: #FF6B6B;
}

.hov-un-ani {
  display: inline-block;
  position: relative;
}
.hov-un-ani::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #FF6B6B;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.hov-un-ani:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* .nav-link:hover {
  background: rgba(255, 107, 107, 0.1);
  color: var(--primary);
}

.nav-link.active {
  background: var(--primary);
  color: white;
}

.nav-link .nav-icon {
  font-size: 1.1rem;
} */

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Cart Icon */
.cart-icon {
  position: relative;
  font-size: 1.5rem;
  text-decoration: none;
  color: var(--text);
  transition: color 0.3s;
}

.cart-icon:hover {
  color: var(--primary);
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn-outline-small,
.btn-primary-small {
  padding: 6px 15px;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-outline-small {
  border: 2px solid var(--primary);
  color: var(--primary);
  background: transparent;
}

.btn-outline-small:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.btn-primary-small {
  background: var(--primary);
  color: white;
  border: 2px solid var(--primary);
}

.btn-primary-small:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: background 0.3s;
}

.user-menu-button:hover {
  background: rgba(0,0,0,0.05);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.user-name {
  font-weight: 500;
  color: var(--text);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  font-size: 0.8rem;
  color: var(--gray);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: var(--text);
  text-decoration: none;
  transition: background 0.3s;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}

.dropdown-item .item-icon {
  font-size: 1.1rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--gray-light);
  margin: 5px 0;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

@media (max-width: 968px) {
  .mobile-menu-toggle {
    display: block;
  }
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 30px;
  height: 30px;
  justify-content: center;
}

.hamburger span {
  display: block;
  height: 2px;
  background: var(--text);
  transition: all 0.3s;
}

.hamburger.is-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 999;
  overflow-y: auto;
  padding: 20px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  color: var(--text);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.3s;
  font-size: 1.1rem;
  font-weight: 500;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-nav-link:hover {
  background: rgba(255, 107, 107, 0.1);
  color: var(--primary);
}

.mobile-nav-link.logout {
  color: var(--error);
}

.mobile-nav-link.logout:hover {
  background: rgba(220, 53, 69, 0.1);
}

.mobile-nav-divider {
  height: 1px;
  background: var(--gray-light);
  margin: 20px 0;
}

.mobile-nav-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-light);
}

.mobile-contact {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--gray-dark);
  text-decoration: none;
  padding: 5px 0;
}

.mobile-contact-item:hover {
  color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .top-bar {
    display: none;
  }
  
  .main-header {
    padding: 10px 0;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .logo-icon {
    font-size: 1.5rem;
  }
  
  .auth-buttons {
    display: none;
  }
  
  .user-menu-button .user-name {
    display: none;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .logo-text {
    display: none;
  }
  
  .cart-icon {
    font-size: 1.3rem;
  }
}
</style>
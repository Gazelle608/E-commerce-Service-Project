import { createRouter, createWebHistory } from 'vue-router'
import store from '../stores'

// Import Views
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SpinView from '../views/SpinView.vue'
import RevealView from '../views/RevealView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'So Where To? - Mystery Travel Adventures',
      description: 'Book mystery travel bundles worldwide. Flights + accommodation included. Destination revealed after purchase.'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login - So Where To?',
      description: 'Sign in to your account',
      guestOnly: true  // Only accessible when not logged in
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Register - So Where To?',
      description: 'Create your account',
      guestOnly: true  // Only accessible when not logged in
    }
  },
  {
    path: '/spin',
    name: 'spin',
    component: SpinView,
    meta: {
      title: 'Spin the Globe - So Where To?',
      description: 'Find your mystery adventure',
      requiresAuth: true  // Requires authentication
    }
  },
  {
    path: '/reveal',
    name: 'reveal',
    component: RevealView,
    meta: {
      title: 'Destination Revealed - So Where To?',
      description: 'Your mystery destination',
      requiresAuth: true  // Requires authentication
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: {
      title: 'Your Cart - So Where To?',
      description: 'View your mystery bookings',
      requiresAuth: true  // Requires authentication
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: {
      title: 'Checkout - So Where To?',
      description: 'Complete your booking',
      requiresAuth: true  // Requires authentication
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'My Profile - So Where To?',
      description: 'Manage your account',
      requiresAuth: true  // Requires authentication
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: HomeView, // Fallback to home for now
    meta: {
      title: 'Page Not Found - So Where To?'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top on route change
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guard - Authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  
  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Redirect unauthenticated users away from protected routes
  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Redirect authenticated users away from guest-only routes
  if (guestOnly && isAuthenticated) {
    next({ name: 'home' })
    return
  }
  
  // Allow navigation for all other cases
  next()
})

// After each route - Analytics or other post-navigation tasks
router.afterEach((to, from) => {
  // You could log page views to analytics here
  console.log(`Navigated to: ${to.name}`)
})

export default router
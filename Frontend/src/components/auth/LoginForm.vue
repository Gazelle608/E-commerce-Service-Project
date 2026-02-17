<template>
  <div class="auth-page">
    <!-- Background blur effect -->
    <div class="background-blur"></div>
    
    <!-- Main card -->
    <div class="auth-card">
      <!-- Tabs -->
      <div class="auth-tabs">
        <button 
          class="auth-tab" 
          :class="{ active: isLoginTab }"
          @click="isLoginTab = true"
        >
          <span class="tab-icon">✈️</span>
          <span class="tab-label">Login</span>
        </button>
        <button 
          class="auth-tab" 
          :class="{ active: !isLoginTab }"
          @click="isLoginTab = false"
        >
          <span class="tab-icon">🎫</span>
          <span class="tab-label">Register</span>
        </button>
      </div>

      <!-- Form Container -->
      <div class="form-wrapper">
        <!-- Header -->
        <div class="form-header">
          <h2>{{ isLoginTab ? 'Welcome back' : 'Join the journey' }}</h2>
          <p class="header-subtitle">
            {{ isLoginTab ? 'Sign in to your mystery adventures' : 'Create your account' }}
          </p>
        </div>

        <!-- Login Form -->
        <form v-if="isLoginTab" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="login-email">Email</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                id="login-email"
                v-model="loginForm.email" 
                type="email" 
                placeholder="john@example.com" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="login-password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                id="login-password"
                v-model="loginForm.password" 
                type="password" 
                placeholder="••••••••" 
                required
              />
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="loginForm.rememberMe" />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" class="submit-btn">🎲 Sign In <a href=""></a></button>

          <p class="toggle-text">
            Don't have an account?
            <button type="button" @click="isLoginTab = false" class="toggle-link">
              Create one
            </button>
          </p>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="reg-firstname">First Name</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  id="reg-firstname"
                  v-model="registerForm.firstName" 
                  type="text" 
                  placeholder="John" 
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label for="reg-lastname">Last Name</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  id="reg-lastname"
                  v-model="registerForm.lastName" 
                  type="text" 
                  placeholder="Doe" 
                  required
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="reg-email">Email</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                id="reg-email"
                v-model="registerForm.email" 
                type="email" 
                placeholder="john@example.com" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="reg-password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                id="reg-password"
                v-model="registerForm.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <button type="submit" class="submit-btn">✈️ Start Exploring</button>

          <p class="toggle-text">
            Already have an account?
            <button type="button" @click="isLoginTab = true" class="toggle-link">
              Sign in
            </button>
          </p>
        </form>
      </div>

      <!-- Info Footer -->
      <div class="card-footer">
        <div class="info-item">
          <span class="info-icon">🛫</span>
          <span>Flights included</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🏨</span>
          <span>Accommodation included</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🎁</span>
          <span>Mystery destination</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import store from '@/stores'

export default {
  name: 'LoginForm',
  setup() {
    return {
      router: useRouter()
    }
  },
  data() {
    return {
      isLoginTab: true,
      showPassword: false,
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      registerForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin() {
      console.log('Login attempt:', this.loginForm)
      
      // Set user as authenticated in the store
      store.commit('setAuthenticated', true)
      store.commit('setUser', {
        id: 1,
        email: this.loginForm.email,
        name: 'User',
        rememberMe: this.loginForm.rememberMe
      })
      
      // Clear form
      this.loginForm = {
        email: '',
        password: '',
        rememberMe: false
      }
      
      // Redirect to home
      this.$router.push({ name: 'home' })
    },
    handleRegister() {
      console.log('Register attempt:', this.registerForm)
      
      // Set user as authenticated in the store
      store.commit('setAuthenticated', true)
      store.commit('setUser', {
        id: Date.now(),
        email: this.registerForm.email,
        name: `${this.registerForm.firstName} ${this.registerForm.lastName}`
      })
      
      // Clear form
      this.registerForm = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
      
      // Redirect to home
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  width: 100%;
  background: url('/images/login.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-blur {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  top: -100px;
  right: -100px;
  pointer-events: none;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}

.auth-card {
  background: rgba(21, 34, 56, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tabs */
.auth-tabs {
  display: flex;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}

.auth-tab {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  color: rgba(245, 249, 255, 0.6);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.auth-tab:hover {
  color: rgba(245, 249, 255, 0.9);
}

.auth-tab.active {
  color: #00D4FF;
}

.auth-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00D4FF, transparent);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Form Wrapper */
.form-wrapper {
  padding: 40px;
}

.form-header {
  margin-bottom: 30px;
  text-align: center;
}

.form-header h2 {
  font-size: 1.8rem;
  color: #F5F9FF;
  margin-bottom: 8px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-subtitle {
  color: rgba(245, 249, 255, 0.7);
  font-size: 0.95rem;
}

/* Form Elements */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: rgba(245, 249, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 1.1rem;
  pointer-events: none;
}

input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  color: #F5F9FF;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

input::placeholder {
  color: rgba(245, 249, 255, 0.4);
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #00D4FF;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

input:hover:not(:focus) {
  border-color: rgba(0, 212, 255, 0.4);
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: rgba(245, 249, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #00D4FF;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(245, 249, 255, 0.7);
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  accent-color: #00D4FF;
}

.forgot-link {
  color: rgba(0, 212, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #00D4FF;
  text-decoration: underline;
}

/* Submit Button */
.submit-btn {
  padding: 14px 24px;
  background: linear-gradient(135deg, #00D4FF 0%, #00A8CC 100%);
  color: #0B1E33;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:active {
  transform: translateY(0);
}

/* Toggle Text */
.toggle-text {
  text-align: center;
  color: rgba(245, 249, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 20px;
}

.toggle-link {
  background: none;
  border: none;
  color: #00D4FF;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  margin-left: 5px;
}

.toggle-link:hover {
  color: #33E0FF;
  text-decoration: underline;
}

/* Card Footer */
.card-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(0, 212, 255, 0.1);
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(21, 34, 56, 0.95);
  color: rgba(245, 249, 255, 0.7);
  font-size: 0.8rem;
  text-align: center;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.info-icon {
  font-size: 1.5rem;
}

/* Responsive Design */
@media (max-width: 480px) {
  .auth-card {
    max-width: 100%;
  }

  .form-wrapper {
    padding: 30px 20px;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .card-footer {
    grid-template-columns: 1fr;
  }

  .auth-tab {
    font-size: 0.85rem;
  }
}
</style>

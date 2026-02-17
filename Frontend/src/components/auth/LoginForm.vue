<template>
  <div class="login-form">
    <h2 class="form-title">Welcome Back!</h2>
    <p class="form-subtitle">Sign in to continue your adventure</p>

    <!-- Social Login Buttons -->
    <div class="social-login">
      <button class="social-btn google" @click="socialLogin('google')">
        <span class="social-icon">G</span>
        <span>Continue with Google</span>
      </button>
      <button class="social-btn facebook" @click="socialLogin('facebook')">
        <span class="social-icon">f</span>
        <span>Continue with Facebook</span>
      </button>
    </div>

    <div class="divider">
      <span class="divider-text">or</span>
    </div>

    <!-- Error Message -->
    <transition name="slide">
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
        <button @click="clearError" class="error-close">✕</button>
      </div>
    </transition>

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email Address</label>
        <div class="input-wrapper">
          <span class="input-icon">📧</span>
          <input 
            type="email" 
            id="email"
            v-model="form.email" 
            :class="{ 'error': errors.email }"
            placeholder="your@email.com"
            @blur="validateField('email')"
            @input="clearFieldError('email')"
          >
        </div>
        <transition name="fade">
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </transition>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password"
            v-model="form.password" 
            :class="{ 'error': errors.password }"
            placeholder="Enter your password"
            @blur="validateField('password')"
            @input="clearFieldError('password')"
          >
          <button 
            type="button" 
            class="password-toggle"
            @click="togglePassword"
            tabindex="-1"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>
        <transition name="fade">
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </transition>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="form-options">
        <label class="checkbox-container">
          <input type="checkbox" v-model="form.remember">
          <span class="checkmark"></span>
          <span class="checkbox-text">Remember me</span>
        </label>
        <button type="button" class="forgot-link" @click="forgotPassword">
          Forgot password?
        </button>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="spinner"></span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <!-- Register Link -->
    <p class="register-text">
      Don't have an account? 
      <button class="register-link" @click="$emit('switch-to-register')">
        Create one now
      </button>
    </p>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'LoginForm',
  emits: ['success', 'switch-to-register'],
  setup(props, { emit }) {
    const store = useStore()
    
    // State
    const form = reactive({
      email: '',
      password: '',
      remember: false
    })
    
    const errors = ref({})
    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)

    // Validation rules
    const rules = {
      email: (value) => {
        if (!value) return 'Email is required'
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email'
        return ''
      },
      password: (value) => {
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return ''
      }
    }

    // Computed
    const isFormValid = computed(() => {
      return !rules.email(form.email) && !rules.password(form.password)
    })

    // Methods
    const validateField = (field) => {
      const error = rules[field](form[field])
      if (error) {
        errors.value[field] = error
      } else {
        delete errors.value[field]
      }
    }

    const clearFieldError = (field) => {
      delete errors.value[field]
    }

    const clearError = () => {
      error.value = ''
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const handleSubmit = async () => {
      // Validate all fields
      Object.keys(rules).forEach(field => {
        validateField(field)
      })

      if (Object.keys(errors.value).length > 0) return

      loading.value = true
      error.value = ''

      try {
        const result = await store.dispatch('auth/login', {
          email: form.email,
          password: form.password,
          remember: form.remember
        })

        if (result.success) {
          emit('success', result.user)
        } else {
          error.value = result.error || 'Invalid email or password'
        }
      } catch (err) {
        error.value = 'An error occurred. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const socialLogin = (provider) => {
      console.log(`Social login with ${provider}`)
      // Implement social login
    }

    const forgotPassword = () => {
      // Navigate to forgot password page or show modal
      console.log('Forgot password clicked')
    }

    return {
      form,
      errors,
      loading,
      error,
      showPassword,
      isFormValid,
      validateField,
      clearFieldError,
      clearError,
      togglePassword,
      handleSubmit,
      socialLogin,
      forgotPassword
    }
  }
}
</script>

<style scoped>
.login-form {
  width: 100%;
}

.form-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.form-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 24px;
}

/* Social Login */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.social-btn.google:hover {
  border-color: #DB4437;
  color: #DB4437;
}

.social-btn.facebook:hover {
  border-color: #4267B2;
  color: #4267B2;
}

.social-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider-text {
  background: white;
  padding: 0 15px;
  color: #999;
  font-size: 0.9rem;
  text-transform: uppercase;
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #999;
  font-size: 1.1rem;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 40px 14px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.input-wrapper input:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.input-wrapper input.error {
  border-color: #DC3545;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  transition: color 0.3s;
}

.password-toggle:hover {
  color: #FF6B6B;
}

.field-error {
  color: #DC3545;
  font-size: 0.8rem;
  margin-top: 4px;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding-left: 25px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 18px;
  width: 18px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.3s;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #FF6B6B;
}

.checkbox-container input:checked ~ .checkmark {
  background: #FF6B6B;
  border-color: #FF6B6B;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  color: #666;
  font-size: 0.9rem;
}

.forgot-link {
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-link:hover {
  color: #FF5252;
  text-decoration: underline;
}

/* Submit Button */
.submit-btn {
  padding: 16px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Register Text */
.register-text {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 0.95rem;
}

.register-link {
  background: none;
  border: none;
  color: #FF6B6B;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.register-link:hover {
  color: #FF5252;
  text-decoration: underline;
}

/* Error Message */
.error-message {
  background: #DC3545;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
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

.error-icon {
  font-size: 1.2rem;
}

.error-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s;
}

.error-close:hover {
  color: white;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Dark Mode */
:root.dark-mode .form-title {
  color: #F5F9FF;
}

:root.dark-mode .form-subtitle {
  color: #B0C4DE;
}

:root.dark-mode .social-btn {
  background: #0B1E33;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .social-btn:hover {
  border-color: #00D4FF;
  color: #00D4FF;
}

:root.dark-mode .divider::before,
:root.dark-mode .divider::after {
  background: #1A334D;
}

:root.dark-mode .divider-text {
  background: #0B1E33;
  color: #B0C4DE;
}

:root.dark-mode .form-group label {
  color: #B0C4DE;
}

:root.dark-mode .input-wrapper input {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .input-wrapper input:focus {
  border-color: #00D4FF;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

:root.dark-mode .input-wrapper input::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .password-toggle {
  color: #B0C4DE;
}

:root.dark-mode .password-toggle:hover {
  color: #00D4FF;
}

:root.dark-mode .checkbox-text {
  color: #B0C4DE;
}

:root.dark-mode .checkmark {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .checkbox-container:hover input ~ .checkmark {
  border-color: #00D4FF;
}

:root.dark-mode .checkbox-container input:checked ~ .checkmark {
  background: #00D4FF;
  border-color: #00D4FF;
}

:root.dark-mode .forgot-link {
  color: #00D4FF;
}

:root.dark-mode .forgot-link:hover {
  color: #80EAFF;
}

:root.dark-mode .submit-btn {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .submit-btn:hover:not(:disabled) {
  background: #80EAFF;
}

:root.dark-mode .register-text {
  color: #B0C4DE;
}

:root.dark-mode .register-link {
  color: #00D4FF;
}

/* Responsive */
@media (max-width: 480px) {
  .form-title {
    font-size: 1.5rem;
  }
  
  .social-btn {
    font-size: 0.95rem;
  }
  
  .input-wrapper input {
    padding: 12px 40px 12px 45px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .submit-btn {
    padding: 14px;
  }
}
</style>
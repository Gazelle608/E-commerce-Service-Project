<template>
  <div class="register-form">
    <h2 class="form-title">Create Account</h2>
    <p class="form-subtitle">Join the mystery travel community</p>

    <!-- Social Register Buttons -->
    <div class="social-register">
      <button class="social-btn google" @click="socialRegister('google')">
        <span class="social-icon">G</span>
        <span>Sign up with Google</span>
      </button>
      <button class="social-btn facebook" @click="socialRegister('facebook')">
        <span class="social-icon">f</span>
        <span>Sign up with Facebook</span>
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

    <!-- Registration Form -->
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Name Fields -->
      <div class="form-row">
        <div class="form-group half">
          <label for="firstName">First Name</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              type="text" 
              id="firstName"
              v-model="form.firstName" 
              :class="{ 'error': errors.firstName }"
              placeholder="John"
              @blur="validateField('firstName')"
              @input="clearFieldError('firstName')"
            >
          </div>
          <transition name="fade">
            <span v-if="errors.firstName" class="field-error">{{ errors.firstName }}</span>
          </transition>
        </div>

        <div class="form-group half">
          <label for="lastName">Last Name</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              type="text" 
              id="lastName"
              v-model="form.lastName" 
              :class="{ 'error': errors.lastName }"
              placeholder="Doe"
              @blur="validateField('lastName')"
              @input="clearFieldError('lastName')"
            >
          </div>
          <transition name="fade">
            <span v-if="errors.lastName" class="field-error">{{ errors.lastName }}</span>
          </transition>
        </div>
      </div>

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

      <!-- Phone Field -->
      <div class="form-group">
        <label for="phone">Phone Number (optional)</label>
        <div class="input-wrapper">
          <span class="input-icon">📞</span>
          <input 
            type="tel" 
            id="phone"
            v-model="form.phone" 
            :class="{ 'error': errors.phone }"
            placeholder="+27 12 345 6789"
            @blur="validateField('phone')"
            @input="clearFieldError('phone')"
          >
        </div>
        <transition name="fade">
          <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
        </transition>
      </div>

      <!-- Home City -->
      <div class="form-group">
        <label for="city">Home City</label>
        <div class="input-wrapper">
          <span class="input-icon">🏙️</span>
          <select 
            id="city"
            v-model="form.city" 
            :class="{ 'error': errors.city }"
            @blur="validateField('city')"
            @change="clearFieldError('city')"
          >
            <option value="" disabled selected>Select your city</option>
            <option value="Johannesburg">Johannesburg</option>
            <option value="Cape Town">Cape Town</option>
            <option value="Durban">Durban</option>
            <option value="Pretoria">Pretoria</option>
            <option value="Port Elizabeth">Port Elizabeth</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <transition name="fade">
          <span v-if="errors.city" class="field-error">{{ errors.city }}</span>
        </transition>
      </div>

      <!-- Password Fields -->
      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password"
            v-model="form.password" 
            :class="{ 'error': errors.password }"
            placeholder="Create a password"
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
        
        <!-- Password Strength Meter -->
        <div v-if="form.password" class="password-strength">
          <div class="strength-bar">
            <div class="strength-fill" :class="passwordStrength.class" :style="{ width: passwordStrength.percentage + '%' }"></div>
          </div>
          <span class="strength-text" :class="passwordStrength.class">
            {{ passwordStrength.text }}
          </span>
        </div>
        
        <transition name="fade">
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </transition>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            id="confirmPassword"
            v-model="form.confirmPassword" 
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Confirm your password"
            @blur="validateField('confirmPassword')"
            @input="clearFieldError('confirmPassword')"
          >
          <button 
            type="button" 
            class="password-toggle"
            @click="toggleConfirmPassword"
            tabindex="-1"
          >
            {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>
        <transition name="fade">
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </transition>
      </div>

      <!-- Terms and Conditions -->
      <div class="form-group">
        <label class="checkbox-container">
          <input type="checkbox" v-model="form.agreeTerms">
          <span class="checkmark"></span>
          <span class="checkbox-text">
            I agree to the 
            <a href="/terms" target="_blank" class="terms-link">Terms of Service</a> and 
            <a href="/privacy" target="_blank" class="terms-link">Privacy Policy</a>
          </span>
        </label>
        <transition name="fade">
          <span v-if="errors.agreeTerms" class="field-error">{{ errors.agreeTerms }}</span>
        </transition>
      </div>

      <!-- Newsletter Opt-in -->
      <div class="form-group">
        <label class="checkbox-container">
          <input type="checkbox" v-model="form.newsletter">
          <span class="checkmark"></span>
          <span class="checkbox-text">
            Send me exclusive deals and travel inspiration
          </span>
        </label>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="spinner"></span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <!-- Login Link -->
    <p class="login-text">
      Already have an account? 
      <button class="login-link" @click="$emit('switch-to-login')">
        Sign in
      </button>
    </p>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RegisterForm',
  emits: ['success', 'switch-to-login'],
  setup(props, { emit }) {
    const store = useStore()
    
    // State
    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      newsletter: false
    })
    
    const errors = ref({})
    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // Password strength calculator
    const passwordStrength = computed(() => {
      const password = form.password
      if (!password) return { percentage: 0, text: '', class: '' }
      
      let strength = 0
      
      // Length check
      if (password.length >= 8) strength += 25
      
      // Contains lowercase
      if (/[a-z]/.test(password)) strength += 25
      
      // Contains uppercase
      if (/[A-Z]/.test(password)) strength += 25
      
      // Contains number or special char
      if (/[0-9!@#$%^&*]/.test(password)) strength += 25
      
      if (strength <= 25) return { percentage: 25, text: 'Weak', class: 'weak' }
      if (strength <= 50) return { percentage: 50, text: 'Fair', class: 'fair' }
      if (strength <= 75) return { percentage: 75, text: 'Good', class: 'good' }
      return { percentage: 100, text: 'Strong', class: 'strong' }
    })

    // Validation rules
    const rules = {
      firstName: (value) => {
        if (!value) return 'First name is required'
        if (value.length < 2) return 'First name must be at least 2 characters'
        return ''
      },
      lastName: (value) => {
        if (!value) return 'Last name is required'
        if (value.length < 2) return 'Last name must be at least 2 characters'
        return ''
      },
      email: (value) => {
        if (!value) return 'Email is required'
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email'
        return ''
      },
      phone: (value) => {
        if (value && !/^[+\d\s-]{10,}$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        return ''
      },
      city: (value) => {
        if (!value) return 'Please select your city'
        return ''
      },
      password: (value) => {
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!/[a-z]/.test(value)) return 'Include at least one lowercase letter'
        if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter'
        if (!/[0-9!@#$%^&*]/.test(value)) return 'Include at least one number or special character'
        return ''
      },
      confirmPassword: (value) => {
        if (!value) return 'Please confirm your password'
        if (value !== form.password) return 'Passwords do not match'
        return ''
      },
      agreeTerms: (value) => {
        if (!value) return 'You must agree to the terms and conditions'
        return ''
      }
    }

    // Computed
    const isFormValid = computed(() => {
      return Object.keys(rules).every(field => {
        return !rules[field](form[field])
      })
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

    const toggleConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value
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
        const result = await store.dispatch('auth/register', {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          password: form.password,
          newsletter: form.newsletter
        })

        if (result.success) {
          emit('success', result.user)
        } else {
          error.value = result.error || 'Registration failed'
        }
      } catch (err) {
        error.value = 'An error occurred. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const socialRegister = (provider) => {
      console.log(`Social register with ${provider}`)
      // Implement social registration
    }

    return {
      form,
      errors,
      loading,
      error,
      showPassword,
      showConfirmPassword,
      passwordStrength,
      isFormValid,
      validateField,
      clearFieldError,
      clearError,
      togglePassword,
      toggleConfirmPassword,
      handleSubmit,
      socialRegister
    }
  }
}
</script>

<style scoped>
.register-form {
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

/* Social Register */
.social-register {
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

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.half {
  flex: 1;
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

.input-wrapper input,
.input-wrapper select {
  width: 100%;
  padding: 14px 40px 14px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.input-wrapper select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.input-wrapper input.error,
.input-wrapper select.error {
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

/* Password Strength */
.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s;
}

.strength-fill.weak {
  background: #DC3545;
}

.strength-fill.fair {
  background: #FFC107;
}

.strength-fill.good {
  background: #4A6FA5;
}

.strength-fill.strong {
  background: #28A745;
}

.strength-text {
  font-size: 0.8rem;
  min-width: 45px;
}

.strength-text.weak {
  color: #DC3545;
}

.strength-text.fair {
  color: #FFC107;
}

.strength-text.good {
  color: #4A6FA5;
}

.strength-text.strong {
  color: #28A745;
}

/* Field Error */
.field-error {
  color: #DC3545;
  font-size: 0.8rem;
  margin-top: 4px;
}

/* Checkbox */
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

.terms-link {
  color: #FF6B6B;
  text-decoration: none;
}

.terms-link:hover {
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

/* Login Text */
.login-text {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 0.95rem;
}

.login-link {
  background: none;
  border: none;
  color: #FF6B6B;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.login-link:hover {
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

:root.dark-mode .input-wrapper input,
:root.dark-mode .input-wrapper select {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .input-wrapper input:focus,
:root.dark-mode .input-wrapper select:focus {
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

:root.dark-mode .terms-link {
  color: #00D4FF;
}

:root.dark-mode .submit-btn {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .submit-btn:hover:not(:disabled) {
  background: #80EAFF;
}

:root.dark-mode .login-text {
  color: #B0C4DE;
}

:root.dark-mode .login-link {
  color: #00D4FF;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .form-title {
    font-size: 1.5rem;
  }
  
  .social-btn {
    font-size: 0.95rem;
  }
  
  .input-wrapper input,
  .input-wrapper select {
    padding: 12px 40px 12px 45px;
  }
  
  .password-strength {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .strength-bar {
    width: 100%;
  }
  
  .submit-btn {
    padding: 14px;
  }
}
</style>
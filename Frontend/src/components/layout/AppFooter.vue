<template>
  <footer class="app-footer">
    <!-- Newsletter Section -->
    <div class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h3>Never Miss a Mystery</h3>
            <p>Subscribe to get exclusive deals and early access to new destinations</p>
          </div>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <div class="form-group">
              <input 
                type="email" 
                v-model="newsletterEmail" 
                placeholder="Enter your email"
                required
              >
              <button type="submit" class="btn btn-primary" :disabled="subscribing">
                <span v-if="subscribing" class="spinner-small"></span>
                <span v-else>Subscribe</span>
              </button>
            </div>
            <p class="form-note" v-if="newsletterMessage">{{ newsletterMessage }}</p>
          </form>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Company Info -->
          <div class="footer-col">
            <div class="footer-logo">
              <span class="logo-icon">✈️</span>
              <span class="logo-text">So <span class="highlight">Where To</span>?</span>
            </div>
            <p class="company-description">
              Turn your wanderlust into mystery. We find the flights, you find the adventure. 
              Global destinations, one fixed price.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">📘</a>
              <a href="#" class="social-link" aria-label="Instagram">📷</a>
              <a href="#" class="social-link" aria-label="Twitter">🐦</a>
              <a href="#" class="social-link" aria-label="TikTok">🎵</a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer-col">
            <h4 class="footer-title">Quick Links</h4>
            <ul class="footer-links">
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/how-it-works">How It Works</router-link></li>
              <li><router-link to="/destinations">Destinations</router-link></li>
              <li><router-link to="/spin">Spin the Globe</router-link></li>
              <li><router-link to="/faq">FAQ</router-link></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="footer-col">
            <h4 class="footer-title">Support</h4>
            <ul class="footer-links">
              <li><router-link to="/contact">Contact Us</router-link></li>
              <li><router-link to="/help">Help Center</router-link></li>
              <li><router-link to="/terms">Terms of Service</router-link></li>
              <li><router-link to="/privacy">Privacy Policy</router-link></li>
              <li><router-link to="/cookies">Cookie Policy</router-link></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="footer-col">
            <h4 class="footer-title">Get in Touch</h4>
            <ul class="contact-info">
              <li>
                <span class="info-icon">📍</span>
                <span>123 Adventure Lane, Cape Town, 8001</span>
              </li>
              <li>
                <span class="info-icon">📞</span>
                <a href="tel:+27123456789">+27 12 345 6789</a>
              </li>
              <li>
                <span class="info-icon">✉️</span>
                <a href="mailto:hello@sowhereto.com">hello@sowhereto.com</a>
              </li>
              <li>
                <span class="info-icon">⏰</span>
                <span>Mon-Fri: 8am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <div class="container">
        <div class="bottom-bar-content">
          <p class="copyright">
            &copy; {{ currentYear }} So Where To? All rights reserved.
          </p>
          <div class="payment-methods">
            <span class="payment-icon" title="Visa">💳</span>
            <span class="payment-icon" title="Mastercard">💳</span>
            <span class="payment-icon" title="PayFast">⚡</span>
            <span class="payment-icon" title="EFT">🏦</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Top (Mobile) -->
    <button class="mobile-back-to-top" @click="scrollToTop" v-show="showMobileTop">
      ↑
    </button>
  </footer>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const newsletterEmail = ref('')
    const subscribing = ref(false)
    const newsletterMessage = ref('')
    const showMobileTop = ref(false)

    const currentYear = computed(() => new Date().getFullYear())

    const subscribeNewsletter = async () => {
      subscribing.value = true
      newsletterMessage.value = ''
      
      // Simulate API call
      setTimeout(() => {
        subscribing.value = false
        newsletterMessage.value = '✅ Thanks for subscribing! Check your email.'
        newsletterEmail.value = ''
        
        // Clear message after 5 seconds
        setTimeout(() => {
          newsletterMessage.value = ''
        }, 5000)
      }, 1500)
    }

    const handleScroll = () => {
      showMobileTop.value = window.scrollY > 300
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      newsletterEmail,
      subscribing,
      newsletterMessage,
      showMobileTop,
      currentYear,
      subscribeNewsletter,
      scrollToTop
    }
  }
}
</script>

<style scoped>
.app-footer {
  background: #1a1a1a;
  color: #ffffff;
  margin-top: auto;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Newsletter Section */
.newsletter-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  padding: 60px 0;
}

.newsletter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.newsletter-text h3 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 10px;
}

.newsletter-text p {
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
}

.newsletter-form {
  flex: 1;
  max-width: 500px;
}

.form-group {
  display: flex;
  gap: 10px;
}

.newsletter-form input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  background: white;
}

.newsletter-form input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
}

.newsletter-form .btn {
  padding: 15px 30px;
  background: var(--text-dark);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.newsletter-form .btn:hover:not(:disabled) {
  background: black;
  transform: translateY(-2px);
}

.newsletter-form .btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-note {
  margin-top: 10px;
  color: white;
  font-size: 0.9rem;
}

.spinner-small {
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

/* Main Footer */
.main-footer {
  padding: 60px 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
}

/* Footer Logo */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.footer-logo .logo-icon {
  font-size: 2.2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.footer-logo .logo-text {
  color: white;
}

.footer-logo .highlight {
  color: var(--primary);
}

.company-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 0.95rem;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.social-link:hover {
  background: var(--primary);
  transform: translateY(-3px);
}

/* Footer Titles */
.footer-title {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--primary);
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #b0b0b0;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--primary);
  transform: translateX(5px);
}

/* Contact Info */
.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  color: #b0b0b0;
}

.info-icon {
  color: var(--primary);
  font-size: 1.1rem;
  min-width: 24px;
}

.contact-info a {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-info a:hover {
  color: var(--primary);
}

/* Bottom Bar */
.bottom-bar {
  background: #111111;
  padding: 20px 0;
  border-top: 1px solid #333;
}

.bottom-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #888;
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  gap: 15px;
}

.payment-icon {
  font-size: 1.5rem;
  opacity: 0.7;
  transition: opacity 0.3s;
  cursor: help;
}

.payment-icon:hover {
  opacity: 1;
}

/* Mobile Back to Top */
.mobile-back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  z-index: 99;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 968px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .newsletter-content {
    flex-direction: column;
    text-align: center;
  }
  
  .newsletter-form {
    width: 100%;
  }
  
  .form-group {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .newsletter-section {
    padding: 40px 0;
  }
  
  .newsletter-text h3 {
    font-size: 1.5rem;
  }
  
  .main-footer {
    padding: 40px 0;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-col:first-child {
    text-align: center;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links {
    text-align: center;
  }
  
  .footer-links a:hover {
    transform: translateX(0) scale(1.05);
  }
  
  .contact-info li {
    justify-content: center;
  }
  
  .bottom-bar-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .mobile-back-to-top {
    display: flex;
  }
}

@media (max-width: 480px) {
  .form-group {
    flex-direction: column;
  }
  
  .newsletter-form .btn {
    width: 100%;
  }
  
  .payment-methods {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
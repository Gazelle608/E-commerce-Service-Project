<template>
  <div class="how-it-works">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <h1 class="page-title">How It <span>Works</span></h1>
        <p class="page-subtitle">Your journey to mystery travel in three simple steps</p>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="steps-section">
      <div class="container">
        <div class="steps-grid">
          <!-- Step 1 -->
          <div class="step-card" data-aos="fade-up">
            <div class="step-number">1</div>
            <div class="step-icon">🌍</div>
            <h3 class="step-title">Spin the Globe</h3>
            <p class="step-description">
              Click the globe and let fate decide. Our algorithm randomly selects a destination 
              based on your preferences and blacklist. No peeking!
            </p>
            <div class="step-features">
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>50+ destinations worldwide</span>
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>Set your blacklist</span>
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>7 minutes to decide</span>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="step-card" data-aos="fade-up" data-aos-delay="200">
            <div class="step-number">2</div>
            <div class="step-icon">💰</div>
            <h3 class="step-title">Book & Pay</h3>
            <p class="step-description">
              One fixed price includes everything: return flights and accommodation. 
              No hidden fees, no surprises.
            </p>
            <div class="step-features">
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>All-inclusive pricing</span>
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>Secure payments</span>
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>From R799 only</span>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="step-card" data-aos="fade-up" data-aos-delay="400">
            <div class="step-number">3</div>
            <div class="step-icon">🎁</div>
            <h3 class="step-title">Reveal & Go</h3>
            <p class="step-description">
              Your destination is revealed 48 hours before departure. Start packing 
              for your mystery adventure!
            </p>
            <div class="step-features">
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>48-hour reveal</span>
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>Download itinerary</span>
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span>
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Explanation Section -->
    <section class="video-section">
      <div class="container">
        <div class="video-content">
          <h2 class="section-title">See It in <span>Action</span></h2>
          <div class="video-wrapper">
            <div class="video-placeholder">
              <div class="play-button">
                <span class="play-icon">▶</span>
              </div>
              <p class="video-caption">Watch how it works (2:30 min)</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose <span>Mystery Travel?</span></h2>
        
        <div class="features-grid">
          <div class="feature-card" data-aos="fade-up">
            <div class="feature-card-icon">💸</div>
            <h4>Save Big</h4>
            <p>Get flights and accommodation at up to 70% off retail prices through our bulk partnerships.</p>
          </div>

          <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
            <div class="feature-card-icon">🎲</div>
            <h4>Embrace Spontaneity</h4>
            <p>Break out of your travel rut. Let us surprise you with destinations you'd never consider.</p>
          </div>

          <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div class="feature-card-icon">🛡️</div>
            <h4>Safe & Secure</h4>
            <p>All bookings are fully protected. Cancel up to 14 days before departure.</p>
          </div>

          <div class="feature-card" data-aos="fade-up" data-aos-delay="300">
            <div class="feature-card-icon">🌏</div>
            <h4>Global Destinations</h4>
            <p>From Tokyo to Cape Town, Paris to Bangkok - the world is your mystery box.</p>
          </div>

          <div class="feature-card" data-aos="fade-up" data-aos-delay="400">
            <div class="feature-card-icon">📱</div>
            <h4>Easy Management</h4>
            <p>Manage all your bookings, view itineraries, and get updates on the go.</p>
          </div>

          <div class="feature-card" data-aos="fade-up" data-aos-delay="500">
            <div class="feature-card-icon">🎯</div>
            <h4>Blacklist Control</h4>
            <p>Tell us where you don't want to go. We'll never send you there.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Preview Section -->
    <section class="faq-preview">
      <div class="container">
        <h2 class="section-title">Frequently Asked <span>Questions</span></h2>
        
        <div class="faq-grid">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <button class="faq-question" @click="toggleFaq(index)">
              <span>{{ faq.question }}</span>
              <span class="faq-icon">{{ openFaqs.includes(index) ? '−' : '+' }}</span>
            </button>
            <transition name="faq">
              <div v-show="openFaqs.includes(index)" class="faq-answer">
                {{ faq.answer }}
              </div>
            </transition>
          </div>
        </div>

        <div class="faq-more">
          <p>Have more questions?</p>
          <router-link to="/contact" class="btn btn-outline">
            Contact Us
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">10,000+</span>
            <span class="stat-label">Happy Travelers</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Destinations</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">4.8/5</span>
            <span class="stat-label">Rating</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Support</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to start your mystery adventure?</h2>
          <p>Join thousands of travelers who've discovered the thrill of not knowing where they're going.</p>
          <div class="cta-buttons">
            <router-link to="/spin" class="btn btn-primary btn-large">
              <span class="btn-icon">🎲</span>
              Spin the Globe
            </router-link>
            <router-link to="/register" class="btn btn-outline-light btn-large">
              <span class="btn-icon">✈️</span>
              Create Account
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HowItWorksView',
  setup() {
    const openFaqs = ref([])
    
    const faqs = [
      {
        question: 'How does the mystery destination work?',
        answer: 'When you book a mystery bundle, we don\'t tell you the destination immediately. Your destination is revealed 48 hours before departure. This adds an element of surprise and adventure to your travel experience!'
      },
      {
        question: 'What\'s included in the price?',
        answer: 'Our mystery bundles include return flights and accommodation. Some bundles may include additional perks like breakfast or airport transfers - check the specific bundle details. There are no hidden fees!'
      },
      {
        question: 'Can I choose where I don\'t want to go?',
        answer: 'Absolutely! You can set a blacklist of destinations you want to avoid. We\'ll make sure you never get sent there. This is set up in your profile.'
      },
      {
        question: 'What if I need to cancel?',
        answer: 'You can cancel up to 14 days before departure for a full refund. Cancellations within 14 days are subject to our cancellation policy. All terms are clearly shown before booking.'
      },
      {
        question: 'Are the flights direct?',
        answer: 'Flight routes vary by destination and availability. Some may be direct, others may have connections. You\'ll see the full itinerary at the time of offer.'
      },
      {
        question: 'What kind of accommodation can I expect?',
        answer: 'We partner with quality hostels and budget hotels that meet our standards. All accommodations are clean, safe, and well-located. Specific details are revealed with your destination.'
      }
    ]
    
    const toggleFaq = (index) => {
      if (openFaqs.value.includes(index)) {
        openFaqs.value = openFaqs.value.filter(i => i !== index)
      } else {
        openFaqs.value.push(index)
      }
    }
    
    return {
      faqs,
      openFaqs,
      toggleFaq
    }
  }
}
</script>

<style scoped>
.how-it-works {
  width: 100%;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
              url('/images/how-it-works-hero.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 120px 20px;
  text-align: center;
  position: relative;
}

.page-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 800;
  animation: fadeInDown 1s ease-out;
}

.page-title span {
  color: #FF6B6B;
  position: relative;
  display: inline-block;
}

.page-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 10px;
  background: rgba(255, 107, 107, 0.3);
  z-index: -1;
}

.page-subtitle {
  font-size: 1.3rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out 0.2s both;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Steps Section */
.steps-section {
  padding: 80px 0;
  background: white;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.step-card {
  background: #f9f9f9;
  padding: 40px 30px;
  border-radius: 20px;
  position: relative;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 107, 107, 0.15);
  border-color: #FF6B6B;
}

.step-number {
  position: absolute;
  top: -20px;
  left: 30px;
  width: 50px;
  height: 50px;
  background: #FF6B6B;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.step-icon {
  font-size: 4rem;
  margin: 20px 0;
  text-align: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.step-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.step-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
  text-align: center;
}

.step-features {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #555;
}

.feature:last-child {
  margin-bottom: 0;
}

.feature-icon {
  color: #28A745;
  font-weight: 700;
  font-size: 1.2rem;
}

/* Video Section */
.video-section {
  padding: 80px 0;
  background: #f5f5f5;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
}

.section-title span {
  color: #FF6B6B;
  position: relative;
}

.section-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.video-wrapper {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.video-placeholder {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.video-placeholder:hover {
  transform: scale(1.02);
}

.play-button {
  width: 100px;
  height: 100px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  backdrop-filter: blur(5px);
  transition: all 0.3s;
}

.video-placeholder:hover .play-button {
  background: #FF6B6B;
  transform: scale(1.1);
}

.play-icon {
  font-size: 3rem;
  color: white;
  margin-left: 5px;
}

.video-caption {
  color: white;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Features Grid */
.features-section {
  padding: 80px 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #FF6B6B;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.1);
}

.feature-card-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h4 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* FAQ Section */
.faq-preview {
  padding: 80px 0;
  background: #f5f5f5;
}

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 10px;
  margin-bottom: 15px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.faq-question {
  width: 100%;
  padding: 20px;
  background: white;
  border: none;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.faq-question:hover {
  background: #f9f9f9;
  color: #FF6B6B;
}

.faq-icon {
  font-size: 1.5rem;
  color: #FF6B6B;
}

.faq-answer {
  padding: 0 20px 20px;
  color: #666;
  line-height: 1.6;
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

.faq-more {
  text-align: center;
  margin-top: 40px;
}

.faq-more p {
  color: #666;
  margin-bottom: 15px;
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, #05142a 0%, #162841 100%);
  padding: 60px 0;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
  color: #FF6B6B;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), 
              url('/images/cta-bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 100px 20px;
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.8rem;
  margin-bottom: 20px;
  color: white;
}

.cta-content p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #FF6B6B;
  color: white;
}

.btn-primary:hover {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
}

.btn-outline {
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
  background: transparent;
}

.btn-outline:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

.btn-outline-light {
  border: 2px solid white;
  color: white;
  background: transparent;
}

.btn-outline-light:hover {
  background: white;
  color: #FF6B6B;
  transform: translateY(-2px);
}

.btn-large {
  padding: 15px 40px;
  font-size: 1.1rem;
}

.btn-icon {
  font-size: 1.2rem;
}

/* Dark Mode Styles */
:root.dark-mode .steps-section {
  background: #0B1E33;
}

:root.dark-mode .step-card {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .step-card:hover {
  border-color: #00D4FF;
  box-shadow: 0 20px 40px rgba(0, 212, 255, 0.15);
}

:root.dark-mode .step-title {
  color: #F5F9FF;
}

:root.dark-mode .step-description {
  color: #B0C4DE;
}

:root.dark-mode .feature {
  color: #B0C4DE;
}

:root.dark-mode .step-features {
  border-top-color: #1A334D;
}

:root.dark-mode .video-section {
  background: #0B1E33;
}

:root.dark-mode .section-title {
  color: #F5F9FF;
}

:root.dark-mode .features-section {
  background: #0B1E33;
}

:root.dark-mode .feature-card {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .feature-card h4 {
  color: #F5F9FF;
}

:root.dark-mode .feature-card p {
  color: #B0C4DE;
}

:root.dark-mode .faq-preview {
  background: #0B1E33;
}

:root.dark-mode .faq-item {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .faq-question {
  background: #122B44;
  color: #F5F9FF;
}

:root.dark-mode .faq-question:hover {
  background: #1A334D;
  color: #00D4FF;
}

:root.dark-mode .faq-answer {
  color: #B0C4DE;
}

:root.dark-mode .faq-more p {
  color: #B0C4DE;
}

/* Responsive */
@media (max-width: 968px) {
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .video-placeholder {
    height: 300px;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn-large {
    width: 100%;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .step-card {
    padding: 30px 20px;
  }
  
  .step-icon {
    font-size: 3rem;
  }
  
  .step-title {
    font-size: 1.5rem;
  }
  
  .video-placeholder {
    height: 200px;
  }
  
  .play-button {
    width: 60px;
    height: 60px;
  }
  
  .play-icon {
    font-size: 2rem;
  }
}
</style>
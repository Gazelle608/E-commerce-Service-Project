<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">So <span>Where To</span>?</h1>
        <p class="hero-subtitle">The world is your mystery box</p>
        <p class="hero-description">
          Book a mystery bundle. We choose the destination. You get the adventure.
          Flights + accommodation included. Reveal after purchase.
        </p>
        <div class="hero-actions">
          <router-link to="/spin" class="btn btn-primary btn-large">
            <span class="btn-icon">🎲</span>
            Spin the Globe
          </router-link>
          <router-link to="/register" class="btn btn-outline btn-large">
            <span class="btn-icon">✈️</span>
            Start Exploring
          </router-link>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="features">
      <h2 class="section-title">How It <span>Works</span></h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>1. Spin the Globe</h3>
          <p>Tell us where you DON'T want to go. We handle the rest.</p>
          <div class="feature-badge">Step 1</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💳</div>
          <h3>2. Pay & Wait</h3>
          <p>One price. Flight + accommodation included. No hidden fees.</p>
          <div class="feature-badge">Step 2</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎁</div>
          <h3>3. Reveal</h3>
          <p>Destination revealed 48 hours before departure. Start packing!</p>
          <div class="feature-badge">Step 3</div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-number">50+</span>
          <span class="stat-label">Destinations</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">10k+</span>
          <span class="stat-label">Happy Travelers</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">R799</span>
          <span class="stat-label">Starting Price</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">24/7</span>
          <span class="stat-label">Support</span>
        </div>
      </div>
    </section>

    <!-- Destinations Preview -->
    <!-- <section class="destinations-preview">
      <h2 class="section-title">Possible <span>Destinations</span></h2>
      <div class="destination-grid">
        <div v-for="dest in destinations" :key="dest.city" class="preview-card">
          <div class="preview-image" :style="{ backgroundImage: `url(${dest.image})` }">
            <div class="preview-overlay">
              <h3>{{ dest.city }}</h3>
              <p>{{ dest.country }}</p>
              <span class="preview-price">From R{{ dest.price || '799' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Testimonials -->
    <!-- <section class="testimonials">
      <h2 class="section-title">What Travelers <span>Say</span></h2>
      <div class="testimonial-grid">
        <div class="testimonial-card">
          <div class="testimonial-rating">★★★★★</div>
          <p class="testimonial-text">"I ended up in Tokyo! Never would have chosen it myself, but it was the best trip of my life."</p>
          <div class="testimonial-author">
            <span class="author-name">Sarah K.</span>
            <span class="author-location">Cape Town</span>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-rating">★★★★★</div>
          <p class="testimonial-text">"The suspense is addictive. Already booked 3 mystery trips. So Where To? is my new addiction."</p>
          <div class="testimonial-author">
            <span class="author-name">Mike R.</span>
            <span class="author-location">Johannesburg</span>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-rating">★★★★★</div>
          <p class="testimonial-text">"Bangkok for R899? Unbelievable. The hostel was great, the flight was perfect. 10/10."</p>
          <div class="testimonial-author">
            <span class="author-name">Thando M.</span>
            <span class="author-location">Durban</span>
          </div>
        </div>
      </div>
    </section> -->

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-content">
        <h2>Ready for the unknown?</h2>
        <p>Join thousands of travelers who've discovered their next adventure with us.</p>
        <div class="cta-buttons">
          <router-link to="/register" class="btn btn-primary btn-large">
            Create Account
          </router-link>
          <router-link to="/spin" class="btn btn-outline-light btn-large">
            Try a Free Spin
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['destinations'])
  },
  data() {
    return {
      destinations: [
        { city: 'Tokyo', country: 'Japan', image: '/images/tokyo.jpg', price: '1299' },
        { city: 'Paris', country: 'France', image: '/images/paris.jpg', price: '999' },
        { city: 'New York', country: 'USA', image: '/images/nyc.jpg', price: '1199' },
        { city: 'Bangkok', country: 'Thailand', image: '/images/bangkok.jpg', price: '899' },
        { city: 'Cape Town', country: 'South Africa', image: '/images/cpt.jpg', price: '799' },
        { city: 'Sydney', country: 'Australia', image: '/images/sydney.jpg', price: '1499' }
      ]
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), 
              url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 120px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '✈️';
  position: absolute;
  bottom: -50px;
  right: -50px;
  font-size: 200px;
  opacity: 0.1;
  transform: rotate(-15deg);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4.5rem;
  margin-bottom: 20px;
  font-weight: 800;
  animation: fadeInDown 1s ease-out;
}

.hero-title span {
  color: #FF6B6B;
  position: relative;
  display: inline-block;
}

.hero-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 10px;
  background: rgba(255, 107, 107, 0.3);
  z-index: -1;
}

.hero-subtitle {
  font-size: 2rem;
  margin-bottom: 20px;
  opacity: 0.9;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 40px;
  line-height: 1.6;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  animation: fadeInUp 1s ease-out 0.6s both;
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

/* Features Section */
.features {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #F9F9F9;
}

.section-title {
  text-align: center;
  font-size: 2.8rem;
  margin-bottom: 60px;
  color: #333333;
  position: relative;
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

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  text-align: center;
  padding: 40px 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #FF6B6B 0%, #4A6FA5 100%);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.2);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.feature-card h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #333333;
}

.feature-card p {
  color: #666666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-badge {
  display: inline-block;
  padding: 5px 15px;
  background: #4A6FA5;
  color: white;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Stats Section */
.stats {
  background: linear-gradient(135deg, #4A6FA5 0%, #3A5A84 100%);
  padding: 60px 20px;
  color: white;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Destinations Preview */
.destinations-preview {
  padding: 80px 20px;
  background: white;
}

.destination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.preview-card {
  height: 280px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.preview-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s;
}

.preview-card:hover .preview-image {
  transform: scale(1.1);
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  transform: translateY(100px);
  transition: transform 0.3s;
}

.preview-card:hover .preview-overlay {
  transform: translateY(0);
}

.preview-overlay h3 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: white;
}

.preview-overlay p {
  margin-bottom: 10px;
  opacity: 0.9;
}

.preview-price {
  display: inline-block;
  padding: 5px 15px;
  background: #FF6B6B;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Testimonials */
.testimonials {
  padding: 80px 20px;
  background: #F9F9F9;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}

.testimonial-rating {
  color: #FFC107;
  font-size: 1.2rem;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.testimonial-text {
  color: #333333;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 700;
  color: #333333;
}

.author-location {
  font-size: 0.9rem;
  color: #999999;
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, #FF6B6B 0%, #9B6B9E 100%);
  padding: 100px 20px;
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: white;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
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
}

.btn-large {
  padding: 15px 40px;
  font-size: 1.1rem;
}

.btn-icon {
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .section-title {
    font-size: 2.2rem;
  }
  
  .cta h2 {
    font-size: 2.2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn-large {
    width: 100%;
  }
  
  .stat-number {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .destination-grid {
    grid-template-columns: 1fr;
  }
}
</style>
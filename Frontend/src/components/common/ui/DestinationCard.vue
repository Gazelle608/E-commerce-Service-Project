<template>
  <div class="destination-card" @click="handleClick">
    <div class="card-image" :style="{ backgroundImage: `url(${imageUrl})` }">
      <div v-if="destination.revealed" class="revealed-badge">🎉 Revealed</div>
      <div v-else class="mystery-badge">🔒 Mystery</div>
      
      <!-- Optional: Image fallback for errors -->
      <div v-if="imageError" class="image-fallback">
        <span class="fallback-icon">🌍</span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ destination.name || 'Mystery Destination' }}</h3>
      <p v-if="destination.country" class="card-country">{{ destination.country }}</p>
      
      <div class="card-info">
        <span class="info-item">
          <span class="info-icon">💰</span>
          R{{ destination.price?.toLocaleString() || '899' }}
        </span>
        <span class="info-item">
          <span class="info-icon">✈️</span>
          {{ destination.days || '3-5' }} days
        </span>
        <span v-if="destination.rating" class="info-item">
          <span class="info-icon">⭐</span>
          {{ destination.rating }}
        </span>
      </div>

      <div v-if="destination.tags" class="card-tags">
        <span v-for="tag in destination.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <button @click.stop="$emit('selected', destination)" class="card-btn">
        {{ destination.revealed ? 'View Details' : 'Explore Mystery' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DestinationCard',
  props: {
    destination: {
      type: Object,
      required: true,
      validator: (obj) => {
        return obj.hasOwnProperty('name') || obj.hasOwnProperty('image')
      }
    }
  },
  emits: ['selected', 'click'],
  setup(props, { emit }) {
    const imageError = ref(false)
    
    // Handle image URL - supports multiple formats
    const imageUrl = computed(() => {
      if (imageError.value) return null
      
      // If destination has image property
      if (props.destination.image) {
        // Check if it's a full URL or local path
        if (props.destination.image.startsWith('http')) {
          return props.destination.image
        } else {
          // For local images in public folder
          return props.destination.image.startsWith('/') 
            ? props.destination.image 
            : `/images/destinations/${props.destination.image}`
        }
      }
      
      // Default fallback image based on region or random
      return getRandomFallbackImage()
    })
    
    const getRandomFallbackImage = () => {
      const fallbacks = [
        '/images/destinations/bangkok.jpg',
        '/images/destinations/cpt.jpg',
        '/images/destinations/nyc.jpg',
        '/images/destinations/paris.jpg',
        '/images/destinations/sydeny.jpg',
        '/images/destinations/tokyo.jpg'
      ]
      const randomIndex = Math.floor(Math.random() * fallbacks.length)
      return fallbacks[randomIndex]
    }
    
    const handleClick = () => {
      emit('click', props.destination)
    }
    
    const handleImageError = () => {
      imageError.value = true
      console.warn(`Failed to load image for ${props.destination.name}`)
    }
    
    return {
      imageUrl,
      imageError,
      handleClick,
      handleImageError
    }
  }
}
</script>

<style scoped>
.destination-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-background-soft, #ffffff);
  border: 1px solid var(--color-border, #e0e0e0);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.destination-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary, #FF6B6B);
  box-shadow: 0 8px 24px rgba(255, 107, 107, 0.2);
}

/* Dark mode hover */
:root.dark-mode .destination-card:hover {
  border-color: #00D4FF;
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
}

.card-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  background-color: #f0f0f0; /* Fallback color */
}

.destination-card:hover .card-image {
  transform: scale(1.05);
}

/* Image badges */
.revealed-badge,
.mystery-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.mystery-badge {
  background: rgba(255, 100, 100, 0.9);
}

:root.dark-mode .mystery-badge {
  background: rgba(0, 212, 255, 0.9);
  color: #0B1E33;
}

.revealed-badge {
  background: rgba(100, 200, 100, 0.9);
}

/* Image fallback */
.image-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.fallback-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Card content */
.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  color: var(--color-heading, #333333);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-country {
  color: var(--color-primary, #FF6B6B);
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

:root.dark-mode .card-country {
  color: #00D4FF;
}

/* Info section */
.card-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--color-text, #666666);
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.info-icon {
  font-size: 1rem;
}

/* Tags */
.card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tag {
  background: var(--color-background, #f5f5f5);
  color: var(--color-text, #666666);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--color-border, #e0e0e0);
}

:root.dark-mode .tag {
  background: #122B44;
  color: #B0C4DE;
  border-color: #1A334D;
}

/* Button */
.card-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary, #FF6B6B);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  font-size: 0.95rem;
}

.card-btn:hover {
  background: var(--color-primary-dark, #FF5252);
  transform: scale(1.02);
}

:root.dark-mode .card-btn {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .card-btn:hover {
  background: #00B8E0;
  box-shadow: 0 0 15px #00D4FF;
}

/* Responsive */
@media (max-width: 768px) {
  .card-image {
    height: 160px;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-info {
    gap: 0.75rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .card-image {
    height: 140px;
  }
  
  .card-info {
    flex-direction: column;
    gap: 0.3rem;
  }
}
</style>
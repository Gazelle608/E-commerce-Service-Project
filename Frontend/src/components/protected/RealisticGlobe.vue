<template>
  <div class="globe-container" ref="globeContainer">
    <div v-if="!globeLoaded" class="globe-loading">
      <div class="spinner"></div>
      <p>Loading Earth...</p>
    </div>
    
    <div class="globe-controls" v-if="globeLoaded">
      <button @click="spinGlobe" class="control-btn spin-btn">
        <span>🎲</span> Random Spin
      </button>
      <button @click="resetView" class="control-btn reset-btn">
        <span>🌍</span> Reset View
      </button>
    </div>

    <!-- Location Popup -->
    <transition name="fade">
      <div v-if="selectedLocation" class="location-popup" :style="popupStyle">
        <button class="popup-close" @click="selectedLocation = null">✕</button>
        <h3>{{ selectedLocation.name }}</h3>
        <p class="location-country">{{ selectedLocation.country }}</p>
        <div class="location-details">
          <p><span>💰</span> R{{ selectedLocation.price }}</p>
          <p><span>✈️</span> {{ selectedLocation.days }} days</p>
          <p v-if="selectedLocation.rating"><span>⭐</span> {{ selectedLocation.rating }}</p>
        </div>
        <div class="location-tags">
          <span v-for="tag in selectedLocation.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <button @click="handleLocationAction" class="location-btn">
          {{ isAuthenticated ? 'Book This Mystery' : 'Sign in to Book' }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import Globe from 'globe.gl'

export default {
  name: 'RealisticGlobe',
  props: {
    interactive: {
      type: Boolean,
      default: true
    },
    onLocationSelect: {
      type: Function,
      default: null
    }
  },
  emits: ['locationSelected', 'spin'],
  setup(props, { emit }) {
    const store = useStore()
    const globeContainer = ref(null)
    const globeLoaded = ref(false)
    const globe = ref(null)
    const selectedLocation = ref(null)
    const popupPosition = ref({ x: 0, y: 0 })
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    
    // Mock destinations with coordinates
    const destinations = [
      { 
        id: 1,
        name: 'Tokyo', 
        country: 'Japan',
        lat: 35.6762, 
        lng: 139.6503,
        price: 1299,
        days: 5,
        rating: 4.8,
        tags: ['Culture', 'Food', 'Tech'],
        revealed: true
      },
      { 
        id: 2,
        name: 'Paris', 
        country: 'France',
        lat: 48.8566, 
        lng: 2.3522,
        price: 999,
        days: 4,
        rating: 4.7,
        tags: ['Romance', 'Art', 'Food'],
        revealed: true
      },
      { 
        id: 3,
        name: 'Cape Town', 
        country: 'South Africa',
        lat: -33.9249, 
        lng: 18.4241,
        price: 799,
        days: 4,
        rating: 4.9,
        tags: ['Beach', 'Mountain', 'Wine'],
        revealed: true
      },
      { 
        id: 4,
        name: 'New York', 
        country: 'USA',
        lat: 40.7128, 
        lng: -74.0060,
        price: 1199,
        days: 4,
        rating: 4.8,
        tags: ['City', 'Culture', 'Shopping'],
        revealed: true
      },
      { 
        id: 5,
        name: 'Rio', 
        country: 'Brazil',
        lat: -22.9068, 
        lng: -43.1729,
        price: 1099,
        days: 6,
        rating: 4.6,
        tags: ['Beach', 'Party', 'Nature'],
        revealed: true
      },
      { 
        id: 6,
        name: 'Sydney', 
        country: 'Australia',
        lat: -33.8688, 
        lng: 151.2093,
        price: 1499,
        days: 7,
        rating: 4.8,
        tags: ['Beach', 'Opera', 'Wildlife'],
        revealed: true
      },
      // Mystery locations (no details until revealed)
      { 
        id: 7,
        name: 'Mystery Asia', 
        lat: 20.0, 
        lng: 100.0,
        price: 899,
        days: 5,
        tags: ['Mystery', 'Adventure'],
        revealed: false
      },
      { 
        id: 8,
        name: 'Mystery Europe', 
        lat: 50.0, 
        lng: 10.0,
        price: 849,
        days: 5,
        tags: ['Mystery', 'History'],
        revealed: false
      }
    ]

    onMounted(() => {
      if (!globeContainer.value) return
      
      // Initialize globe
      globe.value = Globe()(globeContainer.value)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .width(globeContainer.value.clientWidth)
        .height(600)
        .showAtmosphere(true)
        .atmosphereColor('#00D4FF')
        .atmosphereAltitude(0.25)
        .showGraticules(true)
        .showGlobe(true)
        .showGraticules(true)
        .pointOfView({ lat: 20, lng: 0, altitude: 2.5 })
        
      // Add location markers
      const markers = destinations.map(dest => ({
        ...dest,
        color: dest.revealed ? '#FF6B6B' : '#00D4FF',
        size: dest.revealed ? 1.5 : 1.0
      }))
      
      globe.value
        .pointsData(markers)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor('color')
        .pointRadius('size')
        .pointResolution(20)
        .pointAltitude(0.01)
        .pointLabel(d => d.name)
        
      // Add hover interaction
      globe.value.onPointHover((point) => {
        globeContainer.value.style.cursor = point ? 'pointer' : 'default'
      })
      
      // Add click interaction
      globe.value.onPointClick((point, event) => {
        if (!point) return
        
        selectedLocation.value = point
        
        // Calculate popup position
        const rect = globeContainer.value.getBoundingClientRect()
        popupPosition.value = {
          left: event.clientX - rect.left + 20,
          top: event.clientY - rect.top - 100
        }
        
        emit('locationSelected', point)
      })
      
      globeLoaded.value = true
    })

    onUnmounted(() => {
      if (globe.value) {
        globe.value._destructor()
      }
    })

    const spinGlobe = () => {
      const randomLat = (Math.random() - 0.5) * 180
      const randomLng = (Math.random() - 0.5) * 360
      
      globe.value.pointOfView({ 
        lat: randomLat, 
        lng: randomLng, 
        altitude: 2,
        transitionDuration: 2000 
      })
      
      emit('spin')
    }

    const resetView = () => {
      globe.value.pointOfView({ 
        lat: 20, 
        lng: 0, 
        altitude: 2.5,
        transitionDuration: 1500 
      })
    }

    const handleLocationAction = () => {
      if (isAuthenticated.value) {
        // Book the mystery
        if (selectedLocation.value.revealed) {
          // Navigate to destination details
          console.log('View destination:', selectedLocation.value)
        } else {
          // Add to cart or spin for mystery
          console.log('Book mystery:', selectedLocation.value)
        }
      } else {
        // Redirect to login
        window.location.href = '/login?redirect=' + encodeURIComponent('/spin')
      }
    }

    const popupStyle = computed(() => ({
      left: popupPosition.value.left + 'px',
      top: popupPosition.value.top + 'px',
      maxWidth: '300px'
    }))

    return {
      globeContainer,
      globeLoaded,
      selectedLocation,
      popupPosition,
      popupStyle,
      isAuthenticated,
      spinGlobe,
      resetView,
      handleLocationAction
    }
  }
}
</script>

<style scoped>
.globe-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #0a0a1a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.globe-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a1a;
  color: white;
  z-index: 10;
}

.globe-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 20;
}

.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
}

.spin-btn {
  background: rgba(255, 107, 107, 0.9);
  color: white;
}

.spin-btn:hover {
  background: #FF6B6B;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.reset-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Location Popup */
.location-popup {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 30;
  animation: fadeIn 0.3s ease;
  border: 1px solid #e0e0e0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.popup-close:hover {
  background: #f0f0f0;
  color: #333;
}

.location-popup h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 5px;
  padding-right: 20px;
}

.location-country {
  color: #FF6B6B;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.location-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.location-details p {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 0.9rem;
}

.location-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.location-btn {
  width: 100%;
  padding: 12px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.location-btn:hover {
  background: #FF5252;
  transform: scale(1.02);
}

/* Dark mode */
:root.dark-mode .location-popup {
  background: #0B1E33;
  border-color: #00D4FF;
}

:root.dark-mode .location-popup h3 {
  color: #F5F9FF;
}

:root.dark-mode .location-country {
  color: #00D4FF;
}

:root.dark-mode .location-details p {
  color: #B0C4DE;
}

:root.dark-mode .tag {
  background: #122B44;
  color: #B0C4DE;
  border: 1px solid #1A334D;
}

:root.dark-mode .popup-close:hover {
  background: #1A334D;
  color: #F5F9FF;
}

/* Responsive */
@media (max-width: 768px) {
  .globe-container {
    height: 400px;
  }
  
  .globe-controls {
    top: 10px;
    right: 10px;
    flex-direction: column;
  }
  
  .location-popup {
    max-width: 250px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .globe-container {
    height: 350px;
  }
  
  .location-popup {
    left: 50% !important;
    transform: translateX(-50%);
    max-width: 90%;
  }
}
</style>
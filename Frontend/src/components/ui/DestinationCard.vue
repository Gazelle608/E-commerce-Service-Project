<template>
  <div class="destination-card">
    <div class="card-image" :style="{ backgroundImage: `url(${destination.image})` }">
      <div v-if="destination.revealed" class="revealed-badge">🎉 Revealed</div>
      <div v-else class="mystery-badge">🔒 Mystery</div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ destination.name || 'Mystery Destination' }}</h3>
      <p v-if="destination.country" class="card-country">{{ destination.country }}</p>
      <div class="card-info">
        <span class="info-item">💰 R{{ destination.price }}</span>
        <span class="info-item">✈️ {{ destination.days }} days</span>
      </div>
      <button @click="$emit('selected')" class="card-btn">View Details</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DestinationCard',
  props: {
    destination: {
      type: Object,
      required: true
    }
  },
  emits: ['selected']
}
</script>

<style scoped>
.destination-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
}

.destination-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
}

.card-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

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
}

.mystery-badge {
  background: rgba(255, 100, 100, 0.8);
}

.revealed-badge {
  background: rgba(100, 200, 100, 0.8);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.card-country {
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.card-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background: var(--color-primary-dark);
  transform: scale(1.02);
}
</style>
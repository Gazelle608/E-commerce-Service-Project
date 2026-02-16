<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p v-if="message" class="spinner-message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: 'Loading...'
    },
    size: {
      type: String,
      default: 'medium' // small, medium, large
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 212, 255, 0.2);
  border-right-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-message {
  color: var(--color-text);
  font-size: 1rem;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
<template>
  <button 
    class="spin-button" 
    :class="{ loading: isLoading, disabled: isDisabled }"
    @click="handleClick"
    :disabled="isDisabled || isLoading"
  >
    <span v-if="!isLoading" class="button-content">
      <span class="button-icon">🎲</span>
      <span class="button-text">{{ label }}</span>
    </span>
    <span v-else class="loading-content">
      <span class="spinner"></span>
      Spinning...
    </span>
  </button>
</template>

<script>
export default {
  name: 'SpinButton',
  props: {
    label: {
      type: String,
      default: 'Spin the Globe'
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      if (!this.isLoading && !this.isDisabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style scoped>
.spin-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-background);
  background: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.spin-button:hover:not(.disabled):not(.loading) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.3);
}

.spin-button:active:not(.disabled):not(.loading) {
  transform: scale(0.98);
}

.spin-button.loading,
.spin-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-content,
.loading-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.button-icon {
  font-size: 1.2rem;
}

.loading-content {
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-right-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
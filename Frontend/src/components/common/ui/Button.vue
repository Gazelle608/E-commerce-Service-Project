<template>
  <div class="countdown-timer">
    <div class="timer-display">
      <div class="timer-unit">
        <span class="timer-value">{{ padZero(days) }}</span>
        <span class="timer-label">Days</span>
      </div>
      <span class="timer-separator">:</span>
      <div class="timer-unit">
        <span class="timer-value">{{ padZero(hours) }}</span>
        <span class="timer-label">Hours</span>
      </div>
      <span class="timer-separator">:</span>
      <div class="timer-unit">
        <span class="timer-value">{{ padZero(minutes) }}</span>
        <span class="timer-label">Minutes</span>
      </div>
      <span class="timer-separator">:</span>
      <div class="timer-unit">
        <span class="timer-value">{{ padZero(seconds) }}</span>
        <span class="timer-label">Seconds</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountdownTimer',
  props: {
    targetDate: {
      type: [Date, String],
      required: true
    }
  },
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },
  mounted() {
    this.updateCountdown()
    this.interval = setInterval(this.updateCountdown, 1000)
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    updateCountdown() {
      const target = new Date(this.targetDate).getTime()
      const now = new Date().getTime()
      const diff = target - now

      if (diff <= 0) {
        this.days = 0
        this.hours = 0
        this.minutes = 0
        this.seconds = 0
        this.$emit('expired')
        clearInterval(this.interval)
        return
      }

      this.days = Math.floor(diff / (1000 * 60 * 60 * 24))
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000)
    },
    padZero(num) {
      return String(num).padStart(2, '0')
    }
  }
}
</script>

<style scoped>
.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  color: var(--color-primary);
  font-weight: bold;
}

.timer-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 5rem;
}

.timer-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
}

.timer-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.timer-separator {
  color: var(--color-primary);
  margin: 0 0.5rem;
}

@media (max-width: 768px) {
  .timer-display {
    font-size: 1.5rem;
    gap: 0.5rem;
  }

  .timer-value {
    font-size: 1.75rem;
  }

  .timer-unit {
    min-width: 3.5rem;
  }

  .timer-label {
    font-size: 0.6rem;
  }
}
</style>
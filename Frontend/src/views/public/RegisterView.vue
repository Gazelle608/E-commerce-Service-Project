<template>
  <div class="register-view">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/forms/LoginForm.vue'

export default {
  name: 'RegisterView',
  components: {
    LoginForm
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  width: 100%;
  padding: 0;
}
</style>
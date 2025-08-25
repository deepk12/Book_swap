<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="name" placeholder="Name" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return { name: '', email: '', password: '' };
  },
  methods: {
    async register() {
      try {
        await api.post('/register', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        alert('Registration successful! Please login.');
        this.$router.push('/login');
      } catch (err) {
        alert(err.response?.data?.error || 'Registration failed');
      }
    }
  }
}
</script>

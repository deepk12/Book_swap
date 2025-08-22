<template>
  <div class="auth-container">
    <form @submit.prevent="handleLogin" class="auth-form">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="switch-form">
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      // Reset error message on new submission
      this.errorMessage = '';
      try {
        // Send login request to the backend
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password,
        });

        console.log('Login successful:', response.data);

        // --- CRITICAL STEP ---
        // Store the token to keep the user authenticated
        localStorage.setItem('token', response.data.token);

        // Redirect to the homepage after successful login
        this.$router.push('/');

      } catch (error) {
        // Log the detailed error for debugging
        console.error('Login error:', error.response);

        // Display a user-friendly error message from the backend response
        this.errorMessage = error.response?.data?.error || 'Invalid credentials or server error.';
      }
    },
  },
};
</script>

<style scoped>
/* Import the shared styles for the form */
@import '@/assets/auth-form.css';
</style>
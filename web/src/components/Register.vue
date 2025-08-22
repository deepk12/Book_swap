<template>
  <div class="auth-container">
    <form @submit.prevent="handleRegister" class="auth-form">
      <h2>Register</h2>
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Register</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="switch-form">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleRegister() {
      // Reset error message on new submission
      this.errorMessage = '';
      try {
        // Send registration request to the backend
        const response = await axios.post('http://localhost:3000/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        console.log('Registration successful:', response.data);

        // --- CRITICAL STEP ---
        // Redirect to the login page after successful registration
        this.$router.push('/login');

      } catch (error) {
        // Log the detailed error for debugging
        console.error('Registration error:', error.response);

        // Display a user-friendly error message from the backend response
        this.errorMessage = error.response?.data?.error || 'An error occurred during registration.';
      }
    },
  },
};
</script>

<style scoped>
/* Import the shared styles for the form */
@import '@/assets/auth-form.css';
</style>
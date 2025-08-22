<template>
  <div class="home-container">
    <h1>Welcome!</h1>
    <p>You have successfully logged in.</p>
    <pre v-if="profileData">{{ profileData }}</pre>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      profileData: null,
    };
  },
  methods: {
    logout() {
      // Remove the token from localStorage
      localStorage.removeItem('token');
      // Redirect to the login page
      this.$router.push('/login');
    },
    async fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // If no token, redirect to login
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            // Include the JWT token in the Authorization header
            'Authorization': `Bearer ${token}`
          }
        });
        this.profileData = response.data;
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // If token is invalid/expired, log out the user
        this.logout();
      }
    }
  },
  mounted() {
    this.fetchProfile();
  }
};
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}
</style>
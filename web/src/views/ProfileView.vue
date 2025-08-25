<template>
  <div>
    <h2>My Profile</h2>
    <p>Name: {{ profile.name }}</p>
    <p>Email: {{ profile.email }}</p>
    <p>Joined: {{ profile.createdAt }}</p>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return { profile: {} };
  },
  async created() {
    try {
      const res = await api.get('/profile');
      this.profile = res.data;
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  }
};
</script>

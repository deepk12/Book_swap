<template>
  <div>
    <h2>My Swap Requests</h2>
    <div v-for="req in requests" :key="req.id">
      <p>Book: {{ req.book.title }}</p>
      <p>Status: {{ req.status }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return { requests: [] };
  },
  async created() {
    try {
      const res = await api.get('/requests');
      this.requests = res.data;
    } catch (err) {
      console.error('Failed to fetch requests', err);
    }
  }
};
</script>

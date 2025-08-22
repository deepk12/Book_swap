<!-- RequestsView.vue -->
<template>
  <div>
    <h2>Incoming Requests</h2>
    <!-- Loop through incomingRequests -->
    <div v-for="req in incomingRequests" :key="req.id">
        <p>{{ req.requester.name }} wants to swap for your book: {{ req.book.title }}</p>
        <button @click="respondToRequest(req.id, 'ACCEPTED')">Accept</button>
        <button @click="respondToRequest(req.id, 'REJECTED')">Reject</button>
    </div>

    <h2>Outgoing Requests</h2>
    <!-- Loop through outgoingRequests -->
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      incomingRequests: [],
      outgoingRequests: [],
    };
  },
  async created() {
    const incomingRes = await api.get('/requests/incoming');
    this.incomingRequests = incomingRes.data;
    // const outgoingRes = await api.get('/requests/outgoing');
    // this.outgoingRequests = outgoingRes.data;
  },
  methods: {
      async respondToRequest(requestId, status) {
          // Assumes backend route like POST /api/requests/:id/respond
          await api.post(`/requests/${requestId}/respond`, { status });
          // Refresh list after responding
          const index = this.incomingRequests.findIndex(r => r.id === requestId);
          if (index > -1) this.incomingRequests.splice(index, 1);
      }
  }
};
</script>
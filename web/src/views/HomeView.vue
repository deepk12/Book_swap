<template>
  <div>
    <h2>Available Books for Swap</h2>
    <div class="book-list">
      <div v-for="book in books" :key="book.id" class="book-card">
        <h3>{{ book.title }}</h3>
        <p>by {{ book.author }}</p>
        <p>Owner: {{ book.owner.name }}</p>
        <button @click="requestBook(book.id)">Request Swap</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return { books: [] };
  },
  async created() {
    try {
      const response = await api.get('/books');
      this.books = response.data;
    } catch (error) {
      console.error('Failed to fetch books', error);
    }
  },
  methods: {
    async requestBook(bookId) {
        try {
            await api.post('/requests', { bookId });
            alert('Swap request sent!');
        } catch (error) {
            alert(error.response.data.error || 'Failed to send request.');
        }
    }
  }
};
</script>

<style scoped>
/* Add styles for book-list and book-card */
</style>
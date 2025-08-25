<template>
  <div>
    <h2>Available Books for Swap</h2>
    <table class="book-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Owner</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.owner.name }}</td>
          <td>
            <button @click="requestBook(book.id)">Request Swap</button>
          </td>
        </tr>
      </tbody>
    </table>
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
      const response = await api.get('/get-books');
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
        alert(error.response?.data?.error || 'Failed to send request.');
      }
    }
  }
};
</script>

<style scoped>
.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.book-table th,
.book-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.book-table th {
  background-color: #f5f5f5;
}

button {
  padding: 6px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #2f9e6e;
}
</style>

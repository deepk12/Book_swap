<!-- MyBooksView.vue -->
<template>
  <div>
    <h2>My Books</h2>
    <button @click="showAddForm = true">Add New Book</button>
    <!-- Show BookForm as a modal or inline -->
    <BookForm v-if="showAddForm" @submit="addBook" @cancel="showAddForm = false" />
    
    <div class="book-list">
      <div v-for="book in myBooks" :key="book.id" class="book-card">
        <h3>{{ book.title }}</h3>
        <p>by {{ book.author }}</p>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import BookForm from '@/components/BookForm.vue';

export default {
  components: { BookForm },
  data() { /* myBooks, showAddForm */ },
  async created() {
    // Assumes backend has a route like GET /api/me/books
    const response = await api.get('/me/books'); 
    this.myBooks = response.data;
  },
  methods: {
    async addBook(bookData) {
      const response = await api.post('/books', bookData);
      this.myBooks.push(response.data);
      this.showAddForm = false;
    }
    // ... add methods for edit and delete
  }
};
</script>
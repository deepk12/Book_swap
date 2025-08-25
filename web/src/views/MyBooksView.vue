<!-- MyBooksView.vue -->
<template>
  <div>
    <h2>My Books</h2>
    <button @click="showForm = true">Add New Book</button>

    <!-- BookForm: used for both Add & Edit -->
    <BookForm 
      v-if="showForm" 
      :book="selectedBook" 
      @submit="saveBook" 
      @cancel="closeForm" 
    />

    <table class="book-table" v-if="myBooks.length">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Condition</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in myBooks" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.condition }}</td>
          <td>
            <button @click="editBook(book)">Edit</button>
            <button @click="deleteBook(book.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No books found. Add one!</p>
  </div>
</template>

<script>
import api from '@/services/api';
import BookForm from '@/components/BookForm.vue';

export default {
  components: { BookForm },
  data() {
    return {
      myBooks: [],
      showForm: false,
      selectedBook: null, // for editing
      isLoading: false,
      error: null
    };
  },
  async created() {
    await this.loadBooks();
  },
  methods: {
    async loadBooks() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.get('/get-books');
        this.myBooks = response.data;
      } catch (err) {
        console.error('Failed to load books:', err);
        this.error = 'Failed to load books. Please try again.';
        if (err.response && err.response.status === 403) {
          this.error = 'Authentication failed. Please log in again.';
        }
      } finally {
        this.isLoading = false;
      }
    },

    async saveBook(bookData) {
      this.error = null;
      try {
        if (this.selectedBook) {
          // Update existing book
          const response = await api.post(
  `/update/${this.selectedBook.id}`, 
  bookData,
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  }
);
await this.loadBooks();

          const index = this.myBooks.findIndex(b => b.id === this.selectedBook.id);
          this.myBooks.splice(index, 1, response.data); // reactive update
        } else {
          // Add new book
          const response = await api.post('/add-books', bookData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          this.myBooks = [...this.myBooks, response.data];
        }
        this.closeForm();
      } catch (err) {
        console.error('Failed to save book:', err);
        if (err.response && err.response.status === 403) {
          this.error = 'Authentication failed. Please log in again.';
        } else {
          this.error = 'Failed to save book. Please try again.';
        }
      }
    },

    async deleteBook(bookId) {
      if (!confirm('Are you sure you want to delete this book?')) return;

      try {
        await api.delete(`/delete-book/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        this.myBooks = this.myBooks.filter(book => book.id !== bookId);
      } catch (err) {
        console.error('Failed to delete book:', err);
        this.error = err.response?.data?.error || 'Failed to delete book.';
      }
    },

    editBook(book) {
      this.selectedBook = { ...book }; // pass a copy to the form
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
      this.selectedBook = null;
      this.error = null;
    }
  }
};
</script>

// MyBooksView.vue
<template>
  <div>
    <h2>My Books</h2>
    <button @click="showForm = true">Add New Book</button>

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
          await api.post(
            `/update/${this.selectedBook.id}`, 
            bookData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
        } else {
          // Add new book
          await api.post('/add-books', bookData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        // After adding or updating, reload the book list from the server
        await this.loadBooks();
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
<style scoped>
/* Myntra-like Styling for MyBooksView */

/* Use a clean, modern font */
body, h2, button, table, p {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

div {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
}

/* Heading styles */
h2 {
  font-size: 28px;
  font-weight: 500;
  color: #3e4152;
  margin-bottom: 20px;
}

/* Button styles */
button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
}

button:hover {
  opacity: 0.8;
}

/* Primary button (Add New Book) */
button:first-of-type {
  background-color: #ff3f6c; /* Myntra's accent color */
  color: #fff;
  border-color: #ff3f6c;
}

/* Action buttons in the table */
td button {
  background: transparent;
  color: #3e4152;
  border: none;
  font-weight: 400;
  padding: 5px;
  text-transform: capitalize;
}

td button:hover {
  color: #ff3f6c; /* Hover effect with accent color */
  background: transparent;
}

/* Table styles */
.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  border: 1px solid #eaeaec;
}

thead tr {
  background-color: #f7f7f7;
}

th, td {
  text-align: left;
  padding: 12px 15px;
  color: #535766;
  font-size: 14px;
  border-bottom: 1px solid #eaeaec;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  color: #282c3f;
}

/* Last row does not have a bottom border */
tbody tr:last-child td {
  border-bottom: none;
}

/* Message for no books found */
p {
  color: #8c8c8c;
  font-style: italic;
  text-align: center;
  margin-top: 30px;
}

/* Basic form styling (for BookForm.vue) */
/* You would likely apply this in BookForm.vue's own style block */
.book-form-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #eaeaec;
  border-radius: 4px;
  background-color: #fafafa;
}

/* Simple error message styling */
.error-message {
  color: #ff3f6c;
  background-color: #fff0f5;
  border: 1px solid #ff3f6c;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}
</style>
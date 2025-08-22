<template>
  <form @submit.prevent="submitForm">
    <input v-model="book.title" placeholder="Title" required />
    <input v-model="book.author" placeholder="Author" required />
    <textarea v-model="book.description" placeholder="Description"></textarea>
    <button type="submit">Save Book</button>
    <button type="button" @click="$emit('cancel')">Cancel</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      book: { title: '', author: '', description: '' }
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.book);
    }
  }
}
</script>
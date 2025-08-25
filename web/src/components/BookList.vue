<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { useRouter } from "vue-router";

const books = ref([]);
const router = useRouter();

onMounted(async () => {
  const res = await api.get("/books");
  books.value = res.data;
});
</script>

<template>
  <div>
    <h2>Books</h2>
    <div v-for="book in books" :key="book.id" class="book-card" @click="router.push(`/books/${book.id}`)">
      <h3>{{ book.title }} ({{ book.condition }})</h3>
      <p>By {{ book.author }}</p>
      <img v-if="book.imageUrl" :src="book.imageUrl" width="120" />
    </div>
  </div>
</template>

<style>
.book-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 8px 0;
  cursor: pointer;
}
</style>

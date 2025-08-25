<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import { useAuthStore } from "../store/auth";

const route = useRoute();
const router = useRouter();
const book = ref(null);
const auth = useAuthStore();

onMounted(async () => {
  const res = await api.get(`/books/${route.params.id}`);
  book.value = res.data;
});

async function deleteBook() {
  if (!confirm("Are you sure?")) return;
  await api.delete(`/books/${route.params.id}`);
  router.push("/books");
}
</script>

<template>
  <div v-if="book">
    <h2>{{ book.title }}</h2>
    <p>Author: {{ book.author }}</p>
    <p>Condition: {{ book.condition }}</p>
    <img v-if="book.imageUrl" :src="book.imageUrl" width="200" />
    <p>Owner: {{ book.owner?.name || book.owner?.email }}</p>

    <!-- Show update/delete only if logged-in user is owner -->
    <div v-if="auth.user?.id === book.ownerId">
      <button @click="router.push(`/books/${book.id}/edit`)">Edit</button>
      <button @click="deleteBook">Delete</button>
    </div>
  </div>
</template>

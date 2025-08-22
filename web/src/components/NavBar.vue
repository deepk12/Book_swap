<template>
  <header>
    <h1>Book Swap</h1>
    <nav v-if="isLoggedIn">
      <router-link to="/">Home</router-link> |
      <router-link to="/my-books">My Books</router-link> |
      <router-link to="/requests">Requests</router-link> |
      <a @click="logout" href="#">Logout</a>
    </nav>
  </header>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped> /* Add header/nav styles */ </style>
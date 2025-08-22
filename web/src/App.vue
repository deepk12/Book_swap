<template>
  <div id="app">
    <!-- The NavBar component goes here, so it's always at the top -->
    <NavBar />

    <main class="main-content">
      <!-- The content of your pages (Home, Login, etc.) will be rendered here -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
// 1. Import the NavBar component
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'App',
  // 2. Register the component so you can use it in the template
  components: {
    NavBar,
  },
};
</script>

<style>
/* Global styles for your entire application */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  background-color: #f4f7f6;
  color: #2c3e50;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
}
</style>
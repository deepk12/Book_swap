import { createRouter, createWebHistory } from 'vue-router';

// --- CORRECTED IMPORTS FOR YOUR STRUCTURE ---

// Auth pages from the 'components' folder
import Login from '../components/Login.vue';         // <-- Path updated
import Register from '../components/Register.vue';   // <-- Path updated

// Main pages from the 'views' folder (these stay the same)
import HomeView from '../views/HomeView.vue';
import MyBooksView from '../views/MyBooksView.vue';
import RequestsView from '../views/RequestsView.vue';

const routes = [
  // --- UPDATED COMPONENTS ---
  { path: '/login', name: 'Login', component: Login },       // <-- Component name updated
  { path: '/register', name: 'Register', component: Register }, // <-- Component name updated

  // --- THESE ROUTES REMAIN THE SAME ---
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }, // This route requires authentication
  },
  {
    path: '/my-books',
    name: 'MyBooks',
    component: MyBooksView,
    meta: { requiresAuth: true },
  },
  {
    path: '/requests',
    name: 'Requests',
    component: RequestsView,
    meta: { requiresAuth: true },
  },
  // Redirect to login if route doesn't exist
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard (no changes needed here)
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    // If the route requires auth and the user is not logged in, redirect to login
    next('/login');
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;
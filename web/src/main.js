// src/main.js

import { createApp } from 'vue'
import App from './App.vue'

// 1. Import the router instance you created
import router from './router'

// 2. Create the Vue application instance
const app = createApp(App)

// 3. Tell the application to use the router plugin.
// This is the most important step.
app.use(router)

// 4. Mount the application to the DOM element with the id 'app'
app.mount('#app')
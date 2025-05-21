import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'; // <- vigtigt


createApp(App)
  .use(router) // <- også vigtigt
  .mount('#app');
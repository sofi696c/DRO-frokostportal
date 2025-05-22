import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import AdminView from '../views/AdminView.vue';
import BestillingView from '../views/BestillingView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/admin', name: 'Admin', component: AdminView },
  { path: '/bestilling', name: 'Bestilling', component: BestillingView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
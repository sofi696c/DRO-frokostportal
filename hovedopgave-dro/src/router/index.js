import { createRouter, createWebHistory } from 'vue-router';
import { useUser } from '../modules/useUser';

import LoginView from '../views/LoginView.vue';
import AdminView from '../views/AdminView.vue';
import BestillingView from '../views/BestillingView.vue';
import CreateCustomerView from '../views/CreateCustomerView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/admin', name: 'Admin', component: AdminView },
  { path: '/bestilling', name: 'Bestilling', component: BestillingView },
  {
    path: '/opret-kunde',
    name: 'CreateCustomer',
    component: CreateCustomerView,
    meta: { requiresAdmin: true }
  }
];

// Opret router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// router til at beskytte admin-ruter
router.beforeEach((to, from, next) => {
  const { role } = useUser();
  if (to.meta.requiresAdmin && role.value !== 'admin') {
    return next('/');
  }
  next();
});

export default router;

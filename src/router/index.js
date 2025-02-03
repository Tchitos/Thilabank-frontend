import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import DashboardPage from "@/pages/DashboardPage.vue";
import TransactionsPage from "@/pages/TransactionsPage.vue";
import TransferPage from "@/pages/TransferPage.vue";
import ProfilePage from '../pages/ProfilePage.vue';
import { apiService } from '@/services/apiService';

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/dashboard", name: "dashboard", component: DashboardPage, meta: { requiresAuth: true } },
  { path: "/transactions", name: "transactions", component: TransactionsPage, meta: { requiresAuth: true } },
  { path: "/transfer", name: "transfer", component: TransferPage, meta: { requiresAuth: true } },
  { path: "/profile", name: "profile", component: ProfilePage, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await apiService.get("/users/me");
      next();
    } catch (error) {
      console.warn("Accès non autorisé, redirection vers /");
      next({ path: "/" });
    }
  } else {
    next();
  }
});

export default router;

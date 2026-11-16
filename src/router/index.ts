import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/watchlist' },
  {
    path: '/watchlist',
    name: 'CryptoWatchlist',
    component: () => import('@/views/CryptoWatchlist.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/watchlist' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import { clearPending } from '@/utils/request';
// import HomeView from '../views/HomeView.vue'
const App = () => import('../App.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    }
  ]
});
router.beforeEach((to, from, next) => {
  // 在跳转路由之前，先清除所有的请求
  clearPending();
  // ...
  next();
});
export default router;

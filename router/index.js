import Vue from 'vue';
import VueRouter from 'vue-router';
import watchlist from '../pages/watchlist/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/watchlist',
    name: 'watchlist',
    component: watchlist,
    meta: { requiresAuth: true }
  },
];

const router = new VueRouter({
  mode: 'history',
  routes
});


export default router;

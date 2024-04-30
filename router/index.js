import Vue from 'vue';
import VueRouter from 'vue-router';
import Profile from '../pages/profile/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true } 
  },
];

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes
  });
  

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import Profile from '../pages/profile/index.vue';

Vue.use(VueRouter);

const routes = [
  // Otras rutas...
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true } // Para proteger la ruta
  },
  // Otras rutas...
];

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL, <-- Puedes comentar esta línea o eliminarla
    routes
  });
  

export default router;

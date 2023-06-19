import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import DashboardPageVue from '../views/DashboardPage.vue';
import ConfigPage from '../views/ConfigPage.vue';
import SheetsPage from '../views/SheetsPage.vue';
import LogoutPage from '../views/LogoutPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPageVue
  },
  {
    path: '/config',
    name: 'Config',
    component: ConfigPage
  },
  {
    path: '/fichas',
    name: 'Sheets',
    component: SheetsPage
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

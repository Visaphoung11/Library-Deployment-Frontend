// router/index.ts
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuth } from "../composables/useAuth";
import LoginForm from "../components/LoginForm.vue";
import SidebarLayout from "../components/SidebarLayout.vue";
import Dashboard from "../pages/Dashboard.vue";
import Books from "../pages/Books.vue";
import Students from "../pages/Students.vue";
import Borrowing from "../pages/Borrowing.vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: LoginForm,
  },
  {
    path: "/",
    component: SidebarLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "books",
        name: "Books",
        component: Books,
      },
      {
        path: "students",
        name: "Students",
        component: Students,
      },
      {
        path: "borrowing",
        name: "Borrowing",
        component: Borrowing,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated.value) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;

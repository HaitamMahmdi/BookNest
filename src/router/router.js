import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import { useUserAuth } from "../stores/userAuth";
import { getAuth } from "firebase/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/Books",
    name: "Books",
    component: () => import("../views/Books.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/Auth",
    name: "Auth",
    meta: {
      requiresAuth: false,
    },
    component: () => import("../views/Auth.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useUserAuth();

  if (!authStore.authReady) {
    await authStore.waitForAuth();
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return next("/Auth");
  }
  if (!to.meta.requiresAuth && authStore.user) {
    return next("/");
  }

  next();
});

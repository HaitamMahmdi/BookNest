import { createRouter, createWebHistory } from "vue-router";
import { useUserAuth } from "../stores/userAuth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),

    meta: {
      requiresAuth: true,
      requiresEmailVerified: true,
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
  if (to.meta.requiresEmailVerified && authStore.user) {
    const user = authStore.user;
    if (!user.emailVerified) {
      return next("/Auth");
    }
  }
  if (!to.meta.requiresAuth && authStore.user && authStore.user.emailVerified) {
    return next("/");
  }

  next();
});

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
    path: "/Profile",
    name: "Profile",
    component: () => import("../views/UserProfile.vue"),
    meta: {
      requiresAuth: true,
      requiresEmailVerified: true,
    },
  },
  {
    path: "/Book/:id",
    name: "Book",
    component: () => import("../views/BookView.vue"),
    meta: {
      requiresAuth: true,
      requiresEmailVerified: true,
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
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

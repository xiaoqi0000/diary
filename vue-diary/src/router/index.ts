import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/new",
      name: "new-diary",
      component: () => import("../views/NewDiaryView.vue"),
    },
    {
      path: "/diary/:id",
      name: "diary-detail",
      component: () => import("../views/DiaryDetailView.vue"),
      props: true,
    },
    {
      path: "/statistics",
      name: "statistics",
      component: () => import("../views/StatisticsView.vue"),
    },
  ],
});

export default router;

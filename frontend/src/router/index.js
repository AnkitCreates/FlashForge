import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import DeckDetails from "../views/DeckDetails.vue";
import Review from "../views/Review.vue";
import Profile from "../views/Profile.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/deck/:deckId", component: DeckDetails },
  // { path: "/deck/:deckId/review", component: Review },
  { path: "/profile", component: Profile },
  {
    path: "/review/:deckId",
    name: "Review",
    component: () => import("../views/Review.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = !!localStorage.getItem("token");

  if (authRequired && !loggedIn) return next("/login");
  next();
});

export default router;
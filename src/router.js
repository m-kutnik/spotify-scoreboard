import Vue from "vue"
import Router from "vue-router"
import Spotify from "@/api/spotify"
const Home = () => import("@/views/Home")
const Redirect = () => import("@/views/Redirect")
const Dashboard = () => import("@/views/Dashboard")

Vue.use(Router)

const authUser = function authUser(next) {
  const accessToken = window.localStorage.getItem("access_token")

  if (accessToken === "" || accessToken === null) next("/")
  Spotify.checkToken(accessToken)
    .then(response => {
      if (response.status !== 200) next("/")
    })
    .catch(err => {
      if (err) next("/")
    })

  Spotify.setToken(accessToken)
  next()
}

export default new Router({
  // base: "/sptf/",
  // mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        authUser(next)
      },
    },
    {
      path: "*",
      name: "Redirect",
      component: Redirect,
    },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    else return { x: 0, y: 0 }
  },
})

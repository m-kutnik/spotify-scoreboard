import Vue from "vue"
import Router from "vue-router"
import Spotify from "@/api/spotify"
import Home from "@/views/Home"
import Dashboard from "@/views/Dashboard"
import Redirect from "@/views/Redirect"

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
  mode: "history",
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
      path: "/redirect",
      name: "Redirect",
      component: Redirect,
    },
  ],
})

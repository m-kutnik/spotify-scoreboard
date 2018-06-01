<template>
  <div class="baner container">
    <h1>Spotify Scoreboard</h1>
    <h2>Scoreboard for your Spotify Collaborative playlists</h2>
    <button
      class="btn btn-login"
      @click="login">
      Login with Spotify</button>
  </div>
</template>

<script>
import config from "@/config"

export default {
  name: "Home",
  data() {
    return {}
  },
  methods: {
    login() {
      const clientID = config.clientID
      const redirectURI = config.redirectURI
      const scope = config.scope
      const state = this.generateHash()

      const url =
        `https://accounts.spotify.com/authorize?response_type=token` +
        `&client_id=${encodeURIComponent(clientID)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&redirect_uri=${encodeURIComponent(redirectURI)}` +
        `&state=${encodeURIComponent(state)}`

      window.location = url
    },
    generateHash() {
      let text = ""
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

      for (let i = 0; i < 16; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }

      return text
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 80%;
  position: absolute;
  text-align: center;
  padding: 50px;
  box-sizing: border-box;
}

h1 {
  text-transform: uppercase;
  font-size: 3rem;
}
h2 {
  font-size: 2rem;
}

.btn-login {
  margin-top: 100px;
  font-size: 24px;
}
</style>

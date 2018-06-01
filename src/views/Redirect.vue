<template>
  <div>
    <span class="msg">Wait, you are being redirected</span>
  </div>
</template>

<script>
export default {
  name: "Redirect",
  data() {
    return {}
  },
  created() {
    const params = this.getHashParams()
    localStorage.setItem("access_token", params.access_token)
    localStorage.setItem("state", params.state)
    window.location = `${window.location.origin}/dashboard`
  },
  methods: {
    getHashParams() {
      const hashParams = {}
      const r = /([^&;=]+)=?([^&;]*)/g
      const q = this.$route.hash.substring(1)
      let e

      // eslint-disable-next-line
      while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2])
      }

      return hashParams
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.msg {
  text-align: center;
}
</style>

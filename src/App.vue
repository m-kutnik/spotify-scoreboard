<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import '@/assets/global.scss'
import '@/assets/normalize.scss'

export default {
  name: 'App',
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  overflow-y: scroll;
}
</style>

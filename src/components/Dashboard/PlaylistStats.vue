<template>
  <div v-if="isActive">
    <h2>Wow, there are <u>{{ count }}</u> tracks on this playlist</h2>
  </div>
</template>

<script>
export default {
  props: {
    init: {
      type: Number,
      default() {
        return 0
      },
    },
    loader: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  computed: {
    isActive() {
      return this.loader
    },
    count() {
      return this.init
    },
  },
  created() {
    setTimeout(() => {
      this.$emit("loaded", "playlistStats")
    }, 500)
  },
}
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 50px;
  font-size: 2rem;
}
</style>

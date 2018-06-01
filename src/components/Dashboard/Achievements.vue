<template>
  <div v-if="isActive">
    <h2>Achievements</h2>
    <div class="container">
      <template v-for="(child) in componentsArray">
        <component
          :is="child"
          :key="child.name"
          :init="init"/>
      </template>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import FirstTrack from "./Achievements/FirstTrack"
import MostTracks from "./Achievements/MostTracks"

const componentsObj = {
  FirstTrack,
  MostTracks,
}

export default {
  components: {
    ...componentsObj,
  },
  props: {
    init: {
      type: Object,
      default() {
        return {}
      },
    },
    loader: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      componentsArray: _.keys(componentsObj),
    }
  },
  computed: {
    isActive() {
      return this.loader
    },
    sortedArray() {
      return this.init.sortedArray
    },
    tracks() {
      return this.init.tracksArray
    },
  },
  created() {
    setTimeout(() => {
      this.$emit("loaded", "achievements")
    }, 500)
  },
}
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 50px;
  font-size: 2rem;

  &::after {
    content: "";
    display: block;
    margin: 10px auto;
    background: #fff;
    height: 5px;
    width: 60px;
  }
}

.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  margin: 150px 0;
}
</style>

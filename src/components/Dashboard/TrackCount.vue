<template>
  <div v-if="isActive">
    <h2>Tracks Count</h2>
    <div class="container">
      <p
        v-for="(user, key) in users"
        :key="key"
        :style="fontSize(key)"
        class="item">
        {{ upFirst(user.user) }}:
        <span> {{ user.tracks.length }}</span>
      </p>
    </div>
    <!-- <div class="container">
      <ol>
        <li
          v-for="(user, key) in users"
          :key="key"
          class="item">
          {{ upperFirst(user.user) }}
        </div>
      </ol>
    </div> -->
  </div>
</template>

<script>
import upperFirst from "lodash/upperFirst"

export default {
  props: {
    init: {
      type: Array,
      default() {
        return []
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
    return {}
  },
  computed: {
    isActive() {
      return this.loader
    },
    users() {
      return this.init.slice(0, 7)
    },
  },
  created() {
    setTimeout(() => {
      this.$emit("loaded", "trackCount")
    }, 500)
  },
  methods: {
    upFirst(value) {
      return upperFirst(value)
    },
    fontSize(value) {
      return value < 6
        ? `font-size: ${50 - value * 4}px; opacity: ${1 -
            value * 0.15};margin: ${40 - value * 8}px 0px;`
        : "font-size: 30px;opacity: 0.25;margin: 0px;"
    },
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

.item {
  color: #fff;
  text-shadow: 0px 4px 6px rgba(255, 255, 255, 0.3);
}

p {
  transition: 0.2s all ease-in-out;
  transform: scale(1);
  will-change: transform;

  &:hover {
    transform: scale(1.05);
  }
}
</style>

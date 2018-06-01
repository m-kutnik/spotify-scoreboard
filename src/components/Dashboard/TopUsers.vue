<template>
  <div v-if="isActive">
    <h2>TOP USERS</h2>
    <div class="container">
      <div
        v-for="(user, key) in usersTopThree"
        :key="key"
        class="item">
        <h3>{{ roman[key] + upperFirst(user.user) }}</h3>
        <img :src="getAvatar(user)">
        <span class="reward">{{ getRewardText(key) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import Rewards from "@/api/rewards"

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
    return {
      defaultAvatar: "https://i.imgur.com/Ye3fsSH.jpg",
      roman: ["I. ", "II. ", "III. "],
    }
  },
  computed: {
    usersTopThree() {
      return this.init.slice(0, 3)
    },

    isActive() {
      return this.loader
    },
  },
  created() {
    setTimeout(() => {
      this.$emit("loaded", "topUsers")
    }, 1000)
  },
  methods: {
    upperFirst(value) {
      return _.upperFirst(value)
    },

    getAvatar(obj) {
      return obj.extra.images.length >= 1
        ? obj.extra.images[0].url
        : this.defaultAvatar
    },

    getRewardText(index) {
      return Rewards.getRewardText(index)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;

  @media screen and (max-width: 1100px) {
    flex-direction: column;
  }
}

.reward {
  display: inline-block;
  position: relative;
  padding: 15px 30px;
  margin: 15px 0 0 0;
  background: #1f1f1f;
  font-weight: bold;
  text-shadow: 0px 4px 6px rgba(255, 255, 255, 0.3);

  &::after {
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    border-bottom-color: #1f1f1f;
    border-width: 10px;
    margin-left: -10px;
  }
}

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
  width: 350px;
  text-align: center;
  margin: 20px 0;
  transition: 0.2s all ease-in-out;
  transform: scale(1);
  will-change: transform;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  img {
    height: 250px;
    width: 250px;
    box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  }

  &:nth-child(1) {
    order: 2;
    transform: scale(1.3);

    &:hover {
      transform: scale(1.4);
    }

    @media screen and (max-width: 1100px) {
      order: 0;
      margin-bottom: 50px;
    }
  }
  &:nth-child(2) {
    order: 1;
  }
  &:nth-child(3) {
    order: 3;
  }
}
</style>

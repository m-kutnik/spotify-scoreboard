<template>
  <div class="item achievement">
    <div
      :style="setStyle()"
      class="item__background">
      <img
        v-for="(image, key) in data.images"
        :key="key"
        :src="image.url"
        :style="image.style"
        class="image">
    </div>
    <div class="item__content">
      <span
        :style="rarityColor"
        class="item__rarity">
        {{ rarityName }}
      </span>
      <h3>{{ data.name }}</h3>
      <p>{{ data.description }}</p>
    </div>
    <div class="item__foot">
      <img
        :src="data.user.image"
        class="item__avatar">
      <p>{{ data.user.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    init: {
      type: Object,
      default() {
        return {
          name: "Achievement Name",
          rarity: "1",
          description: "Here is description",
          user: {
            name: "User",
            image: "https://i.imgur.com/Ye3fsSH.jpg",
          },
        }
      },
    },
  },
  data() {
    return {
      rarityColors: ["green", "blue", "purple", "Orange"],
      rarityNames: ["Normal", "Rare", "Uniqe", "Epic"],
    }
  },
  computed: {
    data() {
      return this.init
    },
    rarityColor() {
      return `color: ${this.rarityColors[this.data.rarity]}`
    },
    rarityName() {
      return this.rarityNames[this.data.rarity]
    },
  },
  methods: {
    setStyle() {
      const rand = Math.floor(Math.random() * 360) + 1
      return `background: linear-gradient(135deg,hsl(${rand}, 100%, 80%), hsl(${(rand +
        120) %
        360}, 75%, 60%));`
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  height: 450px;
  width: 300px;
  position: relative;
  margin: 0 60px;
  color: #9e9e9e;
  background: white;
  border-radius: 19px;
  box-shadow: -1px 15px 30px -12px black;
  transition: 0.2s all ease-in-out;

  &__background {
    height: 220px;
    border-top-left-radius: 19px;
    border-top-right-radius: 19px;
    position: relative;
    // background: linear-gradient(135deg,hsl(260, 100%, 75%), hsl(20, 100%, 50%));
  }

  &__content {
    padding: 25px 10px 10px;
  }

  &__rarity {
    opacity: 0.6;
  }

  &__foot {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    bottom: 3px;

    p {
      margin: 0;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.7);
      font-weight: bolder;
    }
  }

  &__avatar {
    height: 50px;
    width: 50px;
    border-radius: 500000px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: 0px 4px 6px 0px hsla(0, 0%, 0%, 0.2);
  }
}
h3 {
  color: black;
  font-weight: bold;
  font-size: 32px;
  margin: 0 0 10px;
}
.image {
  position: absolute;
  height: 300px;
}
</style>

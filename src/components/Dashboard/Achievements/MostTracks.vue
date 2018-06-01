<template>
  <achievement-component :init="initializeAchievement"/>
</template>

<script>
import AchievementComponent from "./AchievementComponent"

export default {
  components: {
    AchievementComponent,
  },
  props: {
    init: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    mostTracks() {
      return this.init.sortedArray[0]
    },
    getCount() {
      return this.mostTracks.tracks.length
    },
    getUserID() {
      return this.mostTracks.user
    },
    getUserObject() {
      return this.init.users[this.getUserID]
    },
    getAvatar() {
      return this.getUserObject.extra.images.length >= 1
        ? this.getUserObject.extra.images[0].url
        : "https://i.imgur.com/Ye3fsSH.jpg"
    },
    initializeAchievement() {
      return {
        name: "MVP!",
        rarity: "3",
        description: `Man, it's time to stop! ${this.getCount} tracks? HOW?!`,
        images: [
          {
            url: "https://i.imgur.com/wzZh1qW.png",
            style:
              "opacity: 0.2; top: -40px; left: -50px; height: 261px;transform: rotate(180deg);",
          },
          {
            url: "https://i.imgur.com/D0MLaNW.jpg",
            style:
              "border-radius: 50000px;height: 200px;width:200px;position: relative;margin: 10px;box-shadow: 0px 3px 13px 0px rgba(0, 0, 0, 0.24);",
          },
        ],
        user: {
          name: this.getUserObject.user,
          image: this.getAvatar,
        },
      }
    },
  },
}
</script>

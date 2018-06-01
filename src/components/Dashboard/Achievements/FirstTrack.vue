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
    firstTrack() {
      return this.init.tracksArray.slice(0, 1)
    },
    getUserID() {
      return this.firstTrack[0].added_by
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
        name: "First!",
        rarity: "0",
        description: "Nice, your song is the first one.",
        images: [
          {
            url: "https://i.imgur.com/wzZh1qW.png",
            style: "opacity: 0.2; top: -50px; left: -60px; height: 261px;",
          },
          {
            url: "https://i.imgur.com/51X8GWf.png",
            style: "top: -60px;left: 15px;",
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

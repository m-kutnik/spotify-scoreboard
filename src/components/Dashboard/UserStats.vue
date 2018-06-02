<template>
  <div v-if="isActive">
    <div
      v-for="(user, key) in users"
      :key="key">
      <h2>Overview: {{ upperFirst(user.user) }}</h2>
      <div class="card">
        <img
          :src="getAvatar(user)"
          class="avatar">
        <a
          :href="user.extra.external_urls.spotify"
          target="_blank"
          title="Open on Spotify">
          <img
            src="https://i.imgur.com/57bY4IR.png"
            class="link">
        </a>
        <h4>{{ upperFirst(user.user) }}</h4>
        <div class="stats">
          <ul class="info">
            <li>
              <span>Tracks</span><span class="right">{{ user.tracks.length }}</span>
            </li>
            <li>
              <span>Followers</span><span class="right">{{ user.extra.followers.total }}</span>
            </li>
            <li>
              <span>Duration</span><span class="right">{{ getTracksTime(user.tracks) }}</span>
            </li>
            <li>
              <span>Popularity</span><span class="right">{{ getMeanPopularity(user.tracks) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash"

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
    }
  },
  computed: {
    isActive() {
      return this.loader
    },
    users() {
      return this.init
    },
  },
  created() {
    setTimeout(() => {
      this.$emit("loaded", "userStats")
    }, 500)
  },
  methods: {
    getAvatar(obj) {
      return obj.extra.images.length >= 1
        ? obj.extra.images[0].url
        : this.defaultAvatar
    },

    upperFirst(value) {
      return _.upperFirst(value)
    },

    getMeanPopularity(array) {
      return _.round(_.meanBy(array, "track.popularity"))
    },

    getTracksTime(array) {
      let duration = this.getTracksDuration(array)
      const ms = duration % 1000
      duration = (duration - ms) / 1000
      const secs = duration % 60
      duration = (duration - secs) / 60
      const mins = duration % 60
      const hrs = (duration - mins) / 60
      return `${hrs}h ${mins}min ${secs}sec`
    },

    getTracksDuration(array) {
      let duration = 0
      _.forEach(array, item => {
        duration += item.track.duration
      })
      return duration
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

.card {
  position: relative;
  background: #1f1f1f;
  margin: 0 auto 150px;
  padding: 1em 0;
  border-radius: 2px;
  width: 300px;
  -webkit-box-shadow: 0px 3px 13px 0px rgba(0, 0, 0, 0.24);
  -moz-box-shadow: 0px 3px 13px 0px rgba(0, 0, 0, 0.24);
  box-shadow: 0px 3px 13px 0px rgba(0, 0, 0, 0.24);
}

span.right {
  float: right;
  color: rgba(153, 153, 153, 0.9);
  font-weight: bold;
}

.stats {
  font-weight: 300;
}

.info {
  padding: 10px 20px 0;
  margin: 0;
  text-align: left;
}

ul {
  padding-bottom: 1em;
  list-style: none;
}

ul li {
  color: rgba(153, 153, 153, 0.55);
  margin-bottom: 8px;
  padding: 5px 0 15px 0;
  border-bottom: 1px solid rgba(241, 241, 241, 0.2);
}

img.avatar {
  height: 100px;
  width: 100px;
  border-radius: 50000px;
}
img.link {
  height: 35px;
  position: absolute;
  position: absolute;
  top: 85px;
  right: 100px;
}
</style>

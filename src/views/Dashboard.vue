<template>
  <div
    :style="styleObject"
    class="background-image">
    <div class="overlay" />
    <transition name="fade">
      <div
        v-if="!activePlaylist.id"
        class="content select">
        <h1>Select your playlist:</h1>
        <div class="container">
          <div
            v-for="(item, key) in playlists"
            :key="item.id"
            class="item"
            @click="setActivePlaylistID(key)">
            <img :src="item.images[0].url">
            <h3>{{ item.name }}</h3>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="activePlaylist.id"
        class="content single">
        <span
          class="back"
          @click= "clear()">
          &larr; Select other playlist
        </span>
        <h1>{{ activePlaylist.name }}</h1>

        <!-- Playlist Stats -->
        <div class="container stats">
          <div
            v-if="!loadStatus.playlistStats"
            class="lds-roller">
            <div/><div/><div/><div/><div/><div/><div/><div/>
          </div>
          <playlist-stats
            :init="activePlaylist.total"
            :loader="loadStatus.playlistStats"
            @loaded="childLoaded"/>
        </div>

        <!-- Top Users -->
        <div class="container top">
          <div
            v-if="!loadStatus.topUsers"
            class="lds-roller">
            <div/><div/><div/><div/><div/><div/><div/><div/>
          </div>
          <top-users
            :init="sortedUsers"
            :loader="loadStatus.topUsers"
            @loaded="childLoaded"/>
        </div>

        <!-- Track Count -->
        <div
          v-if="isSortedArrayRead"
          class="container scoreboard">
          <div
            v-if="!loadStatus.trackCount"
            class="lds-roller">
            <div/><div/><div/><div/><div/><div/><div/><div/>
          </div>
          <track-count
            :init="sortedArray"
            :loader="loadStatus.trackCount"
            @loaded="childLoaded"/>
        </div>

        <!-- Users Stats -->
        <div
          v-if="isSortedArrayRead"
          class="container stats">
          <div
            v-if="!loadStatus.userStats"
            class="lds-roller">
            <div/><div/><div/><div/><div/><div/><div/><div/>
          </div>
          <user-stats 
            :init="sortedArray"
            :loader="loadStatus.userStats"
            @loaded="childLoaded"/>
        </div>

        <!-- Achievements -->
        <div
          v-if="isSortedArrayRead"
          class="achievements">
          <div
            v-if="!loadStatus.playlistStats"
            class="lds-roller">
            <div/><div/><div/><div/><div/><div/><div/><div/>
          </div>
          <achievements
            :init="{sortedArray, tracksArray, users}"
            :loader="loadStatus.playlistStats"
            @loaded="childLoaded"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from "lodash"
import Spotify from "@/api/spotify"
import TopUsers from "@/components/Dashboard/TopUsers"
import UserStats from "@/components/Dashboard/UserStats"
import TrackCount from "@/components/Dashboard/TrackCount"
import Achievements from "@/components/Dashboard/Achievements"
import PlaylistStats from "@/components/Dashboard/PlaylistStats"

_.mixin({
  log: arg => {
    // eslint-disable-next-line
    console.log(arg)
    return arg
  },
})

export default {
  name: "Dashboard",
  components: {
    TopUsers,
    UserStats,
    TrackCount,
    Achievements,
    PlaylistStats,
  },
  data() {
    return {
      me: {}, // Logged user
      playlists: {}, // User's collaborative playlists
      tracks: {}, // Selected playlist
      rawResponse: {}, // Container for API response
      activePlaylist: {
        userId: "",
      },
      users: {},
      order: {},
      tracksArray: [],
      loadStatus: {
        playlistStats: false,
        topUsers: false,
        trackCount: false,
        userStats: false,
        achievements: false,
      },
    }
  },
  computed: {
    isSortedArrayRead() {
      // Hack
      return this.loadStatus.topUsers
    },

    styleObject() {
      return {
        "--image": `url(${this.activePlaylist.image})`,
      }
    },

    sortedTracks() {
      return _.map(this.tracks, item => item.tracks)
    },

    sortedUsers() {
      const sortOrder = this.order
      const usersArray = this.users
      const sortedUsers = []

      _.forEach(sortOrder, (item, key) => {
        sortedUsers[item] = usersArray[key]
      })

      return sortedUsers
    },

    sortedArray() {
      return _.map(this.sortedUsers, (item, key) => ({
        user: item.user,
        extra: item.extra,
        tracks: this.sortedTracks[key],
      }))
    },
  },
  created() {
    this.getMe()
    this.getPlaylists()
  },
  methods: {
    getMe() {
      Spotify.me().then(response => {
        this.me = response.data
      })
    },

    getPlaylists() {
      Spotify.getPlaylists()
        .then(response => {
          this.getCollaborative(response.data)
        })
        .catch(err => {
          if (err) window.location = window.location.origin
        })
    },

    getCollaborative(playlists) {
      this.playlists = playlists.items.filter(item => item.collaborative)
    },

    getRequestCount() {
      return Math.ceil(this.activePlaylist.total / 100)
    },

    getTrackList() {
      const promiseArray = Spotify.getTrackList(
        this.activePlaylist.userId,
        this.activePlaylist.id,
        this.getRequestCount(),
      )

      Promise.all(promiseArray).then(value => {
        this.setRawResponse(value)
        this.prepareTrackList()
      })
    },

    getTracksByUser(response) {
      const tracks = response
      const result = _
        .chain(tracks)
        .groupBy("added_by")
        .map((item, user) => ({
          user,
          tracks: item,
        }))
        .orderBy(item => item.tracks.length, "desc")
        .forEach((item, key) => {
          this.getUser(item.user)
          this.$set(this.$data.order, item.user, key)
          return item
        })
        .value()
      this.$set(this.$data, "tracks", result)
    },

    getUser(id) {
      Spotify.getUserInfo(id).then(response => {
        this.setUsername(id, {
          user: response.data.display_name || response.data.id,
          extra: response.data,
        })
      })
    },

    setUsername(id, username) {
      this.$set(this.users, id, username)
    },

    setActivePlaylistID(index) {
      this.setActivePlaylist({
        id: this.playlists[index].id,
        name: this.playlists[index].name,
        total: this.playlists[index].tracks.total,
        userId: this.playlists[index].owner.id,
        image: this.playlists[index].images[0].url,
      })
      this.getTrackList()
    },

    setActivePlaylist(value = {}) {
      this.activePlaylist = value
    },

    setRawResponse(value = {}) {
      this.rawResponse = value
    },

    clear() {
      this.setActivePlaylist()
      this.setRawResponse()
      this.tracks = []
      this.order = {}
      this.users = {}
      _.forOwn(this.loadStatus, (value, key) => {
        this.loadStatus[key] = false
      })
    },

    childLoaded(value) {
      this.loadStatus[value] = true
    },

    prepareTrackList() {
      const response = _
        .chain(this.rawResponse)
        .map(item => item.data.items)
        .flatMap()
        .orderBy("added_at", "asc")
        .map(item => ({
          added_at: item.added_at,
          added_by: item.added_by.id,
          track: {
            name: item.track.name,
            artists: item.track.artists,
            duration: item.track.duration_ms,
            popularity: item.track.popularity,
            // eslint-disable-next-line
            ...((item.track.album.images[0] !== undefined) ? { image: item.track.album.images[0].url } : { image: null }),
          },
        }))
        .value()
      this.tracksArray = response
      this.getTracksByUser(response)
      this.setRawResponse()
    },
  },
}
</script>
<style lang="scss" scoped>
.background-image::after {
  content: "";
  display: block;
  position: fixed;
  height: 100vh;
  width: 100%;
  background-size: cover;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  background-image: var(--image);
  z-index: -2;
}

.container.stats,
.container.achievements {
  margin: 0;
}

h1 {
  font-size: 2.5rem;
}

.overlay {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  height: 100%;
  width: 100%;
}

.content {
  padding: 10px;
  text-align: center;
  position: absolute;
  top: 0;
  width: 100%;
  box-sizing: border-box;
}

.select {
  padding: 60px 30px;
}

.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  margin: 150px 0;
}

.item {
  width: 300px;
  text-align: center;
  margin: 50px;
  transition: 0.2s all ease-in-out;
  transform: scale(1);
  will-change: transform;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  img {
    height: 300px;
    box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  }
}
.back {
  text-align: left;
  display: block;
  cursor: pointer;
  position: fixed;
  font-size: 22px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  will-change: opacity;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.lds-roller {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 32px 32px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  margin: -3px 0 0 -3px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 50px;
  left: 50px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 54px;
  left: 45px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 57px;
  left: 39px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 58px;
  left: 32px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 57px;
  left: 25px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 54px;
  left: 19px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 50px;
  left: 14px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 45px;
  left: 10px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

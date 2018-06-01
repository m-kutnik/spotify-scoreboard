import axios from "axios"

class SpotifyApiInstance {
  constructor() {
    this.spotify = axios.create({
      baseURL: "https://api.spotify.com/",
    })
  }

  checkToken(token) {
    return this.spotify.get("/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  setToken(token) {
    this.spotify.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  me() {
    return this.spotify.get("/v1/me")
  }

  getPlaylists() {
    return this.spotify.get("/v1/me/playlists?limit=50")
  }

  getTrackList(user, playlist, count) {
    // eslint-disable-next-line prettier/prettier
    const promiseArray = []
    ;[...Array(count).keys()].forEach(i => {
      const promise = this.spotify.get(
        `/v1/users/${user}/playlists/${playlist}/tracks?offset=${i *
          100}&limit=100`,
      )
      promiseArray.push(promise)
    })
    return promiseArray
  }

  getUserInfo(id) {
    return this.spotify.get(`/v1/users/${id}`)
  }
}

export default new SpotifyApiInstance()

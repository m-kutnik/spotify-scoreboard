export default {
  redirectURI:
    process.env.NODE_ENV === "production"
      ? "https://m-kutnik.github.io/spotify-scoreboard/redirect"
      : "http://localhost:8080/redirect",
  clientID: "9a1f73aa868942c2b70279ced0bae555",
  scope: "user-read-private user-read-email playlist-read-collaborative",
}

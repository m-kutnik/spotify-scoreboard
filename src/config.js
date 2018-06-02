export default {
  clientID: "9a1f73aa868942c2b70279ced0bae555",
  // redirectURI: 'http://tardis.local:8080/redirect',
  redirectURI:
    process.env.NODE_ENV === "production"
      ? "https://m-kutnik.github.io/spotify-scoreboard/#redirect"
      : "http://localhost:8080/#redirect",
  scope: "user-read-private user-read-email playlist-read-collaborative",
}

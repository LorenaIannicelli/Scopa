<template>
  <div>
    <p>Ciao {{ user.firstName }} {{ user.lastName }}</p>
    <div id="profileInfo">
      <img src="user.profilePath" v-if="user.profilePath" !="" />
      <i class="fas fa-user-astronaut fa-5x"></i>
    </div>
    <button
      type="submit"
      class="pure-button pure-button-primary"
      @click.prevent="updateProfileImg"
    >
      Update Profile Picture
    </button>
    <button
      type="submit"
      class="pure-button pure-button-primary"
      @click.prevent="deleteProfileImg"
    >
      Remove Profile Picture
    </button>
    <div id="stats">
      <p>Games won: {{ user.gameStats.gamesWon }}</p>
      <p>Games lost: {{ user.gameStats.gamesLost }}</p>
      <p>Games played: {{ gamesPlayed }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  computed: {
    user() {
      return this.$root.$data.user;
    },
    gamesPlayed() {
      let myStats = this.user.gameStats;
      return myStats.gamesWon + myStats.gamesLost;
    },
  },
};
</script>

<style scoped>
button {
  margin-top: 1em;
  margin-left: 1em;
}

#stats {
  text-align: left;
  margin-left: 2em;
}
</style>

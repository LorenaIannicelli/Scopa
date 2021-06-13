<template>
  <div>
    <p>Ciao {{ user.firstName }} {{ user.lastName }}</p>
    <h2>
      {{ user.firstName }} {{ user.lastName }}
      <a @click="logout"><i class="fas fa-sign-out-alt"></i></a>
    </h2>
    <div id="profileInfo">
      <img
        id="profilePic"
        :src="user.profilePath"
        v-if="user.profilePath != ''"
      />
      <i v-else class="fas fa-user-astronaut fa-5x"></i>
    </div>
    <button
      type="submit"
      class="pure-button pure-button-primary"
      @click.prevent="uploadProfilePic"
    >
      Update Profile Picture
    </button>
    <upload :show="show" @close="close" @uploadFinished="uploadFinished" />
    <button
      type="submit"
      class="pure-button pure-button-primary"
      @click.prevent="deleteProfileImg"
    >
      Remove Profile Picture
    </button>

    <div id="stats" v-if="playerStats">
      <p>Games won: {{ playerStats.gamesWon }}</p>
      <p>Games lost: {{ playerStats.gamesLost }}</p>
      <p>Games played: {{ gamesPlayed }}</p>
      <p>Scopas won: {{ playerStats.wonScopas }}</p>
      <p>Setebellos captured: {{ playerStats.setebellos }}</p>
    </div>
    <div v-else>
      <p>Play some games to show your stats!</p>
    </div>
  </div>
</template>

<script>
import Upload from "@/components/Upload.vue";
import axios from "axios";
export default {
  name: "UserProfile",
  components: {
    Upload,
  },
  async created() {
    console.log("created");
    let response = await axios.get("/api/playerStats/");
    console.log(response);
    this.playerStats = response.data.playerStats;
  },

  data() {
    return {
      show: false,
      playerStats: {},
    };
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    gamesPlayed() {
      return this.playerStats.gamesWon + this.playerStats.gamesLost;
    },
  },
  methods: {
    uploadProfilePic() {
      this.show = true;
    },
    async uploadFinished() {
      this.show = false;
    },
    close() {
      this.show = false;
    },
    async deleteProfileImg() {
      try {
        await axios.delete("/api/users/profilePic");
        this.$root.user.profilePath = "";
      } catch (error) {
        console.log(error);
      }
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
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

#profilePic {
  width: 20%;
}
</style>

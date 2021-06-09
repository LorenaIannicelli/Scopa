<template>
  <div class="profile">
    <UserProfile v-if="user" />
    <Login v-else />
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import UserProfile from "@/components/UserProfile.vue";
import axios from "axios";
export default {
  name: "profile",
  components: {
    UserProfile,
    Login,
  },
  async created() {
    this.gameInSession = false;
    try {
      let response = await axios.get("/api/users");
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },

  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding-top: 10px;
}
</style>

<template>
  <div class="profile">
    <UserProfile v-if="user" />
    <Login v-else />
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import UserProfile from "@/components/UserProfile.vue";
export default {
  name: "profile",
  components: {
    UserProfile,
    Login,
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

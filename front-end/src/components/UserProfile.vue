<template>
  <div>
    <p>Ciao {{ user.firstName }} {{ user.lastName }}</p>
    <div id="profileInfo">
      <img src="user.profilePath" v-if="user.profilePath" !="" />
      <i class="fas fa-user-astronaut fa-5x"></i>
    </div>
    <div id="stats"></div>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
};
</script>

<style scoped></style>

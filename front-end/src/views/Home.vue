<template>
  <div class="home">
    <div id="welcome">
      <p>Ciao!</p>
      <p>Benevunti a Scopa ~~ Welcome to Scopa!</p>
    </div>
    <div id="funFacts">
      <p>Scopa Fun Facts</p>
    </div>
    <div id="howToPlay">
      <p>How to play Scopa</p>
    </div>
    <div id="play">
      <p>Click here to play!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
}
</style>

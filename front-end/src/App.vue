<template>
  <div id="app">
    <div id="nav">
      <router-link to="/game"><p class="navBarLink">Play</p></router-link>
      <router-link to="/"><p id="scopa">SCOPA</p></router-link>
      <router-link to="/profile"><p class="navBarLink">Profile</p></router-link>
    </div>
    <router-view></router-view>
    <hr />
    <div id="footer">
      <p>I spent __ hours on this website</p>
      <p><a href="https://github.com/LorenaIannicelli/Scopa"> Github! </a></p>
      <p>Lorena Iannicelli, computer engineering</p>
    </div>
  </div>
</template>

<style>
* {
}
.navBarLink {
  color: white;
}

#scopa {
  font-size: 2em;
  color: #bf211e;
  text-decoration: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  background-color: #555b6e;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#footer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>

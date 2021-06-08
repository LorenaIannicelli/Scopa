<template>
  <div id="app">
    <div id="nav"></div>
    <router-view />
    <div id="footer">
      <p>I spent __ hours on this website</p>
      <p><a href="https://github.com/LorenaIannicelli/Scopa"> Github! </a></p>
      <p>Lorena Iannicelli, computer engineering</p>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#footer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>

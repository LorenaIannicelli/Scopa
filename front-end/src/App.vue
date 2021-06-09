<template>
  <div id="app">
    <div id="nav">
      <router-link to="/play">
        <div id="gameLink">
          <img id="italyPic" src="/images/italy.png" />
        </div>
      </router-link>

      <router-link to="/">
        <div id="mainLink">
          <p id="scopa">SCOPA</p>
        </div>
      </router-link>

      <router-link to="/profile">
        <div id="profileLink">
          <p id="profile">Profile</p>
        </div>
      </router-link>
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

#nav {
  padding: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #555b6e;
  align-items: center;
}

#gameLink {
  width: 33%;
}

#italyPic {
  width: 100%;
}

#scopa {
  font-size: 2em;
  color: #bf211e;
  text-decoration: none;
}

#profile {
  color: white;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  text-decoration: none;
  width: 33%;
}

#footer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>

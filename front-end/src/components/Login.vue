<template>
  <div class="loginPage">
    <div class="login">
      <p>Login</p>
      <form class="pure-form">
        <fieldset id="loginInfo">
          <input id="loginUN" placeholder="username" v-model="usernameLogin" />
          <input
            id="loginPW"
            type="password"
            placeholder="password"
            v-model="passwordLogin"
          />
        </fieldset>
        <fieldset>
          <button
            type="submit"
            class="pure-button pure-button-primary"
            @click.prevent="login"
          >
            Login
          </button>
        </fieldset>
      </form>
      <p v-if="errorLogin" class="error">{{ errorLogin }}</p>
    </div>
    <div class="signUp">
      <p>Sign-up</p>
      <form class="pure-form">
        <fieldset>
          <input id="fnSU" placeholder="first name" v-model="firstName" />
          <input placeholder="last name" v-model="lastName" />
        </fieldset>
        <fieldset>
          <input id="fnSU" placeholder="username" v-model="username" />
          <input type="password" placeholder="password" v-model="password" />
        </fieldset>
        <fieldset>
          <button
            type="submit"
            class="pure-button pure-button-primary"
            @click.prevent="registerAndCreateStats"
          >
            Sign Up!
          </button>
        </fieldset>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomePage",
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      usernameLogin: "",
      passwordLogin: "",
      error: "",
      errorLogin: "",
    };
  },
  methods: {
    //when a new person registers, they need zeroed out stats
    async registerAndCreateStats() {
      await this.register();
      await this.createStats();
    },
    //call post to create stats
    async createStats() {
      await axios.post("/api/playerStats");
    },
    //register new person
    async register() {
      this.error = "";
      this.errorLogin = "";
      //if any fields are blank, don't do anything
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        //try and post a new user, with no profile path (default pic will be used )
        let response = await axios.post("/api/users", {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
          profilePath: "",
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    //log user in
    async login() {
      this.error = "";
      this.errorLogin = "";
      //if anything is empty, return
      if (!this.usernameLogin || !this.passwordLogin) return;
      try {
        let response = await axios.post("/api/users/login", {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  },
};
</script>

<style scoped>
button {
  background-color: #bf211e;
}
.loginPage {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

#loginInfo {
  border: none;
  display: flex;
  flex-direction: column;
}

#loginUN {
  margin-bottom: 1em;
}

#fnSU {
  margin-right: 1em;
}

.error {
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 0.75em;
  background-color: #134611;
  color: #fff;
}
</style>

<template>
  <div class="login">
    <h2>Login</h2>
    <form>
      <input type="text" v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <!--      <button type="submit">Login</button>-->
      <button type="submit" @click="authenticate" class="auth">
        Get Started
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    authenticate(event) {
      event.preventDefault();
      // Check if the username and password match the expected values
      if (this.username === "test" && this.password === "test") {
        // Reset the form
        this.username = "";
        this.password = "";
        this.$router.push("/new");
      } else {
        console.log("Authentication failed. Invalid credentials.");
      }
    },
  },
};
</script>

<style scoped>
/* Styles */
.login {
  position: absolute;
  top: 90%;
}

.auth {
  color: #494949;
  margin-left: 30px;
  padding: 10px 10px;
  width: 200px;
  font-size: 20px;
  border-radius: 30px;
  border: 0;
  background-color: #f6c467;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f7ac21;
    transform: scale(1.02);
  }
}
</style>

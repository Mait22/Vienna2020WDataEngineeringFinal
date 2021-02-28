<template>
  <div>
    <b-alert show variant="danger" v-if="wrongLogin"
      >Wrong password or email! Try again!</b-alert
    >
    <b-form @submit.prevent="login" @reset="resetted" v-if="show">
      <b-form-group id="input-group-1" label="Your email:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="email"
          type="email"
          required
          placeholder="Enter your email"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="password"
          type="text"
          required
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary" class="mr-1"> Submit </b-button>

      <b-button type="reset" variant="outline-danger" class="mr-1" ref="resetButton">
        Reset
      </b-button>
    </b-form>

    <router-link to="/register">
      <br />
      Don't have an account? Register.
    </router-link>
  </div>
</template>

<script>
import axios from "axios";
import store from "../vuex/store";

export default {
  data() {
    return {
      email: "",
      password: "",
      show: true,
      wrongLogin: false
    };
  },
  methods: {
    login() {
      return axios
          .post("//localhost:4040/api/user/login", { 
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          console.log(response.data);
          store.commit("SET_USER_DATA", response.data);
          this.$refs.resetButton.click();
          this.$router.push({ name: "registertoevent" });
        })
        .catch(function (err) {
          // Debugging
          console.log(err);

          // Error handling in UI
          this.wrongLogin = true;
          this.$refs.resetButton.click();
        });
    },

    resetted() {
      this.email = "";
      this.password = "";
      this.wrongLogin = false;
    },
  },
};
</script>

<style scoped></style>

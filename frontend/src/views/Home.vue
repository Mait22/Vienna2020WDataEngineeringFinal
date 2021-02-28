<template>
  <div class="home">
    <h1>Welcome to the App!</h1>
    <div v-if="!loggedIn">
      To use this app you'll need to
      <router-link to="/login"> Login </router-link>
      or
      <router-link to="/register"> Register </router-link>
    </div>

    <div v-if="!loggedIn">
      <br />
      <br />
      <p>
        To add random data to the database please press the following button. Tables are
        created and filled with 5 rows of sample data each, only two users are left:
      </p>

      <p>
        - user with email "test44@gmail.com" and password: "testPassword" who has embassy
        worker user rights, i.e. can add events
      </p>
      <p>
        - user with email "test33@gmail.com" and password: "testPassword" who has company
        user rights, i.e. can register to events
      </p>
      <b-button type="submit" variant="primary" class="mr-1" v-on:click="addInitialData"
        >Submit</b-button
      >
    </div>
  </div>
</template>

<script>
import { authComputed } from "../vuex/helpers.js";
import axios from "axios";

export default {
  computed: {
    ...authComputed,
  },
  methods: {
    addInitialData() {
      return axios({
        method: "post",
        url: "//localhost:4040/randomData/add",
        //url: "//localhost:4040/api/user/register",
        headers: {},
        data: {},
      })
        .then(() => {
          console.log("Random data Added");
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },
  },
};
</script>

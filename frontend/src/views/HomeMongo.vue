<template>
  <div class="home">
    <h1>Welcome to the App!</h1>
    <div v-if="!loggedIn">
      To use this app you'll need to
      <router-link to="/login"> Login </router-link>
      or
      <router-link to="/register"> Register </router-link>
    </div>

    <div v-if="loggedIn">
      <br />
      <br />
      <p>
        Use following button to delete previously installed collections and make migrate data from PostgreSQL database.
      </p>
      <b-button type="submit" variant="primary" class="mr-1" v-on:click="makeMigration"
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
    async makeMigration() {
      await this.migrateCountries()
      await this.migrateActivities()
      await this.migrateCompanies()
      await this.migrateEvents()
      await this.migrateEmbassies()

    },

      migrateCountries() {
      return axios({
        method: "post",
        url: "//localhost:4040/mongo/migrateCountries",
        headers: {},
        data: {},
      })
        .then(() => {
          console.log("Countries migrated!");
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

      migrateActivities() {
      return axios({
        method: "post",
        url: "//localhost:4040/mongo/migrateActivities",
        headers: {},
        data: {},
      })
        .then(() => {
          console.log("Countries migrated!");
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

      migrateCompanies() {
      return axios({
        method: "post",
        url: "//localhost:4040/mongo/migrateCompanies",
        headers: {},
        data: {},
      })
        .then(() => {
          console.log("Countries migrated!");
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

      migrateEvents() {
      return axios({
        method: "post",
        url: "//localhost:4040/mongo/migrateEvents",
        headers: {},
        data: {},
      })
        .then(() => {
          console.log("Countries migrated!");
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

      migrateEmbassies() {
      return axios({
        method: "post",
        url: "//localhost:4040/mongo/migrateEmbassies",
        headers: {},
        data: {},
      })
        .then(() => {
          console.log("Countries migrated!");
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },


  },
};
</script>

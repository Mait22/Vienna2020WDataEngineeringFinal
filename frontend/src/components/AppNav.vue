<template>
  <div id="nav">
    <b-navbar toggleable="lg" type="dark" variant="success">
      <b-navbar-brand to="/">Home | </b-navbar-brand>
      <b-navbar-brand v-if="loggedIn" to="/registertoevent">Register to event | </b-navbar-brand>
      <b-navbar-brand v-if="loggedIn" to="/addanevent">Add an event | </b-navbar-brand>
      <b-navbar-brand v-if="loggedIn" to="/registrationactivity">See previous registration activity | </b-navbar-brand>
      <b-navbar-brand v-if="loggedIn" to="/relatedworkers">Query relevant workers by company and activity</b-navbar-brand>

      <b-nav-item-dropdown text="Mongo implementation" right variant="success">
          <b-dropdown-item v-if="loggedIn" to="/mongohome">To mogo</b-dropdown-item>
          <b-dropdown-item v-if="loggedIn" to="/registertoeventmongo">Register to event</b-dropdown-item>
          <b-dropdown-item v-if="loggedIn" to="/addaneventmongo">Add an event </b-dropdown-item>
          <b-dropdown-item v-if="loggedIn" to="/registrationactivitymongo">See previous registration activity</b-dropdown-item>
          <b-dropdown-item v-if="loggedIn" to="/relatedworkersmongo">Query relevant workers</b-dropdown-item>
      </b-nav-item-dropdown>



      <b-navbar-nav class="ml-auto">
        <b-navbar-brand v-if="!loggedIn" to="/login" right>Login to site</b-navbar-brand>
        <b-button
          v-else
          size="sm"
          class="my-2 my-sm-0"
          type="submit"
          @click="logout"
          right
          >Logout</b-button
        >
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { authComputed } from "../vuex/helpers.js";
export default {
  computed: {
    ...authComputed,
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped></style>

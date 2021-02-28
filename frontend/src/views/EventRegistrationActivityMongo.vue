<template>
  <div>
    <div v-if="loggedIn">
      <div v-if="activityOptions.lenth !== 0 && countryOptions.length !== 0">
        <h1>Make a query</h1>
        <b-alert show variant="danger" v-if="wrongInput">{{ problemMessage }}</b-alert>

        <b-form @submit.prevent="makeQuery" @reset="resetted" v-if="loggedIn">
          <br />
          <div v-if="activityOptions.lenth !== 0 && countryOptions.length !== 0">
            <p>Please specify activity:</p>
            <multiselect
              v-model="selectedActivity"
              :options="activityOptions"
              track-by="name"
              label="name"
              placeholder="Select one"
            ></multiselect>
          </div>

          <br />
          <div v-if="activityOptions.lenth !== 0 && countryOptions.length !== 0">
            <p>Please specify country:</p>
            <multiselect
              v-model="selectedCountry"
              :options="countryOptions"
              track-by="name"
              label="name"
              placeholder="Select one"
            ></multiselect>
          </div>

          <br />
          <b-button type="submit" variant="primary" class="mr-1"> Submit </b-button>

          <b-button type="reset" variant="outline-danger" class="mr-1" ref="resetButton">
            Reset
          </b-button>
        </b-form>
        <br />

        <div v-if="queryResult !== null">
          <h3>Registration activity</h3>
          <b-table striped hover :items="queryResult"></b-table>
        </div>
        <div v-if="queryResult === null">
          <h3>No results</h3>
        </div>
      </div>

    </div>

    <div v-if="!loggedIn">
      To use this app you'll need to
      <router-link to="/login"> Login </router-link>
      or
      <router-link to="/register"> Register </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "../vuex/store";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect,
 },
  name: "registerToEvent",
  data() {
    return {
      activityOptions: [],
      selectedActivity: null,

      countryOptions: [],
      selectedCountry: null,

      wrongInput: false,
      problemMessage: null,

      queryResult: null,
    };
  },

  methods: {
    getAllActivities() {
      return axios({
        method: "get",
        url: "//localhost:4040/mongo/allActivities",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          this.activityOptions = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

    getAllCountries() {
      return axios({
        method: "get",
        url: "//localhost:4040/mongo/allCountries",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          this.countryOptions = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

    resetted() {
      this.selectedActivity = null
      this.selectedCountry = null
      this.queryResult = null
    },

    makeQuery() {
      // Element level shallow copy
      this.wrongInput = false;
      this.problemMessage = null;

      if (this.selectedActivity === null) {
        this.wrongInput = true;
        this.problemMessage = "Please select activity";
        return null;
      }

      if (this.selectedCountry === null) {
        this.wrongInput = true;
        this.problemMessage = "Please select country";
        return null;
      }

      let APIPayload = {};
      // Composing api call
      try {
        APIPayload.activityArea = this.selectedActivity.name;
        APIPayload.country = this.selectedCountry.name;
        console.log(JSON.stringify(APIPayload));

        // Making api call

        return axios({
          method: "post",
          url: "//localhost:4040/mongo/getRegistrationActivity",
          headers: {
            "auth-token": this.jwtToken,
          },
          data: APIPayload,
        })
          .then((data) => {
            console.log(JSON.stringify(data.data))

            if(data.data.length > 0) {
              this.queryResult = data.data;
            }
            else {
              this.queryResult = null;
            }
          })
          .then(() => {       
            // Reload data
            this.getAllActivities();
            this.getAllCountries();
          })
          .catch((err) => {
            console.log(err);
            // Debugging
            console.log(err);

            // Error handling in UI
            this.wrongInput = true;
            this.problemMessage = err.response.data;
          });
      } catch (err) {
        console.log(err);
      }
    },
  },

  async created() {
    await this.getAllCountries();
    await this.getAllActivities();
  },

  computed: {
    loggedIn() {
      return store.getters.loggedIn;
    },
    jwtToken() {
      if (store.getters.loggedIn) {
        // console.log(store.state.user);
        return store.state.user;
      } else return null;
    },
  },
};
</script>

<template>
  <div>
    <div v-if="loggedIn">
      <div v-if="activityOptions.lenth !== 0 && companyOptions.length !== 0">
        <h1>Make a query</h1>
        <b-alert show variant="danger" v-if="wrongInput">{{ problemMessage }}</b-alert>

        <b-form @submit.prevent="makeQuery" @reset="resetted" v-if="loggedIn">
          <br />
          <div v-if="activityOptions.lenth !== 0 && companyOptions.length !== 0">
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
          <div v-if="activityOptions.lenth !== 0 && companyOptions.length !== 0">
            <p>Please specify company:</p>
            <multiselect
              v-model="selectedCompany"
              :options="companyOptions"
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

        <div v-if="queryResult != null">
          <h3>Previous activity of the compnay in given field</h3>
          <b-table striped hover :items="queryResult"></b-table>
        </div>
        <div v-if="queryResult === null">
          <h3>No result found</h3>
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

      companyOptions: [],
      selectedCompany: null,

      wrongInput: false,
      problemMessage: null,

      queryResult: null,
    };
  },

  methods: {
    getAllActivities() {
      return axios({
        method: "get",
        url: "//localhost:4040/api/registration/getAllActivities",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          //console.log("Activities");
          //console.log(JSON.stringify(data.data));
          this.activityOptions = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

    getAllCompanies() {
      return axios({
        method: "get",
        url: "//localhost:4040/api/registration/getAllCompanies",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          //console.log(JSON.stringify(data.data));
          this.companyOptions = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

    resetted() {
      this.selectedActivity = null
      this.selectedCompany = null
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

      if (this.selectedCompany === null) {
        this.wrongInput = true;
        this.problemMessage = "Please select company";
        return null;
      }

      let APIPayload = {};
      // Composing api call
      try {
        APIPayload.activityName = this.selectedActivity.name;
        APIPayload.companyName = this.selectedCompany.name;
        console.log(JSON.stringify(APIPayload));

        // Making api call

        return axios({
          method: "post",
          url: "//localhost:4040/report/companyActivity",
          headers: {
            "auth-token": this.jwtToken,
          },
          data: APIPayload,
        })
          .then((data) => {
            console.log(JSON.stringify(data.data))
            console.log(data.data.length)


              const queryResult = []
              if(data.data.length > 0) {
                  data.data.forEach(el => {

                  let workerList = []
                  el.tradeEvent.embassy.workers.forEach(e => workerList.push(e.workerName))
                  workerList = workerList.join(', ')

                  queryResult.push({companyName: el.company.companyName, 
                                      eventName: el.tradeEvent.name,
                                      relatedEmbassy: el.tradeEvent.embassy.name,
                                      countryName: el.tradeEvent.embassy.country.countryName,
                                      relatedWorkers: workerList

                  })
                })
                console.log(queryResult)
                this.queryResult = queryResult
              } 
              else {
                this.queryResult = null
              }
              
              
          })
          .then(() => {       
            // Reload data
            this.getAllActivities();
            this.getAllCompanies();
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
    await this.getAllCompanies();
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


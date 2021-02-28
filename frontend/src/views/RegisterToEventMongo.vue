<template>
  <div>
    <div v-if="loggedIn">
      <h1>Make a Registration</h1>
      <b-alert show variant="danger" v-if="wrongInput">{{problemMessage}}</b-alert>

      <b-form @submit.prevent="register" @reset="resetted" v-if="loggedIn">

        <br />
        <p>Please select an event to register:</p>
        <div>
          <multiselect
            v-model="registerAPIcall.eventName"
            :options="eventsToregister"
            track-by="name"
            label="name"
            placeholder="Select one"
          ></multiselect>
        </div>

        <br />
        <b-form-group
          label="Is your company already present in our database?"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio-group
            id="input-1"
            v-model="companyPresent"
            :options="companyPresentOptions"
            :aria-describedby="ariaDescribedby"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>

        <div v-if="companyPresent === 'Yes'">
          <p>Please select your company:</p>
          <br>
        <div>
          <multiselect
            v-model="registerAPIcall.companyName"
            :options="companyOptions"
            track-by="name"
            label="name"
            placeholder="Select one"
          ></multiselect>
        </div>
        </div>
        <br>

        <div v-if="companyPresent === 'No'">
          <h3>Fill in your company details to add your company and make registration</h3>

          <div>
              <br>
              <p>Company name: </p>
              <b-form-input v-model="companyNameNew" placeholder="Enter your company name"></b-form-input>
          </div>

          <div>
              <br>
              <p>Employee count: </p>
              <b-form-input v-model="registerAPIcall.employeeCount" placeholder="Employee count" type="number"></b-form-input>
          </div>

          <div>
              <br>
              <p>Yearly turnover (in mln €): </p>
              <b-form-input v-model="registerAPIcall.turnoverEur" placeholder="Yearly turnover" type="number"></b-form-input>
          </div>

          <div>
              <br>
              <p>Phone no: </p>
              <b-form-input v-model="registerAPIcall.phoneNo" placeholder="Phone number"></b-form-input>
          </div>

          <div>
              <br>
              <p>Email address: </p>
              <b-form-input v-model="registerAPIcall.email" placeholder="Email" type="email"></b-form-input>
          </div>

          <div>
              <br>
              <p>Select appropriate activty areas: </p>
              <multiselect v-model="registerAPIcall.activityAreas" :options="activityOptions" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Pick some" label="name" track-by="name" :preselect-first="true">
                <template slot="selection" slot-scope="{ values, isOpen }">
                  <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
                </template>
              </multiselect>
          </div>

          <div>
              <br>
              <p>Select markets you export to: </p>
              <multiselect v-model="registerAPIcall.exportMarkets" :options="countryOptions" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Pick some" label="name" track-by="name" :preselect-first="true">
                <template slot="selection" slot-scope="{ values, isOpen }">
                  <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
                </template>
              </multiselect>

          </div>

        </div>

        <br />
        <b-button type="submit" variant="primary" class="mr-1"> Submit </b-button>

        <b-button type="reset" variant="outline-danger" class="mr-1" ref="resetButton">
          Reset
        </b-button>
      </b-form>
      <br />

      <h1>All registrations</h1>
      <div>
        <b-table striped hover :items="registrations"></b-table>
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
      // Navigation helpers
      companyPresent: null,
      companyPresentOptions: ["Yes", "No"],
      wrongInput: false,
      problemMessage: null, 

      companyOptions: [],
      countryOptions: [],
      activityOptions: [],

      // Registration data
      registrations: [],
      eventsToregister: [],

      companyNameNew: null,

      registerAPIcall: {
        dd: null,
        mm: null,
        yyyy: null,
        eventName: null,
        companyName: null,
        employeeCount: null,
        turnoverEur: null,
        phoneNo: null,
        email: null,
        activityAreas: [],
        exportMarkets: [],
      },
    };
  },

  methods: {
    getRegistrations() {
      return axios({
        method: "get",
        url: "//localhost:4040/mongo/allEvents",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          let registrations = []
          data.data.forEach(el => {
            el.registrations.forEach(r => {
              const registration = {}
              registration['event'] = el.name
              registration['eventDate'] = el.startDate
              registration['companyName'] = r
              registrations.push(registration)
            })
          })
          console.log(registrations);
          this.registrations = registrations;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

    getAllEvents() {
      return axios({
        method: "get",
        url: "//localhost:4040/mongo/allEvents",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          console.log(JSON.stringify(data.data));

          const eventsToregister = [];
          data.data.forEach((el) =>
            eventsToregister.push({
              name: el.name + " taking place at " + el.startDate,
              startDate: el.startDate,
              eventName: el.name,
            })
          );
          this.eventsToregister = eventsToregister;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

    getAllCompanies() {
      return axios({
        method: "get",
        url: "//localhost:4040/mongo/allCompanies",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          console.log(data.data);
          this.companyOptions = data.data;
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
          console.log(data.data);
          this.countryOptions = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
      });
    },

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
          console.log('Activities')
          console.log(data.data);
          this.activityOptions = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
      });
    },

    resetted() {
      this.registerAPIcall.eventName = null;
      this.registerAPIcall.companyName = null;
      this.companyPresent = null
      this.registerAPIcall.employeeCount = null
      this.registerAPIcall.turnoverEur = null
      this.registerAPIcall.phoneNo = null
      this.registerAPIcall.email= null
      this.registerAPIcall.activityAreas = []
      this.registerAPIcall.exportMarkets = []
      this.wrongInput = false
      this.problemMessage = ""
      this.companyNameNew = null

    },

    register() {

      // Element level shallow copy
      let APIPayload = JSON.parse(JSON.stringify(this.registerAPIcall));
      this.wrongInput = false;
      this.problemMessage = null


      if(this.companyPresent === "No" || this.companyPresent === "Yes" || this.companyPresent === null) {
        // Event selection
        if(APIPayload.eventName === null || APIPayload.eventName.length == 0) {
          this.wrongInput = true;
          this.problemMessage = "Please select event you want to register" 
          return null
        }
      }
      if(this.companyPresent === null){
        this.wrongInput = true;
        this.problemMessage = "Please specify your company" 
        return null
      }
       if(this.companyPresent === "Yes") {
          if(APIPayload.companyName === null || APIPayload.companyName.length == 0) {
          this.wrongInput = true;
          this.problemMessage = "No company name provided" 
          return null
        }
      }
      if(this.companyPresent === "No") {
        if(this.companyNameNew === null || this.companyNameNew.length == 0) {
          this.wrongInput = true;
          this.problemMessage = "No company name provided" 
          return null
        }
        if(APIPayload.employeeCount === null || APIPayload.employeeCount.length == 0 || APIPayload.employeeCount < 0) {
          this.wrongInput = true;
          this.problemMessage = "Wrong employee count" 
          return null
        }
        if(APIPayload.turnoverEur === null || APIPayload.turnoverEur.length == 0) {
          this.wrongInput = true;
          this.problemMessage = "Wrong turnover amount count" 
          return null
        }
        if(APIPayload.phoneNo === null || APIPayload.phoneNo.length == 0) {
          this.wrongInput = true;
          this.problemMessage = "Empty phone number" 
          return null
        }
        if(APIPayload.activityAreas === null || APIPayload.activityAreas.length == 0) {
          this.wrongInput = true;
          this.problemMessage = "No activity areas selected, please select at least one" 
          return null
        }
        if(APIPayload.exportMarkets === null || APIPayload.exportMarkets.length == 0) {
          this.wrongInput = true;
          this.problemMessage = "No export markets selected, please select at least one" 
          return null
        }
      }
    
      // Composing api call
      try{
      // Getting event name and date data
      APIPayload.event = this.registerAPIcall.eventName.eventName
    
      APIPayload.yyyy = (new Date (this.registerAPIcall.eventName.startDate)).getFullYear()
      APIPayload.mm = (new Date (this.registerAPIcall.eventName.startDate)).getMonth()
      APIPayload.dd = (new Date (this.registerAPIcall.eventName.startDate)).getDate()

      // Numeric input fields
      APIPayload.employeeCount = parseFloat(APIPayload.employeeCount)
      APIPayload.turnoverEur = parseFloat(APIPayload.turnoverEur)


      // Selecting which name field to use in API call
      if(this.companyPresent === "No") {
        APIPayload.company = this.companyNameNew
        APIPayload.addCompany = true
      }
      if(this.companyPresent === "Yes") {
        APIPayload.company = this.registerAPIcall.companyName.name
        APIPayload.addCompany = false
      }

      // Flattening activities and export markets arrays
      let ExportMarkets = APIPayload.exportMarkets.map(el => el.name)
      let Activities = APIPayload.activityAreas.map(el =>el.name)

      APIPayload.countries = ExportMarkets
      APIPayload.activities = Activities

      console.log((JSON.stringify(APIPayload)))

      } catch (err) {
        console.log(err)
      }

      // Making api call 
      return axios({
        method: "post",
        url: "//localhost:4040/mongo/makeRegistration",
        headers: {
          "auth-token": this.jwtToken
          },
        data: APIPayload,
      })
        .then(() => {
          // Reset form
          this.$refs.resetButton.click();
          //Show confirmation
           this.$bvModal.msgBoxConfirm('Registration made')
          .then(value => {
            this.boxOne = value
          })
          .catch(err => {
            console.log(err)
          })

          // Reload data
          this.getRegistrations();
          this.getAllEvents();
          this.getAllCompanies();
          this.getAllCountries();
          this.getAllActivities()

        })
        .catch((err) => {
          // Debugging
          console.log(err);

          // Error handling in UI
          this.wrongInput = true; 
          this.problemMessage = err.response.data;

        });
    },
  },

  async created() {
    await this.getRegistrations();
    await this.getAllEvents();
    await this.getAllCompanies();
    await this.getAllCountries();
    await this.getAllActivities()
  },

  computed: {
    loggedIn() {
      return store.getters.loggedIn;
    },
    jwtToken() {
      if (store.getters.loggedIn) {
        console.log(store.state.user);
        return store.state.user;
      } else return null;
    },
  },
};
</script>

<template>
  <div>
    <div v-if="loggedIn">
      <h1>Add an Event</h1>
      <b-alert show variant="danger" v-if="wrongInput">{{ problemMessage }}</b-alert>

      <b-form @submit.prevent="addEvent" @reset="resetted" v-if="loggedIn">
        <br />

        <div v-if="embassyOptions !== null">
          <p>Please select the embassy organizing the event:</p>
          <multiselect
            v-model="embassySelected"
            :options="embassyOptions"
            track-by="name"
            label="name"
            placeholder="Select one"
          ></multiselect>
        </div>

        <br />
        <div v-if="embassySelected !== null">
          <h3>Please enter event details:</h3>

          <div>
            <p>Name for event:</p>
            <b-form-input v-model="newEventName" placeholder=""></b-form-input>
            <br />
          </div>

          <div>
            <label for="datepicker-1">When will event take place?</label>
            <b-form-datepicker
              id="datepicker-1"
              v-model="startDate"
              class="mb-2"
            ></b-form-datepicker>
            {{ startDate }}
          </div>

          <div>
            <label for="datepicker-2">When will registration be closed?</label>
            <b-form-datepicker
              id="datepicker-2"
              v-model="registrationDueDate"
              class="mb-2"
            ></b-form-datepicker>
          </div>

          <div>
            <br />
            <p>Select activty area:</p>
            <multiselect
              v-model="selectedActivity"
              :options="activityOptions"
              :multiple="false"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Pick some"
              label="name"
              track-by="name"
              :preselect-first="true"
            >

            </multiselect>
          </div>
        </div>

        <br />
        <div v-if="embassySelected !== null">
          <b-form-group
            label="Do you want to use preexisting venue or add a new one?"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-radio-group
              id="input-1"
              v-model="venueAdded"
              :options="addVenuOptions"
              :aria-describedby="ariaDescribedby"
              name="radio-options"
            ></b-form-radio-group>
          </b-form-group>
        </div>

        <br />
        <div v-if="embassySelected !== null && venueAdded === 'Use existing one'">
          <p>Please select venue:</p>

          <multiselect
            v-model="venueSelected"
            :options="venueOptions"
            track-by="venueName"
            label="name"
            placeholder="Select one"
          ></multiselect>
        </div>

        <div v-if="embassySelected !== null && venueAdded === 'Add'">
          <p>Please enter new venue details:</p>

          <div>
            <p>Venue name:</p>
            <b-form-input v-model="newVenueName" placeholder="Name ..."></b-form-input>
          </div>

          <div>
            <p>Venue capacity:</p>
            <b-form-input
              v-model="newVenueCapacity"
              placeholder="Capacity ..."
              type="number"
            ></b-form-input>
          </div>
        </div>
        <br />

        <br />
        <b-button type="submit" variant="primary" class="mr-1"> Submit </b-button>

        <b-button type="reset" variant="outline-danger" class="mr-1" ref="resetButton">
          Reset
        </b-button>
      </b-form>
      <br />

      <h1>All events</h1>
      <div>
        <b-table striped hover :items="eventsToregister"></b-table>
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

      newEventName: null,
      addVenuOptions: ["Use existing one", "Add"],
      venueAdded: null,
      wrongInput: false,
      problemMessage: null,
      embassyOptions: null,
      embassySelected: null,
      venueFullList: null,
      venueSelected: null,
      newVenueName: null,
      newVenueCapacity: null,
      startDate: null,
      registrationDueDate: null,
      activityOptions: null,
      selectedActivity: null,
      eventsToregister: null,

    };
  },

  methods: {
    getAllEvents() {
      return axios({
        method: "get",
        url: "//localhost:4040/api/registration/getAllEvents",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          //console.log(JSON.stringify(data.data));

          const eventsToregister = [];
          data.data.forEach((el) =>
            eventsToregister.push({
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
          //console.log(data.data);
          this.activityOptions = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },

    getAllEmbassiesAndVenues() {
      return axios({
        method: "get",
        url: "//localhost:4040/events/getVenuesByEmbassy",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: {},
      })
        .then((data) => {
          let embassyList = [];
          Object.keys(data.data).forEach((el) => {
            embassyList.push({ name: el });
          });
          this.embassyOptions = embassyList;
          this.venueFullList = data.data;
        })
        .catch((err) => {
          // Debugging
          console.log(err);
        });
    },
    resetted() {

            this.newEventName = null
            this.venueAdded = null
            this.wrongInput = false
            this.problemMessage = null
            this.embassySelected = null
            this.venueSelected = null
            this.newVenueName = null
            this.newVenueCapacity = null
            this.startDate = null
            this.registrationDueDate = null
            this.selectedActivity = null
    },

    addEvent() {
      this.wrongInput = false;
      this.problemMessage = null;

      if (this.embassySelected === null) {
        this.wrongInput = true;
        this.problemMessage = "Please select embassy";
        return null;
      }

    if (this.newEventName === null || this.newEventName === "") {
        this.wrongInput = true;
        this.problemMessage = "Please enter event name";
        return null;
      }

      if (this.startDate === null) {
        this.wrongInput = true;
        this.problemMessage = "Please select start date";
        return null;
      }

      if (this.registrationDueDate === null) {
        this.wrongInput = true;
        this.problemMessage = "Please select registration due date";
        return null;
      }

      if (this.selectedActivity === null) {
        this.wrongInput = true;
        this.problemMessage = "Please select activity category for an event";
        return null;
      }

      if (this.venueAdded === null ) {
        this.wrongInput = true;
        this.problemMessage = "Please specify venue";
        return null;
      }
      
      if (this.venueAdded === 'Use existing one' &&  this.venueSelected === null ) {
        this.wrongInput = true;
        this.problemMessage = "Please select venue";
        return null;
      }
      
      if (this.venueAdded === 'Add' &&  (this.newVenueName === null || this.newVenueName.length === 0 || this.newVenueCapacity === null || this.newVenueCapacity <= 0) ) {
        this.wrongInput = true;
        this.problemMessage = "Please fill in new venue details";
        return null;
      }
      
      let APIPayload = {}
      // Composing api call
      try {

        const registerDate = this.registrationDueDate.split('-');
        const startDate = this.startDate.split('-');

        APIPayload.YYYYR = new Date(registerDate).getFullYear()
        APIPayload.mmR = new Date(registerDate).getMonth()
        APIPayload.ddR = new Date(registerDate).getDate()

        APIPayload.YYYY = new Date(startDate).getFullYear()
        APIPayload.mm = new Date(startDate).getMonth()
        APIPayload.dd = new Date(startDate).getDate()

        APIPayload.activityName = this.selectedActivity.name
        APIPayload.embassyName = this.embassySelected.name
        if(this.venueAdded === 'Add') {
            APIPayload.venueName = this.newVenueName
            APIPayload.venueSeatingCapacity = this.newVenueCapacity
        }
        if(this.venueAdded === 'Use existing one') {
            APIPayload.venueName = this.venueSelected.venueName
            APIPayload.venueSeatingCapacity = null
        }
        APIPayload.eventName = this.newEventName

        console.log(JSON.stringify(APIPayload))

      } catch (err) {
        console.log(err);
      }

      // Making api call
      
      return axios({
        method: "post",
        url: "//localhost:4040/events/add",
        headers: {
          "auth-token": this.jwtToken,
        },
        data: APIPayload,
      })
        .then(() => {
          // Reset form
          this.$refs.resetButton.click();
          //Show confirmation
          this.$bvModal
            .msgBoxConfirm("Registration made")
            .then((value) => {
              this.boxOne = value;
            })
            .catch((err) => {
              console.log(err);
            });
       

          // Reload data
        this.getAllEmbassiesAndVenues();
        this.getAllActivities();
        this.getAllEvents();
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
    await this.getAllEmbassiesAndVenues();
    await this.getAllActivities();
    await this.getAllEvents();
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
    venueOptions() {
      if (this.embassySelected === null) {
        return null;
      } else {
        let venueOptions = [];
        this.venueFullList[this.embassySelected.name].forEach((el) => {
          venueOptions.push({
            name: el.venueName + " with seating capacity of " + el.seatingCapacity,
            venueName: el.venueName,
          });
        });

        //console.log(JSON.stringify(venueOptions));

        return venueOptions;
      }
    },
  },
};
</script>

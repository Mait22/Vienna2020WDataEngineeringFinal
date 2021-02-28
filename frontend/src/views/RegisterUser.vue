<template>
  <div>
    <b-alert show variant="danger" v-if="wrongRegister">{{ errorMessage }}</b-alert>
    <b-form @submit.prevent="register" @reset="resetted" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Your email:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="email"
          type="email"
          required
          placeholder="Enter your email"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Password"
        label-for="input-2"
        description="Please select secure password with minumum length of 6 characters"
      >
        <b-form-input
          id="input-2"
          v-model="password"
          type="text"
          required
          placeholder="Choose password"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Choose role" v-slot="{ ariaDescribedby }">
        <b-form-radio-group
          id="input-3"
          v-model="role"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radio-options"
        ></b-form-radio-group>
      </b-form-group>

      <b-button type="submit" variant="primary" class="mr-1">Submit</b-button>
      <b-button type="reset" variant="outline-danger" class="mr-1" ref="resetButton"
        >Reset</b-button
      >
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import https from "https";

export default {
  data() {
    return {
      role: "",
      email: "",
      password: "",
      show: true,
      errors: null,
      options: ['company', 'embassy worker'],
      wrongRegister: false, 
      errorMessage: null

    };
  },
  methods: {
    
    register() {
      const agent = new https.Agent({  
      rejectUnauthorized: false
      });

      return axios({
        method: "post",
        url: "//localhost:4040/api/user/register",
        //url: "//localhost:4040/api/user/register",
        headers: {},
        data: {
          role: this.role,
          email: this.email,
          password: this.password,
        },
        httpsAgent: agent
      })
        .then(() => {
          this.$refs.resetButton.click();
          this.$router.push({ name: "login" });
        })
        .catch((err) => {
          // Debugging
          console.log(err);
          this.errors = err.response.data.errors;

          // Error handling in UI
          this.wrongRegister = true; 
          this.errorMessage = err.response.data;
          this.$refs.resetButton.click();

        });
    },

    resetted() {
      this.email = "";
      this.password = "";
      this.role = ""
    },
  },
};
</script>

<style scoped></style>

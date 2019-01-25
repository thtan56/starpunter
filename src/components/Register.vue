// const Register = Vue.component('registercomponent', {
<template>
  <div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg6>
          <v-card class="elevation-1 pa-3">
            <v-card-text>
              <div class="layout column align-center">
                <img src="images/tipstars.jpg" width="250" height="100">
                <h2 class="flex my-4 primary--text">Toby Sports</h2>
              </div>
              <h3>Registration Form</h3>       
                         
              <v-form>
                <v-container grid-list-md text-xs-center>
                  <v-layout row wrap>
                    <v-flex xs12 sm6 d-flex><v-text-field append-icon="person" label="Username" type="text" v-model="user.username"></v-text-field></v-flex>
                    <v-flex xs12 sm6 d-flex><v-text-field append-icon="lock" label="Password" id="password" type="password" v-model="user.password"></v-text-field></v-flex>
                    <v-flex xs6><v-text-field append-icon="email" label="Email" type="text" v-model="user.email"></v-text-field></v-flex>
                    <v-flex xs6>
                      <v-combobox v-model="user.role" :items="roles" label="Select your role:"></v-combobox>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs6><v-text-field append-icon="person" label="First name" type="text" v-model="user.firstname"></v-text-field></v-flex>
                    <v-flex xs6><v-text-field append-icon="person" label="Last name" type="text" v-model="user.lastname"></v-text-field></v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6><v-text-field append-icon="home" name="address1" label="Address 1" type="text" v-model="user.address1"></v-text-field></v-flex>
                    <v-flex xs6><v-text-field append-icon="home" name="address2" label="Address 2" type="text" v-model="user.address2"></v-text-field></v-flex>
                  </v-layout> 
                  <v-layout row wrap>
                    <v-flex xs4><v-text-field append-icon="home" label="Town" type="text" v-model="user.town"></v-text-field></v-flex>
                    <v-flex xs4><v-text-field append-icon="home" label="Postcode" type="text" v-model="user.postcode"></v-text-field></v-flex>
                    <v-flex xs4>
                      <v-select append-icon="outlined_flag" label="Country" v-model="user.country" :items="countries"></v-select>
                    </v-flex>
                  </v-layout>                        
                  <v-layout row wrap>
                    <v-flex xs6><v-text-field append-icon="outlined_flag" name="bsb" label="Bank BSB" type="text" v-model="user.bankbsb"></v-text-field></v-flex>
                    <v-flex xs6><v-text-field append-icon="home" name="bankaccount" label="Bank account" type="text" v-model="user.bankaccount"></v-text-field></v-flex>
                  </v-layout>                    
                </v-container>   
              </v-form>
               
            </v-card-text>
            <v-card-actions>
              <v-btn icon><v-icon color="blue">fa fa-facebook-square fa-lg</v-icon></v-btn>
              <v-btn icon><v-icon color="red">fa fa-google fa-lg</v-icon></v-btn>
              <v-btn icon><v-icon color="light-blue">fa fa-twitter fa-lg</v-icon></v-btn>
              <v-spacer></v-spacer>
              <v-btn block color="primary" @click="save" :loading="loading">Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      loading: false,
      status: '', 
      user: { id: 0, firstname: '', lastname: '', username: '', password: '', email: '', role: '', address1: '', address2: '', town: '', postcode: '', country: '', bankbsb: '', bankaccount: '' },
      countries: ['Australia', 'Canada', 'France', 'Malaysia', 'United Kingdom', 'United States'],
      roles: ['customer', 'manager', 'guest'],
      submitted: false,
      error: '',
      result: ''   
    };
  },
  methods: {
    save: function () {
      if(this.user.username=='' || this.user.password=='' || this.user.email==''){
        this.error = 'username, password and email fields are required';
        return;
      }
      this.error = '';
      this.result = 'Saving data to server...';
        let postdata = { "op": "register", "data": this.user };
        //console.log(JSON.stringify(postdata));
        this.$http.post('php/apiUser.php', postdata, { 
          headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          let uid = this.user.email;
          this.result = response.body;
          this.user.id = 0;
          this.user.username = '';
          this.user.password = '';
          this.user.email = '';
          window.location.href = 'apiCustomer.html?uid='+uid;
          console.log('save:'+uid);
        }, response => {
          this.result = 'Failed to save data to server.';
        });
      },
    }   
};
</script>

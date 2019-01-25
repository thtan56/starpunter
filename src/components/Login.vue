// const Login = Vue.component('logincomponent', {
<template>
  <div>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="images/tipstars.jpg" alt="Vue Material Admin" width="250" height="150">
                  <h1 class="flex my-4 primary--text">Starpunter</h1>
                </div>         
                <v-form>
                  <v-text-field append-icon="person" label="Login" type="text" v-model="model.email"></v-text-field>
                  <v-text-field append-icon="lock" label="Password" id="password" type="password" v-model="model.password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn icon><v-icon color="blue">fa fa-facebook-square fa-lg</v-icon></v-btn>
                <v-btn icon><v-icon color="red">fa fa-google fa-lg</v-icon></v-btn>
                <v-btn icon><v-icon color="light-blue">fa fa-twitter fa-lg</v-icon></v-btn>
                <v-spacer></v-spacer>
                <v-btn block  @click="login">Login</v-btn>
                <v-btn block  @click="$router.push('/signup')">Register</v-btn>
                <a href="#" @click="forgot">Forgot Password</a>
                <!-- router-link to="/password/forgot">Forgot Password</router-link -->
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
</template>

<script>
import store from '../store';    // 1
import axios from 'axios';

export default {
  name: 'Login',
  components: { store, axios },   // 2
  data () {
    return { 
      isActive: false,
      loading: false,
      model: { email: 'thtan56@gmail.com', password: 'password' },
      user: [],
      sport: {},     // cannot use sport: []
      round: '',
      organiser: '',
      today: '',
      email: ''
    }; 
  },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('YYYY/MM/DD');
      }
    }
  },
  methods: {
    updateStoreUser() {
      console.log('4) updateStore',this.user);
      this.$store.commit('modifyMyRecord', this.user);
    },
    updateStoreSport() {    // get round# & update to store     
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.displayDate} };
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            console.log("33) updateStoreSport", response.body.data);
            // ------------------------------------------
            // cannot proceed if 
            // 1) round not found
            //    a) goto system manager 
            //    b) create a record in period table
            //       i) define a round or week number for today
            //       ii)  including date range for that period  
            if (response.body.data.length === 0) {  
              this.$swal({
                title: '<strong>STOP!! Period info not found for today!</strong>',
                type: 'info',
                html: '** Ask system manager to setup the period for today',
                showCloseButton: true,
                confirmButtonText: '<i class="ion ion-thumbsup"></i> Cancel!',
              });                 
              this.$router.push({ path: '/login' });
              // this.sport.round = "";  // not found
            } else {
              this.sport.round = response.body.data[0].round;       // 1
            };
            this.sport.organiser=this.organiser;                    // 2
            this.sport.today  = this.displayDate;                   // 3
            this.$store.commit('modifySportRecord', this.sport);
            console.log("34) this.sport", this.sport);
            console.log("35) this.store.state.sport", this.$store.state.sport);                        
//            this.round = (results.length > 0) ? this.rounds[0] : ''; // 2) round
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    sendMailNow(user, newpassword) {
      console.log("55) sendMailNow > user",user, newpassword);
      this.result = 'Getting data from server...';
      var postdata = { op: "sendMail", 
                     data: {email: this.user.email, newpassword: newpassword, uid: this.user.id } };
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
           headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
        },      response => { this.result = 'Failed to load data to server.';
      });
      //---------------------
      this.$swal({
        title: '<strong>Forgot Password!</strong>',
        type: 'info',
        html: '** A <u>temporary password</u>**<br>'+
             ' has been sent to your mailbox.'+
             '<br>Change your password'+
             '<br>after log in with the temporary password',
        showCloseButton: true,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
      }); 
    },
    forgot() {
      console.log("51) forgot");
      this.$swal({
        title: '** Forgot Password **',
        html: '<b>Input email address:<br><br><input id="email-input" type="email"></b>',
        focusConfirm: false,
        preConfirm: () => { return  document.getElementById('email-input').value; },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        // Close dialog if user clicks outside
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.email = result.value;
          console.log("52) this.email", this.email);    // email
          var postdata = { op: "getUser", email: result.value };   
          this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
                        headers: { 'Content-Type': 'application/json' }
            }).then(response => { 
              this.user = response.body.data[0];      // 1 record only instead of array of records
              console.log("53) this.user", this.user);              
              if (typeof this.user === "undefined")  { 
                this.$swal({
                  title: '** Invalid Email Address **',
                  type: 'info',
                  html: '** Email address not registered'
                      + '<br>in our database',
                  showCloseButton: true,
                  confirmButtonText: '<i class="fa fa-thumbs-up"></i> Retry!',
                });
              } else {
                var newpassword = "12345678";
                this.sendMailNow(this.user, newpassword);
                this.$router.push({ path: '/' });    // home   
              }
            },      response => { this.result = 'Failed to load data to server.';
          });    
        };      // if
      });
    },
    login () {     
      this.organiser = this.$store.state.sport.organiser; 
      let qry = '/database/json_users_email.php?email=' + this.model.email;
      console.log('2) login-query:'+qry);
      axios.get(qry)
        .then(response => { 
          this.user = response.data[0];
          // this.updateStore(); 
          console.log('3) login-this.user:', this.user);
          console.log('5) this.user.resetpassword:', this.user.resetpassword);
          if (this.user.resetpassword == 1) {
            console.log("6) need to reset");
            this.$router.push({ path: '/password/reset' });  // 1st time user
          } else {
            console.log("7) no need to reset, password:", this.model.password);
            var $mypwd = Sha256.hash(this.model.password);
            if ($mypwd !== this.user.password) {   // confirm old password
              this.$swal({
                title: '<strong>Invalid Password!</strong>',
                type: 'info',
                html: '** You have entered incorrect password '+this.oldpassword,
                showCloseButton: true,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Retry!',
              });                 
              this.$router.push({ path: '/login' });
            } else {
                  // update store
              this.updateStoreSport();    
              this.updateStoreUser(); 
              if (this.role === 'manager') {
                this.$router.push({ path: '/manager' }); // dashboard v2 (user profile)
              } else {
                this.$router.push({ path: '/' });        // dashboard v2 (user profile)
              };
            };  // check password
          };    // reset password
        })    // axios
        .catch(error => { console.log(error) });  
    },  
  },   // end of method
  created () { console.log('1) Login.vue: created'); },
  mounted() { this.isActive = this.selected; },
};
</script>

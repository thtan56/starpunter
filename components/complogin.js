//************************************************************
const password = Vue.component('passwordcomponent', {
  props: { 
    'activity': {type: String}
  },
  template: /* syntax: html */ `
  <div>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="/images/tipstars.jpg" alt="Vue Material Admin" width="250" height="150">
                  <h1 class="flex my-4 primary--text">Starpunter</h1>
                </div>     
                <h2>{{activity}} Password</h2>    
                <v-form>
                  <v-text-field append-icon="person" label="Email:" type="text" v-model="model.email" readonly background-color="red"></v-text-field>
                  <template v-if="activity === 'change'">                  
                    <v-text-field append-icon="lock" label="Current Password" id="oldpassword" type="password" v-model="oldpassword"></v-text-field>
                    <v-text-field append-icon="lock" label="New Password"     id="newpassword" type="password" v-model="newpassword"></v-text-field>
                    <v-text-field append-icon="lock" label="Repeat Password" id="confirmpassword" type="password" v-model="confirmpassword"></v-text-field>
                  </template>
                  <template v-else-if="activity === 'reset'">   
                    <v-text-field append-icon="lock" label="New Password"     id="newpassword" type="password" v-model="newpassword"></v-text-field>
                    <v-text-field append-icon="lock" label="Repeat Password" id="confirmpassword" type="password" v-model="confirmpassword"></v-text-field>
                  </template>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn v-if="activity==='change' " block color="primary" @click="change">Submit</v-btn>       
                <v-btn v-if="activity==='reset' " block color="primary" @click="reset">Submit</v-btn>             
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  `,
  data () { 
    return {
      oldpassword: '',
      newpassword: '',
      confirmpassword: '', 
      model: { username: '',  email: 't.h.tan@dunelm.org.uk', password: 'password', newpass: '' },
      user: []
    }; 
  },
  methods: {
    reset () {
      console.log("11) reset");
      if (this.newpassword !== this.confirmpassword) {
        swal({
          title: '<strong>Wrong Password!</strong>',
          type: 'info',
          html: '** Your <u>new password</u> does not match <u>confirm password</u>',
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Retry!',
        }); 
      } else {
        this.user.password = this.newpassword;
        console.log("12) this.newpassword:", this.newpassword);
        console.log("13) this.user");
        console.log(this.user);
        this.result = 'Getting data from server...';
        var postdata = { op: "resetPassword", data: this.user };   
        this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
          },      response => { this.result = 'Failed to load data to server.';
        });
        swal({
          title: '<strong>Congratulation!</strong>',
          type: 'info',
          html: '** Your password has changed successfully',
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
        }); 
        this.$router.push({ path: '/login' }); 
      };
    },  
    change () {
      console.log("11) change");
      $oldpwd = Sha256.hash(this.oldpassword);
      if ($oldpwd !== this.user.password) {   // confirm old password
        swal({
          title: '<strong>Invalid Password!</strong>',
          type: 'info',
          html: '** You have entered incorrect password '+this.oldpassword,
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Retry!',
        }); 
      } else if (this.newpassword !== this.confirmpassword) {
        swal({
          title: '<strong>Wrong Password!</strong>',
          type: 'info',
          html: '** Your <u>new password</u> does not match <u>confirm password</u>',
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Retry!',
        }); 
      } else {
        this.user.password = this.newpassword;
        this.result = 'Getting data from server...';
        var postdata = { op: "changePassword", data: this.user };   
        this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
          },      response => { this.result = 'Failed to load data to server.';
        });
        swal({
          title: '<strong>Congratulation!</strong>',
          type: 'info',
          html: '** Your password has changed successfully',
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
        }); 
        this.$router.push({ path: '/login' }); 
      };
    },  
    getAllData: function (email) {
      console.log("1) getAllData");
      this.result = 'Getting data from server...';
      var postdata = { op: "getUser", email: email };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.user = response.body.data[0];       // 1 record only
          console.log(this.user);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
    console.log("1) beforeMount:", this.$store.state.loginUser);
    this.model.username = this.$store.state.loginUser.username;
    this.model.email    = this.$store.state.loginUser.email;
    this.getAllData(this.model.email);
  }
});
//****************************************************
const Login = Vue.component('logincomponent', {
  template: /* syntax: html */ `
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
  `,
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
              swal({
                title: '<strong>STOP!! Period info not found for today!</strong>',
                type: 'info',
                html: '** Ask system manager to setup the period for today',
                showCloseButton: true,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Cancel!',
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
      swal({
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
      swal({
        title: '** Forgot Password **',
        html: '<b>Input email address:<br><br><input id="email-input" type="email"></b>',
        focusConfirm: false,
        preConfirm: () => { return  document.getElementById('email-input').value; },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        // Close dialog if user clicks outside
        allowOutsideClick: () => !swal.isLoading()
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
                swal({
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
          console.log('3) login-this.user:');
          console.log(this.user);
          console.log('5) this.user.resetpassword:', this.user.resetpassword);
          if (this.user.resetpassword == 1) {
            console.log("6) need to reset");
            this.$router.push({ path: '/password/reset' });  // 1st time user
          } else {
            console.log("7) no need to reset, password:", this.model.password);
            var $mypwd = Sha256.hash(this.model.password);
            if ($mypwd !== this.user.password) {   // confirm old password
              swal({
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
  created () { console.log('1) complogin.js : created'); },
  mounted() { this.isActive = this.selected; },
});

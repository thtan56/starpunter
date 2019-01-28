// const password = Vue.component('passwordcomponent', {
<template>
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
</template>

<script>
import store from '../store';
export default {
  name: 'Password',
  props: { 'activity': {type: String} },
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
          confirmButtonText: '<i class="material-icons">thumb_down</i> Retry!',
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
          confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
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
          confirmButtonText: '<i class="material-icons">thumb_down</i> Retry!',
        }); 
      } else if (this.newpassword !== this.confirmpassword) {
        swal({
          title: '<strong>Wrong Password!</strong>',
          type: 'info',
          html: '** Your <u>new password</u> does not match <u>confirm password</u>',
          showCloseButton: true,
          confirmButtonText: '<i class="material-icons">thumb_down</i> Retry!',
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
          confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
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
};
</script>

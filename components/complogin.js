const Login = Vue.component('logincomponent', {
  template: `
  <div>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="images/tipstars.jpg" alt="Vue Material Admin" width="250" height="150">
                  <h1 class="flex my-4 primary--text">Toby Sports</h1>
                </div>         
                <v-form>
                  <v-text-field append-icon="person" label="Login" type="text" v-model="model.username"></v-text-field>
                  <v-text-field append-icon="lock" label="Password" id="password" type="password" v-model="model.password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn icon><v-icon color="blue">fa fa-facebook-square fa-lg</v-icon></v-btn>
                <v-btn icon><v-icon color="red">fa fa-google fa-lg</v-icon></v-btn>
                <v-btn icon><v-icon color="light-blue">fa fa-twitter fa-lg</v-icon></v-btn>
                <v-spacer></v-spacer>
                <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
                <v-btn block color="secondary" href="/apiRegister.html">Register</v-btn>
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
      model: { username: 'admin@isockde.com', password: 'password' },
      user: []
    }; 
  },
  created () { console.log('1) complogin.js : created'); },
  mounted() { this.isActive = this.selected; },
  methods: {
    updateStore () {
      this.$store.commit('modifyMyRecord', this.user);
    },
    login () {
      let qry = 'database/json_users_email.php?email=' + this.model.username;
      axios.get(qry)
        .then(response => { 
          this.user = response.data[0];
          this.updateStore();
        })  
        .catch(error => { console.log(error) });  

      this.loading = true;
      setTimeout(() => { 
        this.$router.push({ name: 'secured', params: { userId: this.model.username }});  // dashboard v2
      }, 1000);
    },  
  }
});

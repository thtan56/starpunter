// Vue.component('userinfo', { 
<template>
  <v-card>
    <v-toolbar color="pink" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Profile:{{username}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>search</v-icon></v-btn>
      <v-btn icon><v-icon>check_circle</v-icon></v-btn>
    </v-toolbar>

    <v-tabs v-model="tabs" color="purple" dark slider-color="yellow">
      <v-tab>General</v-tab><v-tab>Address</v-tab><v-tab>Others</v-tab>
      <v-tab-item>
        <v-list subheader three-line>
          <v-subheader>User Controls</v-subheader>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>email:{{ user.email }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">cash:{{ user.cash }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>vcash:{{ user.vcash }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ user.role }}</v-list-tile-action-text>
              <v-icon color="grey lighten-1">star_border</v-icon>
              <v-icon color="yellow darken-2">star</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile>  
            <v-list-tile-content>
              <v-list-tile-title>full name:{{ user.lastname }} {{ user.lastname }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">Address:{{ user.address1 }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Status:{{ user.status }}</v-list-tile-sub-title>
            </v-list-tile-content>  
          </v-list-tile>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <v-list subheader two-line>
          <v-subheader>Address Controls</v-subheader>     
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Password</v-list-tile-title>
              <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <v-list subheader three-line>
          <v-subheader>Others</v-subheader>
                    <v-divider></v-divider>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>Bank Info</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">BSB:{{ user.bankbsb }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Account:{{ user.bankaccount }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile>  
            <v-list-tile-content>
              <v-list-tile-title>Address</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ user.address1 }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ user.address2 }}</v-list-tile-sub-title>
            </v-list-tile-content>  
          </v-list-tile>
        </v-list>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
export default {
  name: 'userinfo',
  props: { username: {type: String} },
  data() {
    return { 
      tabs: "",
      user:[] 
    }
  },
  methods: {
    getAllData() {
      console.log("10) getAllData:", this.username);   // orgweek, username    
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserByName", username: this.username };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.user = (response.body === null) ? [] : response.body.data[0]; 
          console.log("13) this.user", this.user);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },      
  },  // end of methods
  created () {
    console.log('1) main.js :created', this.username);
    this.getAllData();
  }
};
</script>

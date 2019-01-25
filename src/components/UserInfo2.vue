// Vue.component('userinfo2', { 
<template>
  <v-card>
    <v-toolbar color="pink" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>search</v-icon></v-btn>
      <v-btn icon><v-icon>check_circle</v-icon></v-btn>
    </v-toolbar>
    <v-tabs v-model="tabs" color="purple" dark slider-color="yellow">
      <v-tab>General</v-tab><v-tab>Betting Records</v-tab><v-tab>Statement of Accounts</v-tab>
      <v-tab-item>
        <div class="container-fluid">
          <h1>Customer Info</h1>
          <div class="row">
            <div class="col-md-4 ">
              <address>
                <strong>Name:</strong><br>
                {{userData.lastname}} {{userData.firstname}}<br>
                Email: {{userData.email}}<br>
                Username: {{userData.username}}<br>
                <strong>Address:</strong><br>      
                {{userData.address1}}<br>
                {{userData.address2}}
              </address>
            </div>                <div class="col-md-4">
              <div class="row">
                <div class="col-md-6"><p class="text-right"><strong>Cash:</strong></p></div>
                <div class="col-md-6">{{ userData.cash }}</div>
                <div class="col-md-6"><p class="text-right"><strong>vCash:</strong></p></div>
                <div class="col-md-6">{{ userData.vcash }}</div>
                <div class="col-md-6"><p class="text-right"><strong>Role:</strong></p></div>
                <div class="col-md-6">{{ userData.role }}</div>
                <div class="col-md-6"><p class="text-right"><strong>Status:</strong></p></div>
                <div class="col-md-6">{{ userData.status}}</div>   <!-- default left align -->
              </div>
            </div>
            <div class="col-md-4">
              <div class="row">
                <div class="col-md-6"><p class="text-right"><strong>Bank Bsb:</strong></p></div>
                <div class="col-md-6">{{ userData.bankbsb }}</div>
                <div class="col-md-6"><p class="text-right"><strong>Bank Account:</strong></p></div>
                <div class="col-md-6">{{ userData.bankaccount }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <v-list subheader three-line>
          <v-subheader>Others</v-subheader>
                    <v-divider></v-divider>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>Bank Info</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">BSB:{{ userData.bankbsb }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Account:{{ userData.bankaccount }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile>  
            <v-list-tile-content>
              <v-list-tile-title>Address</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ userData.address1 }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ userData.address2 }}</v-list-tile-sub-title>
            </v-list-tile-content>  
          </v-list-tile>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <soacomponent :username="userData.username"></soacomponent>
      </v-tab-item>

    </v-tabs>
  </v-card>
</template>

<script>
import soacomponent from '../components/SoaComponent.vue'

export default {
  name: 'userinfo2',
  props: { userData: {type: Object } },   
  components: { soacomponent },
  data() {
    return { 
      tabs: ""
    }
  },  
};
</script>

// UserGames.vue - ticketinfo.js
// const userGames=Vue.component('UserGamesComponent', {
<template>
  <v-content>
    <!-- navbars></navbars -->
    <topmenu></topmenu>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 class="my-3">
          <v-card color="grey lighten-4" flat height="300px">
          
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-side-icon><img src="images/tristars2.png" width="70" height="40"></v-toolbar-side-icon>
      <v-toolbar-title>My Profile</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tabs slot="extension" v-model="tabs" color="grey" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
        
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-card flat>
          <v-card-text>Personal<v-icon>fingerprint</v-icon>
            <v-flex xs6 sm6 d-flex><v-text-field append-icon="person" label="Username" type="text" v-model="user.username"></v-text-field></v-flex>
            <v-flex xs6 sm6 d-flex><v-text-field append-icon="lock" label="Password" type="password" v-model="user.password"></v-text-field></v-flex>
            <v-flex xs6 d-flex><v-text-field append-icon="email" label="Email" type="text" v-model="user.email"></v-text-field></v-flex>
            <v-flex xs6 d-flex>
              <v-combobox v-model="user.role" :items="roles" label="Select your role:"></v-combobox>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-tab-item>             
      <v-tab-item>Address<v-icon>contact_mail</v-icon>
        <v-card flat>
          <v-card-text>
            Address content
            <v-layout row wrap>
              <v-flex xs6><v-text-field append-icon="person" label="First name" type="text" v-model="user.firstname"></v-text-field></v-flex>
              <v-flex xs6><v-text-field append-icon="person" label="Last name" type="text" v-model="user.lastname"></v-text-field></v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs6><v-text-field append-icon="home" name="address1" label="Address 1" type="text" v-model="user.address1"></v-text-field></v-flex>
              <v-flex xs6><v-text-field append-icon="home" name="address2" label="Address 2" type="text" v-model="user.address2"></v-text-field></v-flex>
            </v-layout> 
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>Account<v-icon>business</v-icon>
        <v-card flat>
          <v-card-text>
            Banking Details
            <v-layout row wrap>
              <v-flex xs4><v-text-field append-icon="home" label="Town" type="text" v-model="user.town"></v-text-field></v-flex>
              <v-flex xs4><v-text-field append-icon="home" label="Postcode" type="text" v-model="user.postcode"></v-text-field></v-flex>
              <v-flex xs4><v-select append-icon="outlined_flag" label="Country" v-model="user.country" :items="countries"></v-select></v-flex>
            </v-layout>                        
            <v-layout row wrap>
              <v-flex xs6><v-text-field append-icon="outlined_flag" name="bsb" label="Bank BSB" type="text" v-model="user.bankbsb"></v-text-field></v-flex>
              <v-flex xs6><v-text-field append-icon="home" name="bankaccount" label="Bank account" type="text" v-model="user.bankaccount"></v-text-field></v-flex>
            </v-layout>  
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>Tickets<v-icon>bookmarks</v-icon><v-card><v-card-text>
        <userTickets></userTickets>           <!-- components/serviceticket.js -->
      </v-card-text></v-card></v-tab-item>

      <v-tab-item>Cash Flow<v-icon>account_balance</v-icon><v-card><v-card-text>
        <cashFlow></cashFlow>           <!-- components/customerinfo.js -->
      </v-card-text></v-card></v-tab-item>

      <v-tab-item>Bet History<v-icon>build</v-icon><v-card><v-card-text>
        <betComponent status='closed' />              <!-- components/compBasketball.js (close) -->

      </v-card-text></v-card></v-tab-item>
      <v-tab-item>Games<v-icon>games</v-icon><v-card><v-card-text>
        <betComponent status='pending' />              <!-- components/compBasketball.js (pending) -->
      </v-card-text></v-card></v-tab-item>

      <v-tab-item><v-icon>account_balance</v-icon><v-card><v-card-text>
        <poolComponent></poolComponent>           <!-- components/customerinfo.js -->
      </v-card-text></v-card></v-tab-item>
      <v-tab-item><v-icon>face</v-icon><v-card><v-card-text>other</v-card-text></v-card></v-tab-item>
    </v-tabs-items>

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import store from '../store';    // 1
import axios from 'axios';
import topmenu from './TopMenu.vue';
import userTickets from './UserTickets.vue';
import cashFlow from './CashFlow.vue';
import betComponent from './BetComponent.vue';
import poolComponent from './PoolComponent.vue';

export default{
  name: 'userGames',
  components: { store, axios, topmenu, userTickets, cashFlow, betComponent, poolComponent },   // 2
  data(){
    return{
      isActive: false, 
      tabs: null,
      items: ['Personal', 'Address', 'Account','Tickets','Cash Flow', 'Bet History', 'Games', 'Pool Summary', 'Contracts'],
      loading: false,
      status: '', 
      user: { firstname: '', lastname: '', username: '', password: '', email: '', role: '', address1: '', address2: '', town: '', postcode: '', country: '', bankbsb: '', bankaccount: '' },
      countries: ['Australia', 'Canada', 'France', 'Malaysia', 'United Kingdom', 'United States'],
      roles: ['player', 'manager', 'administrator', 'guest'],
      submitted: false
    };
  },
  computed: {
    username() {
      return this.$store.state.loginUser.username;
    }
  },
  created () {
    console.log('1) ticketinfo.js: created');
    let qry = 'database/json_users_email.php?email=' + this.$store.state.loginUser.email;   //this.$route.params.userId;
    console.log(qry);   
    axios.get(qry)
      .then(response => { 
        this.user = response.data[0];
        console.log(this.user);
      })  
      .catch(error => { console.log(error) });  
  },
  mounted() { this.isActive = this.selected; },     
}
</script>

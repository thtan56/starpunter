// const homeGames=Vue.component('homegamelist', {
<template>
  <v-container fluid grid-list-md>
    <homebars></homebars>
    <!-- == 1a) selected pool info =============================================================================== -->
    <v-layout row wrap>
      <v-flex d-flex xs6><poolinfo :poolData="poolData">Pool# {{poolData.pool_id}} Profile</poolinfo></v-flex>
      <v-flex d-flex xs6><poolentrants :poolData="poolData">
            Entrants/Tickets in pool {{poolData.pool_id}}</poolentrants></v-flex>

      <v-flex d-flex xs8> 
        <gameweekbet :poolData="poolData" @clicked-childselected="getUserGames">
          <v-toolbar-title>{{poolData.orgweek}} Games </v-toolbar-title>
          <v-spacer></v-spacer>
          Pool#{{poolData.pool_id}}
        </gameweekbet></v-flex>

      <v-flex d-flex xs4>
        <v-layout row wrap>
          <v-flex d-flex>
            <poolusergames :poollist="gamelist">
                <v-toolbar-title>My Bets - {{poolData.orgweek}} Games</v-toolbar-title> 
                <v-spacer></v-spacer>
                <v-btn flat>Username:{{username}}</v-btn><v-btn flat>Pool#{{poolData.pool_id}}</v-btn>
            </poolusergames>
          </v-flex>
          <v-flex d-flex><userjournals :username="username"></userjournals></v-flex>
        </v-layout>  
      </v-flex> 
    </v-layout>
  </v-container>
</template>
<script>
import store from '../store'; // 1
import homebars from './HomeBars.vue'; // 1
import poolinfo from './PoolInfo.vue';

import poolentrants from './PoolEntrants.vue';
import gameweekbet from './GameWeekBet.vue';
import poolusergames from './PoolUserGames.vue';

import userjournals from './UserJournals.vue';
export default {
  name: 'homeGames',
  props: {
    username: {type: String }, 
    poolData: {type: Object }      // orgweek replaces organiser,round
  },
  components: { store, homebars, poolinfo, poolentrants, gameweekbet, poolusergames, userjournals },
  data () {
    return {
      valid: false,
      gamelist: []
    }
  },
  methods: {
    getUserGames(c2item) {
      console.log("11) getUserGames", c2item);    // betItem
      var orgweek  = c2item.organiser.concat(":",c2item.round);
      var username = this.$store.state.loginUser.username;
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getPoolUserGames", 
                  data: {orgweek: orgweek, username: username, pool_id: c2item.pool_id } };   // orgweek, pid, username
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data;    
          console.log("12) this.gamelist", this.gamelist);                         
        },   response => { this.result = 'Failed to load data to server.';
      });
    }
  },
  created() {
    console.log("1) HG: created: username, poolData:", this.username, this.poolData); 
    // poolData: {type: Object }      // orgweek replaces organiser,round
    this.getUserGames(this.poolData);
  }
};
</script>

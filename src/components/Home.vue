// const Home = Vue.component('homepage', {
<template>
  <v-content>
    <homebars></homebars>
    <topboxes></topboxes>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar color="blue-grey" dark>
        <v-toolbar-title>Game for the week</v-toolbar-title>
          <v-toolbar-items>
            <v-flex xs3 v-for="org in organisers" :key="org.name">
              <v-btn flat color="white">
                <img :src="org.img" class="mb-4"/> 
                  <v-checkbox :value="org.name" :key="org.name" :label="org.name" v-model="selected"
                       :id="org.name"></v-checkbox>   <!-- 1st filter: use watch to intercept change  -->
              </v-btn>
            </v-flex>
            <v-flex xs3>
              <v-btn flat><v-icon small @click="changeRound(-7)">fast_rewind</v-icon>
                {{ round }} <v-icon small @click="changeRound(7)">fast_forward</v-icon>
              </v-btn> 
              <v-btn flat>{{today}}</v-btn>
            </v-flex>  
          </v-toolbar-items>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs9>
          <homepools   :selected="selected" :today="today"></homepools>
          <v-layout row wrap>
            <v-flex xs6><leaderboard></leaderboard></v-flex>
            <v-flex xs6><gameboard></gameboard></v-flex>    <!-- active games with ticket bought -->
          </v-layout>
        </v-flex>
        <v-flex xs3>
          <userlist></userlist>
          <userSummary :selected="selected" :today="today"></userSummary></v-flex>
      </v-layout>
      </v-container>
  </v-content>
</template>

<script>
import store from '../store';
import axios from 'axios';
import moment from 'moment';
import homebars from './HomeBars.vue';    //1
import topboxes from './TopBoxes.vue';
import homepools from './HomePools.vue';
import leaderboard from './LeaderBoard.vue';    //1
import gameboard from './GameBoard.vue';
import userlist from './UserList.vue';
import userSummary from './UserSummary.vue';

export default {
  name: 'Home',
  components: { store, axios, moment, homebars, topboxes, homepools, leaderboard, gameboard, userlist, userSummary },   // 2
  data () {
    return {
      organiser: 'NBA',
      round: '',
      today: '',
      username:'thtan56',
      organisers: [
              { name: 'NBA',  img: '/images/NBA2.png', link: '/game/NBA' },
              { name: 'NBL',  img: '/images/NBL2.png', link: '/game/NBL' },
              { name: 'AFL',  img: '/images/afl2.png', link: '/game/AFL' },
              { name: 'NFL',  img: '/images/nfl2.png', link: '/game/NFL' }
              ],
      sport: {},     // cannot use sport: []
      selected: [],             
    }
  },
  methods: {    
    changeRound(days) {
      let objDate = moment(this.today, 'YYYY/MM/DD').toDate();   // this.today = string
      this.today = moment(objDate).add(days, 'days').format('YYYY/MM/DD');  // moment needs obj
      this.getRound();
    },
    getRound: function () {
      console.log("20) getRound",this.organiser, this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.today} };   
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            console.log("22) reponse.body", response.body); 
            if (response.body.data.length === 0) { this.round = "";
            } else {     this.round = response.body.data[0].round; };
            console.log("23) this.round", this.round);
        },  response => { this.result = 'Failed to load data to server.';
      });
    },  
    //===================================
  },
  // update store - with round and today date
  beforeRouteEnter (to, from, next) {   
    var sport = {};
    var organiser = "NBA";                            // 1) default
    let $today = new Date;                            
    var today = moment($today).format('YYYY/MM/DD');  // 2)  
    var round = "";                                   // 3)
    console.log("10) Home.vue:beforeRouteEnter", organiser, today);
    var result = 'Getting data from server...'; 
    var postdata = { op: "getOrgCurrentRound", 
                   data: {organiser: organiser, today: today} };
    axios.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          if (response.data.length === 0) {  
            this.$swal({
              title: '<strong>STOP!! Period info not found for today!</strong>',
              type: 'info',
              html: '** Ask system manager to setup the period for today',
              showCloseButton: true,
              confirmButtonText: '<i class="material-icons">thumb_down</i> Cancel!',
            });                 
          } else {
            sport.organiser= organiser;                   // 1
            sport.today    = today;                       // 2
            sport.round    = response.data.data[0].round; // 3
            store.commit('modifySportRecord', sport);     
            next(vm => vm.posts = response.data)
          };
        },      response => { this.result = 'Failed to load data to server.';
    });
  },
  created(){
    this.username  = this.$store.state.loginUser.username;   // update during login   but what if not login
    this.organiser = this.$store.state.sport.organiser;      // 1)
    this.round     = this.$store.state.sport.round;          // 2)
    this.today     = this.$store.state.sport.today;          // 3) important, use for 2nd organiser
    console.log("11) home.vue:created:today", this.today);
    this.selected  =[this.organiser];     // default filter (1st time) 
  }
};
</script>

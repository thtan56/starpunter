// const BetMyResults = Vue.component('betmyresults', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar color="pink" dark>
          <v-toolbar-title>My Results for  
            <v-btn flat> <v-icon small @click="changeRound(-7)">fast_rewind</v-icon>
              {{ round }}<v-icon small @click="changeRound(7)">fast_forward</v-icon>
            </v-btn>
            <v-btn flat>{{today}}</v-btn>
            <span STYLE="font-size: 10pt">({{pstart | moment }}:{{pend | moment }})</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
            <v-card-title>                                                                <!-- 2 -->
              <v-layout row wrap>
                Organiser:
                <div v-for="org in organisers" :key="org">
                  <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
                </div>
              </v-layout>            
            </v-card-title>    
          </v-toolbar-items>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <mybetresults  :organiser="organiser" :round="round" :username="username"></mybetresults>
          <mypoolresults :organiser="organiser" :round="round" :username="username"></mypoolresults>
        </v-flex>
      </v-layout>
      </v-container>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import store from '../store';    // 1
import moment from 'moment';
import mybetresults from './MyBetResults.vue';
import mypoolresults from './MyPoolResults.vue';

export default {
  name: 'betMyResults',
  components: { topmenu, store, mybetresults, mypoolresults },
  data () {
    return {
      organiser: 'NBA',
      round: '',
      pstart: '',
      pend: '',
      today: '',
      username:'thtan56',
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      sport: {},     // cannot use sport: []
      selected: [],         
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;
        this.getRound();
      }
    },    
    changeRound(days) {
      let objDate = moment(this.today, 'YYYY/MM/DD').toDate();   // this.today = string
      this.today = moment(objDate).add(days, 'days').format('YYYY/MM/DD');  // moment needs obj
      this.getRound();
    },
    getRound() {
      console.log("11) getRound",this.organiser, this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.today} };    
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
          { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            if (response.body.data.length === 0) {
              this.round = "";
              this.pstart = "";
              this.pend ="";
            } else {
              this.round = response.body.data[0].round;
              this.pstart = response.body.data[0].start;
              this.pend = response.body.data[0].end_dt;
            };
        },  response => { this.result = 'Failed to load data to server.';
      });
    },
    //===================================
  },
  created(){
    this.username  = this.$store.state.loginUser.username;   // update during login   but what if not login
    this.organiser = this.$store.state.sport.organiser;      // 1)
    this.round     = this.$store.state.sport.round;          // 2)
    this.today     = this.$store.state.sport.today;          // 3) important, use for 2nd organiser
    console.log("1) betmyresults-created", this.organiser, this.round);
    this.selected  =[this.organiser];     // default filter (1st time)     
  }  
};
</script>

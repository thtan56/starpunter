// const GameResults = Vue.component('gameresultcomponent', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-layout row wrap>
      <v-flex xs12>    
        <v-toolbar color="pink" dark>
          <v-toolbar-title>Weekly Update of Game Results for  
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
        <v-flex xs8><gameWeekResults  :organiser="organiser" :round="round"></gameWeekResults></v-flex>
        <v-flex xs4><poolgames    :organiser="organiser" :round="round"></poolgames></v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import gameWeekResults from './GameWeekResults.vue';
import poolgames from './PoolGames.vue';
import moment from 'moment';

export default {
  name: 'gameResults',
  components: { topmenu, gameWeekResults, poolgames },
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
    console.log("1) gameresults-created", this.organiser, this.round);
    this.selected  =[this.organiser];     // default filter (1st time)     
  }  
};
</script>

// const ticketSummary = Vue.component('ticketsummarycomponent', {
<template>
  <v-content>
    <homebars></homebars>
    <topboxes></topboxes>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs2>
          <v-layout row wrap>
            <v-flex xs12><weekticketsummary @clicked-childselected="getTickets"></weekticketsummary></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex xs4><summarychart>Sport Weekly Summary</summarychart></v-flex>
            <v-flex xs4><gamesummaryschart>Sport Weekly Match Count</gamesummaryschart></v-flex>
            <v-flex xs4>Week#{{selected.orgweek}} Details
              <!-- weekinfo :weekData="weekinfo">Week#{{selected.orgweek}} Details</weekinfo -->
              </v-flex>
            <v-flex xs12><ticketweektable :ticketData="ticketlist">
                        Sport Week - [{{selected.orgweek}} ]
                      </ticketweektable>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import homebars from './HomeBars.vue'
import topboxes from './TopBoxes.vue';
import weekticketsummary from './WeekTicketSummary.vue'
import summarychart from './SummaryChart.vue'
import gamesummaryschart from './GameSummarysChart.vue'
// import gameinfo from './GameInfo.vue'
import ticketweektable from './TicketWeekTable.vue'

export default {
  name: 'TicketSummary',   // component name
  components: { homebars, topboxes, 
    weekticketsummary, summarychart, gamesummaryschart, ticketweektable },   // 2
  data() {
    return {
      selected: {},
      ticketinfo: {},
      initinfo: { home_team:'', away_team:'', home_score:0, away_score: 0, start: '', status: ''},     
      ticketlist: [],
      totals: { cost: 0, income: 0},   
    }
  },
  methods: {
    getTickets(citem) {
      console.log("151) getTickets:citem", citem);
      this.selected = citem;
      console.log("153) getTickets:citem.orgweek", this.selected.orgweek);   
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgWeekTicketGames", orgweek: this.selected.orgweek };    // orgweek
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          console.log("155) response.body", response.body);
          if (response.body === null) {
            this.ticketlist = [];
            this.ticketinfo = this.initinfo;      
          } else {
            this.ticketlist = response.body.data;  // tickets for selected orgweek
            console.log("156) this.ticketlist", this.ticketlist);
            this.ticketinfo = (this.ticketlist.length === 0) ? this.initinfo : this.ticketlist[0];
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  }    
};
</script>

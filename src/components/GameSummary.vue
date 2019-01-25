// const gameSummary = Vue.component('gamesummarycomponent', {
<template>
  <v-content>
    <homebars></homebars>
    <topboxes></topboxes>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs2>
          <v-layout row wrap>
            <v-flex xs12><gameusersummary @clicked-childselected="getGames"></gameusersummary></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex xs4><summarychart>Sport Weekly Summary</summarychart></v-flex>
            <v-flex xs4><gamesummaryschart>Sport Weekly Match Count</gamesummaryschart></v-flex>
            <v-flex xs4><gameinfo :gameData="gameinfo">Game#{{selected.game_id}} Details</gameinfo></v-flex>
            <v-flex xs12><gameweektable :gameData="gamelist">
                        Games - [{{selected.orgweek}} Game#{{selected.game_id}}]
                      </gameweektable>
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
import gameusersummary from './GameUserSummary.vue'
import summarychart from './SummaryChart.vue'
import gamesummaryschart from './GameSummarysChart.vue'
import gameinfo from './GameInfo.vue'
import gameweektable from './GameWeekTable.vue'

export default {
  name: 'GameSummary',   // component name
  components: { homebars, topboxes, 
    gameusersummary, summarychart, gamesummaryschart, gameinfo, gameweektable },   // 2
  data() {
    return {
      selected: {},
      gameinfo: {},
      initinfo: { home_team:'', away_team:'', home_score:0, away_score: 0, start: '', status: ''},     
      gamelist: [],
      totals: { cost: 0, income: 0},   
    }
  },
  methods: {
    getGames(citem) {
      console.log("151) getGames:citem", citem);
      this.selected = citem;
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getTicketGames2", data: this.selected };    // orgweek, gid   
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null) {
            this.gamelist = [];
            this.gameinfo = this.initinfo;      
          } else {
            this.gamelist = response.body.data;
            console.log("152) this.gamelist", this.gamelist);
            this.gameinfo = (this.gamelist.length === 0) ? this.initinfo : this.gamelist[0];
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  }    
};
</script>

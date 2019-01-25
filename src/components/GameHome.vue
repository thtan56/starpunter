// const gameHome=Vue.component('gamehome', {
<template>
  <v-container fluid grid-list-md>
    <homebars></homebars>
    <!-- == 1a) selected pool info =============================================================================== -->
    <v-layout row wrap>
      <v-flex d-flex xs6><gameinfo :gameData="gameData">Game#: {{game_id}} Profile</gameinfo></v-flex>
      <v-flex xs3><gamechart :game_id="game_id"></gamechart></v-flex>   

      <v-flex xs8>
        <userticketgames :gameData="games">
          <v-toolbar-title>Ticket Games: {{gameData.orgweek}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat>Game#:{{game_id}}</v-btn>
        </userticketgames>
      </v-flex>

    </v-layout>
  </v-container>
</template>
<script>
import homebars from './HomeBars.vue'; // 1
import gameinfo from './GameInfo.vue';
import gamechart from './GameChart.vue';
import userticketgames from './UserTicketGames.vue';
export default {
  name: 'gamehome',
  props: {
    game_id: {type: String },  
    gameData: {type: Object }      // username, etc
  },
  components: { homebars, gameinfo, gamechart, userticketgames },
  data () {
    return {
      selected: {},
      games: [],
      totals: {score: 0, income: 0},
      //--------------------
    }
  },
  methods: {
    getAllData() {
      console.log("10) getAllData:game_id:", this.game_id);
      var result = 'Getting data from server...';
      var postdata = { op: "getTicketGamesByGame", gid: this.game_id };    // orgweek, username   
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null) { this.games = [];      
          } else { this.games = response.body.data;
                   console.log("11)this.games", this.games);
                   //this.plotGameStat(this.games);     
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },   // end of methods
  created() {
    console.log("1) created-gameData", this.gameData);
    this.getAllData();
  }
};
</script>

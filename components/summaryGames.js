const gameSummary = Vue.component('gamesummarycomponent', {
  template: `
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
  `,
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
});

Vue.component('gameweektable', {
  props: { gameData: {type: Array } },          
  template: `
  <div>
    <v-toolbar flat color="deep-orange" dark>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>Ticket Games</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :pagination.sync="pagination" :items="gameData">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}} / {{ props.item.ticket_id}}</td>
        <td>{{ props.item.bet_team}} / {{ props.item.bet_score}}</td> 
        <td>{{ props.item.pool_id}} / {{ props.item.pool_name}}</td>
        <td>{{ props.item.entry_cost}} / {{ props.item.entry_quorum}}</td>
        <td>{{ props.item.pool_prize}}</td>
        <td>{{ props.item.payout}}</td>
        <td>{{ props.item.entrants}}</td>
      </template>
    </v-data-table>
  </div>
  `,
  data () {
    return {
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      headers: [ { text: 'Username/Ticket#', value: 'username' }
              ,{ text: 'Bet Team/Score', value: 'bet_team' }
              ,{ text: 'Pool#/Name', value: 'pool_id' }  
              ,{ text: 'Entry Cost/Quorum', value: 'entry_cost' }
              ,{ text: 'Pool Prize', value: 'pool_prize' }
              ,{ text: 'Payout', value: 'payout' }
              ,{ text: 'Entrants', value: 'entrants' }
                ],
    }
  }
});


// Vue.component('poolgames', {
<template>
  <div>
    <v-card dark color="primary">
      <v-card-title><span class="headline">Pools</span></v-card-title>
      <v-card-text>
        <v-data-table :headers="pheaders" :items="pools" :pagination.sync="ppagination">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.organiser}} / {{ props.item.round}}</td>
            <td>{{ props.item.id}} / {{ props.item.pool_name}}
            <v-icon small @click="showGameWinners(props.item)">more_horiz</v-icon></td>   
            <td>{{ props.item.entrants}}</td>       
            <td>{{ props.item.start | moment}} : {{ props.item.end_dt | moment}}</td>
          </template>
        </v-data-table>
      </v-card-text>            
    </v-card>
        <!-- ===================================================================== -->
    <v-dialog v-model="tabledialog" max-width="1500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Game Winners in Pool {{pool_id}}:{{pool_name}}</span></v-card-title>
        <v-card-text>
            Tickets (Click row for games of specific user)
          <v-data-table :headers="theaders" :pagination.sync="tpagination"
                :items="ptickets">                                            <!-- pool tickets -->
            <template slot="items" slot-scope="props">
              <tr @click="showAlert(props.item)">
                <td>{{ props.item.organiser}} / {{ props.item.round}}</td>
                <td>{{ props.item.username}}</td>
                <td>{{ props.item.id}}</td>
                <td>{{ props.item.income}}</td>
                <td>{{ props.item.total_score}}</td>
              </tr>   
            </template>
          </v-data-table>
        </v-card-text>
        </v-card>

        <v-toolbar color="pink" dark    >
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title>Games</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
          <v-btn color="white" flat @click.native="close">Close</v-btn> 
        </v-toolbar>  
        <v-card dark color="blue-grey">     
        <v-card-text>
          <v-data-table :headers="gheaders" :pagination.sync="gpagination" :search="search"
                :items="pgames">                                              <!-- ticket games -->
            <template slot="items" slot-scope="props">
              <tr @click="showAlert(props.item)">
                <td>{{ props.item.organiser}} / {{ props.item.round}}</td>
                <td>{{ props.item.home_team}} / {{ props.item.away_team}}</td>
                <td>{{ props.item.start | moment }}</td>
                <td>{{ props.item.game_id}} / {{ props.item.game_winner}}</td>  
                <td>{{ props.item.home_score}}/{{ props.item.away_score}}</td> 
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.bet_team}}</td> 
                <td>{{ props.item.bet_score}}</td> 
                <td>{{ props.item.ticket_id}}/{{ props.item.income}}</td> 
                <td>{{ props.item.id}}</td>
              </tr> 
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog> 
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'poolGames',
  props: { organiser: { type: String } 
          ,round:     { type: String }  },
  data () {
    return {
      pools: [],
      pgames: [],
      ptickets: [],
      search:'',
      pool_id: 0,
      pool_name: '',
      tabledialog: false,
      pheaders: [{ text: 'Organiser/Round', value: 'organiser' },
          ,{ text: 'Pool #/Name', value: 'id' } 
          ,{ text: 'Entrants', value: 'entrants', width: '10%'}
          ,{ text: 'Start:End', value: 'start'} ],                   
      gheaders: [{ text: 'Organiser/Round', value: 'organiser' },
          ,{ text: 'Home/Away Team', value: 'home_team' } ,{ text: 'Game Date', value: 'start' }
          ,{ text: 'Game# / Winner', value: 'game_id' }
           ,{ text: 'Home/Away score', value: 'home_score'} 
          , { text: 'Username', value: 'username'}
          ,{ text: 'Bet Team', value: 'bet_team'} 
          ,{ text: 'Bet Score', value: 'bet_score'} 
          ,{ text: 'Ticket#/Income', value: 'ticket_id'}    
          ,{ text: 'TicketGame#', value: 'id'} ],    
      theaders: [{ text: 'Organiser/Round', value: 'organiser' },
          ,{ text: 'Username', value: 'username' } ,{ text: 'Ticket#', value: 'id' }
          ,{ text: 'Income', value: 'income' }
           ,{ text: 'Total Score', value: 'total_score'}  ], 
      
      tpagination: { page: 1, rowsPerPage: 5, totalItems: 0 },                  
      gpagination: { page: 1, rowsPerPage: 5, totalItems: 0 },  

      ppagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
           
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  watch: {
    organiser(newVal, oldVal) { this.getPools(); },
    round(newVal, oldVal)     { this.getPools(); },    
  },  
  methods: {
    showAlert(item) {
      //alert("Click on"+item.username);
      this.search=item.username;
    },
    getPools() {
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getPools", data: { organiser: this.organiser, round: this.round } };    
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), 
          { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.pools = response.body.data;
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    showGameWinners(item) {
      this.pool_id = item.id;
      this.pool_name=item.pool_name;

      this.result = 'Getting data from server...'; 
      var postdata = { op: "getPoolTickets", pid: item.id };    
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.ptickets = response.body.data;
          console.log("61) showGameWinners:this.ptickets", this.ptickets);
        },      response => { this.result = 'Failed to load data to server.';
      });
      postdata = { op: "getPoolGames", pid: item.id };    
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.pgames = response.body.data;
          console.log("62) showGameWinners:this.pgames", this.pgames);
        },      response => { this.result = 'Failed to load data to server.';
      });
      this.tabledialog = true;
    },
    close () { this.tabledialog = false; },
  },
  beforeMount(){ 
    this.getPools();
  }
};
</script>

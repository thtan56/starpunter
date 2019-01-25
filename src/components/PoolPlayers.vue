// Vue.component('poolPlayers', {
<template>
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>{{pageTitle}}
        </v-toolbar-title><v-spacer></v-spacer>
        <v-btn :disabled="role != 'manager'" color="info" @click="newGame()">New Game Contest</v-btn>
      </v-toolbar>
  
      <v-layout row wrap>
        <div v-for="org in orgs" :key="org">
          <v-flex xs2>
            <v-checkbox :value="org.name" :key="org.name" :label="org.name" v-model="selected"
                        :rules="[filterdata]"></v-checkbox>
          </v-flex>
        </div>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-layout>
  
      <v-data-table :headers="headers" 
                    :items="filtered" 
                    :pagination.sync="pagination" 
                    :search="search"
                    item-key="index"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.home_team}}<br>
              {{ props.item.away_team}}<br>
              {{ props.item.organiser}}</td>
          <td>{{ props.item.date}}<br>{{ weekNo(props.item.date) }}</td>
          <td>{{ props.item.entry_cost}}</td> 
          <td>{{ props.item.entrants}}/{{ props.item.entry_quorum}}</td>

          <td>{{ props.item.pool_prize}}</td>
          <td>{{ props.item.payout}}</td>
          <td class="text-xs-right">{{ props.item.team1_count}}/{{ props.item.team2_count}}</td>
          <td>{{ props.item.home_odd}}<br>{{ props.item.away_odd}}<br>{{ props.item.status}}</td>
          <td><poolusers :pool="props.item" /></td>
             
          <td>
            <v-icon :disabled="!exceedQuorum(props.item.entry_quorum, props.item.entrants)"
              small @click="betItem(props.item)">add_shopping_cart</v-icon>
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </template>
        <template slot="footer"><td colspan="100%"><strong>Notes: Just fill the blanks to register a new game</strong></td></template>
      </v-data-table> 
    </v-layout>
    <!-- ======================= statistics ========================== -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card color="grey">
          <v-card-title>Weekly Statistics</v-card-title>
          <v-data-table :headers="stheaders" :items="statistics">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.organiser}}</td>
              <td>{{ props.item.weekno}}</td>
              <td>{{ props.item.count1}}</td>
              <td>{{ props.item.count2}}</td>
            </template>
          </v-data-table> 
        </v-card>
      </v-flex>
    </v-layout>
   <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>
              <v-flex xs4><v-text-field label="Home Team" v-model="editedItem.home_team"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Team" v-model="editedItem.away_team"></v-text-field></v-flex>
              <v-flex xs4><v-combobox v-model="editedItem.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>

              <v-flex xs4><v-text-field label="Id" v-model="editedItem.id" readonly background-color="red"></v-text-field></v-flex>

              <v-flex xs4>   <!-- date picker -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.date">
                  <v-text-field slot="activator" label="Game date" v-model="editedItem.date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedItem.date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedItem.date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>    

              <v-flex xs4><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Quorum" v-model="editedItem.entry_quorum"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Count" v-model="editedItem.count"></v-text-field></v-flex> 
              <v-flex xs4><v-text-field label="Pool Prize" v-model="editedItem.pool_prize"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" flat @click.native="close">Cancel</v-btn>
          <v-btn color="white" flat @click.native="save">Save</v-btn>
          <v-spacer></v-spacer>
          Status: {{ result }}
          <span class="badge badge-danger">{{error}}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>  
     <v-dialog v-model="placebetdialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Place Bet</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6><v-text-field v-model="editedItem.home_team" label="Home Team" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs6><v-text-field v-model="editedItem.away_team" label="Away Team" readonly background-color="red"></v-text-field></v-flex>
           
              <v-flex xs12 sm4><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.id" label="Pool id" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_cost" label="Entry Cost" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entrants" label="Entry Count" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_quorum" label="Entry Quorum" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.pool_prize" label="Pool Prize" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.payout" label="Payout" readonly background-color="red"></v-text-field></v-flex>   

              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.username" label="Username" readonly background-color="red"></v-text-field></v-flex>

              <v-flex xs12 sm8>
                <v-radio-group v-model="editedItem.bet_winner" row label="Bet Winner:" background-color="green">
                  <v-radio v-for="item in editedItem.teams" :key="item" :label="item" :value="item"></v-radio>
                </v-radio-group>
              </v-flex>

              <!--  <v-text-field v-model="editedItem.bet_winner" :rules="[validName]" label="Bet winner">   -->   
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="betClose">Cancel</v-btn>
          <v-btn color="black" flat @click.native="betsave">Confirm Bet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'poolPlayers',
  data () {
    return {
        statistics: [],
        pools: [], 
        teams: [],
        game: { home_team:'', away_team: '', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              home_odd: 0, away_odd:0, pool_id: 0, username: '', status: '', id: 0 },  

        filtered: [],
        editdialog: false,
        placebetdialog: false,       
        menu: false,
        result: '',
        error: '',

        valid: false,

        organiser: 'NBA',  
        organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
        orgs: [ {name: 'NBA'},{name:'NBL'}, {name:'NFL'},{name:'AFL'},{name:'Asian Games'}],
        selected:[], 

        editedIndex: -1,
        editedItem: { home_team: '', away_team: '', organiser: '', venue: '', date: '', home_score: 0, away_score: 0, 
                      game_winner: '', status: '', home_odd: 0, away_odd: 0, id: 0 },
        bettedItem: { home_team: '', away_team: '', organiser: '', venue: '', game_date: '', game_winner: '', 
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },
        
        pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
        headers: [
                  { text: 'Game', value: 'name' }, 
                  ,{ text: 'Date/Wk', value: 'date' }, 
                  ,{ text: 'Entry Cost', value: 'entry_cost' },{ text: 'Quorum', value: 'entry_quorum' }
                  ,{ text: 'PoolPrize', value: 'pool_prize'} 
                  ,{ text: 'Payout', value: 'payout' } 
                  ,{ text: 'Teams count', value: 'team1_count' } 
                  ,{ text: 'Odds/Status', value: 'odds' } 
                  ,{ text: 'Username', value: 'username' } 
                  ],
         stheaders: [
                   { text: 'Organiser', value: 'organiser' }, 
                  ,{ text: 'Week', value: 'week' }, 
                  ,{ text: 'Count1', value: 'count1' }, 
                  ,{ text: 'Count2', value: 'count2' }
                  ],                 
        search: '',
      }
    },
    computed: {
      role() { return this.$store.state.loginUser.role; },
      formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
      pageTitle() { return 'Players for the week ' + moment().format('W') },

    },
    methods: {
      exceedQuorum(strQuorum, icount) {
        if (this.game.status == 'closed') { return false };   // closed, cannot take bets
        let regex= /[+]/g;
        let found = strQuorum.match(regex);
        if (found != null) { return true;      // + exist => unlimited
        } else {
          return ( icount == parseInt(strQuorum) ? false : true )   
        }
      },
//      validName(text) { return (this.editedItem.name.indexOf(text) >= 0) },
      weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },

      filterdata() {
        console.log('11)filterdata');
        console.log(this.selected);
        this.filtered = _.filter(this.pools, (pool) => _.includes(this.selected, pool.organiser) );
        console.log(this.filtered);
        return true;
      },

      newPool (game) {
        this.editedIndex = -1;
        this.editedItem.id = 0;
        this.editedItem.home_team = game.home_team;
        this.editedItem.away_team = game.away_team;
        this.editedItem.date = game.date;
        this.editedItem.entrants = 0;
        this.editedItem.entry_cost = 0;
        this.editedItem.entry_quorum = 0;
        this.editedItem.pool_prize = 0;
        this.editedItem.payout = '';
        this.editedItem.username = this.$store.state.loginUser.username;
        this.editdialog = true;  
      },

      editItem: function(item){
        this.editedIndex = this.pools.indexOf(item);
        this.editedItem = Object.assign({}, item);

        this.editedItem.home_team = item.home_team;
        this.editedItem.away_team = item.away_team;
        this.editedItem.organiser = item.organiser;
        this.editedItem.date = item.date;
        this.editedItem.home_odd = item.home_odd;
        this.editedItem.away_odd = item.away_odd;
        this.editedItem.entry_cost = item.entry_cost;
        this.editedItem.entrants = item.entrants;
        this.editedItem.entry_quorum = item.entry_quorum;
        this.editedItem.pool_prize = item.pool_prize;
        this.editedItem.payout = item.payout;
        this.editedItem.username = this.$store.state.loginUser.username;
        this.editedItem.id = item.id;
        this.editdialog = true;  
        console.log('101) editItem: this.editedItem');
        console.log(this.editedItem);
      },
      betItem: function(item){
        this.editedIndex = this.pools.indexOf(item);
        this.editedItem = Object.assign({}, item);

        if (this.$store.state.loginUser.username == this.editedItem.username1) {
          alert("You have already placed bet here!!");
          return;
        };
        this.editedItem.id       = item.id;
        this.editedItem.pool_id  = item.id;
        this.editedItem.home_team= item.home_team;
        this.editedItem.away_team= item.away_team;
        this.game.teams = [item.home_team, item.away_team];
        this.editedItem.teams    = this.game.teams;
        this.editedItem.date     = item.date;
        this.editedItem.username = this.$store.state.loginUser.username;
        this.placebetdialog = true;  
      },
      deleteItem: function(item){
        var r = confirm("Are you sure to delete this item ("+item.home_team+'-'+item.away_team+ ")?");
        if(r==true) {
          this.result = 'Deleting data to server...';
          var postdata = { op: "delete", id: item.id };
          this.$http.post('php/apiGame.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }})
            .then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
            },      response => { this.result = 'Failed to delete data.'; }
            );
        }
      },
      save() {
        if(this.editedItem.name=='' || this.editedItem.organiser=='' || this.editedItem.date =='' ){     // mysql name (match) problem 
          this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
          return;
        };
        if (this.editedIndex > -1) {
          Object.assign(this.pools[this.editedIndex], this.editedItem);
        } else {
          this.pools.push(this.editedItem);     // new
        };  
        
        this.editedItem.status = 'pending';
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.editedItem };
        this.$http.post('php/apiPoolGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
      },
      betsave () {
        if(this.editedItem.bet_winner==''){     // mysql name (match) problem 
          this.error = 'bet winner field is required';           // use select `match`, ....
          return;
        };
        console.log("3) betsave - ok");
        console.log(this.editedItem);
        this.error = '';
        this.result = 'Saving data to server...';

        var postdata = { "op": "addcount", "data": this.editedItem };      
        this.$http.post('php/apiPoolGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );    
      //----------------------
        this.bettedItem = this.editedItem;

        this.bettedItem.id = 0;    // insert new bet
        this.bettedItem.game_winner='';
        this.bettedItem.bet_type = "head2head";

        this.bettedItem.home_team = this.editedItem.home_team;
        this.bettedItem.away_team = this.editedItem.away_team;
        this.bettedItem.game_date = this.editedItem.date;
//        this.bettedItem.bet_odd = this.editedItem.odd;
        this.bettedItem.pool_id = this.editedItem.pool_id;    // keep pool_id (id = 0 ????)
        this.bettedItem.bet_amount = this.editedItem.entry_cost;
      // ----- problems below: null values needs defaults (head 2 head does need these data in bet table) ------------
        this.bettedItem.venue = "";       
        this.bettedItem.home_score = 0;
        this.bettedItem.away_score = 0;
        this.bettedItem.bet_odd = 1;
        this.bettedItem.bet_score1 = 0;
  //    Object.assign(this.pools[this.editedIndex], this.editedItem);
      // =====================================================
        var postdata = { "op": "save", "data": this.bettedItem };      
        this.$http.post('/php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          ); 
        this.getBetPools(this.editedItem);     // refresh - ok 
        this.betClose();
      },
      betClose() { this.placebetdialog = false; },
      close () { this.editdialog = false; },
      getBetPools: function (game) {
        this.result = 'Getting data from server...';
        var postdata = { op: "getBetPools", data: game };    // name, date
        this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.pools = response.body.data;
          },      response => { this.result = 'Failed to load data to server.';
          });
      },  
      getAllData: function () {
        this.pools=[];
        console.log("90) getAllData");
        this.result = 'Getting data from server...';
        var postdata = { op: "getWeekPools" };
        this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            this.pools = response.body.data;
            console.log('91) this.pools');
            console.log(this.pools);
          },      response => { this.result = 'Failed to load data to server.';
          });
      },
      getStatistics: function () {
        console.log("80) getStatistics");
        this.statistics=[];
        this.result = 'Getting data from server...';
        var postdata = { op: "getWeekStats" };
        this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            this.statistics = response.body.data;
            console.log('81) this.statistics');
            console.log(this.statistics);
          },      response => { this.result = 'Failed to load data to server.';
          });
      },
    },
    beforeMount(){ 
      this.getStatistics();
      this.getAllData(); 
    }
};
</script>

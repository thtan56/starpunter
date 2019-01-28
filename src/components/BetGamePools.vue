// const pools = Vue.component('betpools', {
<template>
  <v-container fluid grid-list-md>
    <v-card color="grey">

    <v-data-iterator :items="pools"
      :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" 
      content-tag="v-layout" hide-actions row wrap dark>   <!-- every individuals bottom potion -->
      <v-toolbar slot="header" class="mb-2" color="indigo darken-5" dark flat>
        <v-toolbar-title>{{ game.home_team }} vs {{game.away_team}} - ({{ game.date }} ){{game.status}}
          <v-btn :disabled="role != 'manager'" color="info" @click="newPool(game)">
            New Pool</v-btn>
        </v-toolbar-title>
      </v-toolbar>

      <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg4>    <!-- lg3 = control width -->
        <v-card color='green'>     <!-- 1 box -->
          <v-card-title class="subheading font-weight-bold">Entry cost:{{ props.item.entry_cost }}</v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Entry Quorum:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.entrants }} / {{ props.item.entry_quorum }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Pool Prize:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.pool_prize }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Payout:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.payout }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ game.teams[0] }}:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.team1_count }}
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ game.teams[1] }}:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.team2_count }}</v-list-tile-content>
            </v-list-tile>
<!-- ============================================================ 
    disable button         if entrants == 2
    only manager           can edit & delete pool
-->
            <v-icon :disabled="!exceedQuorum(props.item.entry_quorum, props.item.entrants)"
              small @click="betItem(props.item)">add_shopping_cart</v-icon>

            <v-icon :disabled="role != 'manager'" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon :disabled="role != 'manager'" small @click="deleteItem(props.item)">delete</v-icon>
          </v-list>
        </v-card>
      </v-flex>

      <v-toolbar slot="footer" class="mt-2" color="indigo" dark dense flat>
        <v-toolbar-title class="subheading">click on shopping cart to 'place bet'</v-toolbar-title>
      </v-toolbar>
    </v-data-iterator>
    </v-card>
    <!-- ===================================================================================================== -->
    <v-dialog v-model="pooldialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs4><v-text-field v-model="editedItem.organiser" label="Organiser" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs4><v-text-field v-model="editedItem.home_team" label="Home Team" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs4><v-text-field v-model="editedItem.away_team" label="Away Team" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs3><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>              
              <v-flex xs3><v-text-field v-model="editedItem.round" label="Round" readonly background-color="red"></v-text-field></v-flex>  
              <v-flex xs3><v-text-field v-model="editedItem.id" label="Pool id" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs3><v-text-field v-model="editedItem.entrants" label="Entry Count" readonly background-color="red"></v-text-field></v-flex>

              <v-flex xs12>
                <v-radio-group v-model="editedItem.bet_type" row label="Bet Type:" background-color="green">
                  <v-radio v-for="item in ['head2head','group']" :key="item" :label="item" :value="item"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_cost" label="Entry Cost" background-color="green"
              :disabled="editedItem.id > 0"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_quorum" label="Entry Quorum" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.pool_prize" label="Pool Prize" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.payout" label="Payout" background-color="green"></v-text-field></v-flex>  

              <!-- <v-text-field v-model="editedItem.username" label="Username" background-color="green">   -->   
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="close">Cancel</v-btn>
          <v-btn color="black" flat @click.native="save">Save</v-btn>
          <v-btn color="black" flat @click.native="newBet">Bet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ======================================================================================================= -->
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

              <v-flex xs12>
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
  name: 'betGamePools',
  props: { 
    'game': {type: Object },
    'dialog' : {type: Boolean, default: false }
  },
  data () {
    return {
      valid: false,  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 4 },
      pooldialog: false,
      placebetdialog: false,
      editedIndex: -1,
      editedItem: { home_team: '', away_team:'', organiser: '', venue: '', date: '', round: '', bet_type: '', bet_winner: ''
              ,home_score: 0, away_score: 0,
              odd_date: '', home_odd: 0, away_odd: 0, pool_id: 0, username: '', id: 0 },
      bettedItem: { home_team: '', away_team: '', organiser: '', venue: '', game_date: '', game_winner: '', 
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },
      bet_types: ['head2head','standard','group'],
      pools: [],
      teams: [],
    }
  },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    formTitle () { return this.editedIndex === -1 ? 'New Pool' : 'Edit Pool' }
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
    validName(text) {
      return (this.editedItem.name.indexOf(text) >= 0)
    },
    newPool (game) {
      this.editedIndex = -1;
      this.editedItem.id = 0;
      this.editedItem.organiser = game.organiser;
      this.editedItem.home_team = game.home_team;
      this.editedItem.away_team = game.away_team;
      this.editedItem.date      = game.date;
      this.editedItem.round     = game.round;
      this.editedItem.bet_type = "head2head";
      this.editedItem.odd_date = "2018-10-10";

      this.editedItem.entrants = 0;
      this.editedItem.entry_cost = 0;
      this.editedItem.entry_quorum = 0;
      this.editedItem.pool_prize = 0;
      this.editedItem.payout = '';
      this.pooldialog = true;  
    },
    editItem: function(item){
      this.editedIndex = this.pools.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.editedItem.id = item.id;
//      this.editedItem.name = item.name;
      this.editedItem.home_team = item.home_team;
      this.editedItem.away_team = item.away_team;


      this.editedItem.date = item.date;

      this.pooldialog = true;  
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
      this.editedItem.home_team     = item.home_team;
      this.editedItem.away_team     = item.away_team;
      this.editedItem.date     = item.date;

      this.editedItem.username = this.$store.state.loginUser.username;
      this.editedItem.teams    = this.game.teams;

      this.placebetdialog = true;  
    },
    deleteItem: function(item){
      const index = this.pools.indexOf(item);
      var r = confirm("Are you sure to delete this item ("+item.home_team+" vs "+item.away_team+ ":Entry cost="+this.pools[index].entry_cost+")?");
      if(r==true) {
        this.pools.splice(index, 1);          // remove deleted item  
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { this.result = response.body;
          },      response => { this.result = 'Failed to delete data.'; }
          );
        }
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.pools[this.editedIndex], this.editedItem);     // 1) update datatable
      } else {
        if (this.pools === undefined || this.pools.length == 0) {
          this.pools = []; 
        };   // initialise if null
        this.pools.push(this.editedItem);                                // 2) insert new to datatable
      };     
      
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
//      this.bettedItem.bet_odd = this.editedItem.odd;
      this.bettedItem.pool_id = this.editedItem.pool_id;    // keep pool_id (id = 0 ????)
      this.bettedItem.bet_amount = this.editedItem.entry_cost;
      // ----- problems below: null values needs defaults (head 2 head does need these data in bet table) ------------
      this.bettedItem.venue = "";       
      this.bettedItem.home_score = 0;
      this.bettedItem.away_score = 0;
      this.bettedItem.bet_odd = 1;
      this.bettedItem.bet_score1 = 0;
      // =====================================================
      var postdata = { "op": "save", "data": this.bettedItem };      
      this.$http.post('php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
        }, response => { this.result = 'Failed to save data to server.'; }
        ); 
      this.getBetPools(this.editedItem);     // refresh - ok 
 //     this.$emit('close-placebetdialog');  
      this.betClose();
    },
    betClose() {
      this.placebetdialog = false;
    },
    close() { this.pooldialog = false; },
    getBetPools: function (game) {
        console.log('98) getBetPools:game>');
        console.log(game);
        this.result = 'Getting data from server...';
        var postdata = { op: "getBetPools", data: game };    // name, date
        this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.pools = response.body.data;
            console.log('99) getBetPools');
            console.log(this.pools);        // null if new game created but no pools yet
          },      response => { this.result = 'Failed to load data to server.';
          });
        },
    },
    beforeMount(){
      console.log('1) beforeMount');
      console.log(this.game);
      this.game.teams = [this.game.home_team, this.game.away_team];
      this.getBetPools(this.game);                        // get this.pools
    }
};
</script>      

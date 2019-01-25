// betOgame (odd), betNgame( top n game - quorum based)
// Vue.component('betOgame', {
<template>
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Odd Betting (Head 2 Head ??)</v-toolbar-title><v-spacer></v-spacer>
        <v-btn :disabled="role != 'manager'" color="info" @click="newPool()">New Pool</v-btn>
      </v-toolbar>   
      <v-card-title>
        <v-layout row wrap>
          <div v-for="org in orgs" :key="org">
            <v-flex xs2>
            <input type="radio" :value="org.name" id="org.name" v-model="checkedOrganisers" @click="check($event)"
              :checked="org.name==organiser">
             {{org.name}}
            </v-flex>
          </div>
        </v-layout>
        <v-spacer></v-spacer>
        ** To place bet, click on the numbers
      </v-card-title>  
    </v-layout>  
    <v-layout row wrap>        
      <v-data-table :headers="headers" :items="pools" :pagination.sync="pagination" :search="search">
        <template slot="items" slot-scope="props">
          <td>
            <v-layout justify-center>
              <v-flex xs12>
                <v-toolbar color="indigo" dark>
                  <v-toolbar-side-icon></v-toolbar-side-icon>
                  <v-toolbar-title>{{ props.item.organiser }}:{{ props.item.home_team }} vs {{ props.item.away_team }}
                                  ({{ props.item.date }})</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon><v-icon>search</v-icon></v-btn>
                </v-toolbar>
                <v-card>
                  
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-card>
                          <v-img :src="props.item.image1" height="200px" width="200px" />
                          <v-divider></v-divider>
                          <v-card-title primary-title><div class="headline">{{props.item.home_team}}</div>
                            <v-card-actions><v-btn icon @click="betItem(props.item,1)">4.5</v-btn></v-card-actions>
                            <v-icon small @click="betItem(props.item,1)">add_shopping_cart</v-icon>
                          </v-card-title>
                        </v-card>
                      </v-flex>
                      <v-flex xs6>
                        <v-card>
                          <v-img :src="props.item.image2" height="200px" width="200px" />
                          <v-divider></v-divider>
                          <v-card-title primary-title><div class="headline">{{props.item.away_team}}</div>
                            <v-card-actions><v-btn icon @click="betItem(props.item,2)">3.5</v-btn></v-card-actions>
                            <v-icon small @click="betItem(props.item,2)">add_shopping_cart</v-icon>
                          </v-card-title>
                        </v-card>
                      </v-flex>
                    </v-layout>

                </v-card>
              </v-flex>
            </v-layout>
          </td>
        </template>
      </v-data-table>
    </v-layout>

    <v-dialog v-model="pooldialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm8><v-text-field v-model="editedItem.name" label="Game name" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm4><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.id" label="Pool id" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.entrants" label="Entry Count" readonly background-color="red"></v-text-field></v-flex>

              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_cost" label="Entry Cost" background-color="green"
              :disabled="editedItem.id > 0"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_quorum" label="Entry Quorum" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.pool_prize" label="Pool Prize" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.payout" label="Payout" background-color="green"></v-text-field></v-flex>  

              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.odd_date" label="Odd date" background-color="green"></v-text-field></v-flex>

              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.home_odd" label="Home Odd" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.away_odd" label="Away Odd" background-color="green"></v-text-field></v-flex> 
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
    <v-dialog v-model="placebetdialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Place Bet</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm5><v-text-field v-model="editedItem.home_team" label="home team" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm5><v-text-field v-model="editedItem.away_team" label="away team" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs2><v-text-field v-model="editedItem.id" label="Pool#" readonly background-color="red"></v-text-field></v-flex> 

              <v-flex xs12 sm4><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.username" label="Username" readonly background-color="red"></v-text-field></v-flex>
            </v-layout>
              <!-- =========================================================== -->
            <v-layout wrap> 
              <v-flex xs12>
                <v-card color="blue darken-1"><v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.odd_date" label="odd date" readonly background-color="red"></v-text-field></v-flex>
                    <v-flex xs12>
                      <v-radio-group v-model="editedItem.bet_winner" column label="Bet:" background-color="green">
                        <v-radio v-for="item in editedItem.teams" :key="item" :label="item" :value="item"></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.bet_amount" label="bet amount" background-color="green"></v-text-field></v-flex>
                  </v-layout>
                </v-card-text></v-card>
              </v-flex>
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
import store from '../store';    // 1
export default {
  name: 'betOgame',
  components: { store },
  data () {
    return {
      valid: false,  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 6 },
      search:'',
      pooldialog: false,

      placebetdialog: false,
      tabs: null,
      editedIndex: -1,
      editedItem: { name: '', organiser: '', venue: '', date: '', bet_winner: '', home_score: 0, away_score: 0,
              odd_date: '', home_odd: 0, away_odd: 0, selected_odd: 1,
              pool_id: 0, username: '', id: 0 },
      bettedItem: { game_name: '', organiser: '', venue: '', game_date: '', game_winner: '', odd_date: '',
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },
      pools: [],
      teams: [],
      game:[],

      organiser: 'NBA',  
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
      orgs: [ {name: 'NBA'},{name:'NBL'}, {name:'NFL'},{name:'AFL'},{name:'Asian Games'}],
      checkedOrganisers:[],
      headers: [],
    }
  },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    formTitle () { return this.editedIndex === -1 ? 'New Pool' : 'Edit Pool' },
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('MM/DD/YYYY');
      }
    }
  },
  methods: {
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;
        this.getAllData();
      }
    },
    exceedQuorum(strQuorum, icount) {
      if (this.game.status == 'closed') { return false };   // closed, cannot take bets
      let regex= /[+]/g;
      let found = strQuorum.match(regex);
      if (found != null) { return true;      // + exist => unlimited
      } else {
        return ( icount == parseInt(strQuorum) ? false : true )   
      }
    },
    newPool () {
      this.editedIndex = -1;
      this.editedItem.id = 0;
//      this.editedItem.name = game.name;
//      this.editedItem.date = game.date;
      this.editedItem.entrants = 0;
      this.editedItem.entry_cost = 0;
      this.editedItem.entry_quorum = 0;
      this.editedItem.pool_prize = 0;
      this.editedItem.payout = '';
      this.editedItem.odd_date = '';
      this.editedItem.home_odd = 0;
      this.editedItem.away_odd = 0;
      this.pooldialog = true;  
    },
    editItem: function(item){
      this.editedIndex = this.pools.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.editedItem.id = item.id;
      this.editedItem.name = item.name;
      this.editedItem.date = item.date;

      this.pooldialog = true;  
      console.log('101) editItem: this.editedItem');
      console.log(this.editedItem);
    },
    betItem: function(item, index){
      console.log('21) betItem');
      console.log(item);
      console.log(index);
      this.editedIndex = this.pools.indexOf(item);
      this.editedItem = Object.assign({}, item);

      if (this.$store.state.loginUser.username == this.editedItem.username1) {
        alert("You have already placed bet here!!");
        return;
      };
     
      this.editedItem.bet_winner =  (index == 1) ? this.editedItem.home_team : this.editedItem.away_team;
      this.editedItem.bet_odd    =  (index == 1) ? this.editedItem.home_odd : this.editedItem.away_odd;

      this.editedItem.teams=[];
      this.editedItem.teams.push(this.editedItem.home_team);
      this.editedItem.teams.push(this.editedItem.away_team);

      console.log(this.editedItem.bet_winner);
      
      this.editedItem.id       = item.id;
      this.editedItem.pool_id  = item.id;
      this.editedItem.name     = item.name;
      this.editedItem.odd_date = item.odd_date;
      this.editedItem.date     = item.date;

      this.editedItem.username = this.$store.state.loginUser.username;
//      this.editedItem.teams    = this.game.teams;

      this.placebetdialog = true;  
    },
    deleteItem: function(item){
      const index = this.pools.indexOf(item);
      var r = confirm("Are you sure to delete this item ("+item.name+ ":Entry cost="+this.pools[index].entry_cost+")?");
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

      this.bettedItem.game_name = this.editedItem.name;
      this.bettedItem.game_date = this.editedItem.date;
      this.bettedItem.odd_date = this.editedItem.odd_date;
      this.bettedItem.bet_odd = this.editedItem.selected_odd;
      this.bettedItem.pool_id = this.editedItem.pool_id;    // keep pool_id (id = 0 ????)
      this.bettedItem.bet_amount = this.editedItem.bet_amount;    // editedItem.entry_cost for quorum only
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
      this.betClose();
    },
    betClose() {
      this.placebetdialog = false;
    },
    close() { this.pooldialog = false; },
    getAllData: function () {
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgBetPools", id: this.organiser };    // name, date
      this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.pools = response.body.data;
          console.log('99) getAllData');
          console.log(this.pools);        // null if new game created but no pools yet
        },      response => { this.result = 'Failed to load data to server.';
        });
      },
    },
    beforeMount(){
      this.organiser = 'NBA';
      this.getAllData();                        // get this.pools
    }
};
</script>     

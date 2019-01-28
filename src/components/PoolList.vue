// const PoolList = Vue.component('poolList', {
<template>
<v-content>
  <topmenu></topmenu>
  <v-container fluid grid-list-md>
    <div>
      <v-tabs v-model="active" color="blue" dark slider-color="yellow">
        <v-card color="blue">
          <v-card-text>** Calendar **</v-card-text>
        </v-card>

        <v-tab to="/calendar/NBA">NBA<v-icon>calendar_view_day</v-icon></v-tab>
        <v-tab to="/calendar/NBL">NBL<v-icon>calendar_view_day</v-icon></v-tab>  
        <v-tab to="/calendar/AFL">AFL<v-icon>calendar_view_day</v-icon></v-tab>
        <v-tab to="/calendar/NFL">NFL<v-icon>calendar_view_day</v-icon></v-tab> 
        <v-tab to="/calendar/Asian Games">Asian Games<v-icon>calendar_view_day</v-icon></v-tab>            
      </v-tabs>
    </div>

    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>{{pageTitle}}
        </v-toolbar-title><v-spacer></v-spacer>
        <v-btn color="info" @click="newPool()">New Pool</v-btn>

        <!-- v-btn :disabled="role != 'manager'" color="info" @click="newGame()">New Game Contest</v-btn -->
      </v-toolbar>
 
      <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
        <v-tab v-for="filter in filterList" :key="filter.bet_type">{{ filter.bet_type }}</v-tab>

        <v-tab-item>
          <v-data-table :pagination.sync="pagination" :headers="headerO" :items="filtered2Items('odd')">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.bet_type}}</td> 
              <td>{{ props.item.odd_date}}</td>
              <td>{{ props.item.home_odd}}</td>
              <td>{{ props.item.away_odd}}</td>
              <td>{{ props.item.payout}}</td>
              <td class="text-xs-right">{{ props.item.team1_count}}/{{ props.item.team2_count}}</td>
              <td>{{ props.item.status}}</td>
              <td><poolusers :pool="props.item" /></td>
             
              <td>
                <v-icon small @click="betItem(props.item)">add_shopping_cart</v-icon>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template slot="footer"><td colspan="100%"><strong>Note1: Inclusive of 'Over' or 'Under' bets</strong></td></template>
          </v-data-table>
        </v-tab-item>
        <!-- ================================================================== -->
        <v-tab-item v-for="filter in quorumList" :key="filter.bet_type">
          <v-data-table :pagination.sync="pagination" :headers="headers" :items="filtered2Items(filter.bet_type)">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.bet_type}}</td> 
              <td>{{ props.item.entry_cost}}</td> 
              <td>{{ props.item.entrants}}/{{ props.item.entry_quorum}}</td>

              <td>{{ props.item.pool_prize}}</td>
              <td>{{ props.item.payout}}</td>

              <td class="text-xs-right">{{ props.item.team1_count}}/{{ props.item.team2_count}}</td>
              <td>{{ props.item.status}}</td>
              <td><poolusers :pool="props.item" /></td>
             
              <td>
                <v-icon :disabled="!exceedQuorum(props.item.entry_quorum, props.item.entrants)"
                  small @click="betItem(props.item)">add_shopping_cart</v-icon>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template slot="footer"><td colspan="100%"><strong>Note2: Just fill the blanks to register a new game</strong></td></template>
          </v-data-table>
        </v-tab-item>
        <!-- ===================================================================== -->
        <v-tab-item v-for="filter in totalList" :key="filter.bet_type">
          <v-data-table :pagination.sync="pagination" :headers="headerT" :items="filtered2Items(filter.bet_type)">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.bet_type}}</td> 
              <td>{{ props.item.odd_date}}</td>
              <td>{{ props.item.home_odd}}</td> 
              <td>{{ props.item.bet_score1}}</td>      <!-- total score --> 

              <td class="text-xs-right">{{ props.item.team1_count}}/{{ props.item.team2_count}}</td>
              <td>{{ props.item.status}}</td>
              <td><poolusers :pool="props.item" /></td>
              <td>
                <v-icon :disabled="!exceedQuorum(props.item.entry_quorum, props.item.entrants)"
                  small @click="betItem(props.item)">add_shopping_cart</v-icon>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template slot="footer"><td colspan="100%"><strong>Note3: Under / Over Match's total score with odd given</strong></td></template>
          </v-data-table>
        </v-tab-item>
      </v-tabs> 
    </v-layout>
   <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>
              <template v-if="editedItem.id > 0">
                <v-flex xs2><v-text-field label="Organiser" v-model="editedItem.organiser" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs8><v-text-field label="Game Name" v-model="gameName" readonly background-color="red"></v-text-field></v-flex>
              </template>  
              <template v-else>
                <v-flex xs2>
                  <v-select v-model="editedItem.organiser" :items="organisers" label="Select your organiser:" @change="change2Organiser"></v-select>
                </v-flex>
                <v-flex xs4><v-select v-model="editedItem.home_team" :items="teams" label="Home team:"></v-select></v-flex>
                <v-flex xs4><v-select v-model="editedItem.away_team" :items="teams" label="Away team:"></v-select></v-flex>
              </template>              
              <v-flex xs2><v-text-field label="Pool Id" v-model="editedItem.id" readonly background-color="red"></v-text-field></v-flex>

              <v-flex xs4>   <!-- game date picker -->
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
               <v-flex xs4><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>  

              <v-flex xs4><v-text-field label="Pool#" v-model="editedItem.pool_id"></v-text-field></v-flex>
              <v-flex xs12>
                  <v-radio-group v-model="editedItem.status" row label="Status:" background-color="green">
                    <v-radio v-for="item in ['pending','closed']" :key="item" :label="item" :value="item"></v-radio>
                  </v-radio-group>
              </v-flex>
            </v-layout>
            <!-- ==================================================================  -->
            <v-tabs slot="extension" v-model="tabs" color="grey" align-with-title>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs">
              <v-tab-item><v-icon>supervisor_account</v-icon>
                <v-layout wrap>       
                  <v-flex xs4>   <!-- odd date picker -->
                    <v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.odd_date">
                      <v-text-field slot="activator" label="Odd date" v-model="editedItem.odd_date" prepend-icon="event" readonly></v-text-field>
                      <v-date-picker v-model="editedItem.odd_date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu1.save(editedItem.odd_date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>  
                  <v-flex xs4><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>         

              <v-tab-item>
                <v-icon>motorcycle</v-icon>
                <v-layout wrap>
                    <v-flex xs4><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"
                      :disabled="editedItem.id > 0"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Quorum" v-model="editedItem.entry_quorum"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Count" v-model="editedItem.count"></v-text-field></v-flex> 
                  <v-flex xs4><v-text-field label="Pool Prize" v-model="editedItem.pool_prize"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item><v-icon>waves</v-icon>
                <v-layout wrap>
                    <v-flex xs4><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"
                      :disabled="editedItem.id > 0"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Quorum" v-model="editedItem.entry_quorum"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Count" v-model="editedItem.count"></v-text-field></v-flex> 
                  <v-flex xs4><v-text-field label="Pool Prize" v-model="editedItem.pool_prize"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>
                </v-layout>
                </v-tab-item>

              <v-tab-item>
                <v-icon>attach_money</v-icon>
                <v-layout wrap>
                  <!-- *** administrator area  *** -->
                  <v-flex xs4><v-text-field label="Winner" v-model="editedItem.winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>

            </v-tabs-items>
            <!-- ============================================================ -->
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
        <v-card-title><span class="headline">Place Bet ({{editedItem.bet_type}})</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12><v-text-field v-model="gameName" label="Game name" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs4><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>         
              <v-flex xs4><v-text-field v-model="editedItem.id" label="Pool id" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs4><v-text-field v-model="editedItem.username" label="Username" readonly background-color="red"></v-text-field></v-flex>
              <!-- =====================================================================================  -->
              <template v-if="editedItem.bet_type === 'odd' ">
                <v-flex xs4><v-text-field v-model="editedItem.odd_date" label="Odd Date" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs4><v-text-field v-model="editedItem.home_odd" label="Home Odd" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs4><v-text-field v-model="editedItem.away_odd" label="Away Odd" readonly background-color="red"></v-text-field></v-flex>

                <v-flex xs12>
                  <v-radio-group v-model="editedItem.bet_winner" row label="Bet Winner:" background-color="green">
                    <v-radio v-for="item in editedItem.teams" :key="item" :label="item" :value="item"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs6><v-text-field label="Bet Amount" v-model="editedItem.bet_amount" background-color="green"></v-text-field></v-flex>
              </template>  

              <template v-else-if="quorumBet">
                <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_cost" label="Entry Cost" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entrants" label="Entry Count" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_quorum" label="Entry Quorum" readonly background-color="red"></v-text-field></v-flex>
              
                <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.pool_prize" label="Pool Prize" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.payout" label="Payout" readonly background-color="red"></v-text-field></v-flex>   

                <v-flex xs12>
                  <v-radio-group v-model="editedItem.bet_winner" row label="Bet Winner:" background-color="green">
                    <v-radio v-for="item in editedItem.teams" :key="item" :label="item" :value="item"></v-radio>
                  </v-radio-group>
                </v-flex>
              </template>

              <template v-else>     <!-- over / under (total score) -->
                <v-flex xs12>
                  <v-radio-group v-model="editedItem.bet_type" row label="Bet type:" background-color="green">
                    <v-radio v-for="item in ['under','over']" :key="item" :label="item" :value="item"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs6><v-text-field v-model="editedItem.odd_date" label="Odd Date" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs6><v-text-field v-model="editedItem.home_odd" label="Home Odd" readonly background-color="red"></v-text-field></v-flex>
                <v-flex xs6><v-text-field label="Total Score" v-model="editedItem.bet_score1" background-color="green"></v-text-field></v-flex>
                <v-flex xs6><v-text-field label="Bet Amount" v-model="editedItem.bet_amount" background-color="green"></v-text-field></v-flex>
              </template>  
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
</v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import moment from 'moment';
export default {
  name: 'poolList',
  props: { 'gameid': {type: String } },
  components: { topmenu },
  data () {
      return {
        filterList: [
          { bet_type: 'odd' },
          { bet_type: 'head2head' },
          { bet_type: 'standard' },
          { bet_type: 'over' },
          { bet_type: 'under' }
        ],
        quorumList: [
          { bet_type: 'head2head' },
          { bet_type: 'standard' }
        ],
        totalList: [
          { bet_type: 'under' },
          { bet_type: 'over' }
        ],
        // bettypes: ['odd', 'head2head', 'standard'],

        search: '',
        tabs: null,
        tabItems: ['Odd', 'Head2Head', 'Standard', 'Under', 'Over', 'Result'],


        pools: [], 
        teams: [],
        game: { organiser: '', home_team:'', away_team:'', date: '', winner: '', home_score: 0, away_score: 0,
              pool_id: 0, username: '', status: '', id: 0 },  
        editdialog: false,
        placebetdialog: false,       
        menu: false,
        menu1: false,
        result: '',
        error: '',

        valid: false,
        active: null,

        organiser: 'NBA',  
        organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
        orgs: [ {name: 'NBA'},{name:'NBL'}, {name:'NFL'},{name:'AFL'},{name:'Asian Games'}],
        selected:[], 

        editedIndex: -1,
        editedItem: { home_team: '', away_team: '', organiser: '', venue: '', date: '', home_score: 0, away_score: 0, winner: ''
                      ,status: '',    home_odd: 0,     away_odd: 0,   odd_date:''
                      ,entry_cost: 0, entry_quorum: 0, pool_prize: 0, payout:'', id: 0 },
        bettedItem: { home_team: '', away_team:'', organiser: '', venue: '', game_date: '', 
                      pool_id: 0, username: '', 
                      odd_date: '', home_odd: 0,   away_odd: 0,   
                      bet_type: '', bet_winner: '', bet_amount: 0, bet_score1: 0, bet_score2: 0,
                      game_winner: '', home_score:0, away_score:0, 
                      id: 0 },

        pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
        headers: [ { text: 'Type', value: 'uom' },{ text: 'Entry Cost', value: 'entry_cost' }
                  ,{ text: 'Quorum', value: 'entry_quorum' }
                  ,{ text: 'PoolPrize', value: 'pool_prize'} 
                  ,{ text: 'Payout', value: 'payout' } 
                  ,{ text: 'Teams count', value: 'team1_count' } 
                  ,{ text: 'Status', value: 'status' }  
                  ,{ text: 'Username', value: 'username' } 
                  ],         
         headerO: [ { text: 'Type', value: 'uom' },{ text: 'Odd Date', value: 'odd_date' }
                   ,{ text: 'Home Odd', value: 'home_odd' },{ text: 'Away Odd', value: 'away_odd' }
                   ,{ text: 'Payout', value: 'payout' },{ text: 'Teams count', value: 'team1_count' } 
                   ,{ text: 'Status', value: 'status' },{ text: 'Username', value: 'username' } ],                  
         headerT: [ { text: 'Type', value: 'uom' },{ text: 'Odd Date', value: 'odd_date' }
                   ,{ text: 'Home Odd', value: 'home_odd' },
                   ,{ text: 'Bet Score', value: 'bet_score1' },{ text: 'Teams count', value: 'team1_count' } 
                   ,{ text: 'Status', value: 'status' },{ text: 'Username', value: 'username' } ], 
         search: '',
      }
    },
    computed: {
      role() { return this.$store.state.loginUser.role; },
      formTitle () { return this.editedIndex === -1 ? 'New Pool' : 'Edit Pool' },
      pageTitle() { return this.game.organiser + ' Pools for the game - ' 
          + this.game.home_team + " vs " + this.game.away_team 
          + "("+this.game.date +") week:" + this.weekNo(this.game.date) 
      },
      gameName() { return this.editedItem.home_team + " vs "+this.editedItem.away_team; },
      quorumBet() {
        this.editedItem.bet_type;
        return this.editedItem.bet_type === 'standard' ||  
               this.editedItem.bet_type === 'head2head'; 
      },

    },
    methods: {
      change2Organiser(selectObj) { this.getTeams(selectObj); },
      weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },
      filtered2Items (key) {
        const res = this.games
        if (key) { 
          if (key === 'Search') { return res };
          return this.pools.filter(pool => pool.bet_type === key) 
        };
        return res
      },
      // -------------------
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
        this.editedItem.organiser = this.game.organiser;
        this.editedItem.home_team = this.game.home_team;
        this.editedItem.away_team = this.game.away_team;
        this.editedItem.date       = this.game.date;
        this.editedItem.entrants = 0;
        this.editedItem.entry_cost = 0;
        this.editedItem.entry_quorum = 0;
        this.editedItem.pool_prize = 0;
        this.editedItem.payout = '';
        this.editedItem.status = 'pending';    
        this.editedItem.odd_date = null;    
        this.editedItem.username = this.$store.state.loginUser.username;
        this.editdialog = true;  
      },

      editItem: function(item){
        this.editedIndex = this.pools.indexOf(item);
        this.editedItem = Object.assign({}, item);

        this.editedItem.name        = item.name;
        this.editedItem.organiser   = item.organiser;
        this.editedItem.date        = item.date;
        this.editedItem.home_odd    = item.home_odd;
        this.editedItem.away_odd    = item.away_odd;
        this.editedItem.odd_date    = item.odd_date;
        this.editedItem.entry_cost  = item.entry_cost;
        this.editedItem.entrants = item.entrants;
        this.editedItem.entry_quorum = item.entry_quorum;
        this.editedItem.pool_prize  = item.pool_prize;
        this.editedItem.payout      = item.payout;
        this.editedItem.status      = item.status;
        this.editedItem.username    = this.$store.state.loginUser.username;
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
        //------------------------------------------
        this.editedItem.venue      = "";                      // undefined if not defined
        this.editedItem.bet_score1 =0;
        this.editedItem.game_winner ="";
        this.editedItem.home_score=0;
        this.editedItem.away_score=0;
        //--------------------------------------------------
        this.editedItem.id       = item.id;
        this.editedItem.pool_id  = item.id;
        this.editedItem.home_team= item.home_team;
        this.editedItem.away_team= item.away_team;
        this.editedItem.teams    = [ item.home_team, item.away_team ];
        this.editedItem.date     = item.date;
        this.editedItem.odd_date = item.odd_date;     
        this.editedItem.username = this.$store.state.loginUser.username;
        this.placebetdialog = true;  
      },
      deleteItem: function(item){
        var r = confirm("Are you sure to delete this item ("+item.id+ ")?");
        if(r==true) {
          this.result = 'Deleting data to server...';
          var postdata = { op: "delete", id: item.id };
          this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }})
            .then(response => { this.result = response.body;
                                this.getAllData(this.gameid);    // refresh datatable
            },      response => { this.result = 'Failed to delete data.'; }
            );
        }
      },
      save() {
        if(this.editedItem.home_team=='' || this.editedItem.away_team==''   
            || this.editedItem.organiser=='' || this.editedItem.date =='' ){     // mysql name (match) problem 
          this.error = 'home_team, away_team, organiser and date fields are required';           // use select `match`, ....
          return;
        };
        if (this.editedIndex > -1) {
        //  Object.assign(this.pools[this.editedIndex], this.editedItem);
        } else {
        //  this.pools.push(this.editedItem);     // new
          this.editedItem.status = 'pending';
          this.editedItem.bet_type = this.tabItems[this.tabs];
        };  
        //console.log('101) save: this.editedItem');
        //console.log(this.editedItem);      

        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.editedItem };
        this.$http.post('php/apiPoolGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
        this.getAllData(this.gameid); // refresh - ok  (push above not working)
      },
      betsave () {
        if(this.editedItem.bet_winner==''){     // mysql name (match) problem 
          this.error = 'bet winner field is required';           // use select `match`, ....
          return;
        };
        if (this.quorumBet) {
          this.editedItem.bet_amount = this.editedItem.entry_cost;        
        };

        console.log("11) betsave - ok");
        console.log(this.editedItem);
        this.error = '';
        this.result = 'Saving data to server...';

        var postdata = { "op": "addcount", "data": this.editedItem };      
        this.$http.post('php/apiPoolGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server-addcount'; }
          );    
      //----------------------
        this.bettedItem = this.editedItem;
        this.bettedItem.id = 0;    // insert new bet
        this.bettedItem.game_date = this.editedItem.date;
        this.bettedItem.pool_id = this.editedItem.pool_id;    // keep pool_id (id = 0 ????)
      // ----- problems below: null values needs defaults (head 2 head does need these data in bet table) ------------      
        console.log("12) betsave:");
        console.log(this.bettedItem);
  //    Object.assign(this.pools[this.editedIndex], this.editedItem);
      // =====================================================
        postdata = { "op": "save", "data": this.bettedItem };      
        this.$http.post('php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server-save apiBet'; }
          );
        console.log("13) betsave:"+this.result);
        this.getBetPools(this.editedItem);     // refresh - ok 
        this.betClose();
      },
      betClose() { this.placebetdialog = false; },
      close () { this.editdialog = false; },
      getTeams(organiser) {
        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgTeams", id: organiser };
        this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            let myteams = response.body.data;
            if (typeof myteams !== "undefined")  {   
              this.teams = [];
              for (var i=0; i < myteams.length; i++) {
                this.teams.push(myteams[i].name);
              };
            }
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
      getBetPools: function (game) {
        console.log("21) getBetPools");
        console.log(game);
        this.result = 'Getting data from server...';
        var postdata = { op: "getBetPools", data: game };    // name, date
        this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.pools = response.body.data;
            console.log(this.pools);
          },      response => { this.result = 'Failed to load data to server.';
          });
      },  
      getAllData(gameid) {
        console.log("80) getGame:"+gameid);
        this.result = 'Getting data from server...';
        var postdata = { op: "getGame", id: gameid };
        this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            this.game = response.body.data[0];
            //-----------------------------------  
            postdata = { op: "getGamePools", data: this.game };
            this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' }
              }).then(response => { 
                this.pools = response.body.data;
                if (this.pools === undefined || this.pools.length == 0) {
                  this.pools = [];
                };
                console.log("81) this.pools");
                console.log(this.pools);
              },  response => { this.result = 'Failed to load data2 to server.';
            //------------------------------------------------------
            });
          },      response => { this.result = 'Failed to load data1 to server.';
        });
      },
    },      // end of methods
    beforeMount(){
      this.getAllData(this.gameid); 
    }
};
</script>

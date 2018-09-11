const GameOdds = Vue.component('gameodds', {
  template: `
  <v-content>
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm12><v-card><v-card-text><betOgame></betOgame></v-card-text></v-card></v-flex>
      </v-layout>
    </v-container>
  </v-content>
`,
});
// betOgame (odd), betNgame( top n game - quorum based)
Vue.component('betOgame', {
  template: `
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Head 2 Head Betting</v-toolbar-title><v-spacer></v-spacer>
        <v-btn color="info" @click="newGame()">New Game</v-btn></v-toolbar>   

      <v-card-title>
        <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="selectedOrganiser" ></v-select>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
        
      <v-data-table :headers="headers" :items="games" :pagination.sync="pagination" :search="search">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name}} - {{ props.item.winner}}

                <gamepools :game="props.item" /></td>    <!-- need refresh for a organiser -->

          <td>{{ props.item.organiser}}</td><td>{{ props.item.venue}}</td>
          <td>{{ props.item.date}}</td><td>{{ props.item.odd}}</td>
          <td>
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </template>
        <template slot="footer"><td colspan="100%"><strong>Notes: Just fill the blanks to register a new game</strong></td></template>
      </v-data-table> 
    </v-layout>
    <!-- ===================================================================== -->
    <v-dialog v-model="gamedialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>
              <v-flex xs4><v-text-field label="Game Name" v-model="editedgame.name"></v-text-field></v-flex>
              <v-flex xs4><v-combobox v-model="editedgame.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Venue" v-model="editedgame.venue"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Odd" v-model="editedgame.odd"></v-text-field></v-flex>

              <v-flex xs4><v-text-field label="Id" v-model="editedgame.id" readonly background-color="red"></v-text-field></v-flex>

              <v-flex xs4>   <!-- date picker -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedgame.date">
                  <v-text-field slot="activator" label="Game date" v-model="editedgame.date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedgame.date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedgame.date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>    

              <v-flex xs4><v-text-field label="Game Winner" v-model="editedgame.winner"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Home Score" v-model="editedgame.home_score"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedgame.away_score"></v-text-field></v-flex> 
            </v-layout>

            <v-tabs slot="extension" v-model="tabs" color="grey" align-with-title>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs">
              <v-tab-item><v-icon>supervisor_account</v-icon>
                <v-layout wrap>
                  <v-flex xs4><v-text-field label="Winner" v-model="editedgame.winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Pool#" v-model="editedgame.pool_id"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>             
              <v-tab-item><v-icon>waves</v-icon></v-tab-item>
              <v-tab-item>
                <v-icon>motorcycle</v-icon>
                <v-layout wrap>
                  <v-flex xs4><v-text-field label="Winner" v-model="editedgame.winner"></v-text-field></v-flex>          
                </v-layout>
              </v-tab-item>
       
              <v-tab-item>
                <v-icon>attach_money</v-icon>
                <v-layout wrap>
                  <!-- *** administrator area  *** -->
                  <v-flex xs4><v-text-field label="Winner" v-model="editedgame.winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Home Score" v-model="editedgame.home_score"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Away Score" v-model="editedgame.away_score"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs-items>
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

  </v-container>
`,
    data () {
      return {
        games: [], 
        gamedialog: false,

        menu: false,
        tabs: null,
        tabItems: ['Head 2 Head', 'Over / Under', 'Standalone', 'Result'],

        result: '',
        error: '',

        valid: false,

        organiser: 'NBA',  
        organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],


        selectedOrganiser: '',
        selectedgame: { name: '', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              odd: 0, pool_id: 0, username: '', id: 0 },

        editedIndex: -1,
        editedgame: { name: '', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              odd: 0, pool_id: 0, username: '', id: 0 },

        pagination: {},
        headers: [{ text: 'Game / Winner / Pools', value: 'name' },  { text: 'Organiser', value: 'organiser' } 
                  ,{ text: 'Venue', value: 'venue' },{ text: 'Date', value: 'date' }
                  ,{ text: 'Odd', value: 'odd' } ],
        search: '',
      }
    },
    computed: {
      formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
    },
    methods: {
      changeOrganiser(selectObj) {
        console.log('55) changeOrganiser');
        console.log(selectObj);
        console.log(this.selectedOrganiser);
        this.organiser = this.selectedOrganiser;
        this.getAllData();

      },
      handleTabChange(tabIndex, newTab, oldTab){
        console.log(tabIndex, newTab.title, oldTab.title)
      },
      closeDialog () {
        console.log('51) closeDialog');
//      eventBus.$emit('reloadbettable',this.bettedItem);
        this.getAllData();     // reload
        this.gamedialog = false;  
      },
      newGame () {
        this.editedIndex = -1;
        this.editedgame.username = this.$store.state.loginUser.username;
        this.editedgame.id = 0;
        this.editedgame.name = '';
        this.editedgame.organiser = '';
        this.editedgame.venue = '';
        this.editedgame.date ='';
        this.editedgame.winner = '';
        this.editedgame.home_score = 0;
        this.editedgame.away_score = 0;
        this.editedgame.odd = 0;

        this.editedgame.pool_id = 0;
        this.gamedialog = true;  
      },
      editItem: function(item){
        this.editedIndex = this.games.indexOf(item);
        this.editedgame = Object.assign({}, item);

        this.editedgame.name = item.name;
        this.editedgame.organiser = item.organiser;
        this.editedgame.venue = item.venue;
        this.editedgame.date = item.date;
        this.editedgame.odd = item.odd;
        this.editedgame.winner = item.winner;
        this.editedgame.id = item.id;
        this.gamedialog = true;  
        console.log('101) editItem: this.editedgame');
        console.log(this.editedgame);
      },
      deleteItem: function(item){
        var r = confirm("Are you sure to delete this item ("+item.name+ ")?");
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
        if(this.editedgame.name=='' || this.editedgame.organiser=='' || this.editedgame.date =='' ){     // mysql name (match) problem 
          this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
          return;
        };
        if (this.editedIndex > -1) {
          Object.assign(this.games[this.editedIndex], this.editedgame);
        } else {
          this.games.push(this.editedgame);     // new
        };  
        
        this.editedgame.status = 'open';
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.editedgame };
        this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
      },
 //     close () { this.$emit('update:dialog', false) },
      close () {
        this.gamedialog = false;
//        this.$emit('close-dialog')
      },
      getAllData: function () {
        console.log("90) getAllData : this.organiser");
        console.log(this.organiser);

        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgGames", id: this.organiser };
        this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.games = response.body.data;
            console.log('91) betNgame > getalldata');
            console.log(this.games);
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
    },
    beforeMount(){ 
      this.organiser = 'NBA';
      this.getAllData(); }
});

const pools2 = Vue.component('game2pools', {
  props: { 
    'game': {type: Object },
    'dialog' : {type: Boolean, default: false }
  },
  template: `
  <v-container fluid grid-list-md>
    <v-card color="grey">

    <v-data-iterator :items="pools"
      :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" 
      content-tag="v-layout" hide-actions row wrap dark>   <!-- every individuals bottom potion -->
      <v-toolbar slot="header" class="mb-2" color="indigo darken-5" dark flat>
        <v-toolbar-title>{{ game.name }} - ({{ game.date }} ){{game.status}}
        
          <v-btn :disabled="role != 'manager'" 
                color="info" @click="newPool(game)">
              New Pool</v-icon></v-btn>
        
        </v-toolbar-title>
      </v-toolbar>

      <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg4>    <!-- lg3 = control width -->
        <v-card color='green'>     <!-- 1 box -->
          <v-card-title class="subheading font-weight-bold">Entry cost:{{ props.item.entry_cost }}</v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Entry Quorum:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.entry_count }} / {{ props.item.entry_quorum }}</v-list-tile-content>
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
    disable button         if entry_count == 2
    only manager           can edit & delete pool
-->
            <v-icon :disabled="!exceedQuorum(props.item.entry_quorum, props.item.entry_count)"
              small @click="betItem(props.item)">add_shopping_cart</v-icon>

            <v-icon :disabled="role != 'manager'" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon :disabled="role != 'manager'" small @click="deleteItem(props.item)">delete</v-icon>
            </div>

          </v-list>
        </v-card>
      </v-flex>

      <v-toolbar slot="footer" class="mt-2" color="indigo" dark dense flat>
        <v-toolbar-title class="subheading">click on shopping cart to 'place bet'</v-toolbar-title>
      </v-toolbar>
    </v-data-iterator>
    </v-card>

    <v-dialog v-model="pooldialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm8><v-text-field v-model="editedItem.name" label="Game name" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm4><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.id" label="Pool id" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.entry_count" label="Entry Count" readonly background-color="red"></v-text-field></v-flex>

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
    <v-dialog v-model="placebetdialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Place Bet</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12><v-text-field v-model="editedItem.name" label="Game name" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm4><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.id" label="Pool id" readonly background-color="red"></v-text-field></v-flex>
              
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_cost" label="Entry Cost" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_count" label="Entry Count" readonly background-color="red"></v-text-field></v-flex>
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
  `,
  data () {
    return {
      valid: false,  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 4 },
      pooldialog: false,
      placebetdialog: false,
      editedIndex: -1,
      editedItem: { name: '', organiser: '', venue: '', date: '', bet_winner: '', home_score: 0, away_score: 0,
              odd: 0, pool_id: 0, username: '', id: 0 },
      bettedItem: { game_name: '', organiser: '', venue: '', game_date: '', game_winner: '', 
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },
      pools: [],
      teams: [],
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
      this.editedItem.name = game.name;
      this.editedItem.date = game.date;
      this.editedItem.entry_count = 0;
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
      this.editedItem.name = item.name;
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
      this.editedItem.name     = item.name;
      this.editedItem.date     = item.date;

      this.editedItem.username = this.$store.state.loginUser.username;
      this.editedItem.teams    = this.game.teams;

      this.placebetdialog = true;  
    },
    deleteItem: function(item){
      const index = this.pools.indexOf(item);
      var r = confirm("Are you sure to delete this item ("+item.name+ ":Entry cost="+this.pools[index].entry_cost+")?");
      if(r==true) {
        this.pools.splice(index, 1);          // remove deleted item  
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiPool.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { this.result = response.body;
       //                       this.getGamePools(item);    
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
      this.$http.post('php/apiPool.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
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
      this.$http.post('php/apiPool.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
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
      this.bettedItem.bet_odd = this.editedItem.odd;
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
      this.getGamePools(this.editedItem);     // refresh - ok 
 //     this.$emit('close-placebetdialog');  
      this.betClose();
    },
    betClose() {
      this.placebetdialog = false;
    },
    close() { this.pooldialog = false; },
    getGamePools: function (game) {
        console.log('98) getGamePools:game>');
        console.log(game);
        this.result = 'Getting data from server...';
        var postdata = { op: "getGamePools", data: game };    // name, date
        this.$http.post('php/apiPool.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.pools = response.body.data;
            console.log('99) getGamePools');
            console.log(this.pools);        // null if new game created but no pools yet
          },      response => { this.result = 'Failed to load data to server.';
          });
        },
    },
    beforeMount(){
      console.log('1) beforeMount');
      this.game.teams = this.game.name.split(' vs ');           // create teams from game name
      this.getGamePools(this.game);                        // get this.pools
    }
});      


const BetMyResults = Vue.component('betmyresults', {
  template: `
  <v-content>
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm12><v-card><v-card-text><mybetresults></mybetresults></v-card-text></v-card></v-flex>
      </v-layout>
    </v-container>
  </v-content>
`,
});

Vue.component('mybetresults', {
  template: /* syntax: html */ `
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark>
        <v-toolbar-title>{{pageTitle}}, 
          <v-btn flat> <v-icon small @click="changeRound(-7)">fast_rewind</v-icon>
            {{ round }}<v-icon small @click="changeRound(7)">fast_forward</v-icon>
          </v-btn>
          <span STYLE="font-size: 10pt">({{pstart | moment }}:{{pend | moment }})</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-card-title>                                                                <!-- 2 -->
            <v-layout row wrap>
              Organiser:
              <template v-for="org in organisers">
                <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
              </template>
            </v-layout>            
          </v-card-title>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
          <v-btn :disabled="role != 'manager'" color="info" @click="newGame()">New Game Contest</v-btn>         
        </v-toolbar-items>
      </v-toolbar>

      <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
        <v-tab v-for="filter in filterList" :key="filter.bet_type">{{ filter.bet_type }}</v-tab>
        <!-- =======  head2head, quorum =================================================== -->
        <v-tab-item v-for="filter in quorumList" :key="filter.bet_type">
          <v-data-table :pagination.sync="pagination" :headers="headers" :items="filtered2Items(filter.bet_type)">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.bet_type}}</td> 
              <td>{{ props.item.game_date}}</td> 
              <td>{{ props.item.organiser}}</td> 
              <td>{{ props.item.home_team}}</td> 
              <td>{{ props.item.away_team}}</td> 
              <td>{{ props.item.pool_id}}</td> 
              <td>{{ props.item.entry_cost}}</td> 
              <td>{{ props.item.entrants}}/{{ props.item.entry_quorum}}</td>

              <td>{{ props.item.pool_prize}}</td>
              <td>{{ props.item.payout}}</td>

              <td class="text-xs-right">{{ props.item.team1_count}}/{{ props.item.team2_count}}</td>
              <td class="text-xs-right">{{ props.item.home_score}}/{{ props.item.away_score}}</td>
              <td>{{ props.item.status}}</td>
              <td>{{ props.item.username}}</td>
              <td>{{ props.item.round}}</td>
              <td>{{ props.item.bet_score}}</td>
              <td>
                <v-icon small @click="betItem(props.item)">add_shopping_cart</v-icon>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template slot="footer"><td colspan="100%"><strong>Note2: Just fill the blanks to register a new game</strong></td></template>
          </v-data-table>
        </v-tab-item>
        <!--   Odd --------->
        <v-tab-item>
          <v-data-table :pagination.sync="pagination" :headers="headerO" :items="filtered2Items('odd')">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.bet_type}}</td> 
              <td>{{ props.item.game_date}}</td> 
              <td>{{ props.item.organiser}}</td> 
              <td>{{ props.item.home_team}}</td> 
              <td>{{ props.item.away_team}}</td> 
              <td>{{ props.item.pool_id}}</td> 
              <td>{{ props.item.odd_date}}</td>
              <td>{{ props.item.home_odd}}</td>
              <td>{{ props.item.away_odd}}</td>
              <td>{{ props.item.payout}}</td>
              <td class="text-xs-right">{{ props.item.team1_count}}/{{ props.item.team2_count}}</td>
              <td class="text-xs-right">{{ props.item.home_score}}/{{ props.item.away_score}}</td>
              <td>{{ props.item.status}}</td>
              <td>{{ props.item.username}}</td>
              <td>{{ props.item.bet_score}}</td>
              <td>
                <v-icon small @click="betItem(props.item)">add_shopping_cart</v-icon>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template slot="footer"><td colspan="100%"><strong>Note1: Inclusive of 'Over' or 'Under' bets</strong></td></template>
          </v-data-table>
        </v-tab-item>
        <!-- ========== over / under =========================================================== -->
        <v-tab-item v-for="filter in totalList" :key="filter.bet_type">
          <v-data-table :pagination.sync="pagination" :headers="headerT" :items="filtered2Items(filter.bet_type)">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.bet_type}}</td> 
              <td>{{ props.item.game_date}}</td> 
               <td>{{ props.item.organiser}}</td> 
              <td>{{ props.item.home_team}}</td> 
              <td>{{ props.item.away_team}}</td>
              <td>{{ props.item.pool_id}}</td>  
              <td>{{ props.item.odd_date}}</td>
              <td>{{ props.item.home_odd}}</td> 
              <td>{{ props.item.bet_score1}}</td>      <!-- total score --> 

              <td class="text-xs-right">{{ props.item.team1_count}}/{{ props.item.team2_count}}</td>
              <td class="text-xs-right">{{ props.item.home_score}}/{{ props.item.away_score}}</td>
              <td>{{ props.item.status}}</td>
              <td>{{ props.item.username}}</td>
                            <td>{{ props.item.bet_score}}</td>
              <td>
                <v-icon 
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
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>
              
              <template v-if="editedItem.id > 0">
                <v-flex xs4><v-text-field label="Organiser" v-model="editedItem.organiser" readonly></v-text-field></v-flex>
                <v-flex xs8><v-text-field label="Game Name" v-model="editedItem.name" readonly></v-text-field></v-flex>
              </template>  
              <template v-else>
                <v-flex xs4>
                  <v-select v-model="editedItem.organiser" :items="organisers" label="Select your organiser:" @change="change2Organiser"></v-select>
                </v-flex>
                <v-flex xs4><v-select v-model="editedItem.home_team" :items="teams" label="Home team:"></v-select></v-flex>
                <v-flex xs4><v-select v-model="editedItem.away_team" :items="teams" label="Away team:"></v-select></v-flex>
              </template>

              <v-flex xs6><v-text-field label="Venue" v-model="editedItem.venue"></v-text-field></v-flex>

              <v-flex xs3>   <!-- date picker -->
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
              <v-flex xs3><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
                        <v-flex xs3><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>
            
            <template v-if="editedItem.id > 0">
              <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score" background-color="green"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score" background-color="green"></v-text-field></v-flex> 
              <v-flex xs4><v-text-field label="Username" v-model="editedItem.username" background-color="green"></v-text-field></v-flex> 
           
            </template>

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

  </v-container>
`,
    data () {
      return {
        bets: [], 
        editdialog: false,

        menu: false,
        tabs: null,
        tabItems: ['$10 pool', '$25 pool', '$50 pool', 'Result'],

        statuslist: ['open', 'closed'],
        filterList: [
          { bet_type: 'head2head' },
          { bet_type: 'standard' },
          { bet_type: 'odd' },
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

        result: '',
        error: '',

        valid: false,

        organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
        organiser: 'NBA',
        username:'',
        round: '',
        pstart: '',
        pend: '',
        today: '',

        teams:[],

        selectedOrganiser: '',
        selectedgame: { name: '', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              home_odd: 0, away_odd:0,  pool_id: 0, username: '', id: 0 },

        editedIndex: -1,
        editedItem: { name: '', organiser: '', venue: '', date: '', home_score: 0, away_score: 0, winner: '',
                      status: '', home_odd: 0, away_odd:0, id: 0 },

        pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
        // source bet file & pool file
        header1: [{ text: 'Week#', value: 'weekno' },{ text: 'Date', value: 'date' }   // 1) game info                
                 ,{ text: 'Organiser', value: 'organiser' } 
                 ,{ text: 'Home Team', value: 'home_team' },{ text: 'Away Team', value: 'away_team' }
                 ,{ text: 'Home Score', value: 'home_score' },{ text: 'Away Score', value: 'away_score' }
                 ,{ text: 'Total Score', value: 'total_score' },{ text: 'Game Winner', value: 'winner' }
                 ,{ text: 'Username', value: 'username' },{ text: 'Pool Id', value: 'pool_id' } ],  // 2) cust info
        header2: [{ text: 'Bet Type', value: 'bet_type' },{ text: 'Bet Winner', value: 'bet_winner' } // 3) bet info
                 ,{ text: 'Bet Amount', value: 'bet_amount' }
                 ,{ text: 'Bet Score', value: 'bet_score1' },    // 1) for over/under with odd (home_odd)
                                                                // 2) for odd below                 // 4) pool info
                 ,{ text: 'Odd Date', value: 'odd_date' },{ text: 'Home Odd', value: 'home_odd' },{ text: 'Away Odd', value: 'away_odd' },
                                                              // 3 ) for quorum
                 ,{ text: 'Entry Cost', value: 'entry_cost' },{ text: 'Entry Quorum', value: 'entry_quorum' }  
                 ,{ text: 'Pool Prize', value: 'pool_prize' },{ text: 'Payout', value: 'payout' }   
                 ,{ text: 'Status', value: 'status' } ],
        headers: [ { text: 'Type', value: 'uom' }        ,{ text: 'Game Date', value: 'date' }
                 ,{ text: 'Organiser', value: 'organiser' }
                 ,{ text: 'Home Team', value: 'home_team' },{ text: 'Away Team', value: 'away_team'} 
                 ,{ text: 'Pool#', value: 'pool_id'}  
                 ,{ text: 'Entry Cost', value: 'entry_cost' },{ text: 'Quorum', value: 'entry_quorum' }
                  ,{ text: 'PoolPrize', value: 'pool_prize'} ,{ text: 'Payout', value: 'payout' } 
                  ,{ text: 'Teams count', value: 'team1_count' },{ text: 'Scores (H/A)', value: 'home_score' }
                  ,{ text: 'Status', value: 'status' }          
                  ,{ text: 'Username', value: 'username' },{ text: 'Round', value: 'round' } 
                  ,{ text: 'Income', value: 'bet_score' } 
                  ],         
        headerO: [ { text: 'Type', value: 'uom' }
                 ,{ text: 'Game Date', value: 'date' }
                 ,{ text: 'Organiser', value: 'organiser' }
                 ,{ text: 'Home Team', value: 'home_team' },{ text: 'Away Team', value: 'away_team'} 
                ,{ text: 'Pool#', value: 'pool_id'} 
                 ,{ text: 'Odd Date', value: 'odd_date' }
                   ,{ text: 'Home Odd', value: 'home_odd' },{ text: 'Away Odd', value: 'away_odd' }
                   ,{ text: 'Payout', value: 'payout' },{ text: 'Teams count', value: 'team1_count' } 
                  ,{ text: 'Home/Away score', value: 'home_score' } 
                   ,{ text: 'Status', value: 'status' },{ text: 'Username', value: 'username' } 
                  ,{ text: 'Income', value: 'bet_score' } ],                 
        headerT: [ { text: 'Type', value: 'uom' }
                 ,{ text: 'Game Date', value: 'date' }
                 ,{ text: 'Organiser', value: 'organiser' }
                 ,{ text: 'Home Team', value: 'home_team' },{ text: 'Away Team', value: 'away_team'} 
                 ,{ text: 'Pool#', value: 'pool_id'}       
                ,{ text: 'Odd Date', value: 'odd_date' }
                   ,{ text: 'Home Odd', value: 'home_odd' },
                   ,{ text: 'Bet Score', value: 'bet_score1' },{ text: 'Teams count', value: 'team1_count' } 
                ,{ text: 'Home/Away score', value: 'home_score' }   
                   ,{ text: 'Status', value: 'status' },{ text: 'Username', value: 'username' } 
                  , { text: 'Income', value: 'bet_score' } 
                   ],               
        search: '',
      }
    },
    computed: {
      role() { return this.$store.state.loginUser.role; },
      formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
      pageTitle() { return 'My Results for the week ' + moment().format('W') },
    },
    filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
    methods: {
      change2Organiser(selectObj) { this.getTeams(selectObj); },
      weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },

      filtered2Items (key) {
        console.log("101) filtered2Items:"+key);
        const res = this.bets;
        if (key) { 
          if (key === 'Search') { return res };
//          return this.pools.filter(pool => pool.bet_type === key) 
            console.log("103) bets");
            console.log(this.bets);
            let results=_.filter(this.bets, bet => bet.bet_type === key);
            console.log("105) filter");
            console.log(results);
            return results;

        };
        return res
      },
      check: function(e) {
        if (e.target.checked) {
          this.organiser = e.target.value;
          this.getRound();
        }
      },
      change2Organiser(selectObj) {
        console.log('65) change2Organiser');
        console.log(selectObj);
        console.log(this.selectedOrganiser);
  //      this.organiser = this.selectedOrganiser;
        this.getTeams(selectObj);

      },
      handleTabChange(tabIndex, newTab, oldTab){
        console.log(tabIndex, newTab.title, oldTab.title)
      },
      closeDialog () {
        console.log('51) closeDialog');
//      eventBus.$emit('reloadbettable',this.bettedItem);
        this.getAllData();     // reload
        this.editdialog = false;  
      },
      newGame () {
        this.editedIndex = -1;
        this.editedItem.username = this.$store.state.loginUser.username;
        this.editedItem.id = 0;
        this.editedItem.name = '';
        this.editedItem.organiser = '';
        this.editedItem.venue = '';
        this.editedItem.date ='';
        this.editedItem.winner = '';
        this.editedItem.home_score = 0;
        this.editedItem.away_score = 0;
        this.editedItem.home_odd = 0;
                this.editedItem.away_odd = 0;
        this.editdialog = true;  
      },
      editItem: function(item){
        this.editedIndex = this.bets.indexOf(item);
        this.editedItem = Object.assign({}, item);

        this.editedItem.name = item.name;

        this.editedItem.organiser = item.organiser;
        this.editedItem.venue = item.venue;
        this.editedItem.date = item.date;
        this.editedItem.home_score = item.home_score;
        this.editedItem.away_score = item.away_score;
        this.editedItem.winner = item.winner;
        this.editedItem.status = item.status;
        this.editedItem.home_odd = item.home_odd;
        this.editedItem.away_odd = item.away_odd;
        this.editedItem.username = item.username;      // temporary
        this.editedItem.id = item.id;

        this.editdialog = true;  
        console.log('101) editItem: this.editedItem');
        console.log(this.editedItem);
      },
      deleteItem: function(item){
        var r = confirm("Are you sure to delete this item ("+item.name+ ")?");
        if(r==true) {
          this.result = 'Deleting data to server...';
          var postdata = { op: "delete", id: item.id };
          this.$http.post('php/apiBet.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }})
            .then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
            },      response => { this.result = 'Failed to delete data.'; }
            );
        }
      },
      save() {
        if (this.editedItem.id == 0) {      // new game
          this.editedItem.name = this.editedItem.home_team + ' vs ' + this.editedItem.away_team;
          this.editedItem.status = 'open';
          this.games.push(this.editedItem);
          var postdata = { "op": "save", "type": "new", "data": this.editedItem,  };
        } else {  // update results
        let teams = this.editedItem.name.split(' vs ');
          this.editedItem.winner = this.editedItem.home_score > this.editedItem.away_score ? teams[0] : teams[1];
          this.editedItem.status = 'closed';
          Object.assign(this.games[this.editedIndex], this.editedItem);   // update datatable
          var postdata = { "op": "save", "type": "result", "data": this.editedItem,  };
        };
        this.error = '';
        this.result = 'Saving data to server...';
        this.$http.post('php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
      },
 //     close () { this.$emit('update:dialog', false) },
      close () {
        this.editdialog = false;
//        this.$emit('close-dialog')
      },
      getTeams(organiser) {
        console.log("80) getTeams : organiser");
        console.log(organiser);

        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgTeams", id: organiser };
        this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            let myteams = response.body.data;
            console.log('81) betresult > myteams');
            console.log(myteams);
            this.teams = [];
            for (var i=0; i < myteams.length; i++) {
              this.teams.push(myteams[i].name);
            };
            console.log('83) betresult > this.teams');
            console.log(this.teams);
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
      getAllData: function () {
        console.log("11) getAllData : this.organiser");
        console.log(this.organiser);

        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgBets", organiser: this.organiser };
        this.$http.post('php/apiBet.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            this.bets = response.body.data;
            console.log('12) betresult > this.bets');
            console.log(this.bets);
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
      changeRound(days) {    // prev, next buttons
        let objDate = moment(this.today, 'YYYY/MM/DD').toDate();   // this.today = string
        this.today = moment(objDate).add(days, 'days').format('YYYY/MM/DD');  // moment needs obj
        this.getRound();
      },
      getRound() {
        console.log("11) getRound",this.organiser, this.today);
        this.result = 'Getting data from server...'; 
        var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.today} };    
        this.$http.post('php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
              if (response.body.data.length === 0) {
                this.round = "";
                this.pstart = "";
                this.pend ="";
                this.games = [];
              } else {
                this.round = response.body.data[0].round;
                this.pstart = response.body.data[0].start;
                this.pend = response.body.data[0].end;
                this.getAllData();  // asyn problem
              };
          },  response => { this.result = 'Failed to load data to server.';
        });
      },
    },  // end of methods
    beforeMount(){ 
      this.organiser = this.$store.state.sport.organiser;
      this.username = this.$store.state.loginUser.username;
//      let $today = new Date;
      this.today = moment().format('YYYY/MM/DD');
      this.getRound();
//      this.getAllData(); 
    }
});

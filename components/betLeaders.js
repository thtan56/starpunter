const BetLeaders = Vue.component('betleaders', {
  template: `
  <v-content>
    <topmenu></topmenu>
    <betresults></betresults>
  </v-content>
`,
});

Vue.component('betresults', {
  template: /* syntax: html */ `
  <v-container grid-list-sm>
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
            <template v-for="org in organisers"><input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
            </template>
          </v-layout>            
        </v-card-title>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <!-- v-btn :disabled="role != 'manager'" color="info" @click="newGame()">New Game Contest</v-btn    -->         
      </v-toolbar-items>
    </v-toolbar>
    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
      <v-tab v-for="filter in quorumList" :key="filter.pool_type">{{ filter.pool_type }}</v-tab>
      <!-- =======  head2head, quorum =================================================== -->
      <v-tab-item v-for="filter in quorumList" :key="filter.pool_type">
        <v-data-table :pagination.sync="pagination" :headers="headers" :items="filtered2Items(filter.pool_type)">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.organiser}}</td>  <td>{{ props.item.round}}</td> <td>{{ props.item.pool_id}}</td> 
            <td>{{ props.item.pool_type}}</td>  <td>{{ props.item.ticket_id}}</td>
            <td>{{ props.item.game_id}}</td>  
            <td>{{ props.item.username}}</td>
            <td>{{ props.item.home_team}}/{{ props.item.away_team}}</td> 
            <td>{{ props.item.game_winner}}/{{ props.item.bet_team}}</td>
            <td>{{ props.item.bet_score}}</td>
            <td>{{ props.item.status}}</td>
            <td>{{ props.item.id}}</td> 
            <td>
              <v-icon small @click="betItem(props.item)">add_shopping_cart</v-icon>
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs> 
    <!-- ======================= statistics ========================== -->
    <v-layout row wrap>
      <v-flex xs4 v-for="pool in poolList" :key="pool.pool_id">
        <v-card flat tile>
          <v-card-title class="blue white--text">
            <span class="headline">Pool# {{pool.pool_id}}</span>
          </v-card-title>
          <v-card-text>
            <span style="float:left">Entry Cost:</span>
            <span style="float:right">{{pool.entry_cost}}</span>
          </v-card-text>
          <v-card-text>
            <span style="float:left">Pool Prize:</span>
            <span style="float:right">{{pool.pool_prize}}</span>
          </v-card-text>
          <v-card-text>
            <span style="float:left">Payout:</span>
            <span style="float:right">{{pool.payout}}</span>
          </v-card-text>          
          <v-divider></v-divider>
          <v-list>
            <v-list-tile>
              <v-list-tile-title><u>Username</u></v-list-tile-title>
              <v-list-tile-title><u>Score</u></v-list-tile-title>
              <v-list-tile-title><u>Won</u></v-list-tile-title>
              <v-list-tile-title><u>Income</u></v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="(player, i) in pool.players" :key="i" @click="">
              <v-list-tile-content>{{ player.username }}</v-list-tile-content>
              <v-list-tile-content>{{ player.score }}</v-list-tile-content>
              <v-list-tile-content>
                <template v-if="player.won === '1'"><v-icon small>check</v-icon></template>
              </v-list-tile-content>
              <v-list-tile-content>{{ formatNumber(player.income) }}</v-list-tile-content>
            </v-list-tile>

          </v-list>
          <v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>         
    <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
          <v-layout row wrap>              
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
        stats: [],
        editdialog: false,
        menu: false,
        tabs: null,
        statuslist: ['pending', 'closed'],
        quorumList: [ { pool_type: 'head2head' }, { pool_type: 'group' } ],
        pagination: { page: 1, rowsPerPage: 5, totalItems: 0 },

        poolList: [],
        pool_id: '',

        result: '',
        error: '',

        organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
        organiser: 'NBA',
        username:'',
        round: '',
        pstart: '',
        pend: '',
        today: '',
        teams: [],

        editedIndex: -1,
        editedItem: { 
               organiser: ''   ,round: ''      ,bet_team: ''  ,bet_score:'' ,status: '' ,id: 0
              ,pool_id:''      ,pool_name:''   ,pool_type: '' ,entry_cost:''
              ,entry_quorum:'' ,entry_count:'' ,pool_prize:'' ,payout:'' 
              ,ticket_id:''    ,game_id:''    ,username: ''
              ,home_team:''   ,away_team:''  ,game_winner: '' },                                                                                                 // sources:
        headers: [ { text: 'Organiser', value: 'organiser' }, { text: 'Round', value: 'round' }  // ticketgames 
          ,{ text: 'Pool#', value: 'pool_id' }, { text: 'Pool Type', value: 'pool_type' }        // pool
//              ,{ text: 'Entry Cost', value: 'entry_cost' },{ text: 'Quorum', value: 'entry_quorum' }
//              ,{ text: 'PoolPrize', value: 'pool_prize'} ,{ text: 'Payout', value: 'payout' } 
          ,{ text: 'Ticket#', value: 'ticket_id' } , { text: 'Game#', value: 'game_id' }  
          ,{ text: 'Username', value: 'username' }          // ticket
          ,{ text: 'Home/Away Team', value: 'home_team' }   // game
          ,{ text: 'Game Winner/Bet Team', value: 'game_winner' }
          ,{ text: 'PL/point', value: 'bet_score' }     // ticketgames
          ,{ text: 'Status', value: 'status' }      // ticketgames
          ,{ text: 'Id', value: 'id' }   // ticketGames id
                  ],                                    
        search: '',
      }
    },
    computed: { 
      pageTitle() { return 'Leadership Result for the week ' + moment().format('W') },  
      formTitle () { return this.editedIndex === -1 ? 'New Bet' : 'Edit Bet' },
    },
    filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
    methods: {
      formatNumber(value) { return accounting.formatNumber(value,2) },
      weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },
      change2Organiser(selectObj) { this.getTeams(selectObj); },
      filtered2Items (key) {
        const res = this.bets;
        if (key) { 
          if (key === 'Search') { return res };
            let results=_.filter(this.bets, bet => bet.pool_type === key);
            return results;
        };
        return res
      },   
      handleTabChange(tabIndex, newTab, oldTab){ console.log(tabIndex, newTab.title, oldTab.title) },
      closeDialog () {
        console.log('51) closeDialog');
        this.getAllData();     // reload
        this.editdialog = false;  
      },
      showItem(item) {alert("showItem");  },
      close () { this.editdialog = false;  },
      getTeams(organiser) {
        console.log("80) getTeams : organiser");
        console.log(organiser);

        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgTeams", id: organiser };
        this.$http.post('/php/apiTeam.php', JSON.stringify(postdata), {
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
      filtered3Items (key) {      //pool_id
//        console.log("201) filtered3Items:"+key);
        const res = this.bets;
        if (key) { 
          if (key === 'Search') { return res };
//          return this.pools.filter(pool => pool.pool_type === key) 
//            console.log("203) bets");
//            console.log(this.bets);
            let results=_.filter(this.stats, stat => stat.pool_id === key);
//             console.log("205) filter",results);
            return results;
        };
        return res
      },
      populatePoolList(stat) {
        this.poolList=[];     // poollist
        var plist=[];         // userlist
        var oldkey="";
        var oldprize="";
        var oldcost="";
        var oldtop="";
        for (var i=0; i < this.stats.length; i++) {
          if ((i!==0) && (oldkey !== this.stats[i].pool_id)) {
            this.poolList.push({'pool_id': oldkey, 'pool_prize': oldprize, 
              'entry_cost': oldcost, 'payout': oldtop,'players': plist });
            plist=[];
          };
          oldkey=this.stats[i].pool_id;
          oldprize=this.stats[i].pool_prize;
          oldcost=this.stats[i].entry_cost;
          oldtop=this.stats[i].payout;
          plist.push({'username': this.stats[i].username,'score': this.stats[i].total 
                      ,'won':     this.stats[i].won     ,'income': this.stats[i].income } 
                    );
        };
        this.poolList.push({'pool_id': oldkey, 'pool_prize': oldprize, 
              'entry_cost': oldcost, 'payout': oldtop, 'players': plist });
      },
      getStatistics: function () {
        console.log("31) getStatistics",this.organiser, this.round);
        this.result = 'Getting data from server...';
        var postdata = { op: "getTicketGamesStatByOrg", data: {organiser: this.organiser, round: this.round} };
        this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            this.stats = response.body.data;    // tgames
            console.log("32)this.stats", this.stats);
            this.populatePoolList(this.stats);
            console.log("34) poolList",this.poolList);   
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
      getAllData: function () {
        console.log("21) getAllData",this.organiser, this.round);
        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgRndTicketGames", data: {organiser: this.organiser, round: this.round} };
        this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.bets = response.body.data;    // tgames
                              console.log("22) this.bets", this.bets);
                              this.getStatistics();
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
        this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
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
                this.pend = response.body.data[0].end_dt;
                this.getAllData();  // asyn problem
              };
          },  response => { this.result = 'Failed to load data to server.';
        });
      },
    },  // end of methods
    beforeMount(){ 
      this.organiser = this.$store.state.sport.organiser;
      this.username = this.$store.state.loginUser.username;
      this.today = moment().format('YYYY/MM/DD');
      this.getRound();

    }
});
            //  const index = this.poolList.map(e => e.pool_id).indexOf(key);    // search pool_id, -1 if not found
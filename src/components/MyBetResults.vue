// Vue.component('mybetresults', {
<template>
  <div>
    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
      <v-tab v-for="filter in quorumList" :key="filter.pool_type">{{ filter.pool_type }}</v-tab>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <!-- =======  head2head, quorum =================================================== -->
      <v-tab-item v-for="filter in quorumList" :key="filter.pool_type">
   
        <v-data-table :pagination.sync="pagination" :headers="headers" :search="search"
              :items="filtered2Items(filter.pool_type)">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.start | moment }}</td>        <!-- game date -->
            <td>{{ props.item.organiser}}/{{ props.item.round}}</td>
            <td>{{ props.item.home_team}}/{{ props.item.away_team}}</td> 
            <td>{{ props.item.pool_name}}</td>     
            <td>{{ props.item.pool_id}}/{{ props.item.ticket_id}}/{{ props.item.game_id}}</td> 
            <td>{{ props.item.entry_cost}}/{{ props.item.pool_prize}}/{{ props.item.payout}}</td>
            <td>{{ props.item.entry_count}}/{{ props.item.entry_quorum}}</td>
               
            <td>{{ props.item.bet_team}}/{{ props.item.game_winner}}</td>
            <td>{{ props.item.home_score}}/{{ props.item.away_score}}</td>
            <td>{{ props.item.status}}</td>
            <td>{{ props.item.username}}</td>

            <td>{{ props.item.bet_score}}</td>
            <td>{{ props.item.income}}</td>
            <td>
              <v-icon small @click="betItem(props.item)">add_shopping_cart</v-icon>
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
          <template slot="footer"><td colspan="100%"><strong>sum:</strong></td></template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>
    <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
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
  </div>
</template>

<script>
export default {
  name: 'myBetResults',
  props: { 
    organiser: {type: String},   
    round: {type: String},   
    username: {type: String}   
  }, 
    data () {
      return {
        bets: [],
        stats: [],
        editdialog: false,

        menu: false,
        tabs: null,

        organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
        tabItems: ['$10 pool', '$25 pool', '$50 pool', 'Result'],

        statuslist: ['pending', 'closed'],
        quorumList: [ { pool_type: 'head2head' }, { pool_type: 'group' }  ],
        totalList: [  { pool_type: 'under' },     { pool_type: 'over' }      ],
        incomeTotal: 0,

        result: '',
        error: '',
        valid: false,

        today: '',

        teams:[],

        selectedOrganiser: '',
        selectedgame: { name: '', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              home_odd: 0, away_odd:0,  pool_id: 0, username: '', id: 0 },

        editedIndex: -1,
        editedItem: { name: '', organiser: '', venue: '', date: '', home_score: 0, away_score: 0, winner: '',
                      status: '', home_odd: 0, away_odd:0, id: 0 },
        
        rowsPerPageItems: [5, 10, 15],        
        pagination: { page: 1, rowsPerPage: 5, totalItems: 0 },

        headers: [ { text: 'Game Date', value: 'date' }
                 ,{ text: 'Organiser/Week', value: 'organiser' }
                 ,{ text: 'Home/Away Team', value: 'home_team' } 
                 ,{ text: 'Plan Name', value: 'pool_name' }       
                 ,{ text: 'Pool/Ticket/Game#', value: 'pool_id'}  
                 ,{ text: 'Cost/Prize/Payout', value: 'entry_cost' },{ text: 'Entry/Quorum', value: 'entry_quorum' }
                  ,{ text: 'Bet Team/Game Winner', value: 'bet_team' },{ text: 'Scores (H/A)', value: 'home_score' }
                  ,{ text: 'Status', value: 'status' }          
                  ,{ text: 'Username', value: 'username' } 
                  ,{ text: 'Bet score', value: 'bet_score' },{ text: 'Income', value: 'income' } 
                  ],                                 
        search: '',
      }
    },
    computed: {
      role() { return this.$store.state.loginUser.role; },
      formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
      pageTitle() { return 'My Results for the week ' + moment().format('W') },
    },
    watch: { 
      organiser (newVal, oldVal)  { this.getAllData(); },
      round (newVal, oldVal)  { this.getAllData(); }    
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
//          return this.pools.filter(pool => pool.pool_type === key) 
            console.log("103) bets");
            console.log(this.bets);
            let results=_.filter(this.bets, bet => bet.pool_type === key);
             console.log("105) filter",results);
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
          this.$http.post('/php/apiBet.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }})
            .then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
            },      response => { this.result = 'Failed to delete data.'; }
            );
        }
      },
      save() {
        if (this.editedItem.id == 0) {      // new game
          this.editedItem.name = this.editedItem.home_team + ' vs ' + this.editedItem.away_team;
          this.editedItem.status = 'pending';
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
        this.$http.post('/php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
      },
      close () {  this.editdialog = false;  },
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
      getAllData: function () {
        console.log("10) mybetresults: getAllData:user, org, round",this.username, this.organiser, this.round);
        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgRndUserTicketGames", 
                       data: {username: this.username, organiser: this.organiser, round: this.round } };
        this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.bets = response.body.data;    // tgames
                              console.log("22) getAllData:this.bets",this.bets);
                              //   this.getStatistics();
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
    },  // end of methods
    beforeMount(){ 
      this.getAllData();
    }
};
</script>

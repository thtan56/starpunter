// Vue.component('betNgame', {
<template>
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Games of the week</v-toolbar-title><v-spacer></v-spacer>
        <v-btn color="info" @click="newGame()">New Game</v-btn></v-toolbar>   

      <v-card-title>
        <v-layout row wrap>
          <div v-for="org in orgs" :key="org">
            <v-flex xs2>
            <input type="radio" :value="org.name" id="org.name" v-model="checkedOrganisers" @click="check($event)"> {{org.name}}
            </v-flex>
          </div>
        </v-layout>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
        
      <v-data-table :headers="headers" :items="games" :pagination.sync="pagination" :search="search">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name}} - {{ props.item.winner}}

                <betGamePools :game="props.item" /></td>    <!-- need refresh for a organiser -->

          <td>{{ props.item.organiser}}</td><td>{{ props.item.venue}}</td>
          <td>{{ props.item.date}}</td>
          <td>{{ props.item.home_odd}}</td><td>{{ props.item.away_odd}}</td>
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
              <v-flex xs4><v-text-field label="Home Team" v-model="editedgame.home_team"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Team" v-model="editedgame.away_team"></v-text-field></v-flex>
              <v-flex xs4><v-combobox v-model="editedgame.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Venue" v-model="editedgame.venue"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Home Odd" v-model="editedgame.home_odd"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Odd" v-model="editedgame.away_odd"></v-text-field></v-flex>

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
</template>

<script>
import betGamePools from './BetGamePools.vue';
export default {
  name: 'betNgame',
  components: { betGamePools },
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
        orgs: [ {name: 'NBA'},{name:'NBL'}, {name:'NFL'},{name:'AFL'},{name:'Asian Games'}],
        checkedOrganisers:[],

        selectedgame: { home_team: '', away_team:'', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              status:'', pool_id: 0, username: '', id: 0 },

        editedIndex: -1,
        editedgame: { home_team: '', away_team:'', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              status: '', pool_id: 0, username: '', id: 0 },

        pagination: {},
        headers: [{ text: 'Game / Winner / Pools', value: 'name' },  { text: 'Organiser', value: 'organiser' } 
                  ,{ text: 'Venue', value: 'venue' },{ text: 'Date', value: 'date' }
                  ,{ text: 'Home Odd', value: 'home_odd' },{ text: 'Away Odd', value: 'away_odd' }
                   ],
        search: '',
      }
    },
    computed: {
      formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
    },
    methods: {
      check: function(e) {
        if (e.target.checked) {
          console.log(e.target.value)
          this.organiser = e.target.value;
          console.log(this.organiser);
          this.getAllData();
        }
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
        this.editedgame.home_team = '';
        this.editedgame.away_team = '';

        this.editedgame.organiser = '';
        this.editedgame.venue = '';
        this.editedgame.date ='';
        this.editedgame.winner = '';
        this.editedgame.home_score = 0;
        this.editedgame.away_score = 0;
        //this.editedgame.home_odd = 0;
        //this.editedgame.away_odd = 0;
        this.editedgame.status = 'pending';

        this.editedgame.pool_id = 0;
        this.gamedialog = true;  
      },
      editItem: function(item){
        this.editedIndex = this.games.indexOf(item);
        this.editedgame = Object.assign({}, item);

        this.editedgame.home_team = item.home_team;
        this.editedgame.away_team = item.away_team;
        this.editedgame.organiser = item.organiser;
        this.editedgame.venue = item.venue;
        this.editedgame.date = item.date;
        //this.editedgame.home_odd = item.home_odd;
        //this.editedgame.away_odd = item.away_odd;
        this.editedgame.status = item.status;

        this.editedgame.winner = item.winner;
        this.editedgame.id = item.id;
        this.gamedialog = true;  
        console.log('101) editItem: this.editedgame');
        console.log(this.editedgame);
      },
      deleteItem: function(item){
        var r = confirm("Are you sure to delete this item ("+item.home_team+ " vs " +item.away_team+")?");
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
        if(this.editedgame.home_team=='' || this.editedgame.away_team=='' || this.editedgame.organiser=='' 
                                         || this.editedgame.date =='' ){     // mysql name (match) problem 
          this.error = 'home & away team, organiser and date fields are required';           // use select `match`, ....
          return;
        };
        if (this.editedIndex > -1) {
          Object.assign(this.games[this.editedIndex], this.editedgame);
        } else {
          this.editedgame.status = 'pending';
          this.games.push(this.editedgame);     // new
        };  
        
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
};
</script>

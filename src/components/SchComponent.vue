// const gameSchedule = Vue.component('schComponent', {
<template>
  <div id='NBAschedule'>
    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
      <v-tab v-for="filter in filterList" :key="filter.status">{{ filter.status }}</v-tab>
      <v-tab-item v-for="filter in filterList" :key="filter.status">
        <v-text-field label="Search" v-model="search" append-icon="search" single-line hide-detail></v-text-field>
        <v-data-table :pagination.sync="pagination" :headers="columns" :items="filtered2Items(filter.status)"
            :search="search">
          <template slot="items" slot-scope="props">                    
                <td style="display:none;">{{ props.item.id }}</td>
                <td style="display:none;">{{ props.item.status }}</td>
                <td style="display:none;">{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.date | moment }}</td>
                <td class="text-xs-left">{{ props.item.home_team }} vs {{ props.item.away_team }}
                </td>
                <td class="text-xs-left">{{ props.item.organiser }}</td>
                <td class="text-xs-left">{{ props.item.home_odd }}</td>
                             <td class="text-xs-left">{{ props.item.away_odd }}</td>   
                <td class="text-xs-left">{{ props.item.score1 }} - {{ props.item.score2 }}</td>
                <td class="justify-center layout px-0">
                  <v-btn color="blue darken-1" flat @click="betItem(props.item)">place bet</v-btn>
                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
          </template>              
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
             Your search for "{{ search }}" found no results.
          </v-alert> 
        </v-data-table>
      </v-tab-item>   
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <!-- *********************** -->
      <!-- tab 1 (Round/Venue)     -->
      <!-- ======================= --> 
      <v-tab-item>
        <v-toolbar flat color="white">
          <v-toolbar-title><v-icon>pets</v-icon>{{ organiser }} Tournament</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- ***************************************** -->
          <!--  dialog 1 --> edit button () -->
          <!-- ==================================== -->
          <v-dialog v-model="editdialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">New Game</v-btn>
            <v-card>
              <v-card-title><span class="headline">{{ form1Title }}</span></v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.round" label="Round"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.date" label="Date"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.home_team" label="Home teams"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.away_team" label="Away teams"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.organiser" label="Organiser"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.home_odd" label="Home Odd"></v-text-field></v-flex>
                                        <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.away_odd" label="Away Odd"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.score1" label="score1"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.score2" label="score2"></v-text-field></v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>   
          
          <v-btn color="info" @click="newBet()">New Bet</v-btn>
          <dialog2bet :dialog.sync="betdialog" :mybet="bettedItem" @close-dialog="closeDialog" />
          <!-- ***************************************** -->
        </v-toolbar>     
      </v-tab-item>      
    </v-tabs-items>
  </div>
</template>
<script>
import store from '../store';
import moment from 'moment';
import dialog2bet from './Dialog2Bet.vue';
export default {
  name: 'schComponent',
  props:[ 'organiser' ],
  components: { store, dialog2bet },
  data () {
    return {
//      items: [ 'User', 'Product', 'videos', 'images', 'news'],
      users: [],
      isActive: false, 
      search: '',
      tabs: null,

      filterList: [
        { status: 'pending' },
        { status: 'closed' }
      ],
      games: [],
      mybets: [],
      columns: [
        { text: 'Date', value: 'date' },
        { text: 'Home vs away Team', value: 'name' },   
        { text: 'organiser', value: 'organiser' },        
        { text: 'Odd', value: 'odd' },
        { text: 'Scores', value: 'score1' }
      ],
      
      btabs: null,
      tabItems: ['Head 2 Head', 'Over / Under', 'Standard', 'Result', 'Odd'],

      editdialog: false,
      editedIndex: -1,
      editedItem: { home_team: '', away_team:'', organiser: '', venue: '', game_date: '', game_winner: '', bet_score1: 0,
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },  
      
      betdialog: false,
      bettedIndex: -1,
      bettedItem: { home_team: '', away_team:'', organiser: '', venue: '', game_date: '', game_winner: '', bet_score1: 0,
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },  
      bettypes: ['head2head', 'over', 'under', 'standard','odd'],
      usernames: [],
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
      menu1: false,    // new
      error:'',
      result:'',

      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 0
      }      
    };
  },
  computed: {
    form1Title () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
    form2Title () { return "Place Bet"; },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0;
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    }
  },
  watch: {
    editdialog (val) { val || this.close() },
    betdialog (val) { val || this.close() }
  },
  created () {
    let qry = 'database/json_basketball.php?organiser=' + this.organiser;
    axios.get(qry)
      .then(response => { 
        this.games = response.data;                       // 1) data table
        let obj1 = _.countBy(this.games, 'round');   // 2) list of round
        let obj2 = _.countBy(this.games, 'venue');
        this.roundList = [''];  // dummy
        this.venueList = [''];  // dummy 
        for (let [key, value] of Object.entries(obj1)) { this.roundList.push(key) }
        for (let [key, value] of Object.entries(obj2)) { this.venueList.push(key) }
        this.venueList.sort();
      })  
      .catch(error => { console.log(error) });
    //===============================================    
  },
  mounted() { this.isActive = this.selected; },

  methods: {
    filtered2Items (key) {
      const res = this.games
      if (key) { 
        if (key === 'Search') { return res };
        return this.games.filter(game => game.status === key) 
      };
      return res
    },
    after1selection (item) { this.$nextTick(() => { this.gameVenue = null }) },  // clear opposite select
    after2selection (item) { this.$nextTick(() => { this.gameRound = null }) },
    // -------------------
    editItem (item) {
      this.editedIndex = this.games.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editdialog = true;
    },

    newBet () {
//      this.bettedItem = {};    // object, not array
      this.bettedItem.username = this.$store.state.loginUser.username;
      this.bettedItem.id = 0;
      this.bettedItem.bet_type ='standard';
      this.bettedItem.home_team = '';
      this.bettedItem.away_team = '';
      this.bettedItem.game_date ='';
      this.bettedItem.organiser = '';
      this.bettedItem.venue = '';

      this.bettedItem.bet_score1 = 0;
      this.bettedItem.bet_odd = 0;

      this.bettedItem.pool_id = 0;
      this.bettedItem.bet_winner = '';
      this.bettedItem.bet_amount = 0;  


      this.bettedItem.game_winner = '';
      this.bettedItem.home_score = 0;
      this.bettedItem.away_score = 0;
      this.bettedItem.status = 'pending';      
      this.betdialog = true;  
    },
    editBet (item) {
      this.bettedItem = Object.assign({}, item);
      this.bettedItem.username = this.$store.state.loginUser.username;
      this.betdialog = true;  
    },
    closeDialog () {
      console.log('51) closeDialog');
      eventBus.$emit('reloadbettable',this.bettedItem);
//        if (this.editedIndex > -1) {
//          console.log('999) update datatable');
//          Object.assign(this.mybets[this.editedIndex], this.bettedItem);
//        };  


//      this.reload();
      this.betdialog = false;  
    },

    betItem (item) {
//      this.bettedIndex = this.games.indexOf(item);
      this.bettedItem = Object.assign({}, item);
      this.bettedItem.home_team = item.home_team;
      this.bettedItem.away_team = item.away_team;
      this.bettedItem.game_date = item.date;
//      this.bettedItem.bet_odd = item.odd;
      this.bettedItem.organiser = item.organiser;

      this.bettedItem.username = this.$store.state.loginUser.username;
      this.bettedItem.id = 0;
      this.bettedItem.bet_type ='standard';


      this.bettedItem.venue = '';
      this.bettedItem.game_winner = '';
      this.bettedItem.home_score = 0;
      this.bettedItem.away_score = 0;
      this.bettedItem.bet_score1 = 0;
      this.bettedItem.pool_id = 0;
      this.bettedItem.bet_winner = '';
      this.bettedItem.bet_amount = 0;  

      this.betdialog = true;
    },
    //-------------------   
    deleteItem (item) {
      const index = this.games.indexOf(item);
      var r = confirm('Are you sure you want to delete this item (' + this.games[index].home_team + ' vs ' + this.games[index].away_team + ') ?');
      if (r == true) {
        this.games.splice(index, 1);          // remove deleted item  
        let qry = 'database/json_basketball_delete.php';
        axios.post(qry, { data: item, op: "delete" } )
          .then(response => { 
          });
      } 
    },
    //------------------------------
    save () {
      console.log('editsave');
      if (this.editedIndex > -1) {
        Object.assign(this.games[this.editedIndex], this.editedItem);

        let qry = 'database/json_basketball_post.php';
        axios.post(qry, { data: this.editedItem } )
          .then(response => { });
      } else {
        this.games.push(this.editedItem);
      }
      this.close();
    },
    //----------------------------------------
    close () {
      this.editdialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format('L');
    }
  }
};
</script>

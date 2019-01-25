// const betTable = Vue.component('betComponent', {
<template>
  <div id="betTable">
    <v-btn color="info" @click="newBet()">New Bet</v-btn>
    status: {{status}}
    <dialog2bet :dialog.sync="betdialog" :mybet="bettedItem" @close-dialog="closeDialog" />

    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">
      <v-tab v-for="filter in filterList" :key="filter.game">{{filter.organiser}}</v-tab>
      <v-tab-item v-for="filter in filterList" :key="filter.organiser">
        <v-data-table :headers="columns" :items="filteredBets(filter.organiser)">
          <template slot="items" slot-scope="props">   
            <td class="text-xs-left">{{ props.item.organiser }}</td>   
            <td class="text-xs-left">{{ props.item.home_team }} vs {{ props.item.away_team }}</td>                             
            <td class="text-xs-left">{{ props.item.game_date | moment }}</td>
            <td class="text-xs-left">{{ props.item.score1 }} - {{ props.item.score2 }}</td>
            <td class="text-xs-left">
              {{ props.item.bet_amount }} - 
              {{ estReturns(props.item.bet_amount, props.item.bet_odd) }}</td>
            <td class="text-xs-left">{{ props.item.bet_score1 }} - {{ props.item.bet_score2 }}</td>
            <td>{{ props.item.bet_type }}-{{ props.item.bet_odd_type }}</td>
            <td>{{ props.item.bet_odd }}</td>
            <td>{{ props.item.pool_id }}</td>
            <td style="display:none;">{{ props.item.id }}</td>
            <div v-if="props.item.status == 'pending'">   
              <td class="justify-center layout px-0">
                <v-icon small class="mr-2" @click="editBet(props.item)">edit</v-icon>
                <v-icon small @click="deleteBet(props.item)">delete</v-icon>
              </td>              
            </div>       
          </template>      
        </v-data-table>         
      </v-tab-item>
    </v-tabs>             
  </div>
</template>
<script>
import store from '../store';
import dialog2bet from './Dialog2Bet.vue';
export default {
  name: 'betComponent',
  props: { 'status': {type: String, default: 'pending' }},
  components: { store, dialog2bet },
  data () {
    return {
      tabs: null,
      btabs: null,
      tabItems: ['Head 2 Head', 'Over / Under', 'Standard / Standalone', 'Result'],
      filterList: [
        { organiser: 'NBA' },
        { organiser: 'NBL' },
        { organiser: 'NFL' },
        { organiser: 'AFL' },
        { organiser: 'Asian Games' }
      ],
      columns: [   
        { text: 'Organiser', value: 'organiser' }, 
        { text: 'Home vs Away Team', value: 'name' },  
        { text: 'Date', value: 'date' },    
        { text: 'Scores', value: 'score1' },
        { text: 'Bet/Return', value: 'bet_amount'},
        { text: 'Bet Scores', value: 'bet_score1' },
        { text: 'Bet type', value: 'bet_type' },
        { text: 'Odd', value: 'bet_odd' },
        { text: 'Pool#', value: 'pool_id' },
//        { text: 'Id', value: 'id' }            
      ],            
      editdialog: false,
      betdialog: false,

      editedIndex: -1,
      editedItem: { home_team: '', away_team:'', organiser: '', venue: '', game_date: '', game_winner: '', home_score: 0, away_score: 0,
              bet_score1: 0, bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 }, 

      bettedIndex: -1,
      bettedItem: { home_team: '', away_team: '', organiser: '', venue: '', game_date: '', game_winner: '', home_score: 0, away_score: 0,
              bet_score1: 0, bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },   

      bettypes: ['odd', 'head2head', 'over', 'under', 'standard'],
      usernames: [],
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
      menu1: false,    // new
      menu2: false,     // edit
      error:'',
      result:'',

      mybets: [],
    }
  },
  created () {
    eventBus.$on('reloadbettable',this.reload);    // call from external component
    this.getMyBets(); 
  },
  methods: {
    getMyBets() {
      console.log("12) getMyBets:"+this.status);
      this.error = '';
      this.result = 'Getting data from server...';
      var postdata = {  "op": "getUserBets", "data": {"status": this.status, 
                                                      "username": this.$store.state.loginUser.username} };
      this.$http.post('php/apiBet.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' } })
        .then(response => { this.mybets = response.body.data;
        },    response => { this.result = 'Failed to load data to server.'; }
        );   // end of .then
    },
    estReturns(val, odd) { return val * odd },
    filteredBets(key) {             // cannot in computed
      const res = this.mybets
      if (typeof this.mybets !== "undefined")  {   
        if (key) { return this.mybets.filter(mybet => mybet.organiser === key) }
      };
      return res
    },
    newBet () {
//      this.bettedItem = {};    // object, not array
      this.bettedItem.username = this.$store.state.loginUser.username;
      this.bettedItem.id = 0;
      this.bettedItem.bet_type ='standard';
      this.bettedItem.home_team = '';
            this.bettedItem.away_team = '';
      this.bettedItem.organiser = '';
      this.bettedItem.venue = '';
      this.bettedItem.game_date ='';
      this.bettedItem.game_winner = '';
      this.bettedItem.home_score = 0;
      this.bettedItem.away_score = 0;
      this.bettedItem.bet_score1 = 0;
      this.bettedItem.bet_odd = 0;

      this.bettedItem.pool_id = 0;
      this.bettedItem.bet_winner = '';
      this.bettedItem.bet_amount = 0;  
      this.betdialog = true;  
    },
    editBet (item) {
      this.bettedItem = Object.assign({}, item);
      this.bettedItem.username = this.$store.state.loginUser.username;
      this.betdialog = true;  
    },
    closeDialog () {
//      this.reload();             // close from local component
      this.betdialog = false;  
    },

    deleteBet (item) {
      const index = this.mybets.indexOf(item);
      var r = confirm('Are you sure you want to delete this item (' + this.mybets[index].game_name + ') ?');
      if (r == true) {
        this.mybets.splice(index, 1);          // remove deleted item  
        let qry = 'database/json_mybet_delete.php';
        axios.post(qry, { data: item, op: "delete" } )
          .then(response => { 
          });
      } 
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format('L');
    }
  }
};
</script>

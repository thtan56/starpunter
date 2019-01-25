// const Bet = Vue.component('betcomponent', {
<template>
  <v-layout column>
    <v-toolbar color="pink" dark><v-toolbar-title>Bet Management</v-toolbar-title></v-toolbar>
    <v-container fluid grid-list-md>
<!-- ========================================================== -->
      <v-form v-model="valid" ref="form">
        <v-layout row wrap>
        <v-flex xs4><v-text-field label="Home Team" v-model="bet.home_team"></v-text-field></v-flex>
          <v-flex xs4><v-text-field label="Away Team" v-model="bet.away_team"></v-text-field></v-flex>     
        <v-flex xs4><v-combobox v-model="bet.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
        <v-flex xs4><v-text-field label="Venue" v-model="bet.venue"></v-text-field></v-flex>
        <v-flex xs4>
          <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="bet.game_date">
            <v-text-field slot="activator" label="Game date" v-model="bet.game_date" prepend-icon="event" readonly>
            </v-text-field>
            <v-date-picker v-model="bet.game_date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menu.save(bet.game_date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>           
        <v-flex xs4>
          bet type:
          <v-radio-group v-model="bet.bet_type" row>
            <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs4><v-text-field label="Pool#" v-model="bet.pool_id"></v-text-field></v-flex>
        <v-flex xs4><v-text-field label="Odd" v-model="bet.bet_odd"></v-text-field></v-flex>
        <v-flex xs4>
          <v-combobox v-model="bet.username" :items="usernames" label="Select username:"></v-combobox>
        </v-flex>
        <v-flex xs4><v-text-field label="Bet Winner" v-model="bet.bet_winner"></v-text-field></v-flex>
        <v-flex xs4><v-text-field label="Bet/Pool Amount" v-model="bet.bet_amount"></v-text-field></v-flex>
        <v-flex xs4><v-text-field label="Game Winner" v-model="bet.game_winner"></v-text-field></v-flex>
      </v-layout>
      <v-btn @click="save" :class="{ red: !valid, green: valid }">save</v-btn>
        Status: {{ result }}
        <span class="badge badge-danger">{{error}}</span>
    </v-form>
    <!-- ================================================================ -->    
  </v-container>
  <v-container fluid grid-list-md>
    <v-flex xs12>
      <v-card dark color="primary">
        <div>
          <v-data-table :headers="headers" :items="games" :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.home_team}} vs
                  {{ props.item.away_team}}</td>
              <td>{{ props.item.organiser}}</td>
              <!--        <td>{{ props.item.venue}}</td>  -->
              <td>{{ props.item.game_date | moment }}<br>
                  {{ props.item.week_no}}</td>
              <td>{{ props.item.bet_type}}</td>          
              <td>{{ props.item.pool_id}}</td>     
              <td>{{ props.item.bet_odd}}</td>
              <td>{{ props.item.username}}</td>        
              <td>{{ props.item.bet_winner}}<br>
                  {{ props.item.game_winner}}</td>
              <td>{{ props.item.bet_amount}}</td>            
              <td>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template slot="footer">
              <td colspan="100%">
                <strong>Notes: Just fill the blanks to register a new bet</strong>
              </td>
            </template>
          </v-data-table>
        </div>            
      </v-card>
    </v-flex>
  </v-container>
</v-layout>
</template>

<script>
export default {
  name: 'Bet',   // component name
  data () {
    return {
      menu: false,
      result: '',
      error: '',
      valid: false,
      bettypes: ['head2head', 'over', 'under', 'standard'],
      usernames: [],
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],

      bet: { home_team: '', away_team:'', organiser: '', venue: '', game_date: '', game_winner: '', 
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },
      defaultItem: { home_team: '', away_team:'', organiser: '', venue: '', game_date: '', game_winner: '', 
              bet_odd: 0,  bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },
      games: [],
      pagination: {},
      headers: [{ text: 'Home vs Away Team', value: 'name' }
                  ,{ text: 'Organiser', value: 'organiser', width: '10px' } 
//                  ,{ text: 'Venue', value: 'venue' }
                  ,{ text: 'Date/Week', value: 'date' }       
                  ,{ text: 'Bet Type', value: 'bet_type' }
                  ,{ text: 'Pool#', value: 'pool_id' }
                  ,{ text: 'Odd', value: 'bet_odd' }
                  ,{ text: 'Username', value: 'username' }
                  ,{ text: 'Winner(Bet:Game)', value: 'game_winner' }
                  ,{ text: 'Bet/Pool($)', value: 'bet_amount' }
                  ],
    }
  },
  created () { console.log('1) created' + this.valid); },
  mounted: function () { console.log('2) mounted');    },

  methods: {
    save: function () {
      if(this.bet.home_team=='' || this.bet.away_team=='' || this.bet.organiser=='' || this.bet.game_date =='' ){     // mysql name (match) problem 
        this.error = 'home & away team, organiser and date fields are required';           // use select `match`, ....
        return;
      };
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.bet };
      this.$http.post('php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            this.result = response.body;
            this.getAllData();                 // refresh datatable
            this.bet.home_team ='';
            this.bet.away_team ='';
            this.bet.organiser = '';
            this.bet.venue = '';
            this.bet.game_date = '';
            this.bet.game_winner='';
            this.bet.bet_type = '';
            this.bet.pool_id = 0;
            this.bet.bet_odd =  0;
            this.bet.username = '';
            this.bet.bet_winner=''; 
            this.bet.bet_amount= 0;
          }, response => { this.result = 'Failed to save data to server.'; });
    },
    editItem: function(item){ this.bet = item; },
    deleteItem: function(item){
        var r = confirm("Are you sure to delete this item ("+item.game_name+ ")?");
        if(r==true) {
          this.result = 'Deleting data to server...';
          var postdata = { op: "delete", id: item.id };
          this.$http.post('php/apiBet.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
            .then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
            },    response => { this.result = 'Failed to delete data.'; }
            );
        }    // if
    },
    getAllData: function () {
        this.result = 'Getting data from server...';
        var postdata = { op: "getBets" };
        this.$http.post('php/apiBet.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' } })
          .then(response => { this.games = response.body.data;
          },    response => { this.result = 'Failed to load data to server.'; }
          );   // end of .then
    },
    setUsernames: function() {
        var postdata = { op: "getUsers" };
        this.$http.post('php/apiUser.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
          .then(response => {
            this.users = response.body.data;
            this.usernames=[];
            for (var i=0; i < this.users.length; i++) {
              this.usernames.push(this.users[i].username);
            };
          }, response => { this.result = 'Failed to load data to server.'; }
          );
    },
  },       // methods
  filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD');
      }
  },
  beforeMount(){
      console.log('1) beforeMount > this.getAllData');
      this.getAllData();
      this.setUsernames(); 
  }
};
</script>


// Vue.component('gameresults', {
<template> 
  <div>
    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
      <v-tab v-for="filter in statusList" :key="filter.status">{{ filter.status }}</v-tab>
      <v-spacer></v-spacer>
      <v-btn flat>Games </v-btn>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-tab-item v-for="filter in statusList" :key="filter.status">
        <v-card dark color="primary">   

          <v-data-table :headers="headers" :pagination.sync="pagination" :search="search" 
                        :items="filtered2Items(filter.status)">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.start | moment }} / {{ props.item.id }}</td>
              <td>{{ props.item.organiser}} / {{ props.item.round}}</td> 
              <td>{{ props.item.home_team}}</td> 
              <td>{{ props.item.away_team}}</td> 
              <td>{{ props.item.home_score}}/{{ props.item.away_score}}</td>
              <td>{{ props.item.status}}</td>           
              <td> 
                <template v-if="role === 'manager'">      
                  <v-icon small @click="updateResult(props.item)">note_add</v-icon>
                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </template>
              </td>
            </template>            
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <!-- ==================================================================== -->
    <v-dialog v-model="resultdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Update Result for Game# {{pool_id}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>              
              <v-flex xs3><v-text-field label="Home team:" v-model="editedItem.home_team" readonly></v-text-field></v-flex>
              <v-flex xs3><v-text-field label="Away team:" v-model="editedItem.away_team" readonly></v-text-field></v-flex>
              <v-flex xs2><v-text-field label="Organiser"  v-model="editedItem.organiser" readonly></v-text-field></v-flex>
              <v-flex xs2><v-text-field label="Round:"     v-model="editedItem.round" readonly></v-text-field></v-flex>            
              <v-flex xs2><v-text-field label="Game date:" v-model="displayStart" readonly></v-text-field></v-flex> 

              <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score" background-color="green"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score" background-color="green"></v-text-field></v-flex>            

            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" flat @click.native="close">Cancel</v-btn>
          <v-btn color="white" flat @click.native="saveResult">Save</v-btn>
          <v-spacer></v-spacer>
          Status: {{ result }}
          <span class="badge badge-danger">{{error}}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>  
    <!-- ================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>              
              <v-flex xs2><v-text-field label="Organiser" v-model="editedItem.organiser" readonly></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Home Team" v-model="editedItem.home_team" readonly></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Team" v-model="editedItem.away_team" readonly></v-text-field></v-flex>       
              <v-flex xs2><v-text-field label="Round"     v-model="editedItem.round"     readonly></v-text-field></v-flex>
              <v-flex xs5><v-text-field label="Venue" v-model="editedItem.venue"></v-text-field></v-flex>

              <v-flex xs3>   <!-- date picker -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.start">
                  <v-text-field slot="activator" label="Game date" v-model="editedItem.start" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedItem.start" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedItem.start)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>    
              <v-flex xs2><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
              <v-flex xs2><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>
            
              <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score" background-color="green"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score" background-color="green"></v-text-field></v-flex> 
              <v-flex xs4>
                <v-radio-group v-model="editedItem.status" row label="Status:" background-color="green">
                  <v-radio v-for="item in ['pending','closed']" :key="item" :label="item" :value="item"></v-radio>
                </v-radio-group>
              </v-flex>           
              
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
  </div>
</template>

<script>
import store from '../store';    // 1
import moment from 'moment';
export default {
  name: 'gameWeekResults',
  props: { organiser: { type: String } 
          ,round:     { type: String }  
  },
  components: { store },   // 2
  data () {
      return {
        games: [],
        pool_id: 0,
        organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
        
        resultdialog: false,
        editdialog: false,
        menu: false,      // edit dialog
        menu2: false,    // result dialog
        tabs: null,
        statusList: [ { status: 'pending' }, { status: 'closed' }],
        result: '',
        error: '',
        valid: false,
        teams:[],
        editedIndex: -1,
        editedItem: { organiser: '', round: '', home_team: '', away_team: '', winner: '', home_odd: 0, away_odd: 0,
              venue: '', home_score: 0, away_score: 0, status: '', start: '',
              id: 0 },

        pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },    
        // source bet file & pool file
        headers: [{ text: 'Game Date/#', value: 'start' }
                 ,{ text: 'Organiser/Round', value: 'organiser' },
                 ,{ text: 'Home Team', value: 'home_team' },{ text: 'Away Team', value: 'away_team'} 
                 ,{ text: 'Home/Away Score', value: 'home_score'}
                 ,{ text: 'Status', value: 'status' } ],
        search: ''
      }
    },
    computed: {
      role()       { return this.$store.state.loginUser.role; },
      formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
      pageTitle()  { return 'Game Results for the week ' + moment().format('W') },
      displayStart: {
        get: function () {
          return moment(this.editedItem.start).format('YYYY/MM/DD');
        }
      }
    },
    watch: {
      organiser(newVal, oldVal) { this.getAllData(); },
      round(newVal, oldVal)     { this.getAllData(); },    
    },    
    filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
    methods: {
      filtered2Items (key) {
        console.log("101) filtered2Items:"+key);
        const res = this.games;
        if (key) { 
          if (key === 'Search') { return res };
          let results=_.filter(this.games, game => game.status === key);
          return results;
        };
        return res
      },
      closeDialog () {
        console.log('51) closeDialog');
        this.getAllData();     // reload
        this.editdialog = false;  
      },
      editItem: function(item){
        this.editedIndex = this.games.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItem.name = item.name;
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
        this.editedItem.winner = this.editedItem.home_score > this.editedItem.away_score 
            ? this.editedItem.home_team : this.editedItem.away_team;
        this.editedItem.status = 'closed';
        Object.assign(this.games[this.editedIndex], this.editedItem);   // update datatable
        var postdata = { "op": "save", "type": "result", "data": this.editedItem,  };

        this.error = '';
        this.result = 'Saving data to server...';
        this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
      },
      saveResult() {
        this.editedItem.status = 'closed';
        Object.assign(this.games[this.editedIndex], this.editedItem);   // update datatable
        var postdata = { "op": "saveResult", "data": this.editedItem,  };
        this.error = '';
        this.result = 'Saving data to server...';
        this.$http.post('/php/apiGame.php', postdata, { headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
      },
      updateResult: function(item){
        this.editedIndex = this.games.indexOf(item);
        this.editedItem = item;
        this.resultdialog = true;  
        console.log('51) updateResult: this.editedItem', this.editedItem);
      },  
      close () {
        this.editdialog = false;
        this.resultdialog = false;
      },
      getAllData() {
        console.log("20) getAllData:"+this.organiser+":"+this.round);
        this.result = 'Getting data from server...'; 
        var postdata = { op: "getOrgRndGames", data: { organiser: this.organiser, round: this.round } };    
        this.$http.post('/php/apiGame.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.games = response.body.data;
                    console.log("22) this.games", this.games);
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
    },    // end of method
    beforeMount(){ 
      this.getAllData();
    }
};
</script>

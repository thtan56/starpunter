const gametable = Vue.component('gameTable', {
  props: { 'organiser': {type: String } },
  template: /* syntax: html */ `
  <v-content>
    <homebars></homebars>
    <v-container fluid grid-list-sm>
      <v-layout row wrap>
        <v-flex xs12> 
          <v-toolbar flat color="pink" dark>
            <v-toolbar-title><v-icon>pets</v-icon>{{organiser}} Tournament</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn :disabled="role != 'manager'" color="pink" @click="newGame()">New Game</v-btn>
            </v-toolbar-items>        
          </v-toolbar>

          <v-card flat>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field label="Search" v-model="search" append-icon="search" single-line hide-detail></v-text-field>
            </v-card-title>
            <v-data-table
                :pagination.sync="pagination"
                :headers="columns" :items="games" :search="search">
              <template slot="items" slot-scope="props">   
                <td class="text-xs-left">{{ weekNo(props.item.start) }}</td>
                <td class="text-xs-left">{{ props.item.start | moment }}</td>
                <td class="text-xs-left">{{ props.item.home_team }}</td>
                <td class="text-xs-left">{{ props.item.away_team }}</td>
                <td class="text-xs-left">{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.venue }}</td>
                <td class="text-xs-left">{{ props.item.result }}</td>
                <td>{{ props.item.id }}</td>
                <td><v-icon :disabled="role != 'manager'" @click="editItem(props.item)">edit</v-icon></td>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
              </v-alert>              
            </v-data-table>    
          </v-card>
        </v-flex>
      </v-layout>
      <v-dialog v-model="editdialog" max-width="1000px">
        <v-card>
          <v-card-title><span class="headline">{{ formTitle }}</span></v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>              
                <v-flex xs4>   <!-- date picker -->
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
                <v-flex xs4><v-text-field v-model="editedItem.round" label="Round"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Id" v-model="editedItem.id" readonly background-color="red"></v-text-field></v-flex>
   
                <v-flex xs2>
                  <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select>
                </v-flex>
                <v-flex xs5><v-combobox v-model="editedItem.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
                <v-flex xs5><v-combobox v-model="editedItem.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
                <v-flex xs12><v-text-field v-model="editedItem.venue" label="Venue"></v-text-field></v-flex>
                <v-flex xs4><v-text-field v-model="editedItem.home_score" label="Home Score"></v-text-field></v-flex>
                <v-flex xs4><v-text-field v-model="editedItem.away_score" label="Away Score"></v-text-field></v-flex>
                <v-flex xs4>
                  <v-radio-group v-model="editedItem.status" row label="Status:" background-color="green">
                    <v-radio v-for="item in ['pending','closed']" :key="item" :label="item" :value="item"></v-radio>
                  </v-radio-group>
                </v-flex>
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
    </v-container>
  </v-content>
  `,
  data () {
    return {
      games: [],           // define in dataManager function (no action required in html)
      teams: [],  
      //======================================================
      menu: false,
      tabs: null,
      result: '',
      error: '',
      valid: false,
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],

      users: [],
      isActive: false, 
      editdialog: false,
      search: '',
      tabs: null,
      items: [ 'Results', 'Search'],
      columns: [
        { text: 'Week#', value: 'weekno' },
        { text: 'Date', value: 'date' },
        { text: 'Home Teams', value: 'home_team' },        
        { text: 'Away Teams', value: 'away_team' },  
        { text: 'Round', value: 'round' },
        { text: 'Venue', value: 'venue' },
        { text: 'Results', value: 'result' },
        { text: 'Id', value: 'id' },
      ],
      editedIndex: -1,
      editedItem: { round: '', date: '', home_team: '', away_team:'', venue: '', result: '' },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 0
      }      
    };
  },
  computed: {
    role()       { return this.$store.state.loginUser.role; },
    formTitle () { return this.editedIndex === -1 ? 'New Item' : 'Edit Item' },
  },
  watch: {
    editdialog (val) { val || this.close() },
    organiser (newVal, oldVal)  { this.getItems(newVal); },
  },

  created () { this.getItems(this.organiser); },
  mounted() { this.isActive = this.selected;  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    //=============================================================================
    changeOrganiser(selectObj) {
      this.editedItem.organiser = selectObj;
      this.getTeams(selectObj);
    },
    getTeams(organiser) {
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgTeamNames", id: organiser };
      this.$http.post('/php/apiTeam.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.teams = response.body.data;
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    //========================================
    weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },

    editItem (item) {
      this.editedIndex = this.games.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editdialog = true;
    },
    deleteItem (item) {
      const index = this.games.indexOf(item);
      confirm('Are you sure you want to delete this item (' + this.games[index].home_team 
                                                    + " vs "+ this.games[index].away_team +') ?') && this.games.splice(index, 1);
    },
    newGame () {
      this.editedIndex = -1;
 //       this.editedItem.username = this.$store.state.loginUser.username;
      this.editedItem.id = 0;
      this.editedItem.organiser = '';
      this.editedItem.venue = '';
      this.editedItem.date ='';
      this.editedItem.home_score = 0;
      this.editedItem.away_score = 0;
      this.editedItem.home_team = '';
      this.editedItem.away_team = '';
      this.editedItem.round = '';

      this.editedItem.pool_id = 0;
      this.editdialog = true;  
    },
    save () {
      console.log('save');
      if (this.editedIndex > -1) {
        console.log('save edit game');
        console.log(this.editedIndex);
        Object.assign(this.games[this.editedIndex], this.editedItem);
      } else {
        console.log('save new game');
        console.log(this.editedItem);
        this.games.push(this.editedItem);
      };
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };
      this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
        }, response => { this.result = 'Failed to save data to server.'; }
        );
      this.close();
    },
    close () {
      this.editdialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    getItems(organiser) {
      console.log("11) getAllData:"+organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgGames", id: organiser };
      this.$http.post('/php/apiGame.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' } })
        .then(response => {   this.games = response.body.data;     
        },      response => { this.result = 'Failed to load data to server.'; }
        );
    },
  }
});

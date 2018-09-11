const GameResults = Vue.component('gameresults', {
  template: `
  <v-content>
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm12><v-card><v-card-text><betresults></betresults></v-card-text></v-card></v-flex>
      </v-layout>
    </v-container>
  </v-content>
`,
});

Vue.component('betresults', {
  template: `
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>{{pageTitle}} 
      </v-toolbar-title><v-spacer></v-spacer>
        <v-btn :disabled="role != 'manager'" color="info" @click="newGame()">New Game Contest</v-btn></v-toolbar>
      
      <v-card-title>
        <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="selectedOrganiser" ></v-select>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
        
      <v-data-table :headers="headers" :items="games" :pagination.sync="pagination" :search="search">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name}}</td><td>{{ props.item.organiser}}</td><td>{{ props.item.venue}}</td>
          <td>{{ props.item.date}}</td>
          <td>{{ props.item.odd}}</td>
          <td>{{ props.item.home_score}}</td> <td>{{ props.item.away_score}}</td>
          <td>{{ props.item.winner}}</td>

          <td>{{ props.item.status}}</td>
          <td>
            <v-icon :disabled="role != 'manager'" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon :disabled="role != 'manager'" small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </template>
        <template slot="footer"><td colspan="100%"><strong>Notes: Just fill the blanks to register a new game</strong></td></template>
      </v-data-table> 
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
              <v-flex xs3><v-text-field label="Odd" v-model="editedItem.odd"></v-text-field></v-flex>
          
            
            <template v-if="editedItem.id > 0">
              <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score" background-color="green"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score" background-color="green"></v-text-field></v-flex> 
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
        games: [], 
        editdialog: false,

        menu: false,
        tabs: null,
        tabItems: ['$10 pool', '$25 pool', '$50 pool', 'Result'],

        statuslist: ['open', 'closed'],


        result: '',
        error: '',

        valid: false,

        organiser: 'NBA',  
        organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
        teams:[],

        selectedOrganiser: '',
        selectedgame: { name: '', organiser: '', venue: '', date: '', winner: '', home_score: 0, away_score: 0,
              odd: 0, pool_id: 0, username: '', id: 0 },

        editedIndex: -1,
        editedItem: { name: '', organiser: '', venue: '', date: '', home_score: 0, away_score: 0, winner: '',
                      status: '', odd: 0, id: 0 },

        pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
        headers: [{ text: 'Game', value: 'name' },  { text: 'Organiser', value: 'organiser' } 
                  ,{ text: 'Venue', value: 'venue' },{ text: 'Date', value: 'date' },{ text: 'Odd', value: 'odd' } 
                  ,{ text: 'Home Score', value: 'home_score' },{ text: 'Away Score', value: 'away_score' }
                  ,{ text: 'Winner', value: 'winner' }, { text: 'Status', value: 'status' } ],
        search: '',
      }
    },
    computed: {
      role() { return this.$store.state.loginUser.role; },
      formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
      pageTitle() { return 'Results for the week ' + moment().format('W') },
    },
    methods: {
      changeOrganiser(selectObj) {
        console.log('55) changeOrganiser');
        console.log(selectObj);
        console.log(this.selectedOrganiser);
        this.organiser = this.selectedOrganiser;

        this.getAllData();

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
        this.editedItem.odd = 0;
        this.editdialog = true;  
      },
      editItem: function(item){
        this.editedIndex = this.games.indexOf(item);
        this.editedItem = Object.assign({}, item);

        this.editedItem.name = item.name;

        this.editedItem.organiser = item.organiser;
        this.editedItem.venue = item.venue;
        this.editedItem.date = item.date;
        this.editedItem.home_score = item.home_score;
        this.editedItem.away_score = item.away_score;
        this.editedItem.winner = item.winner;
        this.editedItem.status = item.status;
        this.editedItem.odd = item.odd;
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
          this.$http.post('php/apiGame.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }})
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
        this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
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
        console.log("90) getAllData : this.organiser");
        console.log(this.organiser);

        this.result = 'Getting data from server...';
        var postdata = { op: "getOrgGames", id: this.organiser };
        this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            this.games = response.body.data;
            console.log('91) betresult > this.games');
            console.log(this.games);
          },      response => { this.result = 'Failed to load data to server.';
        });
      },
    },
    beforeMount(){ 
      this.organiser = 'NBA';
      this.getAllData(); }
});

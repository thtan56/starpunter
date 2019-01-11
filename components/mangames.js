const Game = Vue.component('gamecomponent', {
    template: `
       <v-layout column>
          <v-toolbar color="pink" dark><v-toolbar-title>Games Management</v-toolbar-title></v-toolbar>
          <v-container fluid grid-list-md>
            <v-form v-model="valid" ref="form">
              <v-layout row wrap>        
                <v-flex xs2>
                  <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select>
                </v-flex>
                <v-flex xs4><v-combobox v-model="editedItem.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
                <v-flex xs4><v-combobox v-model="editedItem.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
                <v-flex xs2>   
                  <!-- =============== date picker ==========================  -->
                  <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.start">
                    <v-text-field slot="activator" label="Game date" v-model="editedItem.start" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="editedItem.start" no-title scrollable>

                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(editedItem.start)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                  <!-- --------------------------------------------------------------------------- -->
                </v-flex>  
                <v-flex xs3><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
                <v-flex xs3><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>
                <v-flex xs3><v-text-field label="Home Score" v-model="editedItem.home_score"></v-text-field></v-flex>
                <v-flex xs3><v-text-field label="Away Score" v-model="editedItem.away_score"></v-text-field></v-flex>

                <v-flex xs4><v-text-field label="Venue" v-model="editedItem.venue"></v-text-field></v-flex>
                <v-flex xs4><v-combobox v-model="editedItem.status" :items="['pending','closed']" label="Status:"></v-combobox></v-flex>  
                <v-flex xs4><v-text-field label="id" v-model="editedItem.id"></v-text-field></v-flex>  
              </v-layout>
              <v-btn @click="save">save</v-btn>
              <v-btn @click="csvinsert">csv insert-{{organiser}}</v-btn>
              Status: {{ result }}
              <span class="badge badge-danger">{{error}}</span>
            </v-form>
          </v-container>
          <v-container fluid grid-list-md>
            <v-flex xs12>
              <v-card dark color="primary">
                <div>
                Organiser:
                <template v-for="org in organisers">
                  <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
                </template>
                <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>     
                <v-data-table :headers="headers" :items="games" :pagination.sync="pagination" :search="search">
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.organiser}}
                    :{{ props.item.home_team}} vs {{ props.item.away_team}}</td>
                    <td>{{ props.item.start | moment}} / {{ props.item.round}}</td>
                    <td>{{ props.item.venue }}</td>
                    <td>{{ props.item.home_odd}}:{{ props.item.away_odd}}</td>
                    <td>{{ props.item.home_score}}:{{ props.item.away_score}}/{{ props.item.game_winner}}</td>
                    <td>{{ props.item.status}}</td>
                    <td>{{ props.item.id}}</td>
                    <td>
                      <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                      <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                    </td>
                  </template>
     <template slot="footer">
        <td colspan="100%">
          <strong>Notes: Just fill the blanks to register a new game, status=close to disallow further entry</strong>
        </td>
      </template>
                </v-data-table>
                </div>            
              </v-card>
            </v-flex>
          </v-container>
        </v-layout>
  `,
      data () {
        return {
          menu: false,
          search: '',
          result: '',
          error: '',
          valid: false,
  
          editedIndex: -1,
          editedItem: { organiser: '', home_team: '', away_team: '', start: '', round: '', home_odd: 0, away_odd: 0,
              venue: '', game_winner: '', home_score: 0, away_score: 0, status: '',
              odd_date: '', selected_odd: 1,
              pool_id: 0, username: '', id: 0 },

          organiser: 'NBA',  
          organisers: ['NBA', 'NBL', 'NFL', 'AFL'],

          teams: [],
          games: [],
          pagination: {},
          headers: [ { text: 'Home vs Away Team', value: 'home_team' }  
            ,{ text: 'Start/Round', value: 'start' }
            ,{ text: 'Venue', value: 'venue' }
            ,{ text: 'Home/Away Odd', value: 'home_odd' },{ text: 'Home:Away Score/Winner', value: 'home_score' } 
            ,{ text: 'Status', value: 'status' },{ text: 'Game#', value: 'id' }   
          ],
        }
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
        changeOrganiser(selectObj) {
          this.editedItem.organiser = selectObj;
          this.getTeams(selectObj);
          console.log(this.editedItem.organiser);
        },
        getTeams(organiser) {
          console.log("11) getTeams-call axios"+organiser);
          this.result = 'Getting data from server...';
          var postdata = { op: "getOrgTeamNames", id: organiser };
          this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
            }).then(response => { this.teams = response.body.data;
              console.log(this.teams);
            },      response => { this.result = 'Failed to load data to server.';
          });
        },    
        csvinsert() {
          console.log("101) csvInsertGame",this.organiser);
          this.result = 'Getting data from server...';
          var postdata = { op: "csvinsertGames", orgid: this.organiser };
/*
          swal({
            title: '<strong>Test csv insert</strong>',
            type: 'info',
            html: '** You have just bought ticket <br>'
                  +'<u>Organiser#'+this.organiser+'</u>',
            showCloseButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
          });       
*/

          this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
            }).then(response => { 
            },      response => { this.result = 'Failed to load data to server.';
          });
          
        },  
        save: function () {
          if(this.editedItem.home_team=='' || this.editedItem.away_team=='' 
            || this.editedItem.organiser=='' || this.editedItem.date =='' ){     // mysql name (match) problem 
            this.error = 'home & away team, organiser and date fields are required';           // use select `match`, ....
            return;
          };
          this.error = '';
          this.result = 'Saving data to server...';
          var postdata = { "op": "save", "data": this.editedItem };
          this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
            .then(response => {
              this.result = response.body;
              this.getAllData();                 // refresh datatable
              this.editedItem.id = 0;
              this.editedItem.home_team = '';
              this.editedItem.away_team = '';
              this.editedItem.home_odd = '';
              this.editedItem.away_odd = '';
              this.editedItem.home_score = '';
              this.editedItem.away_score = '';
              this.editedItem.start = '';
              this.editedItem.status = '';
            }, response => { this.result = 'Failed to save data to server.'; });
          },
          editItem: function(item){ this.editedItem = item; },
          deleteItem: function(item){
              var r = confirm("Are you sure to delete this item ("+item.id+ ")?");
              if(r==true) {
                  this.result = 'Deleting data to server...';
                  var postdata = { op: "delete", id: item.id };
                  this.$http.post('php/apiGame.php', JSON.stringify(postdata),{
                      headers: { 'Content-Type': 'application/json' }
                  }).then(response => { this.result = response.body;
                                        this.getAllData();    // refresh datatable
                  },      response => { this.result = 'Failed to delete data.';
                  });
              }
          },          
          getAllData: function () {
            console.log('1) mangames.js: getAllData');
              this.result = 'Getting data from server...';
              var postdata = { op: "getOrgGames", id: this.organiser };
              this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
                  headers: { 'Content-Type': 'application/json' }
              }).then(response => { this.games = response.body.data;
                console.log(this.games);
              },      response => { this.result = 'Failed to load data to server.';
              });
          }
      },
      filters: { 
        moment: function (date) { return moment(date).format('YYYY-MM-DD'); }
      },
      beforeMount(){
        this.getAllData(); 
      },
 
  });
const PoolGames = Vue.component('poolgamescomponent', {
  template: `
     <v-layout column>
        <v-toolbar color="pink" dark><v-toolbar-title>Pool Games Management</v-toolbar-title></v-toolbar>
        <v-container fluid grid-list-md>
          <v-form v-model="valid" ref="form">
            <v-layout row wrap>
              <v-flex xs4><v-text-field label="Pool_id" v-model="editedItem.pool_id"></v-text-field></v-flex>
              <v-flex xs4></v-flex>
              <v-flex xs4><v-text-field label="id" v-model="editedItem.id" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12>
                 <v-radio-group v-model="editedItem.bet_type" row label="bet type">
                   <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
                 </v-radio-group>
              </v-flex>   
            
              <v-flex xs2>
                <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select>
              </v-flex>
              <v-flex xs5><v-combobox v-model="editedItem.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
              <v-flex xs5><v-combobox v-model="editedItem.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
              <v-flex xs4>   
                <!-- =============== date picker ==========================  -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.date">
                  <v-text-field slot="activator" label="Game date" v-model="editedItem.date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedItem.date" no-title scrollable>

                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedItem.date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <!-- --------------------------------------------------------------------------- -->
              </v-flex>  
              <v-flex xs4><v-combobox v-model="editedItem.status" :items="['pending','closed']" label="Status:"></v-combobox></v-flex>

            </v-layout>
            <v-btn @click="save">save</v-btn>
            Status: {{ result }}
            <span class="badge badge-danger">{{error}}</span>
          </v-form>
        </v-container>
        <v-container fluid grid-list-md>
          <v-flex xs12>
            <v-card dark color="primary">
              <div>
              <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>     
              <v-data-table :headers="headers" :items="poolgames" :pagination.sync="pagination" :search="search">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.pool_id}}</td>
                  <td>{{ props.item.bet_type}}</td>
                  <td>{{ props.item.organiser}}</td>
                  <td>{{ props.item.home_team}}</td>
                  <td>{{ props.item.away_team}}</td>
                  <td>{{ props.item.date}}</td>
                  <td>{{ props.item.status}}</td>
                  <td>{{ props.item.id}}</td>
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
   <template slot="footer">
      <td colspan="100%">
        <strong>Notes: Just fill the blanks to register a new pool game</strong>
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
        search: '',
        result: '',
        error: '',
        menu: false,
        valid: false,
        organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
        teams: [],
        editedIndex: -1,
        editedItem: { pool_id: 0, bet_type: '', organiser: '', home_team: '', away_team: '', date: '', status: '', id: 0 },

        poolgames: [],
        bettypes: ['odd', 'head2head', 'over', 'under', 'standard'],
        pagination: {},
        headers: [{ text: 'Pool Id', value: 'pool_id' }, { text: 'Bet Type', value: 'bet_type' } 
                  ,{ text: 'Organiser', value: 'organiser' }, { text: 'Home Team', value: 'home_team' }
                  ,{ text: 'Away Team', value: 'away_team' },{ text: 'Game Date', value: 'date' }
                  ,{ text: 'Status', value: 'status' },{ text: 'Id', value: 'id' }],
      }
    },
    methods: {
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
      save: function () {
        if(this.editedItem.home_team=='' || this.editedItem.away_team=='' 
            || this.editedItem.organiser=='' || this.editedItem.date =='' ){     // mysql name (match) problem 
          this.error = 'home & away team, organiser and date fields are required';           // use select `match`, ....
          return;
        };
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.editedItem };
        this.$http.post('php/apiPoolGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            this.result = response.body;
            this.getAllData();                 // refresh datatable
            this.editedItem.id = 0;
            this.editedItem.home_team = '';
            this.editedItem.away_team = '';
            this.editedItem.date = '';
            this.editedItem.status = '';
          }, response => { this.result = 'Failed to save data to server.'; });
        },
        editItem: function(item){ this.editedItem = item; },
        deleteItem: function(item){
            var r = confirm("Are you sure to delete this item (id:"+item.id+" pool id:"+item.pool_id+ ")?");
            if(r==true) {
                this.result = 'Deleting data to server...';
                var postdata = { op: "delete", id: item.id };
                this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata),{
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => { this.result = response.body;
                                      this.getAllData();    // refresh datatable
                },      response => { this.result = 'Failed to delete data.';
                });
            }
        },
        getAllData: function () {
            this.result = 'Getting data from server...';
            var postdata = { op: "getPoolGames" };
            this.$http.post('php/apiPoolGames.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => { this.poolgames = response.body.data;
              console.log("11) getAllData");
              console.log(this.poolgames);
            },      response => { this.result = 'Failed to load data to server.';
            });
        }
    },
    beforeMount(){ this.getAllData(); }
});

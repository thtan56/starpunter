const Team = Vue.component('teamcomponent', {
  template: `
     <v-layout column>
        <v-toolbar color="pink" dark><v-toolbar-title>Team Management</v-toolbar-title></v-toolbar>
        <v-container fluid grid-list-md>
          <v-form v-model="valid" ref="form">
            <v-layout row wrap>
              <v-flex xs4><v-text-field label="Name" v-model="team.name"></v-text-field></v-flex>
              <v-flex xs4><v-combobox v-model="team.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Venue" v-model="team.venue"></v-text-field></v-flex>
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
              <v-data-table :headers="headers" :items="teams" :pagination.sync="pagination">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name}}</td>
                  <td>{{ props.item.organiser}}</td>
                  <td>{{ props.item.venue}}</td>
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
   <template slot="footer">
      <td colspan="100%">
        <strong>Notes: Just fill the blanks to register a new team</strong>
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
        result: '',
        error: '',
        valid: false,
        organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
        team: { id: 0, name: '', organiser: '', venue: '' },
        teams: [],
        pagination: {},
        headers: [{ text: 'Team Name', value: 'name' }, { text: 'Organiser', value: 'organiser' }, { text: 'Venue', value: 'venue' }],
      }
    },
    methods: {
      save: function () {
        if(this.team.name=='' || this.team.organiser==''){
          this.error = 'Name and organiser fields are required';
          return;
          }
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.team };
        this.$http.post('php/apiTeam.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            this.result = response.body;
            this.getAllData();                 // refresh datatable
            this.team.id = 0;
            this.team.name = '';
            this.team.organiser = '';
            this.team.venue='';
          }, response => { this.result = 'Failed to save data to server.'; });
        },
        editItem: function(item){ this.team = item; },
        deleteItem: function(item){
            var r = confirm("Are you sure to delete this item ("+item.name+ ")?");
            if(r==true) {
                this.result = 'Deleting data to server...';
                var postdata = { op: "delete", id: item.id };
                this.$http.post('php/apiTeam.php', JSON.stringify(postdata),{
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => { this.result = response.body;
                                      this.getAllData();    // refresh datatable
                },      response => { this.result = 'Failed to delete data.';
                });
            }
        },
        getAllData: function () {
            this.result = 'Getting data from server...';
            var postdata = { op: "getTeams" };
            this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => { this.teams = response.body.data;
            },      response => { this.result = 'Failed to load data to server.';
            });
        }
    },
    beforeMount(){ this.getAllData(); }
});

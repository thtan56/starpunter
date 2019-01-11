const Team = Vue.component('teamcomponent', {
  template: `
     <v-layout column>
        <v-toolbar color="pink" dark><v-toolbar-title>Team Management</v-toolbar-title></v-toolbar>
        <v-container fluid grid-list-md>
          <v-form v-model="valid" ref="form">
            <v-layout row wrap>
              <v-flex xs4><v-text-field label="Name" v-model="editedItem.name"></v-text-field></v-flex>
              <v-flex xs4><v-combobox v-model="editedItem.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Short Name" v-model="editedItem.shortname"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Venue" v-model="editedItem.venue"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Logo" v-model="editedItem.logo"></v-text-field></v-flex>
              <v-flex xs4>
<img 
    :src="'images/'+editedItem.logo" 
    alt="triangle with all three sides equal"
    height="87px"
    width="100px" />
              </v-flex>
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
                Organiser:
                <template v-for="org in organisers">
                  <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
                </template>
              <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>     
              <v-data-table :headers="headers" :items="teams" :pagination.sync="pagination" :search="search">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name}}</td>
                  <td>{{ props.item.organiser}}</td>
                  <td>{{ props.item.shortname}}</td>
                  <td>{{ props.item.venue}}</td>
                  <td>{{ props.item.logo}}</td>
                  <td><img :src="'images/'+props.item.logo"  height="47px" width="50px" /></td>
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
        search: '',
        valid: false,
        organiser: 'NBA',  
        organisers: ['NBA', 'NBL', 'NFL', 'AFL'],

//        team: { id: 0, name: '', organiser: '', venue: '', logo: '' },

        editedIndex: -1,
        editedItem: { organiser: '', name: '', venue: '', logo: '', id: 0 },
        teams: [],
        pagination: {},
        headers: [{ text: 'Team Name', value: 'name' }, { text: 'Organiser', value: 'organiser' }, 
                  { text: 'shortname', value: 'shortname' },
          { text: 'Venue', value: 'venue' }, { text: 'Logo', value: 'logo' }],
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
//        this.getTeams(selectObj);
        console.log(this.editedItem.organiser);
      },      
      save: function () {
        if(this.editedItem.name=='' || this.editedItem.organiser==''){
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
            this.editedItem.id = 0;
            this.editedItem.name = '';
            this.editedItem.organiser = '';
            this.editedItem.shortname = '';
            this.editedItem.venue='';
            this.editedItem.logo='';
          }, response => { this.result = 'Failed to save data to server.'; });
        },
        editItem: function(item){ this.editedItem = item; },
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
//            var postdata = { op: "getTeams" };
            var postdata = { op: "getOrgTeams", id: this.organiser };           
            this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => { this.teams = response.body.data;
            },      response => { this.result = 'Failed to load data to server.';
            });
        }
    },
    beforeMount(){ this.getAllData(); }
});

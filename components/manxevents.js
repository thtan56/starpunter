const Event = Vue.component('eventcomponent', {
  template: `
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Event/Game Management</v-toolbar-title></v-toolbar>
      <v-container fluid grid-list-md>
        <v-form v-model="valid" ref="form">
          <v-layout row wrap>
            <v-flex xs3><v-text-field label="Event" v-model="editedItem.title"></v-text-field></v-flex>
            <v-flex xs3>   
              <!-- =============== date picker-start ==========================  -->
              <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.start">
                <v-text-field slot="activator" label="Start date" v-model="editedItem.start" prepend-icon="event" readonly></v-text-field>
                <v-date-picker v-model="editedItem.start" no-title scrollable><v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu.save(editedItem.start)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <!-- --------------------------------------------------------------------------- -->
            </v-flex>     
            <v-flex xs3>   
              <!-- =============== date picker-end ==========================  -->
              <v-menu ref="menu2" lazy :close-on-content-click="false" v-model="menu2" transition="scale-transition" 
                          offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.end">
                <v-text-field slot="activator" label="End date" v-model="editedItem.end" prepend-icon="event" readonly></v-text-field>
                <v-date-picker v-model="editedItem.end" no-title scrollable><v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu2.save(editedItem.end)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <!-- --------------------------------------------------------------------------- -->
            </v-flex>  
            <v-flex xs2><v-text-field label="Color" v-model="editedItem.cssClass"></v-text-field></v-flex>  
            <v-flex xs1><v-text-field label="id" v-model="editedItem.id" readonly ></v-text-field></v-flex> 

            <v-flex xs2>
              <v-select v-model="editedItem.organiser" :items="organisers" label="Select your organiser:" @change="change2Organiser"></v-select>
            </v-flex>
            <v-flex xs4><v-select v-model="editedItem.home_team" :items="teams" label="Home team:"></v-select></v-flex>
            <v-flex xs4><v-select v-model="editedItem.away_team" :items="teams" label="Away team:"></v-select></v-flex>

            <v-flex xs10><v-text-field label="Remarks" v-model="editedItem.remarks"></v-text-field></v-flex>
 
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
              <v-data-table :headers="headers" :items="events" :pagination.sync="pagination" :search="search">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.title}}</td>    
                  <td>{{ props.item.start | moment }}</td>
                  <td>{{ props.item.end | moment }}</td>      
                  <td>{{ props.item.cssClass}}</td>
                  <td>{{ props.item.organiser}}</td>    
                  <td>{{ props.item.home_team}} / {{ props.item.away_team}}</td>      
                  <td>{{ props.item.remarks}}</td>  <td>{{ props.item.id}}</td>
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
                <template slot="footer">
                  <td colspan="100%"><strong>Notes: Just fill the blanks to register a new Event</strong></td>
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
      events: [],
      menu: false,
      menu2: false,
      search: '',
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { id: 0, title: '', start: '', end: '', cssClass:'', 
                  organiser: '', home_team: '', away_team: '', remarks: '', id: '' },
      pagination: {},
      headers: [ { text: 'Event', value: 'title' },        { text: 'Start', value: 'start' } 
                ,{ text: 'End', value: 'end' },        { text: 'CssClass', value: 'cssClass' }
                ,{ text: 'Organiser', value: 'organiser' }  
                ,{ text: 'Home/Away Team', value: 'home_team' }
                ,{ text: 'Remarks', value: 'remarks' },{ text: 'Id', value: 'id' } ],
      organiser: 'NBA',  
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      teams: [],
    }
  },
  methods: {
    change2Organiser(selectObj) { this.getTeams(selectObj); },
    save: function () {
      console.log("11) save:editedItem");
      console.log(this.editedItem);
      if(this.editedItem.title=='' ){
        this.error = 'Event fields are required';
        return;
      }
      //---------------------
      if (this.editedIndex > -1) {
        Object.assign(this.events[this.editedIndex], this.editedItem);
      } else {
        this.events.push(this.editedItem);     // new
      }; 
      var saveitems = this.editedItem;    // updated too early - async
            //----------
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": saveitems };
      this.$http.post('php/apiEvent.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          this.result = response.body;
          this.getAllData();                 // refresh datatable
          this.editedItem = '';
/*          this.editedItem.id = 0;
          this.editedItem.title = '';
          this.editedItem.start = '';
          this.editedItem.end = '';
          this.editedItem.cssClass = '';
          this.editedItem.organiser = '';
          this.editedItem.home_team='';
          this.editedItem.away_team='',
          this.editedItem.remarks = '';
          */
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ 
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item ("+item.title+':id#'+item.id+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiEvent.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getTeams(organiser) {
      console.log("getTeams:organiser");
      console.log(organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgTeams", id: organiser };
      this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          let myteams = response.body.data;
          if (typeof myteams !== "undefined")  {   
            this.teams = [];
            for (var i=0; i < myteams.length; i++) {
              this.teams.push(myteams[i].name);
            };
          }
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    getAllData: function () {
      console.log('1) manevents.js: getAllData');
      this.result = 'Getting data from server...';
      var postdata = { op: "getEvents" };
      this.$http.post('php/apiEvent.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.events = response.body.data;
                              console.log(this.events);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  filters: {
    moment: function (date) { return moment(date).format('YYYY-MM-DD'); }
  },
  beforeMount(){ this.getAllData(); }
  });
const Period = Vue.component('periodcomponent', {
  template: `
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Period Management</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn href="/autoperiods.html">AutoGen Periods</v-btn>
      </v-toolbar>
      <v-container fluid grid-list-md>
        <v-form v-model="valid" ref="form">
          <v-layout row wrap>
            <v-flex xs3><v-text-field label="Period" v-model="editedItem.title"></v-text-field></v-flex>
            <v-flex xs2>   
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
            <v-flex xs2>   
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
            <v-flex xs3><v-text-field label="Color" v-model="editedItem.color"></v-text-field></v-flex> 
            <v-flex xs2><v-text-field label="id" v-model="editedItem.id"></v-text-field></v-flex> 

            <v-flex xs2>
                  <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select>
            </v-flex>
            <v-flex xs2><v-text-field label="Round" v-model="editedItem.round"></v-text-field></v-flex>  
            <v-flex xs8><v-text-field label="Remarks" v-model="editedItem.remarks"></v-text-field></v-flex>
 
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
              <v-data-table :headers="headers" :items="periods" :pagination.sync="pagination" :search="search">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.title}}</td>    <td>{{ props.item.start}}</td>
                  <td>{{ props.item.end}}</td>      <td>{{ props.item.color}}</td>
                  <td>{{ props.item.organiser}}</td>      <td>{{ props.item.round}}</td>
                  <td>{{ props.item.remarks}}</td>  <td>{{ props.item.id}}</td>
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
                <template slot="footer">
                  <td colspan="100%"><strong>Notes: Just fill the blanks to register a new Period</strong></td>
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
      periods: [],
      menu: false,
      menu2: false,
      search: '',
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { id: 0, title: '', start: '', end: '', color:''
          ,organiser: '', round:'', remarks: '', id: '' },
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      pagination: {},
      headers: [ { text: 'Title', value: 'title' },        { text: 'Start', value: 'start' } 
                ,{ text: 'End', value: 'end' },        { text: 'Color', value: 'color' }
                ,{ text: 'Organiser', value: 'organiser' }, { text: 'Round', value: 'round' }
                ,{ text: 'Remarks', value: 'remarks' },{ text: 'Id', value: 'id' } ],
    }
  },
  methods: {
    changeOrganiser(selectObj) {
      this.editedItem.organiser = selectObj;
      //   this.getTeams(selectObj);
      console.log(this.editedItem.organiser);
    },    
    save: function () {
      console.log("11) save:editedItem");
      console.log(this.editedItem);
      if(this.editedItem.title=='' ){
        this.error = 'Title fields are required';
        return;
      };
      //---------------------
      if (this.editedIndex > -1) {
        Object.assign(this.periods[this.editedIndex], this.editedItem);
      } else {
        this.periods.push(this.editedItem);     // new
      }; 
      var saveitems = this.editedItem;    // updated too early - async
      //----------
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": saveitems };
      this.$http.post('php/apiPeriod.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
//          this.getAllData();                 // refresh datatable
          this.editedItem = '';
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ 
      this.editedIndex = this.periods.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item ("+item.id+':'+item.title+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiPeriod.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      console.log('1) manperiods.js: getAllData');
      this.result = 'Getting data from server...';
      var postdata = { op: "getPeriods" };
      this.$http.post('php/apiPeriod.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.periods = response.body.data;
                              console.log(this.periods);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){ this.getAllData(); }
  });

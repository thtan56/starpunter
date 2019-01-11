const Plan = Vue.component('plancomponent', {
  template: /* syntax: html */ `
  <v-layout column>
    <v-toolbar color="pink" dark><v-toolbar-title>Plan Management</v-toolbar-title> 
    </v-toolbar>
    <v-container fluid grid-list-md>
      <v-form v-model="valid" ref="form">
        <v-layout row wrap>
          <v-flex xs3><v-text-field label="Pool Name" v-model="editedItem.pool_name"></v-text-field></v-flex>
          <v-flex xs3>
            <v-radio-group v-model="editedItem.pool_type" row label="Pool Type">
              <v-radio v-for="item in pool_types" :key="item" :label="item" :value="item"></v-radio>
            </v-radio-group>
          </v-flex>      
          <v-flex xs2><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Entry Quorum" v-model="editedItem.entry_quorum"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="entrants" v-model="editedItem.entrants"></v-text-field></v-flex>
          
          <v-flex xs2><v-text-field label="Pool Prize" v-model="editedItem.pool_prize"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>  
          <v-flex xs2>
            <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select>
          </v-flex>
          <v-flex xs4><v-text-field label="Remarks" v-model="editedItem.remarks"></v-text-field></v-flex>
          <v-flex xs1><v-text-field label="id" v-model="editedItem.id"></v-text-field></v-flex>  
        </v-layout>
        <v-btn @click="save">save</v-btn>
        Status: {{ result }}
        <span class="badge badge-danger">{{error}}</span>
      </v-form>
    </v-container>
    <v-container fluid grid-list-md>
      <v-toolbar color="pink" dark>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-card-title>                                                                <!-- 2 -->
            <v-layout row wrap>
              Organiser:
              <template v-for="org in organisers">
                <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
              </template>
            </v-layout>            
          </v-card-title>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>     
        </v-toolbar-items>
      </v-toolbar>
      <div>
        <v-data-table :headers="headers" :items="plans" :pagination.sync="pagination" :search="search">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.pool_type}} / {{ props.item.pool_name}}</td>
            <td>{{ props.item.entry_cost}}</td>
            <td>{{ props.item.entry_quorum}} / {{ props.item.entrants}}</td>
            <td>{{ props.item.pool_prize}}</td>  <td>{{ props.item.payout}}</td>                    
            <td>{{ props.item.remarks}}</td>    <td>{{ props.item.id}}</td>
            <td>
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
          <template slot="footer">
            <td colspan="100%"><strong>Notes: Just fill the blanks to register a new Plan</strong></td>
          </template>
        </v-data-table>
      </div>            
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
      editedItem: { id: 0, pool_name: '', pool_type: '', entry_cost: 0, entry_quorum:0, entrants:0
                   ,pool_prize:0, payout:'',organiser:'',remarks: '' },
      plans: [],
      pool_types: ['head2head','group'],        
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      pagination: {},
      headers: [ { text: 'Pool Type/Name', value: 'pool_type' } 
                ,{ text: 'Entry Cost', value: 'entry_cost' }
                ,{ text: 'Entry Quorum/Players', value: 'entry_quorum' }
                ,{ text: 'Pool Prize', value: 'pool_prize' },{ text: 'Payout', value: 'payout' }
                ,{ text: 'Remarks', value: 'remarks' },{ text: 'Id', value: 'id' }],
      organiser: 'NBA'    
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: { 
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;
        this.getAllData();
      }
    },
    changeOrganiser(selectObj) { this.editedItem.organiser = selectObj; },
    save: function () {
      if(this.editedItem.pool_name=='' ){
        this.error = 'Pool Name fields are required';
        return;
      }
      var saveitems = this.editedItem;     // delay update
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": saveitems };
      this.$http.post('/php/apiPlan.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          // this.result = response.body;
          this.getAllData();                 // refresh datatable
          this.editedItem = '';
        }, response => { this.result = 'Failed to save data to server.'; });
    },
    editItem: function(item){ this.editedItem = item; },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item ("+item.pool_name+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('/php/apiPlan.php', JSON.stringify(postdata),{
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { // this.result = response.body;
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      console.log('1) getAllData', this.organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgPlans", organiser: this.organiser }; 
      this.$http.post('/php/apiPlan.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          console.log("12) response.body", response.body);
          this.plans = response.body.data;
          console.log(this.plans);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },  // end of methods
  beforeMount(){ 
    this.organiser = 'NBA';
    this.getAllData();
  }
});
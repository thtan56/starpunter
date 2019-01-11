const Ticket1 = Vue.component('ticketcomponent', {
  template: `
     <v-layout column>
        <v-toolbar color="pink" dark><v-toolbar-title>Ticket Management</v-toolbar-title></v-toolbar>
        <v-container fluid grid-list-md>
          <v-form v-model="valid" ref="form">
            <v-layout row wrap>
              <v-flex xs2><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>
              <v-flex xs2><v-text-field label="Pool Id" v-model="editedItem.pool_id"></v-text-field></v-flex>
              <v-flex xs2><v-text-field label="Pool Name" v-model="editedItem.pool_name"></v-text-field></v-flex>
              <v-flex xs6>
                <v-radio-group v-model="editedItem.pool_type" row label="Pool Type">
                  <v-radio v-for="item in pool_types" :key="item" :label="item" :value="item"></v-radio>
                </v-radio-group>
              </v-flex>      
  
              <v-flex xs3><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"></v-text-field></v-flex>
              <v-flex xs3><v-text-field label="Entry Quorum" v-model="editedItem.entry_quorum"></v-text-field></v-flex>
              <v-flex xs3><v-text-field label="Pool Prize" v-model="editedItem.pool_prize"></v-text-field></v-flex>
              <v-flex xs3><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>  
  
              <v-flex xs10><v-text-field label="Remarks" v-model="editedItem.remarks"></v-text-field></v-flex>
              <v-flex xs2><v-text-field label="Ticket#" v-model="editedItem.id"></v-text-field></v-flex>  
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
                <v-data-table :headers="headers" :items="tickets" :pagination.sync="pagination" :search="search">
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.username}}</td>
                    <td>{{ props.item.pool_id}}-{{ props.item.pool_name}}</td>
                    <td>{{ props.item.pool_type}}</td>
                    <td>{{ props.item.entry_cost}}</td>
  
                    <td>{{ props.item.entry_quorum}}</td>
                    <td>{{ props.item.pool_prize}}</td>
                    <td>{{ props.item.payout}}</td>
                    <td>{{ props.item.remarks}}</td>
                    <td>{{ props.item.id}}</td>
                    <td>
                      <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                      <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                    </td>
                  </template>
                  <template slot="footer">
                    <td colspan="100%"><strong>Notes: Just fill the blanks to register a new Scheme</strong></td>
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
          filterList: [ { pool_type: 'head2head' }, { pool_type: 'group' }],
          pool_types: ['head2head','group'],
          menu: false,
          search: '',
          result: '',
          error: '',
          valid: false,
  
          editedIndex: -1,
          editedItem: { id: 0, username: '', pool_id: 0, pool_name: '', pool_type: '', entry_cost: 0, entry_quorum:0, pool_prize:0, payout:''
                ,remarks: '' },
          tickets: [],
          types: ['head2head','group'],
          pagination: {},
          headers: [ { text: 'Username', value: 'username' }
                    ,{ text: 'Pool Name', value: 'pool_name' }, { text: 'Pool Type', value: 'pool_type' } 
                    ,{ text: 'Entry Cost', value: 'entry_cost' },{ text: 'Entry Quorum', value: 'entry_quorum' }
                    ,{ text: 'Pool Prize', value: 'pool_prize' },{ text: 'Payout', value: 'payout' }
                    ,{ text: 'Remarks', value: 'remarks' },{ text: 'Ticket#', value: 'id' }],
        }
      },
      methods: {
        save: function () {
          console.log("11) save:editedItem");
          console.log(this.editedItem);
          if(this.editedItem.pool_name=='' || this.editedItem.username=='') 
          {
            this.error = 'Pool name fields are required';
            return;
          }
          this.error = '';
          this.result = 'Saving data to server...';
          var postdata = { "op": "save", "data": this.editedItem };
          this.$http.post('php/apiTicket.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
            .then(response => {
              this.result = response.body;
              this.getAllData();                 // refresh datatable
              this.editedItem.id = 0;
              this.editedItem.username = '';
              this.editedItem.pool_name = '';
              this.editedItem.pool_id = 0;
              this.editedItem.entry_cost = '';
              this.editedItem.entry_quorum = '';
              this.editedItem.pool_prize = '';
              this.editedItem.payout = '';
              this.editedItem.remarks = '';
            }, response => { this.result = 'Failed to save data to server.'; });
          },
          editItem: function(item){ this.editedItem = item; },
          deleteItem: function(item){
              var r = confirm("Are you sure to delete this item ("+item.pool_name+ ")?");
              if(r==true) {
                  this.result = 'Deleting data to server...';
                  var postdata = { op: "delete", id: item.id };
                  this.$http.post('php/apiTicket.php', JSON.stringify(postdata),{
                      headers: { 'Content-Type': 'application/json' }
                  }).then(response => { this.result = response.body;
                                        this.getAllData();    // refresh datatable
                  },      response => { this.result = 'Failed to delete data.';
                  });
              }
          },
          getAllData: function () {
            console.log('1) mantickets.js: getAllData');
              this.result = 'Getting data from server...';
              var postdata = { op: "getTickets" };
              this.$http.post('php/apiTicket.php', JSON.stringify(postdata), {
                  headers: { 'Content-Type': 'application/json' }
              }).then(response => { this.tickets = response.body.data;
                console.log(this.tickets);
              },      response => { this.result = 'Failed to load data to server.';
              });
          }
      },
      beforeMount(){ this.getAllData(); }
  });
  
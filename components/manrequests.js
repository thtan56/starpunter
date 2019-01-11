const Request = Vue.component('requestcomponent', {
  template: `
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Request Management</v-toolbar-title></v-toolbar>
      <v-container fluid grid-list-md>
        <v-form v-model="valid" ref="form">
          <v-layout row wrap>
            <v-flex xs3><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>
            <v-flex xs3>
              <v-select label="Activity" :items="['deposit cash', 'withdraw cash', 'buy vcash', 'sell vcash']" v-model="editedItem.activity"></v-select>
            </v-flex>
            <v-flex xs2>   
              <!-- =============== date picker-start ==========================  -->
              <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.created">
                <v-text-field slot="activator" label="Request date" v-model="editedItem.created" prepend-icon="event" readonly></v-text-field>
                <v-date-picker v-model="editedItem.created" no-title scrollable><v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu.save(editedItem.created)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <!-- --------------------------------------------------------------------------- -->
            </v-flex>     
            <v-flex xs3><v-text-field label="Description" v-model="editedItem.description"></v-text-field></v-flex> 

            <v-flex xs2><v-text-field label="id" v-model="editedItem.id"></v-text-field></v-flex> 

            <v-flex xs2>
              <v-select label="Status" :items="['pending', 'successful']" v-model="editedItem.status"></v-select>    
            </v-flex>
            <v-flex xs3><v-text-field label="Cash" v-model="editedItem.cash"></v-text-field></v-flex>  
            <v-flex xs3><v-text-field label="vCash" v-model="editedItem.vcash"></v-text-field></v-flex>
             <v-flex xs3><v-text-field label="Exchange rate" v-model="editedItem.exchange_rate"></v-text-field></v-flex>

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
              <v-data-table :headers="headers" :items="requests" :pagination.sync="pagination" :search="search">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.username}}</td>    <td>{{ props.item.activity}}</td>
                  <td>{{ props.item.description}}</td>      <td>{{ props.item.cash}}</td>
                  <td>{{ props.item.vcash}}</td>      <td>{{ props.item.exchange_rate}}</td>
                  <td>{{ props.item.status}}</td>     <td>{{ props.item.created}}</td>   
                  <td>{{ props.item.id}}</td>
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
                <template slot="footer">
                  <td colspan="100%"><strong>Notes: Just fill the blanks to register a new Request</strong></td>
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
      requests: [],
      menu: false,
      menu2: false,
      search: '',
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { id: 0, username: '', activity: '', description: '', cash:''
          ,vcash: '', exchange_rate:'', status: '', created: '', id: '' },
      pagination: {},
      headers: [ { text: 'Username', value: 'username' },        { text: 'Activity', value: 'activity' } 
                ,{ text: 'Description', value: 'description' },        { text: 'Cash', value: 'cash' }
                ,{ text: 'vCash', value: 'vcash' }, { text: 'ExcRate', value: 'rate' }
                ,{ text: 'Status', value: 'status' },{ text: 'Created', value: 'created' }
                ,{ text: 'Id', value: 'id' } ],
    }
  },
  methods: {
    save: function () {
      console.log("11) save:editedItem");
      console.log(this.editedItem);
      if(this.editedItem.activity=='' ){
        this.error = 'activity fields are required';
        return;
      };
      //---------------------
      if (this.editedIndex > -1) {
        Object.assign(this.requests[this.editedIndex], this.editedItem);
      } else {
        this.requests.push(this.editedItem);     // new
      }; 
      var saveitems = this.editedItem;    // updated too early - async
      //----------
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": saveitems };
      this.$http.post('php/apiRequest.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
//          this.getAllData();                 // refresh datatable
          this.editedItem = '';
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ 
      this.editedIndex = this.requests.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item ("+item.id+':'+item.title+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiRequest.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      console.log('1) manrequests.js: getAllData');
      this.result = 'Getting data from server...';
      var postdata = { op: "getAllRequests" };
      this.$http.post('php/apiRequest.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.requests = response.body.data;
                              console.log(this.requests);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){ this.getAllData(); }
  });

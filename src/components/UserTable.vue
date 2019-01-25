// Vue.component('usertable', { 
<template>
  <div>
    <v-toolbar flat color="pink">
      <v-toolbar-title>Users</v-toolbar-title>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="users">                        
      <template slot="items" slot-scope="props">
        <tr @click="child3Selected(props.item)">
          <td>{{ props.item.username}} / {{ props.item.id}}</td>
          <td>{{ props.item.email}}</td>  
          <td>{{ props.item.bankbsb}} : {{ props.item.bankaccount}}</td>  
          <td>{{ props.item.lastname}} {{ props.item.firstname}}</td>
          <td>{{ props.item.role}}</td>
          <td>{{ props.item.cash}}</td>
          <td>{{ props.item.vcash}}</td>
          <td>{{ props.item.status}}</td>
          <td><v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>    
      </template>      
      <template slot="footer">
        <td colspan=2><strong>click row for user info</strong></td>
      </template>     
    </v-data-table>
    <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
          <v-layout row wrap>              
            <template v-if="editedItem.id > 0">
              <v-flex xs4><v-text-field label="Username" v-model="editedItem.username" readonly></v-text-field></v-flex>
            </template>  
            <template v-else>
              <v-flex xs4><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>
            </template>   
            <v-flex xs4><v-text-field label="Email" v-model="editedItem.email"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Id"    v-model="editedItem.id" readonly></v-text-field></v-flex>  

            <v-flex xs3><v-text-field label="Last Name"  v-model="editedItem.lastname"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="First Name" v-model="editedItem.firstname"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Bank Bsb"   v-model="editedItem.bankbsb"></v-text-field></v-flex>   
            <v-flex xs3><v-text-field label="Bank Account" v-model="editedItem.bankaccount"></v-text-field></v-flex>  
            <v-flex xs3><v-select v-model="editedItem.role" :items="roles" label="Role:"></v-select></v-flex>
            <v-flex xs3><v-text-field label="Cash"   v-model="editedItem.cash"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="V Cash" v-model="editedItem.vcash"></v-text-field></v-flex>  
            <v-flex xs3><v-select v-model="editedItem.status" :items="statuses" label="Status:"></v-select></v-flex>
          </v-layout>
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
  </div>
</template>

<script>
export default {
  name: 'usertable',   // component name
  data() {
    return { 
      users: [],
      editdialog: false, 
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Username/Id', value: 'username' } 
          ,{ text: 'Email', value: 'email' }      
          ,{ text: 'Bank Bsb/Account', value: 'bankbsb' } 
          ,{ text: 'Name', value: 'lastname' } 
          ,{ text: 'Role', value: 'role' }
          ,{ text: 'Cash', value: 'cash' }                 
          ,{ text: 'Vcash', value: 'vcash' } 
          ,{ text: 'Status', value: 'status' } 
               ],
      editedIndex: -1,
      editedItem: { 
              username: '',email:'', id: ''  ,bankbsb: ''  ,bankaccount:'' ,lastname: '' ,firstname:''
              ,role:''      ,cash: 0   ,vcash: 0, status: ''
              },
      roles: ['customer', 'manager', 'guest'],
      statuses: ['pending', 'active', 'suspend'],
      error: '',
      result: ''                             
    }
  },    
  computed: { 
    pageTitle() { return 'Leadership Result for the week ' + moment().format('W') },  
    formTitle () { return this.editedIndex === -1 ? 'New User' : 'Edit User' },
  },  
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    child3Selected(item) {  
      console.log("35) child3Selected", item);
      this.$router.push({name:'sysuser', params: {username: item.username} });           
      // this.$emit('clicked-child2selected', item);
    },       
    close () { this.editdialog = false;  },    
    closeDialog () {
      console.log('51) closeDialog');
      this.editdialog = false;  
    },
    save: function () {
      if(this.editedItem.username=='' ||  this.editedItem.email==''){
        this.error = 'username and email fields are required';
        return;
      }
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };
      //console.log(JSON.stringify(postdata));
      this.$http.post('/php/apiUser.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          this.result = response.body;
          this.getAllData();                 // refresh datatable      
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ 
      this.editedItem = item;
      this.editdialog=true; 
    },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item?"+item.id);
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('/php/apiUser.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { 
            this.result = response.body;
            this.getAllData();
          }, response => { this.result = 'Failed to delete data.'; }
          );
      }
    },
    getAllData: function () {
      this.result = 'Getting data to server...';
      var postdata = { op: "getUsers" };
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => {
          this.result = '';
          this.users = response.body.data;
          console.log("2) getAllData > this.users");
          console.log(this.users);
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  created() {
    this.getAllData();
  }
};
</script>

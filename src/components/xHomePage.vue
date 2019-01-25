// const Home = Vue.component('homepage', {
<template>
  <v-container fluid>
    <v-toolbar>User List</v-toolbar>    
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="users">                        
      <template slot="items" slot-scope="props">
          <td>{{ props.item.username}} / {{ props.item.id}}</td>
          <td>{{ props.item.email}}</td><td>{{ props.item.bankbsb}} : {{ props.item.bankaccount}}</td>  
          <td>{{ props.item.lastname}} {{ props.item.firstname}}</td>
          <td>{{ props.item.role}}</td><td>{{ props.item.cash}}</td>
          <td>{{ props.item.vcash}}</td><td>{{ props.item.status}}</td>
      </template>      
    </v-data-table>   
  </v-container>
</template>

<script>
export default {
  name: 'OldHome',
  data() {
    return { 
      users: [],
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Username/Id', value: 'username' }, { text: 'Email', value: 'email' }      
          ,{ text: 'Bank Bsb/Account', value: 'bankbsb' }, { text: 'Name', value: 'lastname' } 
          ,{ text: 'Role', value: 'role' }, { text: 'Cash', value: 'cash' }                 
          ,{ text: 'Vcash', value: 'vcash' }, { text: 'Status', value: 'status' } ]
    }
  },    
  methods: {
    getAllData: function () {
      var result = 'Getting data to server...';
      var postdata = { op: "getUsers" };
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), 
          { headers: { 'Content-Type': 'application/json' }})
        .then(response => {
          this.users = response.body.data;
          // this.users = response.body;    // php/GetUsers.php
          console.log("2) getAllData > response.body.data", response.body.data);
          console.log(this.users);
        },   response => { var result = 'Failed to load data to server.';
      });
    },
  },
  created() { this.getAllData(); }
};
</script>

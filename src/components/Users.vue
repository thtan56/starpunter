// Users.vue - compusers.js
<template>
  <div>
    <v-toolbar flat color="pink">
      <v-toolbar-title>User List</v-toolbar-title>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="users">                        
      <template slot="items" slot-scope="props">
          <td>{{ props.item.username}} / {{ props.item.id}}</td>
          <td>{{ props.item.cash}}/{{ props.item.vcash}}
            <template v-if="role === 'manager'">      
              <v-icon small @click="showDetails(props.item)">more_horiz</v-icon>
            </template>
          </td> 
      </template>      
    </v-data-table>          
  </div>
</template>
<script>
export default{
  data(){
    return{
      users: [],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Username/Id', value: 'username' },{ text: 'Cash/Vcash', value: 'cash' }],
      editedIndex: -1,
      editedItem: { username: '',email:'', id: '',role:'' ,cash: 0   ,vcash: 0, status: '' },
      roles: ['customer', 'manager', 'guest'],
      statuses: ['pending', 'active', 'suspend'],
      error: '',
      result: ''                             
    }
  },    
  computed: { role() { return this.$store.state.loginUser.role; } },
  methods: {
    showDetails(item) { 
      console.log("991) item", item);
      this.$router.push({name:'userHome', params: {username: item.username, userData: item} });     
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
  },    // end of methods
  created() {
    this.getAllData();
  }
};
</script>

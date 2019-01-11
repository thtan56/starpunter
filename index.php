<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vue Resource</title>
  <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/vuetify/1.3.4/vuetify.css" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">  
</head>
<body>
<div id="app">
  <v-app id="inspire">
    <todo-list></todo-list>
  </v-app>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@1.3.4/dist/vuetify.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-resource@1.5.1"></script>
<script>

const TodoComponent={
  template: `
    <v-container fluid grid-list-md>
      <div>
        <v-data-table :headers="headers" :items="users" :pagination.sync="pagination">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.username}}</td>
            <td>{{ props.item.email}}</td>
            <td>{{ props.item.role}}</td>
          </template>
        </v-data-table>
      </div>            
    </v-container>
  `,
  data () {
    return {
      users: [],
      result: '',
      pagination: { rowsPerPage: 4 },
      headers: [ { text: 'Username', value: 'username' },{ text: 'Email', value: 'email' },{ text: 'Role', value: 'role' }]
    }
  },     // end of data  
  methods: { 
    getAllData: function () {
      var postdata = { op: "getUsers" };
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => { this.users = response.body.data;
                            console.log("10)getAllData:users:", this.users);
        },    response => { this.result = 'Failed to load data to server.'; }
      );
    },
  },  // end of methods
  created() { this.getAllData(); }
};

new Vue({
  el: '#app',
  components: { 'todo-list' : TodoComponent },
  data: () => ({  }),
});   // Vue
</script>
</body>
</html>

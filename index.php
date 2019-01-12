<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Index.php-Test:Vue Resource</title>
  <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/vuetify/1.3.4/vuetify.css" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">  
</head>
<body>
<div id="app">
  <v-app id="inspire">
    <user-list></user-list>
    <period-list></period-list>
  </v-app>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@1.3.4/dist/vuetify.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-resource@1.5.1"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js"></script>
<script src='lib/moment.js'></script>
<script>

const UserTableComponent={
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
      this.$http.post('php/apiUser.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => { this.users = response.body.data;
                            console.log("20)getAllData:users:", this.users);
        },    response => { this.result = 'Failed to load data to server.'; }
      );
    }
  },  // end of methods
  created() { this.getAllData(); }
};

const PeriodTableComponent={
  template: `
    <v-container fluid grid-list-md>
      <div>
        <v-data-table :headers="headers" :items="periods" :pagination.sync="pagination">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.start}}</td>
            <td>{{ props.item.end_dt}}</td>
            <td>{{ props.item.title}}</td>
          </template>
        </v-data-table>
      </div>            
    </v-container>
  `,
  data () {
    return {
      periods: [],
      result: '',
      pagination: { rowsPerPage: 4 },
      headers: [ { text: 'Start', value: 'start' },{ text: 'End', value: 'end_dt' },{ text: 'Title', value: 'title' }]
    }
  },     // end of data  
  methods: { 
    getAllData: function () {
      var postdata = { op: "getPeriods" };
      axios.post('php/apiPeriod.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => { this.periods = response.data.data;
                            console.log("30)getAllData:periods:", this.periods);
        },    response => { this.result = 'Failed to load data to server.'; }
      );
    },    
  },  // end of methods
  created() { this.getAllData(); }
};

new Vue({
  el: '#app',
  components: { 'user-list' : UserTableComponent,
                'period-list' : PeriodTableComponent },
  data: { sysinfo: []  },
  methods: {
    getSystemDetails() {
      console.log("10) getSystemDetails"); 
      var result = 'Getting data from server...';
      var postdata = { op: "getSystemInfo" };   // redundant
      this.$http.post('php/apiSystem.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.sysinfo = response.body; console.log("11) sysinfo", this.sysinfo);
          },      response => { result = 'Failed to load data to server.';
      });
    }
  },     // end of methods
  created() { 
    console.log('1) index.php: created');
    this.getSystemDetails();
  }
});   // Vue
</script>
</body>
</html>

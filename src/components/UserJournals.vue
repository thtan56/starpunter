// Vue.component('userjournals', { 
<template>
  <div>
    <v-expansion-panel dark>
      <v-expansion-panel-content>
        <div slot="header">My Journals - {{username}}</div>
        <v-card color="purple" tile flat>    
          <v-data-table :pagination.sync="pagination" :headers="headers" :items="requests">         
            <template slot="items" slot-scope="props">
              <td>{{ props.item.created | moment}}</td>
              <td>{{ props.item.description}}</td>
              <td>{{ props.item.cash}}</td>
              <td>{{ props.item.vcash}}</td>                  
            </template>         
          </v-data-table>
        </v-card>          
      </v-expansion-panel-content>
      </v-expansion-panel>
  </div>
</template>

<script>
export default {
  name: 'userjournals',   // component name
  props: { username: {type: String} },
  data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Date', value: 'created' }     
                ,{ text: 'Description', value: 'description' }
                ,{ text: 'Cash', value: 'cash' }  
                ,{ text: 'vCash', value: 'vcash' }  
                ],
      requests: []      
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    getAllData() {   
      var result = 'Getting data from server...';
      var postdata = { op: "getUserRequests", data: {username: this.username, activity: 'all' }};
      this.$http.post('/php/apiRequest.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, username, ticket_id
          this.requests = (response.body === null) ? [] : response.body.data;                             
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    this.getAllData();  
  }
};
</script>

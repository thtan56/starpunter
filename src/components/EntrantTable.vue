// Vue.component('entranttable', { 
<template>
  <div>
    <v-card>
      <v-toolbar color="pink" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Entrant:{{username}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon><v-icon>search</v-icon></v-btn>
        <v-btn icon><v-icon>check_circle</v-icon></v-btn>
      </v-toolbar>
      <v-data-table :pagination.sync="pagination" :headers="uheaders" 
                        :items="userlist">         
          <template slot="items" slot-scope="props">
            <tr @click="childSelected(props.item)">
              <td>{{ props.item.orgweek}}</td>
              <td>{{ props.item.username}}</td>
              <td>{{ props.item.ticketcount}}</td>
            </tr>                  
          </template>         
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'entranttable',   // component name
  props: { username: {type: String} },  
  data() {
    return {
      dialog: false,
      result: '',   
      utabs: '',
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      uheaders: [ { text: 'Organiser/Round', value: 'orgweek' }     
                ,{ text: '*Username', value: 'username' }
                ,{ text: 'Ticket count', value: 'ticketcount' }  
                ],
      //search: '',      
      selected: {},       
      orgweeklist: [],
      tickets: [], 
      userlist: [],
      poollist: []        
    }
  },
  methods: {
    getPCount(item) {
      var results=this.poollist.filter(pool => pool.orgweek === item.orgweek && pool.username === item.username);
      return (results.length > 0) ? results[0].pcount : "";
    },    
    childSelected(item) {       
      this.selected = item; 
      this.$emit('clicked-childselected', item);
    },    
    filtered_uItems (key) {  // 2) user
      const res = [];
      if (key) { 
        const selectedusers = this.userlist.filter(game => game.orgweek  === key );    // repeat for each orgweek
        return selectedusers; 
      };
      return res
    },
    getUserTickets() {    // no orgweek
      this.result = 'Getting data from server...';
      var postdata = { op: "getUserTickets2b", data: {username: this.username }};
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, username, ticket_id
          this.tickets = (response.body === null) ? [] : response.body.data;                             
          console.log("10) getOrgWeek, this.tickets", this.tickets);             
          this.userlist    = alasql('SELECT orgweek, username, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek, username',[this.tickets]);
          this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[this.tickets]);  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("created-username:", this.username);
    this.getUserTickets();  
  }
};
</script>

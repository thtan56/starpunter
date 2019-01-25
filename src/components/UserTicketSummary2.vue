// Vue.component('userticketsummary2', {    // yet to be completed
<template>
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">User Ticket Summary</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>more_vert</v-icon></v-btn>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" 
                        :items="ticketlist">         
      <template slot="items" slot-scope="props">
        <tr @click="getSelected(props.item)">
          <td class="text-xs-left">{{ props.item.orgweek}}</td>
          <td class="text-xs-left">{{ props.item.username}}</td>
          <td class="text-xs-left">{{ props.item.ticketcount}}</td>
        </tr>                  
      </template>   
      <template slot="footer">
        <td colspan="3"><strong>click row for details</strong></td>
      </template>              
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'userticketsummary2',
  props: { ticketlist: {type: Array} },
  data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Username', value: 'username' }             
                ,{ text: 'Ticket Count', value: 'ticketcount' } ],   
      userlist: [],
      tgames: []
    }
  },     
  methods: {
    getSelected(item) { this.$emit('clicked-childselected', item); },    
    getOrgWeekUser() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
            // to compute usercount, need to create array 1st
          var array     = alasql('SELECT orgweek, username, ticket_id FROM ? GROUP BY orgweek, username, ticket_id'
                                ,[this.tgames]);              
          this.userlist = alasql('SELECT orgweek, username, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek, username'
                                ,[array]);
          //this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]);  
        },   response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  this.getOrgWeekUser();  }
};
</script>

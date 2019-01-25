// Vue.component('userweektable', { 
<template>
  <v-tabs v-model="utabs" color="purple" dark slider-color="yellow">                              <!-- 1 --->
    <v-tab      v-for="filter in orgweeklist" :key="filter.orgweek">{{ filter.orgweek }}</v-tab>  <!-- 2 -->
    <v-spacer></v-spacer>
    <v-btn flat>Entrants</v-btn>
    <v-tab-item v-for="filter in orgweeklist" :key="filter.orgweek">                   <!-- 3 -->
      <v-data-table :pagination.sync="pagination" :headers="uheaders" 
                      :items="filtered_uItems(filter.orgweek)">         
        <template slot="items" slot-scope="props">
          <tr @click="childSelected(props.item)">
            <td>{{ props.item.orgweek}}</td>
            <td>{{ props.item.username}}</td>
            <td>{{ props.item.ticketcount}}</td>
          </tr>                  
        </template>         
      </v-data-table>
    </v-tab-item>
  </v-tabs>  
</template>

<script>
export default {
  name: 'userweektable',   // component name
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
     
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
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
    getOrgWeekUser() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeekTickets" };    // all
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
    console.log("created");
    this.getOrgWeekUser();  
  }
};
</script>

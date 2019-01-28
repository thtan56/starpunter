// Vue.component('usertickets', {   
<template>
  <div>
    <v-toolbar flat color="primary">
      <v-toolbar-title>Tickets - {{selected.username}}-{{selected.orgweek}}</v-toolbar-title>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="data">                        
      <template slot="items" slot-scope="props">
        <tr @click="child2Selected(props.item)">
          <td>{{ props.item.ticket_id}} : {{ props.item.pool_id}}/{{ props.item.pool_name}}</td>  
          <td>{{ props.item.entry_cost}}/{{ props.item.gamecount}}</td>
          <td>{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
          <td>{{ props.item.start | moment}} : {{ props.item.end_dt | moment}}</td>
          <td>{{ props.item.total_score}}/{{ props.item.income}}</td>
        </tr>
      </template>           
    </v-data-table>       
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'userweektickets',   // component name
  props: { selected: {type: Object },   // orgweek, username
           data: {type: Array }  },     // ticketlist 
  data() {
    return { 
      tickets: [],
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Ticket#/Pool#/Name', value: 'ticket_id' } 
                ,{ text: 'Entry Cost/Game Count', value: 'entry_cost' } 
                ,{ text: 'Pool Prize/Payout', value: 'pool_prize' },
                { text: 'Start/End', value: 'start' }                 
               ,{ text: 'Total Score/Income', value: 'total_score' } ],
      totals: { score: 0, count: 0},                
    }
  },    
  watch: {
    selected (newVal, oldVal)  { this.getUserTickets(); }
  }, 
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    child2Selected(item) {  
      console.log("25) child2Selected", item);     
      this.$emit('clicked-child2selected', item);
    },      
    getUserTickets() {  
      console.log("201) filtered_tItems", this.selected);
      var array = this.selected.orgweek.split(":");
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgRndTickets", 
                     data: {organiser: array[0], round: array[1], username: this.selected.username } };    
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {    
          if (response.body === null) { this.tickets=[];  
          } else {              
            this.tickets = response.body.data;           // A) data 1    
            console.log("203) this.tickets", this.tickets);                             
          };
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  created() {
    console.log("1) UserTickets > created: this.selected", this.selected);  
  }
};
</script>  

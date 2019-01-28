// Vue.component('userweektickettable', {                
<template>
  <div>
    <v-toolbar flat color="deep-orange" dark>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>Ticket</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :pagination.sync="pagination" :items="ticketData">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}} / {{ props.item.ticket_id}}</td>
        <td>{{ props.item.start | moment}} / {{ props.item.end_dt | moment}}</td> 
        <td>{{ props.item.pool_id}} / {{ props.item.pool_name}}/ {{ props.item.entry_quorum}}</td>
        <td>{{ props.item.entry_cost}} / {{ props.item.income}}</td> 
        <td>{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
        <td>{{ props.item.entrants}}</td>
        <td>{{ props.item.total_score}}</td> 
        <td>{{ props.item.gamecount}}</td> 
      </template>
      <template slot="footer">
        <slot name="totalsSlot"></slot>
      </template>     
    </v-data-table>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'userweektickettable',
  props: { ticketData: {type: Array } },
  data () {
    return {
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      headers: [ { text: 'Username/Ticket#', value: 'username' }
              ,{ text: 'Start / End', value: 'start' }
              ,{ text: 'Pool#/Name/Quorum', value: 'pool_id' }  
              ,{ text: 'Entry Cost/Income', value: 'entry_cost' }
              ,{ text: 'Pool Prize/Payout', value: 'pool_prize' }
              ,{ text: 'Entrants', value: 'entrants' }
              ,{ text: 'Total Score', value: 'total_score' }
              ,{ text: 'Game Count', value: 'gamecount' }  
                ],
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {},
  created() {}
};
</script>

// Vue.component('poolweektable', {         
<template>
  <div>
    <v-toolbar flat color="deep-orange" dark>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>Tickets</v-btn>
    </v-toolbar>

    <v-data-table :headers="headers" :pagination.sync="pagination" :items="ticketData">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}}/{{ props.item.ticket_id}}</td>    
        <td>{{ props.item.total_score}}</td>   
        <td>{{ props.item.rank}}</td> 
        <td>{{ props.item.entry_cost}}/{{ props.item.income}}</td>
        <td>{{ props.item.payout}}/{{ props.item.top}}</td>
        <td>{{ props.item.pool_prize}}</td>
      </template>
      <template slot="footer"><slot name="totalsSlot"></slot></template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'poolweektable',
  props: { ticketData: {type: Array }, 
           totals: {type: Object } },   
  data () {
    return {
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      headers: [ { text: 'Username/Ticket#', value: 'username' },{ text: 'Total Score', value: 'total_score' }
              ,{ text: 'Rank', value: 'rank' }
              ,{ text: 'Entry Cost/Income', value: 'entry_cost'} 
              ,{ text: 'Payout/Top', value: 'payout'} 
              ,{ text: 'Pool Prize', value: 'pool_prize'} ],
    }
  }
};
</script>

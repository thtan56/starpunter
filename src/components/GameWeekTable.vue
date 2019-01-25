// Vue.component('gameweektable', {
        
<template>
  <div>
    <v-toolbar flat color="deep-orange" dark>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>Ticket Games</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :pagination.sync="pagination" :items="gameData">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}} / {{ props.item.ticket_id}}</td>
        <td>{{ props.item.bet_team}} / {{ props.item.bet_score}}</td> 
        <td>{{ props.item.pool_id}} / {{ props.item.pool_name}}</td>
        <td>{{ props.item.entry_cost}} / {{ props.item.entry_quorum}}</td>
        <td>{{ props.item.pool_prize}}</td>
        <td>{{ props.item.payout}}</td>
        <td>{{ props.item.entrants}}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'gameweektable',
  props: { gameData: {type: Array } },
  data () {
    return {
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      headers: [ { text: 'Username/Ticket#', value: 'username' }
              ,{ text: 'Bet Team/Score', value: 'bet_team' }
              ,{ text: 'Pool#/Name', value: 'pool_id' }  
              ,{ text: 'Entry Cost/Quorum', value: 'entry_cost' }
              ,{ text: 'Pool Prize', value: 'pool_prize' }
              ,{ text: 'Payout', value: 'payout' }
              ,{ text: 'Entrants', value: 'entrants' }
                ],
    }
  }
};
</script>

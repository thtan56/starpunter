// Vue.component('ticketweektable', {
        
<template>
  <div>
    <v-toolbar flat color="deep-orange" dark>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>Week Tickets</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :pagination.sync="pagination" :items="ticketData">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}} / {{ props.item.ticket_id}}</td>
        <td>{{ props.item.bet_team}} / {{ props.item.bet_score}}</td> 
        <td>{{ props.item.pool_id}} /</td>
        <td>{{ props.item.game_id}} / {{props.item.start | moment}}</td>
        <td>{{ props.item.home_team}}/ {{ props.item.away_team}}</td>
        <td>{{ props.item.home_score}}/ {{ props.item.away_score}}</td>
        <td>{{ props.item.game_winner}}</td>
          <!-- {{ props.item.pool_name}}</td>
        <td>{{ props.item.entry_cost}} / {{ props.item.entry_quorum}}</td>
        <td>{{ props.item.pool_prize}}</td>
        <td>{{ props.item.payout}}</td>
        <td>{{ props.item.entrants}}</td -->
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'ticketweektable',
  props: { ticketData: {type: Array } },
  data () {
    return {
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      headers: [ { text: 'Username/Ticket#', value: 'username' }
              ,{ text: 'Bet Team/Score', value: 'bet_team' }
              ,{ text: 'Pool#/Name', value: 'pool_id' }  
              ,{ text: 'Game#/Date', value: 'game_id' }  
              ,{ text: 'Home vs Away Teams', value: 'home_team' }
              ,{ text: 'Home vs Away Scores', value: 'home_score' }
              ,{ text: 'Game Winner', value: 'game_winner' }
                ],
    }
  }
};
</script>

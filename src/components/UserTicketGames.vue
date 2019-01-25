// Vue.component('userticketgames', {  
<template>
  <div>
    <v-toolbar flat color="orange lighten-1"><slot></slot></v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="tgheaders" 
                    :items="gameData">                        
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.username}}</td>
        <td class="text-xs-left">{{ props.item.home_team}} vs {{ props.item.away_team}}</td>
        <td>{{ props.item.start | moment}}</td>
        <td>{{ props.item.pool_id}} : {{ props.item.ticket_id}}:{{ props.item.game_id}}</td>              
        <td>{{ props.item.home_score}}/{{ props.item.away_score}}</td>
        <td>{{ props.item.game_winner}}</td>
        <td>{{ props.item.bet_team}}</td>
        <td>{{ props.item.bet_score}}</td>
      </template>
      <template slot="footer">
        <td><strong>Sum</strong></td>
        <td class="text-xs-right">score totals: {{ totals.score }}</td>
        <td class="text-xs-right">count totals: {{ totals.count }}</td>
      </template>            
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'userticketgames',   // component name
  props: { gameData: {type: Array }  },     // ticketlist 
  data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      tgheaders: [{ text: 'Username', value: 'username' }
                ,{ text: 'Home/Away Team', value: 'home_team' }
                ,{ text: 'Date', value: 'start' } 
                ,{ text: 'Pool#/Ticket#/Game#', value: 'pool_name' } 
                ,{ text: 'Home/Away Score', value: 'home_score' }  ,{ text: 'Game Winner', value: 'game_winner' }    
                ,{ text: 'Bet Team', value: 'bet_team' }                       
                ,{ text: 'Bet Score', value: 'bet_score' } ],
      totals: { score: 0, count: 0 },
    }
  },    
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
};
</script>

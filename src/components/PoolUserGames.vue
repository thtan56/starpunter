// Vue.component('poolusergames', { 
<template>
  <div>
    <v-toolbar flat color="orange lighten-1"><slot></slot>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="tgheaders" 
                    :items="poollist">                        
      <template slot="items" slot-scope="props"> 
        <td>{{ props.item.game_id}}/{{ props.item.pool_id}}</td>    
        <td class="text-xs-left">{{ props.item.home_team}} vs {{ props.item.away_team}}</td>
        <td>{{ props.item.start | moment}}</td>
        <td>{{ props.item.bet_team}}</td>
        <td>{{ props.item.bet_amount}}</td>
      </template>   
       
    </v-data-table>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  name: 'poolusergames',
  props: { poollist: {type: Array } },   // orgweek, username, pool_id
  data() {
    return {
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      tgheaders: [ { text: 'Game#/Pool#',    value: 'game_id' }      
               ,{ text: 'Home/Away Team', value: 'home_team' }
               ,{ text: 'Game#/Date', value: 'start' } 
               ,{ text: 'Bet Team', value: 'bet_team' }
               ,{ text: 'Bet Amount', value: 'bet_amount' }
                 ],
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
};
</script>

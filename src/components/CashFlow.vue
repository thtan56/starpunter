// const cashFlow = Vue.component('cashComponent', {
<template>
  <div id="cashTable">
    <v-select label="Activity" :items="['deposit cash', 'withdraw cash', 'buy vcash', 'sell vcash', 'all']" v-model="search"></v-select>
    <v-data-table :headers="columns" :items="mycash" :search="search" :custom-filter="customFilter" hide-actions> 
      <template slot="items" slot-scope="props">                            
        <td class="text-xs-left">{{ props.item.created | moment }}</td>
        <td class="text-xs-left">{{ props.item.cash | currency(2) }}</td>
         <td class="text-xs-left">{{ props.item.vcash | currency(2) }}</td>
         <td class="text-xs-left">{{ props.item.exchange_rate | number(2) }}</td>        
        <td class="text-xs-left">{{ props.item.activity }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td>{{ props.item.reference_number }}</td>
        <td>{{ props.item.id }}</td>
      </template>  
      <template slot="footer">
        <td><strong>Sum</strong></td>
        <td class="text-xs-right">{{ $store.state.loginUser.cash | currency(2) }}</td>
        <td class="text-xs-right">{{ $store.state.loginUser.vcash | currency(2) }}</td>
        <td>x-rate:{{ $store.state.xchgRate }}</td>
        <td><vcashBuySell></vcashBuySell></td>
        <td><cashDepositWithdraw></cashDepositWithdraw></td>
        <td><button v-on:click="getAllData" class="btn btn-danger">ReFresh</button></td>
      </template> 
    </v-data-table>           
  </div>
</template>

<script>
import store from '../store';    // 1
import axios from 'axios';
import vcashBuySell from './VCashBuySell.vue';
import cashDepositWithdraw from './CashDepositWithdraw.vue';

export default {
  name: 'cashFlow',
  components: { store, axios, vcashBuySell, cashDepositWithdraw },   // 2
  data () {
    return {
      dlgDeposit: false,
      dlgWithdraw: false,
      columns: [   
//        { text: 'Username', value: 'username' },  
        { text: 'Date', value: 'created' },    
        { text: 'Cash($)', value: 'cash'},
        { text: 'Virtual($)', value: 'vcash'},
        { text: 'Exchange Rate', value: 'exchange_rate'},        
        { text: 'Activity', value: 'activity' },
        { text: 'Description', value: 'description' },
        { text: 'Reference', value: 'reference_number' },
        { text: 'Id', value: 'id' }            
      ],
      mycash: [],
      totals: {cash: 1000, vcash: 500 },
      search: '',
    }
  },
  created () {
      console.log('1) created');
  },
  methods: {
    getAllData() {
      let qry = 'database/json_cashflow.php?username=' + this.$store.state.loginUser.username;
      console.log('101) getAllData > query:'+qry);
      console.log('102) getAllData: this.$store.state.loginUser');
      console.log(this.$store.state.loginUser.cash);
      axios.get(qry)
        .then(response => { 
          this.mycash = response.data['data'];
          this.totals = response.data['totals'];
        })  
        .catch(error => { console.log(error) });  
    },
    customFilter(items, search, filter) { 
      if (search==='all') { return items; };
      return items.filter(row => filter(row["activity"], search)); }
  },
  filters: {
    moment: function (date) { return moment(date).format('L'); }
  },
  beforeMount() {
    console.log('0) beforeMount: getAllData');
    this.getAllData();
  }
};
</script>

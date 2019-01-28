// Vue.component('cashDepositWithdraw', {
<template>
  <v-dialog v-model="cashDialog" max-width="500px">
    <v-btn slot="activator" color="info" dark>Deposit/Withdraw Cash</v-btn>
    <v-card dark color="blue-grey">
      <v-card-title><span class="headline">Cash - Deposit / Withdraw</span></v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.loginUser.username label="Username" readonly background-color="red"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model="displayDate" label="Date" readonly background-color="red"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.loginUser.cash label="Cash available" readonly background-color="red"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.xchgRate label="Exchange Rate" readonly background-color="red"></v-text-field></v-flex>           

            <v-flex xs12 sm6 md6><v-text-field v-model="depositedItem.deposit_amount" label="deposit amount" background-color="green"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model="depositedItem.withdraw_amount" label="withdraw amount" background-color="green"></v-text-field></v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black" flat @click.native="close">Cancel</v-btn>
        <v-btn color="black" flat @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
export default {
  name: 'cashDepositWithdraw',   // component name
  data () {
    return {
      cashDialog: false,
      depositedItem: { deposit_amount: 0, withdraw_amount: 0, username: '', exchange_rate: 1, uom: 'cash' },
      defaultItem: { deposit_amount: 0, withdraw_amount: 0, username: '' },
      todayDate:''
    }
  },
  computed: {
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('MM/DD/YYYY');
      }
    }
  },
  methods: {
    save () {
      console.log('save');
      this.depositedItem.username = this.$store.state.loginUser.username;
      this.depositedItem.exchange_rate = this.$store.state.xchgRate;
      this.depositedItem.uom = 'cash';
      let qry = 'database/json_cashflow_post.php';
      axios.post(qry, { data: this.depositedItem } )
        .then(response => { 
        });  
      console.log('save new bet');
      console.log(this.depositedItem);
      this.close();
    },
    //----------------------------------------
    close () {
      this.cashDialog = false;
      setTimeout(() => {
        this.depositedItem = Object.assign({}, this.defaultItem);
      }, 300);
    },
  },  
};
</script>

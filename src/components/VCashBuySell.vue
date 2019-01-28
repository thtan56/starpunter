// Vue.component('vcashBuySell', {
<template>
  <v-dialog v-model="vcashDialog" max-width="500px">
    <v-btn slot="activator" color="success" dark>Buy/Sell vCash</v-btn>
    <v-card dark color="blue-grey">
      <v-card-title><span class="headline">vCash - Buy / Sell</span></v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.loginUser.username label="Username" readonly background-color="red"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model="displayDate" label="Date" readonly background-color="red"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.loginUser.cash label="Cash available" readonly background-color="red"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.xchgRate label="Exchange Rate" readonly background-color="red"></v-text-field></v-flex>           

            <v-flex xs12 sm6 md6><v-text-field v-model="boughtItem.buy_amount" label="buy amount" background-color="green"></v-text-field></v-flex>
            <v-flex xs12 sm6 md6><v-text-field v-model="boughtItem.sell_amount" label="sell amount" background-color="green"></v-text-field></v-flex>
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
import store from '../store';    // 1
import moment from 'moment';
export default {
  name: 'vcashBuySell',   // component name
  components: { store },
  data () {
    return {
      vcashDialog: false,
      boughtItem: { buy_amount: 0, sell_amount: 0, username: '', exchange_rate: 1, uom: 'vcash' },
      defaultItem: { buy_amount: 0, sell_amount: 0, username: '', exchange_rate: 1 },
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
      this.boughtItem.uom = 'vcash';
      this.boughtItem.username = this.$store.state.loginUser.username;
      this.boughtItem.exchange_rate = this.$store.state.xchgRate;
      this.boughtItem.uom = 'vcash';
      let qry = 'database/json_cashflow_post.php';
      axios.post(qry, { data: this.boughtItem } )
        .then(response => { 
        });  
      console.log('save new bet');
      console.log(this.boughtItem);
      this.close();
    },
    //----------------------------------------
    close () {
      this.vcashDialog = false;
      setTimeout(() => {
        this.boughtItem = Object.assign({}, this.defaultItem);
      }, 300);
    },
  },   
};
</script>

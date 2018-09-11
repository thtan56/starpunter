Vue.component('vcashBuySell', {
  template: `
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
      </v-card-text>
    </v-card>
  </v-dialog>
  `,
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
});
Vue.component('cashDepositWithdraw', {
  template: `
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
      </v-card-text>
    </v-card>
  </v-dialog>
  `,
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
});
const cashFlow = Vue.component('cashComponent', {
  template: `
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
  `,
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
});

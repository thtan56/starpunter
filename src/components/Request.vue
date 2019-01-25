// const request = Vue.component('requestcomponent', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-toolbar color="pink" dark><v-toolbar-title>Request: {{ displayTitle(activity) }} </v-toolbar-title></v-toolbar> 
    <v-container>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-container>
                <v-form v-model="valid" ref="form">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.username" label="Username:" readonly background-color="grey"></v-text-field>
                      <v-text-field v-model="displayDate" label="Request Date:" readonly background-color="grey" suffix="(DD/MM/YYYY)"></v-text-field>
                      <v-text-field label="Amount" v-model="editedItem.amount" :suffix="currencyType"></v-text-field>
                      <v-btn @click="save">save</v-btn>
                      Status: {{ result }}
                      <span class="badge badge-danger">{{error}}</span>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
export default {
  name: 'request',
  props: { 
    'activity': {type: String}
  },
  components: { topmenu },
  data () {
    return {
      editedItem: { username: '', activity: '', date: '', amount: '', exchange_rate: '', balcash: '', balvcash:'' },
      currencyType: '',
      result: '',
      error: '',
      valid: false,
    }
  },
  watch: {
    activity (newValue) {  
      this.currencyType = this.getCurrencyType(newValue);
    }
  },
  computed: {
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('DD/MM/YYYY');
      }
    }
  },
  methods: { 
    displayTitle(activity) {
      var result = '';
      switch(activity){
        case "withdraw":result = "Cash Withdrawal"; break;   // cash
        case "deposit": result = "Cash Deposit"; break;   // cash
        case "buy":     result = "Buy virtual Cash"; break;   // vcash
        case "sell":    result = "Sell virtual Cash"; break;  // vcash
      };
      return result;
    },    
    save: function () {   
      this.editedItem.date = moment().format('YYYY-MM-DD');
      this.editedItem.activity = this.activity;
      if (this.editedItem.amount=='' ){
        this.error = 'Amount fields are required';
        return;
      };
      var saveitems = this.editedItem;    // updated too early - async
      this.result = 'Saving data to server...';
      var postdata = { "op": "insert", "data": saveitems };
      this.$http.post('/php/apiRequest.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => { 
          var balances = response.body.data;    // new cash,vcash balance      
          this.updateUserStore(this.editedItem.username);
          this.editedItem.amount = '';
        }, response => { this.result = 'Failed to save data to server.';
      });  // http.post 1 
    },
    updateUserStore(username) {
      var postdata = { op: "getUserByName", username: username };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          this.$store.commit('modifyMyRecord', response.body.data[0] );   // update store with new cash, vcash balance
        }, response => { this.result = 'Failed to save data to server.'; 
      });   // http.post 2
    },
    getCurrencyType(activity) {
      var result = '';
      switch(activity){
        case "withdraw":result = "in $"; break;   // cash
        case "deposit": result = "in $"; break;   // cash
        case "buy":     result = "in $"; break;   // vcash
        case "sell":    result = "in vcash"; break;  // vcash
      };
      return result;
    }
  },   // end of methods
  beforeMount(){ 
    console.log("1) beforeMount", this.activity);
    this.editedItem.username      = this.$store.state.loginUser.username;
    this.editedItem.balcash       = this.$store.state.loginUser.cash;
    this.editedItem.balvcash      = this.$store.state.loginUser.vcash;
    this.editedItem.exchange_rate = this.$store.state. xchgRate;
    this.currencyType = this.getCurrencyType(this.activity);
  }
};
</script>

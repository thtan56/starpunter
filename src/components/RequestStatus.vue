// const requeststatus = Vue.component('statuscomponent', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-toolbar color="pink" dark><v-toolbar-title>Request Management</v-toolbar-title></v-toolbar>
    <v-container fluid grid-list-md>
      <v-flex xs12>
        <v-card dark color="primary">
          <v-card-title>{{formTitle}}
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
          </v-card-title>     
          <v-data-table :headers="headers" :items="requests" :search="search"> 
            <template slot="items" slot-scope="props">                            
              <td class="text-xs-left">{{ props.item.username }}</td>
              <td class="text-xs-left">{{ props.item.created | moment }}</td>
              <td class="text-xs-left">{{ props.item.cash | currency(2) }}</td>
              <td class="text-xs-left">{{ props.item.vcash | currency(2) }}</td>
              <td class="text-xs-left">{{ props.item.exchange_rate | number(2) }}</td>        
              <td class="text-xs-left">{{ props.item.activity }}</td>
              <td class="text-xs-left">{{ props.item.description }}</td>
              <td>{{ props.item.status }}</td>
              <td>{{ props.item.id }}</td>
              <td>
                <template v-if="props.item.status === 'pending'">      
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </template>
              </td>
            </template>
            <template slot="footer">
              <td colspan=2><strong>My Balance</strong></td>
              <td class="text-xs-right">{{ $store.state.loginUser.cash | currency(2) }}</td>
              <td class="text-xs-right">{{ $store.state.loginUser.vcash | currency(2) }}</td>
              <td>x-rate:{{ $store.state.xchgRate }}</td>
            </template>
          </v-data-table>    
        </v-card>
      </v-flex>   
    </v-container>    
  </v-content>              
</template>

<script>
import topmenu from './TopMenu.vue';
import moment from 'moment';
export default {
  name: 'requestStatus',
  props: { 
    'activity': {type: String}
  },
  components: { topmenu },
  data () {
    return {
      activities: [ { type: 'deposit cash',  description: 'deposit to trust account' },
            { type: 'withdraw cash', description: 'transfer to bank' },
            { type: 'buy vcash',  description: 'transfer to virtual bank' },
            { type: 'sell vcash', description: 'transfer to trust account' }   ],
      activity_types:    ['deposit cash','withdraw cash', 'buy vcash', 'sell vcash'],
      description_types: ['deposit to trust account', 'transfer to bank',
                          'transfer to virtual bank', 'transfer to trust account'],
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { id: 0, username: '', activity: '', description: '', status:''
          ,exchange_rate: '', cash:'', vcash: '', id: '', balcash: '', balvcash: '' },
      pagination: {},
      headers: [  
        { text: 'Username', value: 'username' },   
        { text: 'Date', value: 'created' },  
        { text: 'Cash($)', value: 'cash'},
        { text: 'Virtual($)', value: 'vcash'},
        { text: 'Exchange Rate', value: 'exchange_rate'},        
        { text: 'Activity', value: 'activity' },
        { text: 'Description', value: 'description' },
        { text: 'Status', value: 'status' },
        { text: 'Id', value: 'id' }            
      ],
      requests: [],
      search: '',
      username: ''
    }
  },
  watch: {
    activity (newValue) {                // trigger when value change in round
      this.getAllData();
    }
  },
  computed: {
    formTitle() {
      var result="";
      switch(this.activity){
        case "withdraw":result = "Cash Withdrawal History"; break;
        case "deposit": result = "Cash Deposit History"; break;  
        case "buy":     result = "Buy Virtual Cash History"; break;      
        case "sell":    result = "Sell Virtual Cash History"; break;
      };
      return result;
    }
  },
  filters: {
    moment: function (date) { return moment(date).format('L'); }
  },
  methods: {
    updateUserStore(username) {
      var postdata = { op: "getUserByName", username: username };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          this.$store.commit('modifyMyRecord', response.body.data[0] );   // update store with new cash, vcash balance
        }, response => { this.result = 'Failed to save data to server.'; 
      });   // http.post 2
    },   
    deleteItem: function(item){
      this.editedItem               = item;
      this.editedItem.balcash       = this.$store.state.loginUser.cash;
      this.editedItem.balvcash      = this.$store.state.loginUser.vcash;
      console.log("29) deleteItem", this.editedItem);
      var r = confirm("Are you sure to delete this item ("+item.id+':'+item.activity
                +" date:"+item.created+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "deleteUpdate", data: this.editedItem};
        this.$http.post('/php/apiRequest.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => {
                                this.updateUserStore(this.editedItem.username);
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      console.log("20) getAllData:", this.username);
      this.result = 'Getting data from server...';
      var postdata = { op: "getUserRequests", data: { username: this.username, activity: this.activity }  };
      this.$http.post('/php/apiRequest.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.requests = response.body.data;
                              console.log(this.requests);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){
    console.log("10) beforeMount:", this.activity);
    this.username = this.$store.state.loginUser.username;
    this.getAllData(); }
  };
  </script>

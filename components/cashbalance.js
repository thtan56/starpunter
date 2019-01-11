const cashBalance = Vue.component('cashbalancecomponent', {
  template: /* syntax: html */ `
  <v-content>
  hello
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>
        <cashBalance></cashBalance>
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>
  `
});
const vcashBalance = Vue.component('vcashbalancecomponent', {
  template: /* syntax: html */ `
  <v-content>
  hello
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>
        <vcashBalance></vcashBalance>
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>
  `
});
Vue.component('cashBalance', {
  template: /* syntax: html */ `
  <v-container fluid grid-list-md><v-layout column> </v-layout></v-container>
    `
});
Vue.component('cashBalance', {
  template: /* syntax: html */ `
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>CashFlow Management</v-toolbar-title></v-toolbar>
      <v-container fluid grid-list-md>
        <v-form v-model="valid" ref="form">
          <v-layout row wrap>
            <v-flex xs3><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>
            <v-flex xs9>
              <v-radio-group v-model="editedItem.activity" row label="Activity">
                <v-radio v-for="item in activity_types" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>   
            <v-flex xs9>
              <v-radio-group v-model="editedItem.description" row label="Description">
                <v-radio v-for="item in description_types" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex> 
            <v-flex xs3><v-text-field label="Reference Number" v-model="editedItem.username"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Cash" v-model="editedItem.activity"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="vCash" v-model="editedItem.activity"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Exchange Rate" v-model="editedItem.username"></v-text-field></v-flex>
            <v-flex xs2><v-text-field label="id" v-model="editedItem.id"></v-text-field></v-flex>  
          </v-layout>
          <v-btn @click="save">save</v-btn>
          Status: {{ result }}
          <span class="badge badge-danger">{{error}}</span>
        </v-form>
      </v-container>
      <v-container fluid grid-list-md>
        <v-flex xs12>
          <v-card dark color="primary">
            <div>
    <v-select label="Activity" :items="['deposit cash', 'withdraw cash', 'buy vcash', 'sell vcash', 'all']" v-model="search"></v-select>
    <v-data-table :headers="headers" :items="cashs" :search="search" :custom-filter="customFilter" hide-actions> 
      <template slot="items" slot-scope="props">                            
        <td class="text-xs-left">{{ props.item.username }}</td>
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
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
      </template> 
      <template slot="footer">
         <td colspan="100%"><strong>Notes: Just fill the blanks to register a new Period</strong></td>
      </template>
    </v-data-table>
            </div>            
          </v-card>
        </v-flex>
      </v-container>
    </v-layout>
  </v-container>
  `,
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
      editedItem: { id: 0, username: '', activity: '', description: '', reference_number:''
          ,exchange_rate: '', cash:'', vcash: '', id: '' },
      pagination: {},
      headers: [  
        { text: 'Username', value: 'username' },   
        { text: 'Date', value: 'created' },  
        { text: 'Cash($)', value: 'cash'},
        { text: 'Virtual($)', value: 'vcash'},
        { text: 'Exchange Rate', value: 'exchange_rate'},        
        { text: 'Activity', value: 'activity' },
        { text: 'Description', value: 'description' },
        { text: 'Reference', value: 'reference_number' },
        { text: 'Id', value: 'id' }            
      ],
      cashs: [],
      totals: {cash: 1000, vcash: 500 },
      search: '',
      username: ''
    }
  },
  methods: {   
    save: function () {
      console.log("11) save:editedItem");
      console.log(this.editedItem);
      if(this.editedItem.title=='' ){
        this.error = 'Title fields are required';
        return;
      };
      //---------------------
      if (this.editedIndex > -1) {
        Object.assign(this.cashs[this.editedIndex], this.editedItem);
      } else {
        this.cashs.push(this.editedItem);     // new
      }; 
      var saveitems = this.editedItem;    // updated too early - async
      //----------
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": saveitems };
      this.$http.post('php/apiCashFlow.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
//          this.getAllData();                 // refresh datatable
          this.editedItem = '';
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ 
      this.editedIndex = this.cashs.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item ("+item.id+':'+item.title+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiCashFlow.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    customFilter(items, search, filter) { 
      if (search==='all') { return items; };
      return items.filter(row => filter(row["activity"], search)); },
    getAllData: function () {
      console.log('1) depositcash.js: getAllData', this.username);
      this.result = 'Getting data from server...';
      var postdata = { op: "getCashs", username: this.username  };
      this.$http.post('php/apiCashFlow.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.cashs = response.body.data;
                              console.log(this.cashs);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  filters: {
    moment: function (date) { return moment(date).format('L'); }
  },
  beforeMount(){ 
    this.username = this.$store.state.loginUser.username;
    this.getAllData(); }
  });

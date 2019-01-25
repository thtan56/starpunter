// const ticketStatus = Vue.component('ticketstatuscomponent', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>

  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Ticket Management</v-toolbar-title></v-toolbar>
      <v-container fluid grid-list-md>
        <v-flex xs12>
          <v-card dark color="primary">
            <v-card-title>Ticket Status History<v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-card-title>     
            <v-data-table :headers="headers" :items="tickets" :search="search"> 
              <template slot="items" slot-scope="props">                            
                <td class="text-xs-left">{{ props.item.username }}</td>
                <td class="text-xs-left">{{ props.item.organiser }}/{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.start | moment }}-{{ props.item.end_dt | moment }}</td>
                <td class="text-xs-left">{{ props.item.pool_type }} / {{ props.item.pool_id }}</td>
                <td class="text-xs-left">{{ props.item.entry_cost | currency(2) }}</td>
                <td class="text-xs-left">{{ props.item.entry_quorum}} / {{ props.item.entrants}}</td>
                <td class="text-xs-left">{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
                <td class="text-xs-left">{{ props.item.created | moment }}</td>
                <td>{{ props.item.status }} / {{ props.item.id }}</td>
                <td>
                  <template v-if="props.item.status === 'pending'">      
                     <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </template>
                </td>
              </template>
               <template slot="footer">
                <td colspan=2><strong>My Balance</strong></td>
                <td colspan=2>Cash Balance:{{ $store.state.loginUser.cash | currency(2) }}</td>
                <td colspan=2>Virtual Cash Balance:{{ $store.state.loginUser.vcash | currency(2) }}</td>
               </template>
            </v-data-table>    
          </v-card>
        </v-flex>   
      </v-container>
    </v-layout>
  </v-container>    
        
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>              
</template>


<script>
import topmenu from './TopMenu.vue';

export default {
  name: 'ticketStatus',
  components: { topmenu },   // 2
  data () {
    return {
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { id: 0, username: '', organiser: '', round: '', start:'', end_dt: ''
          ,pool_type: '', pool_id:'', entry_cost: '', entry_quorum:'', entrants:''
          ,pool_prize: '', payout: '', created: ''
          , id: '', status: '' },
      pagination: {},
      headers: [   
        { text: 'Username', value: 'username'},
        { text: 'Organiser/Round', value: 'organiser'},
        { text: 'Start-End', value: 'start'},        
        { text: 'Pool Type/Id', value: 'pool_type' },
        { text: 'Entry Cost', value: 'entry_cost' },
        { text: 'Quorum/Count', value: 'entry_quorum' },
        { text: 'Prize/Payout', value: 'pool_prize' },
        { text: 'Date', value: 'created' }, 
        { text: 'Status/Id', value: 'status' }      
      ],
      tickets: [],
      search: '',
      username: ''
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
      this.editedItem               = item;      // item from ticket table
      this.editedItem.balcash       = this.$store.state.loginUser.cash;
      this.editeItem.balvcash      = this.$store.state.loginUser.vcash;
      console.log("29) deleteItem", this.editedItem);
      var r = confirm("Are you sure to delete this (ticket#"+item.id+':pool#'+item.pool_id
                +" date:"+item.created+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "deleteUpdate", data: this.editedItem};
        this.$http.post('/php/apiTicket.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => {
              this.updateUserStore(this.editedItem.username);
              this.getAllData();    // refresh datatable
              //===========================================================
              postdata = { op: "reverseCount", "pid": item.pool_id };
              this.$http.post('/php/apiPool.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' } })
                .then(response => {
                },      response => { this.result = 'Failed to load data to server.'; }
              );
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      this.result = 'Getting data from server...';
      var postdata = { op: "getUserTickets", username: this.username };
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.tickets = response.body.data;
                              console.log(this.tickets);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){
    console.log("21) beforeMount:");
    this.username = this.$store.state.loginUser.username;
    this.getAllData(); 
  }
};
</script>

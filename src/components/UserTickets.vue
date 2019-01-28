// customer 
// const Ticket2 = Vue.component('userTickets', {
<template>
  <div id="ticketTable">
    <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>     
    <v-data-table :headers="headers" :items="tickets" :pagination.sync="pagination" :search="search">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}}</td>
        <td>{{ props.item.pool_name}}-{{ props.item.pool_id}}</td>
        <td>{{ props.item.pool_type}}</td>
        <td>{{ props.item.entry_cost}}</td>
        <td>{{ props.item.entry_quorum}}</td>
        <td>{{ props.item.pool_prize}}</td>
        <td>{{ props.item.payout}}</td>
        <td>{{ props.item.created  | moment }}</td>
        <td>{{ props.item.remarks}}</td>
        <td>{{ props.item.id}}</td>
        <td>
        <v-btn icon @click="placeBet(props.item)">Bets</v-btn>
      
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
     <template slot="footer">
        <td colspan="100%">
          <strong>Notes: Can only delete if the games are attached to the ticket</strong>
        </td>
      </template>
    </v-data-table>    
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'usertickets',   // component name
  props: { selected: {type: Object },   // orgweek, username
           data: {type: Array }  },     // ticketlist 
  data() {
    return { 
          filterList: [ { pool_type: 'head2head' }, { pool_type: 'group' } ],
          menu: false,
          search: '',
          result: '',
          error: '',
          valid: false,

          editedIndex: -1,
          editedItem: { id: 0, username: '', pool_id: 0, pool_name: '', pool_type: '', entry_cost: 0, entry_quorum:0, pool_prize:0, payout:''
                ,remarks: '' },
          tickets: [],
          types: ['head2head','group'],
          pagination: {},
          headers: [ { text: 'Username', value: 'username' }
                    ,{ text: 'Pool Name', value: 'pool_name' }, { text: 'Pool Type', value: 'pool_type' } 
                    ,{ text: 'Entry Cost', value: 'entry_cost' },{ text: 'Entry Quorum', value: 'entry_quorum' }
                    ,{ text: 'Pool Prize', value: 'pool_prize' },{ text: 'Payout', value: 'payout' }
                    ,{ text: 'Created', value: 'created' },
                    ,{ text: 'Remarks', value: 'remarks' },{ text: 'Ticket#', value: 'id' }],
          username: ''
        }
      },
      computed: {
        formTitle () { return this.editedIndex === -1 ? 'New Ticket' : 'Edit Ticket' },
      },
      methods: {
        save: function () {
          console.log("11) save:editedItem");
          console.log(this.editedItem);
          if(this.editedItem.pool_name=='' || this.editedItem.username=='') 
          {
            this.error = 'Pool name fields are required';
            return;
          }
          this.error = '';
          this.result = 'Saving data to server...';
          var postdata = { "op": "save", "data": this.editedItem };
          this.$http.post('php/apiTicket.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
            .then(response => {
              this.result = response.body;
              this.getAllData();                 // refresh datatable
              this.editedItem.id = 0;
              this.editedItem.username = '';
              this.editedItem.pool_name = '';
              this.editedItem.pool_id = 0;
              this.editedItem.entry_cost = '';
              this.editedItem.entry_quorum = '';
              this.editedItem.pool_prize = '';
              this.editedItem.payout = '';
              this.editedItem.remarks = '';
            }, response => { this.result = 'Failed to save data to server.'; });
          },
          placeBet: function(item){
            console.log("placeBet");
            this.$router.push({name:'betGames', params: {ticketid: item.id}})     
          },
          deleteItem: function(item){
              var r = confirm("Are you sure to delete this item ("+item.pool_name+"-"+item.pool_id+ ")?");
              if(r==true) {
                  this.result = 'Deleting data to server...';
                  var postdata = { op: "delete", id: item.id };
                  this.$http.post('php/apiTicket.php', JSON.stringify(postdata),{
                      headers: { 'Content-Type': 'application/json' }
                  }).then(response => { this.result = response.body;
                                        this.getAllData();    // refresh datatable
                  },      response => { this.result = 'Failed to delete data.';
                  });
              }
          },
          getAllData: function () {
            this.username = this.$store.state.loginUser.username;
            console.log('2) serviceticket.js: getAllData');
              this.result = 'Getting data from server...';
              var postdata = { op: "getUserTickets", username: this.username };
              this.$http.post('php/apiTicket.php', JSON.stringify(postdata), {
                  headers: { 'Content-Type': 'application/json' }
              }).then(response => { 
                this.tickets = response.body.data;
                console.log('4) this.tickets');
                console.log(this.tickets);
              },      response => { this.result = 'Failed to load data to server.';
              });
          }
      },
      filters: {
        moment: function (date) {
          return moment(date).format('YYYY-MM-DD');
        }
      },
      beforeMount(){
        console.log("1) serviceticket.js-beforeMount");
        this.getAllData(); }
  };
</script>

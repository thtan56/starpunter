// Vue.component('poolentrants', {
<template>
  <div>
    <v-card color="blue-grey" dark tile flat>
      <v-toolbar color="brown" dark>
        <v-toolbar-title><slot></slot></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn small color="blue-grey" class="white--text" @click="buyTicket(poolData)"
            :disabled="!exceedQuorum(poolData.entry_quorum, poolData.entrants)"
          >Buy Pool Ticket
          <v-icon right dark>shopping_cart</v-icon>
        </v-btn>            
      </v-toolbar>     
      <v-data-table :headers="headers" :items="tickets" :pagination.sync="pagination"> 
            <template slot="items" slot-scope="props">
              <tr @click="showAlert(props.item)">
                <td>{{ props.item.organiser}} / {{ props.item.round}}</td>
                <td>{{ props.item.start | moment}} : {{ props.item.end_dt | moment}}
                <td>{{ props.item.pool_id}} / {{ props.item.pool_name}}</td>  
                <td>{{ props.item.username}} / {{ props.item.id}}</td>  <!-- ticket#  -->
                <td>{{ props.item.income}} / {{ props.item.total_score}}</td>
                <td><!-- v-icon small @click="deleteTicket(props.item)">delete</v-icon --></td>
              </tr>
            </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>

import moment from 'moment';
export default {
  name: 'poolentrants',
  props: { 
    poolData: {type: Object}
  },
  data () {
    return {
      tickets: [],    
      rowsPerPageItems: [3, 6, 12],
      pagination: {  rowsPerPage: 3 },
      headers:[ { text: 'Organiser/Round', value: 'organiser' } 
                ,{ text: 'Start/End', value: 'start' }
                ,{ text: 'Pool#/Name', value: 'pool_id' }                 
                ,{ text: 'Entrants/Ticket#', value: 'username' }
                ,{ text: 'Income/Score', value: 'income' }],
      editedItem:{},
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    showAlert(item) {
      alert("Click on Game#:"+item.game_id+">Ticket#:"+item.id+">Pool#:"+item.pool_id
        +"<br>no of entrants:"+this.poolData.entrants+">"+this.poolData.entry_quorum
        +"<br>exceeded:"+this.exceeded);
    },  
    exceedQuorum(strQuorum, icount) {
      console.log("100) PE: exceedQuorum", strQuorum, icount);
      if (this.poolData.status == 'closed') { return false };   // closed, cannot buy ticket
      let regex= /[+]/g;
      let found = strQuorum.match(regex);
      if (found != null) { return true;      // + exist => unlimited
      } else {           return ( icount == parseInt(strQuorum) ? false : true )   }
    },    
    buyTicket(item){
      this.editedItem         = item;     // poolData
      this.editedItem.pool_id = item.id; 
      console.log('101) PE: buyTicket > this.editedItem(no cash)', this.editedItem);
      console.log('102) this.editedItem.entry_cost',this.editedItem.entry_cost);
      if ( typeof this.editedItem.entry_cost === "undefined" ) {
        this.$swal({
          title: '<strong>Error! Unknown User!</strong>',
          type: 'info',
          html: '** You need to login to your account **'
                  +'<br>before you can buy a ticket',
          showCloseButton: true,
          confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
        });        
      } else if (this.editedItem.entry_cost > this.$store.state.loginUser.vcash) {
        this.$swal({
          title: '<strong>Error! Insufficient fund!</strong>',
          type: 'info',
          html: '** You cannot bought ticket **'
                  +'<br>due to insufficient fund<br>buy additional vcash first<br><br>'
                  +'<table border=1 style="margin: 0px auto;">'
                  +'<tr><th>Pool#</th><th>Type</th><th>Entry Cost</th></tr>'
                  +'<tr><td>'+this.editedItem.pool_id+'</td><td>'
                  + this.editedItem.pool_type+'</td><td>'
                  + this.editedItem.entry_cost+'</td></tr></table>',
          showCloseButton: true,
          confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
        });  
      } else {
        // use orgweek to get start and end of week from period
        this.result = 'Getting data from server...'; 
        var postdata = { op: "getOrgWeekPeriod",   
            data: {organiser: this.editedItem.organiser, round: this.editedItem.round} };    
        this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            if (response.body.data.length === 0) {
              this.editedItem.start = "";
              this.editedItem.end_dt ="";
              console.log('103) this.editedItem', this.editedItem);
            } else {
              var start = response.body.data[0].start;
              var end_dt = response.body.data[0].end_dt;
              this.editedItem.start=moment(start).format('YYYY/MM/DD');
              this.editedItem.end_dt=moment(end_dt).format('YYYY/MM/DD');
        //-------------------------------------      
              this.editedItem.username = this.$store.state.loginUser.username;
              this.editedItem.balcash  = this.$store.state.loginUser.cash;
              this.editedItem.balvcash = this.$store.state.loginUser.vcash;
              console.log('104) this.editedItem', this.editedItem);
              this.error = '';
              this.result = 'Saving data to server...';
              var postdata = { "op": "insertUpdate", "data": this.editedItem };    // reduce vcash bal in users table  
              this.$http.post('/php/apiTicket.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
                .then(response => { this.ticket = response.body.data[0];
                                    this.editedItem.id = this.ticket.tid;
                                    this.tickets.push(this.editedItem);     // new
                                    this.updateUserStore(this.editedItem.username);
                }, response => {  this.result = 'Failed to save data to server.'; } 
                );
              this.poolData.entrants++;
              this.$swal({
                title: '<strong>Congratulation!</strong>',
                type: 'info',
                html: '** You have just bought ticket <br>'
                  +'<u>Pool#'+this.editedItem.pool_id+' of type '
                  + this.editedItem.pool_type
                  +'</u><br>Entry cost:<u>'+this.editedItem.entry_cost+'</u>',
                showCloseButton: true,
                confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
              });
              //-------------------------------------      
            };
          },  response => { this.result = 'Failed to load data to server.';
        });
        //-----------------------
      };   // else    
    },
    updateUserStore(username) {
      var postdata = { op: "getUserByName", username: username };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => {
          this.$store.commit('modifyMyRecord', response.body.data[0]);   // update store with new cash, vcash balance
        }, response => { this.result = 'Failed to save data to server.'; 
      });   // http.post 2
    },       
    getAllData: function () {
      console.log("30) getPoolUser from ticket", this.poolData.pool_id, 
        this.poolData.organiser, this.poolData.round);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgRndTicketsByPid", 
                      data: {organiser: this.poolData.organiser
                             ,round:    this.poolData.round
                             ,pool_id:  this.poolData.pool_id} };    
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.tickets = response.body.data;
                              console.log("31) this.tickets", this.tickets);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
      console.log("1)PEntrants.vue:beforeMount: poolData", this.poolData);
      this.organiser = this.poolData.organiser;
      this.round     = this.poolData.round;
      this.editedItem = this.poolData;      
      this.getAllData();                        // get this.pools
  }   
};
</script>

// const userHome=Vue.component('userhome', {
<template>
  <v-container fluid grid-list-md>
    <homebars></homebars>
    <!-- == 1a) selected pool info =============================================================================== -->
    <v-layout row wrap>
      <v-flex d-flex xs6><userinfo2 :userData="userData">Username: {{username}} Profile</userinfo2></v-flex>
      <v-flex xs3><userticketsummary2 :ticketlist="ticketlist" @clicked-childselected="getTicketGames">
                  </userticketsummary2></v-flex>
      <v-flex xs8>
        <userticketgames :gameData="gamelist">
          <v-toolbar-title>Ticket Games: {{selected.orgweek}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat>Username:{{selected.username}}</v-btn>
        </userticketgames>
      </v-flex> 
    </v-layout>
  </v-container>
</template>

<script>
import homebars from './HomeBars.vue'
import userinfo2 from './UserInfo2.vue'
import userticketsummary2 from './UserTicketSummary2.vue'
import userticketgames from './UserTicketGames.vue'

export default {
  name: 'userHome',   // component name
  props: {
    username: {type: String },  
    userData: {type: Object }      // username, etc
  },  
  components: { homebars, userinfo2, userticketsummary2, userticketgames },   // 2
  data () {
    return {
      selected: {},
      tickets: [],
      ticketlist: [],
      gamelist: [],
      totals: {score: 0, income: 0}  
    }
  },
  methods: {
    getTicketGames(c2item) {
      console.log("81) getTickets:citem", c2item);   // orgweek, username  
      this.selected = c2item;
      var array=c2item.orgweek.split(':');
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgRndUserTicketGames", 
               data: {organiser: array[0], round: array[1], username: c2item.username } };   // organiser, round, username
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data; 
          console.log("73) this.gamelist", this.gamelist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },    
    getAllData() {
      console.log("10) getAllData:username:", this.username);
      var result = 'Getting data from server...';
      var postdata = { op: "getUserTickets", username: this.username };    // orgweek, username   
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null) { this.tickets = [];      
          } else {                      this.tickets = response.body.data;
            console.log("11)this.tickets", this.tickets);
            this.ticketlist = alasql('SELECT orgweek, username, count(*) as ticketcount FROM ? '
                +' group by orgweek, username ',[this.tickets]);
               console.log("12)this.ticketlist", this.ticketlist);               
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },   // end of methods
  created() {
    this.getAllData();
  }
};
</script>

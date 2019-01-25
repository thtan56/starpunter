// const userManager=Vue.component('usermanager', { 
<template>
  <div>
    <sysmenu sitename="System Maintenances"></sysmenu>
    <v-container fluid grid-list-lg text-xs-center>
      <v-layout row wrap>
        <v-flex xs8><usertable></usertable></v-flex>
        <v-flex xs4><userweektable @clicked-childselected="getTickets"></userweektable></v-flex>
        <v-flex xs5><usertickets  @clicked-child2selected="getTicketGames" 
                                  :selected="selected" :data="ticketlist"></usertickets></v-flex>  
        <v-flex xs7>
          <userticketgames :gameData="gamelist">
            <v-toolbar-title>Ticket Games: {{selected.orgweek}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat>Username:{{selected.username}}</v-btn>
          </userticketgames></v-flex> 
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import sysmenu from './SysMenu.vue';    // 1
import usertable from './UserTable.vue';
import userweektable from './UserWeekTable.vue'
import usertickets from './UserTickets.vue';
import userticketgames from './UserTicketGames.vue';

export default {
  name: 'userManager',
  components: { sysmenu, usertable, userweektable, usertickets, userticketgames },   // 2
  data() {
    return {
      selected: {},
      ticketlist: [],
      gamelist: []
    }
  },
  methods: {
    updateSelected(obj) {
      this.selected = obj;     // from child tgame-list
    },
    getTickets(citem) {
      this.selected = citem;
      console.log("71) getTickets:citem", citem);   // orgweek, username    
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserTickets2", data: citem };   // orgweek, username
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.ticketlist = (response.body === null) ? [] : response.body.data; 
          console.log("73) this.ticketlist", this.ticketlist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
    getTicketGames(c2item) {
      this.selected = c2item;
      console.log("81) getTickets:citem", c2item);   // orgweek, username    
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserTicketGames", data: c2item };   // orgweek, username, ticket#
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data; 
          console.log("73) this.gamelist", this.gamelist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },    
  },
  created () {
    console.log('1) main.js :created');  // cannot have logic here due to async file reading
  }
};
</script>

// const sysUser = Vue.component('sysuser', { 
<template>
  <div>
    <sysmenu sitename="System Maintenances"></sysmenu>
    <v-container fluid grid-list-lg text-xs-center>
      <v-layout row wrap>
        <v-flex xs3><userinfo :username="username"></userinfo></v-flex>
        <v-flex xs3><entranttable :username="username" 
                                  @clicked-childselected="getTickets"></entranttable></v-flex>
        <v-flex xs6><userweektickets  @clicked-child2selected="getTicketGames" 
                                  :selected="selected" :data="ticketlist"></userweektickets></v-flex>  
        <v-flex xs7>
          <userticketgames :gameData="gamelist">
            <v-toolbar-title>Ticket Games: {{selected.orgweek}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat>Username:{{selected.username}}</v-btn>
          </userticketgames></v-flex> 
        <v-flex xs5><userjournals :username="username"></userjournals></v-flex> 
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import sysmenu from './SysMenu.vue';
import userinfo from './UserInfo.vue';
import entranttable from './EntrantTable.vue';
import userweektickets from './UserWeekTickets.vue';
import userticketgames from './UserTicketGames.vue';
import userjournals from './UserJournals.vue';

export default {
  name: 'sysUser',   // component name
  props: { username: {type: String} },
  components: { sysmenu, userinfo, entranttable, userweektickets, userticketgames, userjournals },   // 2
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

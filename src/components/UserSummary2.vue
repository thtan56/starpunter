// const userSummary2 = Vue.component('usersummarycomponent', {
<template>
  <v-content>
    <homebars></homebars>
    <topboxes></topboxes>   
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs3><userscashchart></userscashchart></v-flex>
        <v-flex xs3><usersscorechart></usersscorechart></v-flex>
        <v-flex xs3><userprofitschart :username="selected.username"></userprofitschart></v-flex>  
        <v-flex xs3><userinfo2 :userData="userinfo">Profile:{{selected.username}}</userinfo2></v-flex>
        <!--  
        <v-flex xs3><userticketsummary @clicked-childselected="getUsers"></userticketsummary></v-flex>
        <v-flex xs9>
          <userweektickettable :ticketData="tickets">
                Tickets - [{{selected.orgweek}} Username: {{selected.username}}]
            <template for="totals" slot="totalsSlot">
              <td><strong>Total Cost / Income:</strong></td>
              <td :style="totals.cost > totals.income ? {'color':'red'} : {'color':'green'}">
                      {{totals.cost}} / {{totals.income}}</td>
            </template>
          </userweektickettable>
        </v-flex>
        -->
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import homebars from './HomeBars.vue'
import topboxes from './TopBoxes.vue';
import userscashchart from './UsersCashChart.vue'
import usersscorechart from './UsersScoreChart.vue'
import userprofitschart from './UserProfitsChart.vue'
import userinfo2 from './UserInfo2.vue'

export default {
  name: 'userSummary2',   // component name
  components: { homebars, topboxes, 
    userscashchart, usersscorechart, userprofitschart, userinfo2 },   // 2
  data() {
    return {
      selected: {},
      userinfo: {},
      tickets: [],
      totals: { cost: 0, income: 0}     
    }
  },
  methods: {
    getUserTickets() {
      console.log("153) getUserTickets");
      var result = 'Getting data from server...';
      var postdata = { op: "getUserTickets2", data: this.selected };    // orgweek, username   
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null) { this.tickets = [];      
          } else {                      this.tickets = response.body.data;
            console.log("155)this.tickets", this.tickets);
            this.totals = alasql('SELECT sum(entry_cost::NUMBER) as cost, sum(income::NUMBER) as income FROM ? '
                              ,[this.tickets])[0];  
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },   
    getUsers(citem) {
      console.log("151) getUsers:citem", citem);
      this.selected = citem;
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserByName", username: this.selected.username };    // username   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null || response.body === "") { this.userinfo = {};      
          } else {  
              this.userinfo = response.body.data[0];
              this.getUserTickets();
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  }    
};
</script>

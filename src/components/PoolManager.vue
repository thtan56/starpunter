// const poolManager=Vue.component('poolmanager', { 
<template>
  <div>
    <sysmenu sitename="System Maintenances"></sysmenu>
    <v-container fluid grid-list-lg text-xs-center>
      <v-layout row wrap>
        <v-flex xs6><pooltable></pooltable></v-flex>
        <v-flex xs3><poolweektabs @clicked-childselected="getUsers"></poolweektabs></v-flex>
        <v-flex xs3><poolusertable @clicked-child2selected="getUserGames"
                                    :selected="selected" :data="userlist"></poolusertable></v-flex>
        <v-flex xs12>
          <poolusergames :poollist="gamelist">
            <v-toolbar-title>Games {{selected.orgweek}}
            </v-toolbar-title> 
            <v-spacer></v-spacer>
            <v-btn flat>Username:{{selected.username}}</v-btn>
            <v-btn flat>Pool#{{selected.pool_id}}</v-btn>
          </poolusergames></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import sysmenu from './SysMenu.vue'; // 1

import pooltable from './PoolTable.vue';
import poolweektabs from './PoolWeekTabs.vue';
import poolusertable from './PoolUserTable.vue';
import poolusergames from './PoolUserGames.vue';

export default {
  name: 'poolManager',
  components: { sysmenu, pooltable, poolweektabs, poolusertable, poolusergames },
  data() {
    return {
      selected: {},
      userlist: [],
      gamelist: [],
      tgames: [],  
    }
  },
  methods: {
    getUsers(citem) {
      this.selected = citem;
      console.log("71) getTickets:citem", citem);   // orgweek, pid 
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getPoolGames", data: citem };   // orgweek, pid
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data; 
          this.userlist = alasql('SELECT orgweek, pool_id, username, count(*) as gamecount FROM ? ' 
                            +' where orgweek = ? and pool_id = ? group by orgweek, pool_id, username '
                  ,[this.tgames, citem.orgweek, citem.pool_id]);
          console.log("73) this.userlist", this.userlist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },  
    getUserGames(c2item) {
      this.selected = c2item;
      this.result = 'Getting data from server...'; 
      postdata = { op: "getPoolUserGames", data: c2item };   // orgweek, pid, username
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data;                             
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
    getAllData() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getPoolUserGames", data: { orgweek: orgweek } };
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {    
            if (response.body === null) { this.pools=[];  
            } else {              
              this.pools = response.body.data;           // A) data 1                            
       console.log("10) getPools, this.pools", this.pools);
       //---------------------------------------   
            };
       },   response => { this.result = 'Failed to load data to server.';
      });
    },
  }
};
</script>

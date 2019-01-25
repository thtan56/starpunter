// Vue.component('gameusersummary', { 
<template>
  <div>
    <v-toolbar dark color="primary">
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title class="white--text">Game Summary</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon><v-icon>more_vert</v-icon></v-btn>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" 
                      :items="gamelist">         
          <template slot="items" slot-scope="props">
            <tr @click="getSelected(props.item)">
              <td class="text-xs-left">{{ props.item.orgweek}}</td>
              <td class="text-xs-left">{{ props.item.game_id}}
                 <v-icon small>more_horiz</v-icon>
              </td>
              <td class="text-xs-left">{{ props.item.usercount}}</td>
            </tr>                  
          </template>   
          <template slot="footer">
            <td><strong>click row for details</strong></td>
          </template>              
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'gameusersummary',
  data() {
    return {
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Game#', value: 'game_id' }             
                ,{ text: 'User Count', value: 'usercount' }  ],   
      gamelist: [],
      tgames: [],
    }
  },     
  methods: {
    getSelected(item) { this.$emit('clicked-childselected', item); },  // game_id   
    getOrgWeekGames() {
      var result = 'Getting data from server...'; 
      var postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
          console.log("10) getOrgWeek, this.tgames", this.tgames);
          // to compute usercount, need to create array 1st
          var array        = alasql('SELECT orgweek, game_id, username FROM ? GROUP BY orgweek, game_id, username',[this.tgames]);              
          this.gamelist    = alasql('SELECT orgweek, game_id, COUNT(*) AS usercount FROM ? GROUP BY orgweek, game_id',[array]);
          //this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]); 
        },   response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  this.getOrgWeekGames(); }
};
</script>

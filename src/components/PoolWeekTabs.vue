// Vue.component('poolweektabs', { 
<template>
  <div>
    <v-tabs v-model="tabs" color="purple" dark slider-color="yellow">                              <!-- 1 --->
      <v-btn flat>Pools</v-btn>
      <v-tab      v-for="filter in orgweeklist" :key="filter.orgweek">{{ filter.orgweek }}</v-tab>  <!-- 2 -->
      <v-spacer></v-spacer>

      <v-tab-item v-for="filter in orgweeklist" :key="filter.orgweek">                   <!-- 3 -->
        <v-data-table :pagination.sync="pagination" :headers="headers" 
                        :items="filtered_pItems(filter.orgweek)">         
          <template slot="items" slot-scope="props">
            <tr @click="getSelected(props.item)">
              <td class="text-xs-left">{{ props.item.orgweek}}</td>
              <td class="text-xs-left">{{ props.item.pool_id}}</td>
              <td class="text-xs-left">{{ props.item.usercount}}</td>
            </tr>                  
          </template>   
          <template slot="footer">
            <td><strong>click row for user info</strong></td>
          </template>              
        </v-data-table>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
export default {
  name: 'poolweektabs',
 data() {
    return {
      result: '',   
      tabs: '',      
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Pool#', value: 'pool_id' }             
                ,{ text: 'User Count', value: 'usercount' }
                ],   
      selected: {},       
      orgweeklist: [],
      poollist: [],
      pools: [],
      tgames: []
    }
  },     
  methods: {
    getSelected(item) {
      console.log("31) getSelected", item);
      this.selected = item; 
      this.$emit('clicked-childselected', item);
    },    
    filtered_pItems (key) {  // 2) user
      const res = [];
      if (key) { 
        const selectedpools = this.poollist.filter(game => game.orgweek  === key );    // repeat for each orgweek
        return selectedpools; 
      };
      return res
    },
    getOrgWeekPool() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
          console.log("10) getOrgWeek, this.tgames", this.tgames);
          // to compute usercount, need to create array 1st
          var array        = alasql('SELECT orgweek, pool_id, username FROM ? GROUP BY orgweek, pool_id, username',[this.tgames]);              
          this.poollist    = alasql('SELECT orgweek, pool_id, COUNT(*) AS usercount FROM ? GROUP BY orgweek, pool_id',[array]);
          this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]);  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("created");
    this.getOrgWeekPool();  
  }
};
</script>

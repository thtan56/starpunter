// Vue.component('gameboard', { 
<template>
  <v-content>
  <v-toolbar color="deep-orange" dark tabs>    
      <v-toolbar-side-icon><img src="images/tristars2.png" width="70" height="40"></v-toolbar-side-icon>
      <v-toolbar-title>Game Board</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tabs slot="extension" v-model="tabs" color="deep-orange" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in gameweeks" :key="item.week">
          {{ item.week }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <v-tab-item v-for="week in gameweeks" :key="week.week">
        <v-data-table :headers="headers" :pagination.sync="pagination" disable-initial-sort
                      :items="week.games">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.home_team}} vs {{ props.item.away_team}}</td>
            <td>{{ props.item.start | moment}} / {{ props.item.game_id}}    
                <v-btn color="primary" @click="showDetails(props.item)">ENTER</v-btn>
                <!--v-icon small @click="showDetails(props.item)">more_horiz</v-icon-->
            </td>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>    
  </v-content>
</template>

<script>
export default {
  name: 'gameboard',   // component name
  data () {
    return {
      tabs: null,
      pagination: { rowsPerPage: 5, sortBy: 'userscore' },    
      gameweeks: [],
      headers: [ { text: 'Home vs Away Team', value: 'home_team'}
             ,{ text: 'Date/Game#', value: 'start'} ]
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    showDetails(item) { 
      console.log("992) item", item);
      this.$router.push({name:'gameHome', params: {game_id: item.game_id, gameData: item} });     
    },      
    getAllData: function () {
      console.log("10) gameboard: getAllData :");
      var result = 'Getting data from server...'; 
      var postdata = { op: "getGameWeeks" };         
      this.$http.post('/php/apiGame.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.gameweeks = response.body.data;
          console.log("12)this.gameweeks", this.gameweeks);
        },   response => { result = 'Failed to load data to server.';
      });
    }
  },
  created(){
    console.log("1) gameboard: created");
    this.getAllData(); }
};
</script>   

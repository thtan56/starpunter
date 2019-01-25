// Vue.component('leaderboard', { 
<template>
  <v-content>
  <v-toolbar color="indigo" dark tabs>    
      <v-toolbar-side-icon><img src="images/tristars2.png" width="70" height="40"></v-toolbar-side-icon>
      <v-toolbar-title>Leadership Board</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tabs slot="extension" v-model="tabs" color="indigo" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in weekleaders" :key="item.week">
          {{ item.week }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <v-tab-item v-for="week in weekleaders" :key="week.week">
        <v-data-table :headers="headers" :items="week.entrants" 
            :pagination.sync="pagination" disable-initial-sort>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.username}}</td>
            <td>{{ props.item.userscore}}</td>
            <td>{{ props.item.userincome}}</td>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>    
  </v-content>
</template>

<script>
export default {
  name: 'leaderboard',   // component name
  data () {
    return {
      tabs: null,
      pagination: { rowsPerPage: 5, sortBy: 'userscore' },    
      weekleaders: [],
      headers: [ { text: 'Username', value: 'username'}
             ,{ text: 'Scores', value: 'userscore'}
             ,{ text: 'Profit', value: 'userincome' } ]
    }
  }, 
  watch: { 
    weekleaders (newVal, oldVal)  { 
      console.log("20) change in weekleaders", newVal);
      //this.getAllData(); 
    }  
  },  
  methods: { 
    getAllData: function () {
      var result = 'Getting data from server...'; 
      var postdata = { op: "getGameLeaders" };         
      this.$http.post('/php/apiGame.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.weekleaders = response.body.data;
          console.log("10)leaderboard:this.weekleaders", this.weekleaders);
        },   response => { result = 'Failed to load data to server.';
      });
    }
  },
  created(){
    console.log("1) leaderboard: created");
    this.getAllData(); }
};
</script>

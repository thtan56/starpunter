// Vue.component('usersummary', {  
<template>
  <v-card dark color="teal lighten-3">
    <v-card-title><span class="headline">Entrants: {{selected}}</span></v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="entrants" :pagination.sync="pagination">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.orgweek}}</td>
          <td>{{ props.item.username}}</td>
          <td>{{ props.item.pool_id}} 
            <v-icon small @click="showDetails(props.item)">more_horiz</v-icon>
            / {{ props.item.game_entries }}
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'usersummary',   // component name
  props: { 
    selected: {type: Array},   // user list
    today: {type: String}    
  }, 
  data () {
    return {
      pagination: {  rowsPerPage: 10 },
      entrants: [],
      headers: [ { text: 'Organiser/Round', value: 'organiser' }
                ,{ text: 'Username', value: 'username' }
                ,{ text: 'Pool# / Games', value: 'pool_id' } ],
    }
  }, 
  watch: { 
    selected: {
      handler: function (newValue) {
        console.log("202) selected change", newValue);
        this.getAllData();  
      }, deep: true }, 
    today (newVal, oldVal)  { 
      console.log("201) today change", newVal);
      this.getAllData(); 
    }  
  },  
  methods: {
    showDetails(item) {
      console.log("91) showDetails", item);
      var result = 'Getting data from server...'; 
      var postdata = { op: "getPool", pool_id: item.pool_id };         
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { var pool = response.body.data;
          console.log("92)pool", pool);       

          item.entry_quorum=pool[0].entry_quorum;
          item.entrants    =pool[0].entrants;
          item.entry_cost  =pool[0].entry_cost;
          item.payout      =pool[0].payout;
          item.pool_name   =pool[0].pool_name;
          item.pool_prize  =pool[0].pool_prize;
          item.pool_type   =pool[0].pool_type;
          item.status   =pool[0].status;
          // var array=item.orgweek.split(":");
          item.organiser   =pool[0].organiser;
          item.round       =pool[0].round;

          this.$router.push({name:'homeGames', params: {username: item.username, poolData: item} });
        },   response => { this.result = 'Failed to load data to server.';
      });
    },    
    getAllData: function () {
      console.log("50) getUserGameSummary :", this.selected);
      console.log("51) this.today", this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserGameSummary", 
            data: { organisers: this.selected, today: this.today } };         
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.entrants = response.body.data;
          console.log("59)this.entrants", this.entrants);
        },   response => { this.result = 'Failed to load data to server.';
      });
    }
  },
  created(){ this.getAllData(); }
};
</script>

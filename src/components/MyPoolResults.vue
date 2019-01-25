// Vue.component('mypoolresults', {
<template>
  <div>
    <v-data-iterator :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination"  
        :items="stats"    content-tag="v-layout" row wrap>
      <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg4>    <!-- lg3 = control width -->
        <v-card color='green'>     <!-- 1 box -->
          <v-card-title class="subheading font-weight-bold">Entry cost:{{ props.item.entry_cost }}
            <br>{{ props.item.organiser }}:{{ props.item.round }}
            <v-spacer></v-spacer>Pool#{{ props.item.pool_id }}
          </v-card-title>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Pool Prize:</v-list-tile-content>            
              <v-list-tile-content class="align-end">{{ props.item.pool_prize }}</v-list-tile-content>
            </v-list-tile>   
            <v-list-tile>
                <v-list-tile-content>Total Score:</v-list-tile-content>            
                <v-list-tile-content class="align-end">{{ props.item.total }}</v-list-tile-content>
            </v-list-tile>     
            <v-list-tile>
                  <v-list-tile-content>Payout-Top:</v-list-tile-content>            
                  <v-list-tile-content class="align-end">{{ props.item.top }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                  <v-list-tile-content>Income:</v-list-tile-content>            
                  <v-list-tile-content class="align-end">{{ props.item.income }}</v-list-tile-content>
            </v-list-tile>  
            <v-list-tile>
                  <v-list-tile-content>Username:</v-list-tile-content>            
                  <v-list-tile-content class="align-end">{{ props.item.username }}</v-list-tile-content>
            </v-list-tile>                       
            <v-icon small class="mr-2" @click="showItem(props.item)">more_horiz</v-icon>      
          </v-list>
        </v-card>
      </v-flex>
      <v-toolbar slot="footer" class="mt-2" color="indigo" dark dense flat>
        <v-toolbar-title class="subheading"></v-toolbar-title>
      </v-toolbar>
    </v-data-iterator>
  </div>
</template>

<script>
export default {
  name: 'myPoolResults',
  props: { 
    organiser: {type: String},   
    round: {type: String},   
    username: {type: String}   
  }, 
  data () {
    return {
      stats: [],
      rowsPerPageItems: [4, 8, 12],        
      pagination: { rowsPerPage: 4 },      
    }
  },
  watch: { 
    organiser (newVal, oldVal)  { this.getAllData(); },
    round (newVal, oldVal)      { this.getAllData(); }    
  }, 
  methods: {
    getAllData: function () {
      console.log("10) mypoolresults-getAllData",this.organiser, this.round);
      this.result = 'Getting data from server...';
      var postdata = { op: "getTicketGamesStatByOrg", data: {organiser: this.organiser, round: this.round} };
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          this.stats = response.body.data;    // tgames
          console.log("12)mypoolresults-response.body.data", response.body.data);
          this.stats = this.stats.filter(stat => stat.username === this.username)   // only this user   
          console.log("14)filter 4 username-this.stats",this.username,this.stats);

        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },  // end of methods
  created(){
    console.log("1) mypoolresults-created", this.organiser, this.round); 
    this.getAllData();
  }
};
</script>

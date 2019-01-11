const userHome=Vue.component('userhome', {
  props: {
    username: {type: String },  
    userData: {type: Object }      // username, etc
  },
  template: /* syntax: html */ `
  <v-container fluid grid-list-md>
    <homebars></homebars>
    <!-- == 1a) selected pool info =============================================================================== -->
    <v-layout row wrap>
      <v-flex d-flex xs6><userinfo2 :userData="userData">Username: {{username}} Profile</userinfo2></v-flex>
      <v-flex xs3><userticketsummary2 :ticketlist="ticketlist" @clicked-childselected="getTicketGames">
                  </userticketsummary2></v-flex>
      <v-flex xs8>
        <userticketgames :gameData="gamelist">
          <v-toolbar-title>Ticket Games: {{selected.orgweek}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat>Username:{{selected.username}}</v-btn>
        </userticketgames>
      </v-flex> 
    </v-layout>
  </v-container>
  `,
  data () {
    return {
      selected: {},
      tickets: [],
      ticketlist: [],
      gamelist: [],
      totals: {score: 0, income: 0}  
    }
  },
  methods: {
    getTicketGames(c2item) {
      console.log("81) getTickets:citem", c2item);   // orgweek, username  
      this.selected = c2item;
      var array=c2item.orgweek.split(':');
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgRndUserTicketGames", 
               data: {organiser: array[0], round: array[1], username: c2item.username } };   // organiser, round, username
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data; 
          console.log("73) this.gamelist", this.gamelist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },    
    getAllData() {
      console.log("10) getAllData:username:", this.username);
      var result = 'Getting data from server...';
      var postdata = { op: "getUserTickets", username: this.username };    // orgweek, username   
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null) { this.tickets = [];      
          } else {                      this.tickets = response.body.data;
            console.log("11)this.tickets", this.tickets);
            this.ticketlist = alasql('SELECT orgweek, username, count(*) as ticketcount FROM ? '
                +' group by orgweek, username ',[this.tickets]);
               console.log("12)this.ticketlist", this.ticketlist);               
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },   // end of methods
  created() {
    this.getAllData();
  }
});
Vue.component('usersummary', { 
  props: { 
    selected: {type: Array},   // user list
    today: {type: String}    
  },  
  template: `
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
  `,
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
}); 

Vue.component('leaderboard', { 
  template: `
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
  `,
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
});   

Vue.component('gameboard', { 
  template: `
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
  `,
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
});   

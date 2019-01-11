Vue.component('poolusersummary', { 
  template: `
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Pool Summary</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>more_vert</v-icon></v-btn>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="poollist">         
      <template slot="items" slot-scope="props">
        <tr @click="getSelected(props.item)">
          <td class="text-xs-left">{{ props.item.orgweek}}</td>
          <td class="text-xs-left">{{ props.item.pool_id}}</td>
          <td class="text-xs-left">{{ props.item.usercount}}</td>
        </tr>                  
      </template>   
      <template slot="footer">
        <td><strong>click row for details</strong></td>
      </template>              
    </v-data-table>
  </div>
  `,
 data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Pool#', value: 'pool_id' }             
                ,{ text: 'User Count', value: 'usercount' } ],   
      poollist: [],
      tgames: []
    }
  },     
  methods: {
    getSelected(item) {  this.$emit('clicked-childselected', item); },    
    getOrgWeekPool() {
      var result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
          console.log("10) getOrgWeek, this.tgames", this.tgames);
          // to compute usercount, need to create array 1st
          var array        = alasql('SELECT orgweek, pool_id, username FROM ? GROUP BY orgweek, pool_id, username',[this.tgames]);              
          this.poollist    = alasql('SELECT orgweek, pool_id, COUNT(*) AS usercount FROM ? GROUP BY orgweek, pool_id',[array]);
          //this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]);  
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  this.getOrgWeekPool();  }
});
Vue.component('gameusersummary', { 
  template: /* syntax: html */ `
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
  `,
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
    getSelected(item) { this.$emit('clicked-childselected', item); },   
    getOrgWeekGames() {
      var result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
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
});

Vue.component('userticketsummary', { 
  template: `
  <div>
    <v-toolbar dark color="primary">
                  <v-toolbar-side-icon></v-toolbar-side-icon>
                  <v-toolbar-title class="white--text">User Summary</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon><v-icon>more_vert</v-icon></v-btn>
                </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" 
                        :items="userlist">         
                  <template slot="items" slot-scope="props">
                    <tr @click="getSelected(props.item)">
                      <td class="text-xs-left">{{ props.item.orgweek}}</td>
                      <td class="text-xs-left">{{ props.item.username}}
                          <v-icon small>more_horiz</v-icon>
                      </td>
                      <td class="text-xs-left">{{ props.item.ticketcount}}</td>
                    </tr>                  
                  </template>   
                  <template slot="footer">
                    <td colspan="3"><strong>click row for details</strong></td>
                  </template>              
                </v-data-table>
  </div>
  `,
 data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Username', value: 'username' }             
                ,{ text: 'Ticket Count', value: 'ticketcount' } ],   
      userlist: [],
      tgames: [],      
    }
  },     
  methods: {         
    getSelected(item) { this.$emit('clicked-childselected', item); },    
    getOrgWeekUsers() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
            // to compute usercount, need to create array 1st
          var array     = alasql('SELECT orgweek, username, ticket_id FROM ? GROUP BY orgweek, username, ticket_id'
                                ,[this.tgames]);              
          this.userlist = alasql('SELECT orgweek, username, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek, username'
                                ,[array]);
          //this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]); 
        },   response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    this.getOrgWeekUsers();  }
});
Vue.component('userticketsummary2', {    // yet to be completed
  props: { ticketlist: {type: Array} },
  template: `
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">User Ticket Summary</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>more_vert</v-icon></v-btn>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" 
                        :items="ticketlist">         
      <template slot="items" slot-scope="props">
        <tr @click="getSelected(props.item)">
          <td class="text-xs-left">{{ props.item.orgweek}}</td>
          <td class="text-xs-left">{{ props.item.username}}</td>
          <td class="text-xs-left">{{ props.item.ticketcount}}</td>
        </tr>                  
      </template>   
      <template slot="footer">
        <td colspan="3"><strong>click row for details</strong></td>
      </template>              
    </v-data-table>
  </div>
  `,
 data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Username', value: 'username' }             
                ,{ text: 'Ticket Count', value: 'ticketcount' } ],   
      userlist: [],
      tgames: []
    }
  },     
  methods: {
    getSelected(item) { this.$emit('clicked-childselected', item); },    
    getOrgWeekUser() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
            // to compute usercount, need to create array 1st
          var array     = alasql('SELECT orgweek, username, ticket_id FROM ? GROUP BY orgweek, username, ticket_id'
                                ,[this.tgames]);              
          this.userlist = alasql('SELECT orgweek, username, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek, username'
                                ,[array]);
          //this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]);  
        },   response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  this.getOrgWeekUser();  }
});
Vue.component('gameticketsummary', {    // yet to be completed
  props: { ticketlist: {type: Array} },
  template: `
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Game Ticket Summary</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>more_vert</v-icon></v-btn>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" 
                        :items="ticketlist">         
      <template slot="items" slot-scope="props">
        <tr @click="getSelected(props.item)">
          <td class="text-xs-left">{{ props.item.orgweek}}</td>
          <td class="text-xs-left">{{ props.item.game_id}}</td>
          <td class="text-xs-left">{{ props.item.ticketcount}}</td>
        </tr>                  
      </template>   
      <template slot="footer">
        <td colspan="3"><strong>click row for details</strong></td>
      </template>              
    </v-data-table>
  </div>
  `,
 data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Game#', value: 'game_id' }             
                ,{ text: 'Ticket Count', value: 'ticketcount' } ],   
      userlist: [],
      tgames: []
    }
  },     
  methods: {
    getSelected(item) { this.$emit('clicked-childselected', item); },    
    getOrgWeekGame() {
      /*
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
            // to compute usercount, need to create array 1st
          var array     = alasql('SELECT orgweek, username, ticket_id FROM ? GROUP BY orgweek, username, ticket_id'
                                ,[this.tgames]);              
          this.userlist = alasql('SELECT orgweek, username, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek, username'
                                ,[array]);
          //this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]);  
        },   response => { var result = 'Failed to load data to server.';
      });
      */
    },
  },    // end of methods
  created() {  this.getOrgWeekGame();  }
});

Vue.component('poolinfo', {
  props: {  poolData: {type: Object} },
  template: /* syntax: html */ `
  <div>
    <v-card color="blue-grey" dark tile flat>
      <v-toolbar color="pink" dark>
        <v-toolbar-title><slot></slot></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat class="white--text">Sport:{{poolData.organiser}} - {{poolData.round}}</v-btn>            
      </v-toolbar> 
      <v-card-text>
        <v-layout wrap>
          <v-flex xs3><v-text-field label="Entry Cost"   v-model="poolData.entry_cost" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Entry Quorum" v-model="poolData.entry_quorum" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Entrants"     v-model="poolData.entrants" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Pool Prize"   v-model="poolData.pool_prize" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Pool Type"    v-model="poolData.pool_type" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Pool Name"    v-model="poolData.pool_name" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Payout"       v-model="poolData.payout" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Status"       v-model="poolData.status" readonly></v-text-field></v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
  `,
});
Vue.component('gameinfo', {
  props: { gameData: {type: Object } },          
  template: `
  <div>
    <v-toolbar flat color="pink">
      <v-toolbar-title><slot></slot></v-toolbar-title>
    </v-toolbar>
    <div class="container-fluid">
      <h1>{{gameData.orgweek}}</h1>
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4"><strong>Home</strong></div>
            <div class="col-md-4"><strong>Away</strong></div>
            <div class="col-md-4"><p class="text-right"><strong>Team</strong></p></div>
            <div class="col-md-4">{{gameData.home_team}}</div>
            <div class="col-md-4">{{gameData.away_team}}</div>
            <div class="col-md-4"><p class="text-right"><strong>Score</strong></p></div>
            <div class="col-md-4">{{gameData.home_score}}</div>
            <div class="col-md-4">{{gameData.away_score}}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6"><p class="text-right"><strong>Date</strong></p></div>
            <div class="col-md-6">{{gameData.start | moment}}</div>
            <div class="col-md-6"><p class="text-right"><strong>Status</strong></p></div>
            <div class="col-md-6">{{gameData.status}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
});

Vue.component('userinfo2', { 
  props: { userData: {type: Object } },   
  template: /* syntax: html */ `
  <v-card>
    <v-toolbar color="pink" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>search</v-icon></v-btn>
      <v-btn icon><v-icon>check_circle</v-icon></v-btn>
    </v-toolbar>
    <v-tabs v-model="tabs" color="purple" dark slider-color="yellow">
      <v-tab>General</v-tab><v-tab>Betting Records</v-tab><v-tab>Statement of Accounts</v-tab>
      <v-tab-item>
        <div class="container-fluid">
          <h1>Customer Info</h1>
          <div class="row">
            <div class="col-md-4 ">
              <address>
                <strong>Name:</strong><br>
                {{userData.lastname}} {{userData.firstname}}<br>
                Email: {{userData.email}}<br>
                Username: {{userData.username}}<br>
                <strong>Address:</strong><br>      
                {{userData.address1}}<br>
                {{userData.address2}}
              </address>
            </div>                <div class="col-md-4">
              <div class="row">
                <div class="col-md-6"><p class="text-right"><strong>Cash:</strong></p></div>
                <div class="col-md-6">{{ userData.cash }}</div>
                <div class="col-md-6"><p class="text-right"><strong>vCash:</strong></p></div>
                <div class="col-md-6">{{ userData.vcash }}</div>
                <div class="col-md-6"><p class="text-right"><strong>Role:</strong></p></div>
                <div class="col-md-6">{{ userData.role }}</div>
                <div class="col-md-6"><p class="text-right"><strong>Status:</strong></p></div>
                <div class="col-md-6">{{ userData.status}}</div>   <!-- default left align -->
              </div>
            </div>
            <div class="col-md-4">
              <div class="row">
                <div class="col-md-6"><p class="text-right"><strong>Bank Bsb:</strong></p></div>
                <div class="col-md-6">{{ userData.bankbsb }}</div>
                <div class="col-md-6"><p class="text-right"><strong>Bank Account:</strong></p></div>
                <div class="col-md-6">{{ userData.bankaccount }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <v-list subheader three-line>
          <v-subheader>Others</v-subheader>
                    <v-divider></v-divider>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>Bank Info</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">BSB:{{ userData.bankbsb }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Account:{{ userData.bankaccount }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile>  
            <v-list-tile-content>
              <v-list-tile-title>Address</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ userData.address1 }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ userData.address2 }}</v-list-tile-sub-title>
            </v-list-tile-content>  
          </v-list-tile>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <soacomponent :username="userData.username"></soacomponent>
      </v-tab-item>

    </v-tabs>
  </v-card>
  `,
  data() {
    return { 
      tabs: ""
    }
  },  
});

Vue.component('userinfo', { 
  props: { username: {type: String} },
  template: /* syntax: html */ `
  <v-card>
    <v-toolbar color="pink" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Profile:{{username}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>search</v-icon></v-btn>
      <v-btn icon><v-icon>check_circle</v-icon></v-btn>
    </v-toolbar>

    <v-tabs v-model="tabs" color="purple" dark slider-color="yellow">
      <v-tab>General</v-tab><v-tab>Address</v-tab><v-tab>Others</v-tab>
      <v-tab-item>
        <v-list subheader three-line>
          <v-subheader>User Controls</v-subheader>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>email:{{ user.email }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">cash:{{ user.cash }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>vcash:{{ user.vcash }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ user.role }}</v-list-tile-action-text>
              <v-icon color="grey lighten-1">star_border</v-icon>
              <v-icon color="yellow darken-2">star</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile>  
            <v-list-tile-content>
              <v-list-tile-title>full name:{{ user.lastname }} {{ user.lastname }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">Address:{{ user.address1 }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Status:{{ user.status }}</v-list-tile-sub-title>
            </v-list-tile-content>  
          </v-list-tile>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <v-list subheader two-line>
          <v-subheader>Address Controls</v-subheader>     
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Password</v-list-tile-title>
              <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <v-list subheader three-line>
          <v-subheader>Others</v-subheader>
                    <v-divider></v-divider>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>Bank Info</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">BSB:{{ user.bankbsb }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Account:{{ user.bankaccount }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile>  
            <v-list-tile-content>
              <v-list-tile-title>Address</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ user.address1 }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ user.address2 }}</v-list-tile-sub-title>
            </v-list-tile-content>  
          </v-list-tile>
        </v-list>
      </v-tab-item>
    </v-tabs>
  </v-card>
  `,
  data() {
    return { 
      tabs: "",
      user:[] 
    }
  },
  methods: {
    getAllData() {
      console.log("10) getAllData:", this.username);   // orgweek, username    
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserByName", username: this.username };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.user = (response.body === null) ? [] : response.body.data[0]; 
          console.log("13) this.user", this.user);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },      
  },  // end of methods
  created () {
    console.log('1) main.js :created', this.username);
    this.getAllData();
  }
});

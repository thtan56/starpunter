/*   for selected username
  0) sysuser          // user menu
  1) userprofile
  2) entranttable
*/
const sysUser = Vue.component('sysuser', { 
  props: { username: {type: String} },
  template: /* syntax: html */ `
  <div>
    <sysmenu sitename="System Maintenances"></sysmenu>
    <v-container fluid grid-list-lg text-xs-center>
      <v-layout row wrap>
        <v-flex xs3><userinfo :username="username"></userinfo></v-flex>
        <v-flex xs3><entranttable :username="username" 
                                  @clicked-childselected="getTickets"></entranttable></v-flex>
        <v-flex xs6><usertickets  @clicked-child2selected="getTicketGames" 
                                  :selected="selected" :data="ticketlist"></usertickets></v-flex>  
        <v-flex xs7>
          <userticketgames :gameData="gamelist">
            <v-toolbar-title>Ticket Games: {{selected.orgweek}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat>Username:{{selected.username}}</v-btn>
          </userticketgames></v-flex> 
        <v-flex xs5><userjournals :username="username"></userjournals></v-flex> 
      </v-layout>
    </v-container>
  </div>
  `,
  data() {
    return {
      selected: {},
      ticketlist: [],
      gamelist: []
    }
  },
  methods: {
    updateSelected(obj) {
      this.selected = obj;     // from child tgame-list
    },
    getTickets(citem) {
      this.selected = citem;
      console.log("71) getTickets:citem", citem);   // orgweek, username    
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserTickets2", data: citem };   // orgweek, username
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.ticketlist = (response.body === null) ? [] : response.body.data; 
          console.log("73) this.ticketlist", this.ticketlist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
    getTicketGames(c2item) {
      this.selected = c2item;
      console.log("81) getTickets:citem", c2item);   // orgweek, username    
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserTicketGames", data: c2item };   // orgweek, username, ticket#
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data; 
          console.log("73) this.gamelist", this.gamelist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },    
  },
  created () {
    console.log('1) main.js :created');  // cannot have logic here due to async file reading
  }
});

Vue.component('entranttable', { 
  props: { username: {type: String} },
  template: /* syntax: html */ `
  <div>
    <v-card>
      <v-toolbar color="pink" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Entrant:{{username}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon><v-icon>search</v-icon></v-btn>
        <v-btn icon><v-icon>check_circle</v-icon></v-btn>
      </v-toolbar>
      <v-data-table :pagination.sync="pagination" :headers="uheaders" 
                        :items="userlist">         
          <template slot="items" slot-scope="props">
            <tr @click="childSelected(props.item)">
              <td>{{ props.item.orgweek}}</td>
              <td>{{ props.item.username}}</td>
              <td>{{ props.item.ticketcount}}</td>
            </tr>                  
          </template>         
      </v-data-table>
    </v-card>
  </div>
  `,
 data() {
    return {
      dialog: false,
      result: '',   
      utabs: '',
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      uheaders: [ { text: 'Organiser/Round', value: 'orgweek' }     
                ,{ text: '*Username', value: 'username' }
                ,{ text: 'Ticket count', value: 'ticketcount' }  
                ],
      //search: '',      
      selected: {},       
      orgweeklist: [],
      tickets: [], 
      userlist: [],
      poollist: []        
    }
  },
     
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    getPCount(item) {
      var results=this.poollist.filter(pool => pool.orgweek === item.orgweek && pool.username === item.username);
      return (results.length > 0) ? results[0].pcount : "";
    },    
    childSelected(item) {       
      this.selected = item; 
      this.$emit('clicked-childselected', item);
    },    
    filtered_uItems (key) {  // 2) user
      const res = [];
      if (key) { 
        const selectedusers = this.userlist.filter(game => game.orgweek  === key );    // repeat for each orgweek
        return selectedusers; 
      };
      return res
    },
    getUserTickets() {    // no orgweek
      this.result = 'Getting data from server...';
      var postdata = { op: "getUserTickets2b", data: {username: this.username }};
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, username, ticket_id
          this.tickets = (response.body === null) ? [] : response.body.data;                             
          console.log("10) getOrgWeek, this.tickets", this.tickets);             
          this.userlist    = alasql('SELECT orgweek, username, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek, username',[this.tickets]);
          this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[this.tickets]);  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("created-username:", this.username);
    this.getUserTickets();  
  }
});
Vue.component('userjournals', { 
  props: { username: {type: String} },
  template: /* syntax: html */ `
  <div>
    <v-expansion-panel dark>
      <v-expansion-panel-content>
        <div slot="header">My Journals - {{username}}</div>
        <v-card color="purple" tile flat>    
          <v-data-table :pagination.sync="pagination" :headers="headers" :items="requests">         
            <template slot="items" slot-scope="props">
              <td>{{ props.item.created | moment}}</td>
              <td>{{ props.item.description}}</td>
              <td>{{ props.item.cash}}</td>
              <td>{{ props.item.vcash}}</td>                  
            </template>         
          </v-data-table>
        </v-card>          
      </v-expansion-panel-content>
      </v-expansion-panel>
  </div>
  `,
 data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Date', value: 'created' }     
                ,{ text: 'Description', value: 'description' }
                ,{ text: 'Cash', value: 'cash' }  
                ,{ text: 'vCash', value: 'vcash' }  
                ],
      requests: []      
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    getAllData() {   
      var result = 'Getting data from server...';
      var postdata = { op: "getUserRequests", data: {username: this.username, activity: 'all' }};
      this.$http.post('/php/apiRequest.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, username, ticket_id
          this.requests = (response.body === null) ? [] : response.body.data;                             
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    this.getAllData();  
  }
});

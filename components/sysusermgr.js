/*  Components
 1) usertable       : user list
 2) usertickets     : ticket list by user   
 3) userticketgames : ticket games list by user
 4) userweektable    : user ticket count by week (all users)
 4b) entranttable    : ticket count by user
 5) sysuser         : selected user profile
 6) usermanager     : home page
*/
const userManager=Vue.component('usermanager', { 
  template: /* syntax: html */ `
  <div>
    <sysmenu sitename="System Maintenances"></sysmenu>
    <v-container fluid grid-list-lg text-xs-center>
      <v-layout row wrap>
        <v-flex xs8><usertable></usertable></v-flex>
        <v-flex xs4><userweektable @clicked-childselected="getTickets"></userweektable></v-flex>
        <v-flex xs5><usertickets  @clicked-child2selected="getTicketGames" 
                                  :selected="selected" :data="ticketlist"></usertickets></v-flex>  
        <v-flex xs7>
          <userticketgames :gameData="gamelist">
            <v-toolbar-title>Ticket Games: {{selected.orgweek}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat>Username:{{selected.username}}</v-btn>
          </userticketgames></v-flex> 
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

Vue.component('usertickets', { 
  props: { selected: {type: Object },   // orgweek, username
           data: {type: Array }  },     // ticketlist   
  template: /* syntax: html */ `
  <div>
    <v-toolbar flat color="primary">
      <v-toolbar-title>Tickets - {{selected.username}}-{{selected.orgweek}}</v-toolbar-title>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="data">                        
      <template slot="items" slot-scope="props">
        <tr @click="child2Selected(props.item)">
          <td>{{ props.item.ticket_id}} : {{ props.item.pool_id}}/{{ props.item.pool_name}}</td>  
          <td>{{ props.item.entry_cost}}/{{ props.item.gamecount}}</td>
          <td>{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
          <td>{{ props.item.start | moment}} : {{ props.item.end | moment}}</td>
          <td>{{ props.item.total_score}}/{{ props.item.income}}</td>
        </tr>
      </template>           
    </v-data-table>       
  </div>
  `,
  data() {
    return { 
      tickets: [],
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Ticket#/Pool#/Name', value: 'ticket_id' } 
                ,{ text: 'Entry Cost/Game Count', value: 'entry_cost' } 
                ,{ text: 'Pool Prize/Payout', value: 'pool_prize' },
                { text: 'Start/End', value: 'start' }                 
               ,{ text: 'Total Score/Income', value: 'total_score' } ],
      totals: { score: 0, count: 0},                
    }
  },    
  watch: {
    selected (newVal, oldVal)  { 
      this.getUserTickets(); 
    }
  }, 
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    child2Selected(item) {  
      console.log("25) child2Selected", item);     
      this.$emit('clicked-child2selected', item);
    },      
    getUserTickets() {  
      console.log("201) filtered_tItems", this.selected);
      var array = this.selected.orgweek.split(":");
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgRndTickets", 
                     data: {organiser: array[0], round: array[1], username: this.selected.username } };    
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {    
          if (response.body === null) { this.tickets=[];  
          } else {              
            this.tickets = response.body.data;           // A) data 1    
            console.log("203) this.tickets", this.tickets);                             
          };
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  created() {
  }
});  

Vue.component('userticketgames', { 
  props: { gameData: {type: Array }  },     // ticketlist   
  template: /* syntax: html */ `
  <div>
    <v-toolbar flat color="orange lighten-1"><slot></slot></v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="tgheaders" 
                    :items="gameData">                        
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.username}}</td>
        <td class="text-xs-left">{{ props.item.home_team}} vs {{ props.item.away_team}}</td>
        <td>{{ props.item.start | moment}}</td>
        <td>{{ props.item.pool_id}} : {{ props.item.ticket_id}}:{{ props.item.game_id}}</td>              
        <td>{{ props.item.home_score}}/{{ props.item.away_score}}</td>
        <td>{{ props.item.game_winner}}</td>
        <td>{{ props.item.bet_team}}</td>
        <td>{{ props.item.bet_score}}</td>
      </template>
      <template slot="footer">
        <td><strong>Sum</strong></td>
        <td class="text-xs-right">score totals: {{ totals.score }}</td>
        <td class="text-xs-right">count totals: {{ totals.count }}</td>
      </template>            
    </v-data-table>
  </div>
  `,
 data() {
    return {
      pagination: {  rowsPerPage: 10 }, 
      tgheaders: [{ text: 'Username', value: 'username' }
                ,{ text: 'Home/Away Team', value: 'home_team' }
                ,{ text: 'Date', value: 'start' } 
                ,{ text: 'Pool#/Ticket#/Game#', value: 'pool_name' } 
                ,{ text: 'Home/Away Score', value: 'home_score' }  ,{ text: 'Game Winner', value: 'game_winner' }    
                ,{ text: 'Bet Team', value: 'bet_team' }                       
                ,{ text: 'Bet Score', value: 'bet_score' } ],
      totals: { score: 0, count: 0 },
    }
  },    
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
});
Vue.component('userweektable', { 
  template: /* syntax: html */ `
    <v-tabs v-model="utabs" color="purple" dark slider-color="yellow">                              <!-- 1 --->
      <v-tab      v-for="filter in orgweeklist" :key="filter.orgweek">{{ filter.orgweek }}</v-tab>  <!-- 2 -->
      <v-spacer></v-spacer>
      <v-btn flat>Entrants</v-btn>
      <v-tab-item v-for="filter in orgweeklist" :key="filter.orgweek">                   <!-- 3 -->
        <v-data-table :pagination.sync="pagination" :headers="uheaders" 
                        :items="filtered_uItems(filter.orgweek)">         
          <template slot="items" slot-scope="props">
            <tr @click="childSelected(props.item)">
              <td>{{ props.item.orgweek}}</td>
              <td>{{ props.item.username}}</td>
              <td>{{ props.item.ticketcount}}</td>
            </tr>                  
          </template>         
        </v-data-table>
      </v-tab-item>
    </v-tabs>  
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
    getOrgWeekUser() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeekTickets" };    // all
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
    console.log("created");
    this.getOrgWeekUser();  
  }
});
Vue.component('sysmenu', {
  props: { sitename: {type: String } },
  template: /* syntax: html */`
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title"  :to="item.link" router>
          <v-list-tile-action><v-icon>{{ item.icon }}</v-icon></v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark color="cyan">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">{{sitename}}</router-link></v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
    </v-toolbar>
  </div>
  `,
  data: () => { return { drawer: false } },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: 'home', title: 'Home',    link:'/'},
        { icon: 'face', title: 'Sign up', link:'/signup'},
        { icon: 'lock_open', title: 'Sign in', link:'/login'}, 
        { icon: 'lock_open', title: 'User Manager', link:'/usermanager'},
        { icon: 'lock_open', title: 'System Manager', link:'/sysmanager'},
        { icon: 'lock_open', title: 'Pool Manager', link:'/poolmanager'},
        { icon: 'lock_open', title: 'Test1', link:'/test1'},
        { icon: 'lock_open', title: 'Test2', link:'/test2'},      
         ];
      return menuItems;
    },
  },  
});
//================== all users ------------------------
Vue.component('usertable', { 
  template: /* syntax: html */ `
  <div>
    <v-toolbar flat color="pink">
      <v-toolbar-title>Users</v-toolbar-title>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="users">                        
      <template slot="items" slot-scope="props">
        <tr @click="child3Selected(props.item)">
          <td>{{ props.item.username}} / {{ props.item.id}}</td>
          <td>{{ props.item.email}}</td>  
          <td>{{ props.item.bankbsb}} : {{ props.item.bankaccount}}</td>  
          <td>{{ props.item.lastname}} {{ props.item.firstname}}</td>
          <td>{{ props.item.role}}</td>
          <td>{{ props.item.cash}}</td>
          <td>{{ props.item.vcash}}</td>
          <td>{{ props.item.status}}</td>
          <td><v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>    
      </template>      
      <template slot="footer">
        <td colspan=2><strong>click row for user info</strong></td>
      </template>     
    </v-data-table>
    <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
          <v-layout row wrap>              
            <template v-if="editedItem.id > 0">
              <v-flex xs4><v-text-field label="Username" v-model="editedItem.username" readonly></v-text-field></v-flex>
            </template>  
            <template v-else>
              <v-flex xs4><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>
            </template>   
            <v-flex xs4><v-text-field label="Email" v-model="editedItem.email"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Id"    v-model="editedItem.id" readonly></v-text-field></v-flex>  

            <v-flex xs3><v-text-field label="Last Name"  v-model="editedItem.lastname"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="First Name" v-model="editedItem.firstname"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Bank Bsb"   v-model="editedItem.bankbsb"></v-text-field></v-flex>   
            <v-flex xs3><v-text-field label="Bank Account" v-model="editedItem.bankaccount"></v-text-field></v-flex>  
            <v-flex xs3><v-select v-model="editedItem.role" :items="roles" label="Role:"></v-select></v-flex>
            <v-flex xs3><v-text-field label="Cash"   v-model="editedItem.cash"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="V Cash" v-model="editedItem.vcash"></v-text-field></v-flex>  
            <v-flex xs3><v-select v-model="editedItem.status" :items="statuses" label="Status:"></v-select></v-flex>
            </template>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" flat @click.native="close">Cancel</v-btn>
          <v-btn color="white" flat @click.native="save">Save</v-btn>
          <v-spacer></v-spacer>
          Status: {{ result }}
          <span class="badge badge-danger">{{error}}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>             
  </div>
  `,
  data() {
    return { 
      users: [],
      editdialog: false, 
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Username/Id', value: 'username' } 
          ,{ text: 'Email', value: 'email' }      
          ,{ text: 'Bank Bsb/Account', value: 'bankbsb' } 
          ,{ text: 'Name', value: 'lastname' } 
          ,{ text: 'Role', value: 'role' }
          ,{ text: 'Cash', value: 'cash' }                 
          ,{ text: 'Vcash', value: 'vcash' } 
          ,{ text: 'Status', value: 'status' } 
               ],
      editedIndex: -1,
      editedItem: { 
              username: '',email:'', id: ''  ,bankbsb: ''  ,bankaccount:'' ,lastname: '' ,firstname:''
              ,role:''      ,cash: 0   ,vcash: 0, status: ''
              },
      roles: ['customer', 'manager', 'guest'],
      statuses: ['pending', 'active', 'suspend'],
      error: '',
      result: ''                             
    }
  },    
  computed: { 
    pageTitle() { return 'Leadership Result for the week ' + moment().format('W') },  
    formTitle () { return this.editedIndex === -1 ? 'New User' : 'Edit User' },
  },  
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    child3Selected(item) {  
      console.log("35) child3Selected", item);
      this.$router.push({name:'sysuser', params: {username: item.username} });           
      // this.$emit('clicked-child2selected', item);
    },       
    close () { this.editdialog = false;  },    
    closeDialog () {
      console.log('51) closeDialog');
      this.editdialog = false;  
    },
    save: function () {
      if(this.editedItem.username=='' ||  this.editedItem.email==''){
        this.error = 'username and email fields are required';
        return;
      }
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };
      //console.log(JSON.stringify(postdata));
      this.$http.post('/php/apiUser.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          this.result = response.body;
          this.getAllData();                 // refresh datatable      
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ 
      this.editedItem = item;
      this.editdialog=true; 
    },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item?"+item.id);
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('/php/apiUser.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { 
            this.result = response.body;
            this.getAllData();
          }, response => { this.result = 'Failed to delete data.'; }
          );
      }
    },
    getAllData: function () {
      this.result = 'Getting data to server...';
      var postdata = { op: "getUsers" };
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => {
          this.result = '';
          this.users = response.body.data;
          console.log("2) getAllData > this.users");
          console.log(this.users);
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  created() {
    this.getAllData();
  }
}); 

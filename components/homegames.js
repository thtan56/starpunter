const homeGames=Vue.component('homegamelist', {
  props: {
    username: {type: String }, 
    poolData: {type: Object }      // orgweek replaces organiser,round
  },
  template: /* syntax: html */ `
  <v-container fluid grid-list-md>
    <homebars></homebars>
    <!-- == 1a) selected pool info =============================================================================== -->
    <v-layout row wrap>
      <v-flex d-flex xs6><poolinfo :poolData="poolData">Pool# {{poolData.pool_id}} Profile</poolinfo></v-flex>
      <v-flex d-flex xs6><poolentrants :poolData="poolData">
            Entrants/Tickets in pool {{poolData.pool_id}}</poolentrants></v-flex>

      <v-flex d-flex xs8> 
        <gameweekbet :poolData="poolData" @clicked-childselected="getUserGames">
          <v-toolbar-title>{{poolData.orgweek}} Games </v-toolbar-title>
          <v-spacer></v-spacer>
          Pool#{{poolData.pool_id}}
        </gameweekbet></v-flex>

      <v-flex d-flex xs4>
        <v-layout row wrap>
          <v-flex d-flex>
            <poolusergames :poollist="gamelist">
                <v-toolbar-title>My Bets - {{poolData.orgweek}} Games</v-toolbar-title> 
                <v-spacer></v-spacer>
                <v-btn flat>Username:{{username}}</v-btn><v-btn flat>Pool#{{poolData.pool_id}}</v-btn>
            </poolusergames>
          </v-flex>
          <v-flex d-flex><userjournals :username="username"></userjournals></v-flex>
        </v-layout>  
      </v-flex> 
    </v-layout>
  </v-container>
  `,
  data () {
    return {
      valid: false,
      gamelist: []
    }
  },
  methods: {
    getUserGames(c2item) {
      console.log("11) getUserGames", c2item);    // betItem
      var orgweek  = c2item.organiser.concat(":",c2item.round);
      var username = this.$store.state.loginUser.username;
      this.result = 'Getting data from server...'; 
      postdata = { op: "getPoolUserGames", 
                  data: {orgweek: orgweek, username: username, pool_id: c2item.pool_id } };   // orgweek, pid, username
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data;    
          console.log("12) this.gamelist", this.gamelist);                         
        },   response => { this.result = 'Failed to load data to server.';
      });
    }
  },
  created() {
    this.getUserGames(this.poolData);
  }
});

Vue.component('gameweekbet', {
  props: { 
//    poolid: {type: String},    
    poolData: {type: Object }
  },  
  template: /* syntax: html */ `
  <div>  
    <v-toolbar color="primary" dark><slot></slot></v-toolbar>
    <v-layout row wrap> 
      <v-data-table :headers="gheaders" :items="games" :pagination.sync="pagination">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.organiser}}</td>
          <td>{{ props.item.round}}</td>
          <td>{{ props.item.start | moment}}</td>
          <td>{{ props.item.home_team}}</td>
          <td>{{ props.item.away_team}}</td>
          <td><gameusers ref="gameUsers" :poolid="poolData.pool_id" :gameData="props.item" /></td>             
          <td>{{ props.item.status}}</td>
          <td>{{ props.item.id}}</td>
          <td>
            <v-btn small color="blue-grey" class="white--text" @click="betItem(props.item)">Place Bet<v-icon right dark>shopping_cart</v-icon></v-btn>
          </td>
        </template>
      </v-data-table>
    </v-layout>
    <!-- ===============================================================================================  -->
    <v-dialog v-model="placebetdialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Place Bet</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6><v-text-field v-model="bettedItem.home_team" label="home team" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs6><v-text-field v-model="bettedItem.away_team" label="away team" readonly background-color="red"></v-text-field></v-flex>

              <v-flex sm4><v-text-field v-model="bettedItem.bet_date" label="Date" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs2><v-text-field v-model="bettedItem.gid" label="Game#" readonly background-color="red"></v-text-field></v-flex> 
              <v-flex xs2><v-text-field v-model="bettedItem.pool_id" label="Pool#" readonly background-color="red"></v-text-field></v-flex>
            </v-layout>
              <!-- =========================================================== -->
            <v-layout wrap> 
              <v-flex xs12>
                <v-card color="blue darken-1"><v-card-text>
                  <v-layout wrap>
                    <v-flex xs12><v-combobox v-model="bettedItem.tid" :items="mytickets" label="Ticket#:"></v-combobox></v-flex>
                    <v-flex xs12>
                      <v-radio-group v-model="bettedItem.bet_team" column label="Bet:">
                        <v-radio v-for="item in bettedItem.teams" :key="item" :label="item" :value="item"></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs12><v-text-field v-model="bettedItem.bet_amount" label="bet amount"></v-text-field></v-flex>
                  </v-layout>
                </v-card-text></v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="betClose">Cancel</v-btn>
          <v-btn color="black" flat @click.native="betsave">Confirm Bet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- =======================================================================================  -->
    <v-dialog v-model="deletedialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Delete Bet</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6><v-text-field v-model="editedItem.home_team" label="home team" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs6><v-text-field v-model="editedItem.away_team" label="away team" readonly background-color="red"></v-text-field></v-flex>
              <v-flex sm4><v-text-field v-model="displayStart" label="Date" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs2><v-text-field v-model="editedItem.id" label="Game#" readonly background-color="red"></v-text-field></v-flex> 
              <v-flex xs2><v-text-field v-model="editedItem.pool_id" label="Pool#" readonly background-color="red"></v-text-field></v-flex> 
            </v-layout>
              <!-- =========================================================== -->
            <v-layout wrap> 
              <v-flex xs12>
                <v-layout wrap>
                  <v-flex xs4><v-text-field v-model="editedItem.username" label="Username" background-color="green"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field v-model="editedItem.password" label="Password" background-color="green"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field v-model="editedItem.ticket_id" label="ticket#" background-color="green"></v-text-field></v-flex> 
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="close">Cancel</v-btn>
          <v-btn color="black" flat @click.native="confirmDelete">Confirm Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>   
  </div>
  `,
  data () {
    return {
      valid: false,  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 },
      tpagination: {  rowsPerPage: 3 },
      search:'',
      deletedialog: false,
      placebetdialog: false,
      tabs: null,
      editedIndex: -1,
      editedItem: { username: '', organiser: '', round: '',  venue: '', date: '', bet_winner: ''
                    ,home_score: 0, away_score: 0
                    ,odd_date: '', home_odd: 0, away_odd: 0, selected_odd: 1, ticket_id:0
                    ,pool_id: 0, id: 0 },     // id=game#              
      bettedItem: { organiser: '', round: '', start: '', home_team: '', away_team: '', entrants: [], status: '', gid: 0
                   ,bet_team: '', bet_amount: 0, bet_date: ''
                   ,username: '', tid: 0,  pool_id: 0
                   ,home_odd: '', away_odd: '', odd_date: '', remarks: '', teams: '' },
      games:[],
      tickets: [],
      ticket: {},
      mytickets:[],
      gheaders: [ { text: 'Organiser', value: 'organiser' } 
                ,{ text: 'Round', value: 'round' }
                ,{ text: 'Start', value: 'start' }
                ,{ text: 'Home Team', value: 'home_team' }                 
                ,{ text: 'Away Team', value: 'away_team' }
                ,{ text: 'Entrants', value: 'users' }
                ,{ text: 'Status', value: 'status' }
                ,{ text: 'Game#', value: 'id' }],
      organiser: 'NBA',
      round: '',  
    }
  },
  computed: {
    //exceedQuorum() { return this.poolData.entrants+1 > this.poolData.entry_quorum ? true : false; },
    role()         { return this.$store.state.loginUser.role; },
    ticket_id()    { return this.$store.state.loginUser.ticket_id; }, // pass to 
    formTitle ()   { return this.editedIndex === -1 ? 'New Pool' : 'Edit Pool' },
    //pageTitle()    { return this.organiser +' Games for the ' + this.round },
    displayStart: {
      get: function () {
        return moment(this.editedItem.start).format('YYYY/MM/DD');
      }
    },    
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('YYYY/MM/DD');
      }
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: { 
    exceed2Quorum(strQuorum, icount) {
      if (this.game.status == 'closed') { return false };   // closed, cannot take bets
      let regex= /[+]/g;
      let found = strQuorum.match(regex);
      if (found != null) { return true;      // + exist => unlimited
      } else {
        return ( icount == parseInt(strQuorum) ? false : true )   
      }
    },
    //================================================================
    betItem: function(item){    // game
      console.log("301) betItem", item);
      var data = {organiser: this.organiser
                 ,round:    this.round
                 ,pool_id:  this.poolid 
                 ,username: this.$store.state.loginUser.username };  
      console.log("302) data", data);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgRndPlTicketsByUid", 
                      data: {organiser: this.organiser
                             ,round:    this.round
                             ,pool_id:  this.poolid 
                             ,username: this.$store.state.loginUser.username} };       
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            this.mytickets = response.body.data;
            this.bettedItem.tid = this.mytickets[0];   // default
            console.log("41) this.mytickets", this.mytickets);
//-----------------------------------------------
            if (this.mytickets.length===0) {
              swal({
                title: '<strong>Stop! No Ticket found!</strong>',
                type: 'info',
                html: "** You cannot bet **<br>You don't have ticket<br>"
                        + " in this <u>Pool#"+this.poolid+"</u><br>"
                        +"You need to buy a ticket first",
                showCloseButton: true,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
              }); 
            } else {
              this.bettedItem = item;
              this.bettedItem.bet_date = this.displayDate;   // today
              this.bettedItem.gid = item.id;    
              this.bettedItem.pool_id = this.poolid;   
              this.bettedItem.username = this.$store.state.loginUser.username;

              this.bettedItem.teams=[];
              this.bettedItem.teams.push(item.home_team);
              this.bettedItem.teams.push(item.away_team);
              this.bettedItem.bet_team=this.bettedItem.teams[0];    
              this.placebetdialog = true;
            };  
//----------------------------------------------------------
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    deleteUser: function(item){
      const index = this.games.indexOf(item);
      var r = confirm("Are you sure to delete this item ("+item.name+ ":Entry cost="+this.games[index].entry_cost+")?");
      if(r==true) {
        this.games.splice(index, 1);          // remove deleted item  
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('/php/apiGame.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { this.result = response.body;
          },      response => { this.result = 'Failed to delete data.'; }
          );
        }
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.games[this.editedIndex], this.editedItem);     // 1) update datatable
      } else {
        if (this.games === undefined || this.games.length == 0) {
          this.games = []; 
        };   // initialise if null
        this.games.push(this.editedItem);                                // 2) insert new to datatable
      };     
      
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };      
      this.$http.post('/php/apiPoolGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => { 
        }, response => { this.result = 'Failed to save data to server.'; }
        );       
      this.close();
    },

    betsave () {
      console.log("70) betsave", this.bettedItem);
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "saveGame2Ticket", "data": this.bettedItem };      
      this.$http.post('/php/apiTicketGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
           this.getAllData();   // refresh with new username in gamelist (ok since new browser has caching )
           //******************************************************
           this.$emit('clicked-childselected', this.bettedItem);     // reload myBet list
           console.log("71) emit", this.bettedItem);
        }, response => { this.result = 'Failed to save data to server.'; }
        );    
      this.betClose();
    },
    betClose() { this.placebetdialog = false; },
    close() { this.pooldialog = false; },
    getAllData: function () {
      console.log("20) getAllData:"+this.organiser+":"+this.round);
      this.games=[];
      if (this.round !== '') { 
        this.result = 'Getting data from server...'; 
        var postdata = { op: "getOrgRndGames", data: { organiser: this.organiser, round: this.round } };    
        this.$http.post('/php/apiGame.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.games = response.body.data;
                                // this.getPoolUsers();
          },      response => { this.result = 'Failed to load data to server.';
        });
      };
    },
  },
  beforeMount(){
      console.log("1) poolData", this.poolData);
      this.organiser = this.poolData.organiser;
      this.round     = this.poolData.round;
      this.poolid     = this.poolData.pool_id;     
      this.editedItem = this.poolData;      
      this.getAllData();                        // get this.pools
  }
});  
//***************************************************************************
const gameUsers = Vue.component('gameusers', {
  props: { 
    poolid: {type: String}
   ,gameData: {type: Object }     
  },
  template: `
  <div><li v-for="(item, index) in users">{{index+1}}) {{item.username}}</li>
  </div>
  `,
  data () {
    return {
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 4 },
      users: [],
    }
  },
  methods: {
    getGameUsers: function (pid, gid) {
      console.log("11) getGameUsers", pid, gid);
      this.result = 'Getting data from server...';
      var postdata = { op: "getGameUsers", data: {pid: pid, gid: gid} };    // name, date
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            this.users = (response.body === null || response.body === "") 
                            ? [] : response.body.data;  
                              console.log("13) this.users",this.users);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  beforeMount(){ 
    this.getGameUsers(this.poolid, this.gameData.id); }
}); 

Vue.component('poolentrants', {
  props: { 
    poolData: {type: Object}
  },
  template: /* syntax: html */ `
  <div>
    <v-card color="blue-grey" dark tile flat>
      <v-toolbar color="brown" dark>
        <v-toolbar-title><slot></slot></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn small color="blue-grey" class="white--text" @click="buyTicket(poolData)"
            :disabled="!exceedQuorum(poolData.entry_quorum, poolData.entrants)"
          >Buy Pool Ticket
          <v-icon right dark>shopping_cart</v-icon>
        </v-btn>            
      </v-toolbar>     
      <v-data-table :headers="headers" :items="tickets" :pagination.sync="pagination"> 
            <template slot="items" slot-scope="props">
              <tr @click="showAlert(props.item)">
                <td>{{ props.item.organiser}} / {{ props.item.round}}</td>
                <td>{{ props.item.start | moment}} : {{ props.item.end | moment}}
                <td>{{ props.item.pool_id}} / {{ props.item.pool_name}}</td>  
                <td>{{ props.item.username}} / {{ props.item.id}}</td>  <!-- ticket#  -->
                <td>{{ props.item.income}} / {{ props.item.total_score}}</td>
                <td><!-- v-icon small @click="deleteTicket(props.item)">delete</v-icon --></td>
              </tr>
            </template>
      </v-data-table>
    </v-card>
  </div>
  `,
  data () {
    return {
      tickets: [],    
      rowsPerPageItems: [3, 6, 12],
      pagination: {  rowsPerPage: 3 },
      headers:[ { text: 'Organiser/Round', value: 'organiser' } 
                ,{ text: 'Start/End', value: 'start' }
                ,{ text: 'Pool#/Name', value: 'pool_id' }                 
                ,{ text: 'Entrants/Ticket#', value: 'username' }
                ,{ text: 'Income/Score', value: 'income' }],
      editedItem:{},
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    showAlert(item) {
      alert("Click on Game#:"+item.game_id+">Ticket#:"+item.id+">Pool#:"+item.pool_id
        +"<br>no of entrants:"+this.poolData.entrants+">"+this.poolData.entry_quorum
        +"<br>exceeded:"+this.exceeded);
    },  
    exceedQuorum(strQuorum, icount) {
      console.log("101) exceedQuorum", strQuorum, icount);
      if (this.poolData.status == 'closed') { return false };   // closed, cannot buy ticket
      let regex= /[+]/g;
      let found = strQuorum.match(regex);
      if (found != null) { return true;      // + exist => unlimited
      } else {           return ( icount == parseInt(strQuorum) ? false : true )   }
    },    
    buyTicket(item){
      this.editedItem         = item;     // poolData
      this.editedItem.pool_id = item.id; 
      console.log('101) buyTicket > this.editedItem(no cash)', this.editedItem);
      console.log('102) this.editedItem.entry_cost',this.editedItem.entry_cost);
      if ( typeof this.editedItem.entry_cost === "undefined" ) {
        swal({
          title: '<strong>Error! Unknown User!</strong>',
          type: 'info',
          html: '** You need to login to your account **'
                  +'<br>before you can buy a ticket',
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
        });        
      } else if (this.editedItem.entry_cost > this.$store.state.loginUser.vcash) {
        swal({
          title: '<strong>Error! Insufficient fund!</strong>',
          type: 'info',
          html: '** You cannot bought ticket **'
                  +'<br>due to insufficient fund<br>buy additional vcash first<br><br>'
                  +'<table border=1 style="margin: 0px auto;">'
                  +'<tr><th>Pool#</th><th>Type</th><th>Entry Cost</th></tr>'
                  +'<tr><td>'+this.editedItem.pool_id+'</td><td>'
                  + this.editedItem.pool_type+'</td><td>'
                  + this.editedItem.entry_cost+'</td></tr></table>',
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
        });  
      } else {
        // use orgweek to get start and end of week from period
        this.result = 'Getting data from server...'; 
        var postdata = { op: "getOrgWeekPeriod",   
            data: {organiser: this.editedItem.organiser, round: this.editedItem.round} };    
        this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            if (response.body.data.length === 0) {
              this.editedItem.start = "";
              this.editedItem.end ="";
              console.log('103) this.editedItem', this.editedItem);
            } else {
              var start = response.body.data[0].start;
              var end = response.body.data[0].end;
              this.editedItem.start=moment(start).format('YYYY/MM/DD');
              this.editedItem.end=moment(end).format('YYYY/MM/DD');
        //-------------------------------------      
              this.editedItem.username = this.$store.state.loginUser.username;
              this.editedItem.balcash  = this.$store.state.loginUser.cash;
              this.editedItem.balvcash = this.$store.state.loginUser.vcash;
              console.log('104) this.editedItem', this.editedItem);
              this.error = '';
              this.result = 'Saving data to server...';
              var postdata = { "op": "insertUpdate", "data": this.editedItem };    // reduce vcash bal in users table  
              this.$http.post('/php/apiTicket.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
                .then(response => { this.ticket = response.body.data[0];
                                    this.editedItem.id = this.ticket.tid;
                                    this.tickets.push(this.editedItem);     // new
                                    this.updateUserStore(this.editedItem.username);
                }, response => {  this.result = 'Failed to save data to server.'; } 
                );
              this.poolData.entrants++;
              swal({
                title: '<strong>Congratulation!</strong>',
                type: 'info',
                html: '** You have just bought ticket <br>'
                  +'<u>Pool#'+this.editedItem.pool_id+' of type '
                  + this.editedItem.pool_type
                  +'</u><br>Entry cost:<u>'+this.editedItem.entry_cost+'</u>',
                showCloseButton: true,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
              });
              //-------------------------------------      
            };
          },  response => { this.result = 'Failed to load data to server.';
        });
        //-----------------------
      };   // else    
    },
    updateUserStore(username) {
      var postdata = { op: "getUserByName", username: username };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => {
          this.$store.commit('modifyMyRecord', response.body.data[0]);   // update store with new cash, vcash balance
        }, response => { this.result = 'Failed to save data to server.'; 
      });   // http.post 2
    },       
    getAllData: function () {
      console.log("30) getPoolUser from ticket", this.poolData.pool_id, 
        this.poolData.organiser, this.poolData.round);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgRndTicketsByPid", 
                      data: {organiser: this.poolData.organiser
                             ,round:    this.poolData.round
                             ,pool_id:  this.poolData.pool_id} };    
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.tickets = response.body.data;
                              console.log("31) this.tickets", this.tickets);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
      console.log("1) poolData", this.poolData);
      this.organiser = this.poolData.organiser;
      this.round     = this.poolData.round;
      this.editedItem = this.poolData;      
      this.getAllData();                        // get this.pools
  }   
});
//========================================================================    

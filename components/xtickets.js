const buyTicket = Vue.component('ticketbuycomponent', {   // stage 1
  template: `
  <v-content>
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>
        <buyTickets></buyTickets>
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>
`,
});
const placeBet = Vue.component('dragdropcomponent', {      // stage 2 
  template: `
  <v-content>
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>
        <game-draggable></game-draggable>            <!-- in component/servicebet.js (table ticket_games) -->
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>
`,
});
Vue.component('buyTickets', {
  template: /* syntax: html */ `
  <v-container fluid grid-list-md>
  <v-layout column>
      <v-toolbar slot="header" class="mb-2" color="indigo darken-5" dark>
        <v-toolbar-title>Buy Ticket for the </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-select :items="rounds" @change="changeRound" v-model="round"></v-select>   <!-- 1 -->   
          <v-card-title>                                                                <!-- 2 -->
            <v-layout row wrap>
              Organiser:
              <template v-for="org in organisers">
                <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
              </template>
            </v-layout>
          </v-card-title>
          <v-btn flat>V-cash balance:$ {{vcash}}</v-btn>         
        </v-toolbar-items>
      </v-toolbar>
    </v-layout>
    <!--  -->

    <v-data-iterator :items="pools" :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination"
        content-tag="v-layout" row wrap>
      <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg4>    <!-- lg3 = control width -->
        <v-card color='green'>     <!-- 1 box -->
          <v-card-title class="subheading font-weight-bold">
            Entry cost:{{ props.item.entry_cost }}-{{ props.item.organiser }}           
          </v-card-title>
          {{ props.item.round }} : {{ props.item.start | moment}} - {{ props.item.end | moment }}
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Entry Quorum:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.entrants }} / {{ props.item.entry_quorum }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Pool Prize:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.pool_prize }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Payout:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.payout }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Pool Name:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.pool_name }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Pool Type:</v-list-tile-content>            
              <v-list-tile-content class="align-end">{{ props.item.pool_type }}</v-list-tile-content>
            </v-list-tile>  
            <v-list-tile>
              <v-list-tile-content>Pool#:</v-list-tile-content>            
              <v-list-tile-content class="align-end">{{ props.item.id }}</v-list-tile-content>
            </v-list-tile>          
            <!-- ============================================================ 
              disable button         if entrants == 2
              only manager           can edit & delete pool
            -->
            <v-icon :disabled="!exceedQuorum(props.item.entry_quorum, props.item.entrants)"
              small @click="buyItem(props.item)">add_shopping_cart</v-icon>

            <v-icon :disabled="role != 'manager'" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon :disabled="role != 'manager'" small @click="deleteItem(props.item)">delete</v-icon>
          </v-list>
        </v-card>
      </v-flex>

      <v-toolbar slot="footer" class="mt-2" color="indigo" dark dense flat>
        <v-toolbar-title class="subheading">click on shopping cart to 'buy game ticket'</v-toolbar-title>
      </v-toolbar>
    </v-data-iterator>
    <!-- ======================================================== -->
    <v-dialog v-model="editdialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm8><v-text-field v-model="editedItem.pool_name" label="Pool name" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs12 sm4><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red">          </v-text-field></v-flex>
              
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.id" label="Pool id" readonly background-color="red">     </v-text-field></v-flex>
              <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.entrants" label="Entry Count" readonly background-color="red"></v-text-field></v-flex>

              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_cost" label="Entry Cost" background-color="green"
              :disabled="editedItem.id > 0"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.entry_quorum" label="Entry Quorum" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.pool_prize" label="Pool Prize" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.payout" label="Payout" background-color="green"></v-text-field></v-flex>  

              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.odd_date" label="Odd date" background-color="green"></v-text-field></v-flex>

              <v-flex xs12 sm4 md4><v-text-field v-model="editedItem.home_odd" label="Home Odd" background-color="green"></v-text-field></v-flex>
              <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.away_odd" label="Away Odd" background-color="green"></v-text-field></v-flex> 
              <!-- <v-text-field v-model="editedItem.username" label="Username" background-color="green">   -->   
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="close">Cancel</v-btn>
          <v-btn color="black" flat @click.native="save">Save</v-btn>
          <v-btn color="black" flat @click.native="newBet">Bet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>  
  `,
  data () {
    return {
      valid: false,  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 4 },
      editdialog: false,
      placebetdialog: false,

      editedIndex: -1,
      editedItem: { entry_cost: 0, entrants: 0, entry_quorum: 0, pool_prize: 0
        ,payout: '', id: 0,  pool_id: 0, pool_name: '', pool_type: '', start: '', end: ''
        ,username: '' },
      pools: [],
      teams: [],

      organiser: 'NBA',
      username:'thtan56',
      vcash: 0,
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      round: '',
      rounds:[],
    }
  },
  watch: {
    round (newValue) {                // trigger when value change in round
      console.log('201)watch round:'+newValue+'>'+this.organiser);
      this.round=newValue;
      this.getAllData(this.organiser, this.round);
    }
  },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    formTitle () { return this.editedIndex === -1 ? 'New Pool' : 'Edit Pool' },
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('MM/DD/YYYY');
      }
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;           // 1) select organiser
        this.getRounds(this.organiser);            // 2) get rounds & default round
      }
    },
    changeRound(selectObj) {
      this.round = selectObj;           // change round, trigger getGames in watch
    },
    //=================================================================
    exceedQuorum(strQuorum, icount) {
      let regex= /[+]/g;
      let found = strQuorum.match(regex);
      if (found != null) { return true;      // + exist => unlimited
      } else {
        return ( icount == parseInt(strQuorum) ? false : true )   
      }
    },
    editItem: function(item){
      console.log("editItem");
      console.log(item);
      this.editedIndex = this.pools.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editdialog = true; 
    },
    close() {
      this.editdialog = false; 
    },
    buyItem: function(item){
      console.log("1) buyItem");
      // check whether enough vcash to buy ??????????

      this.editedIndex = this.pools.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.pool_id   = item.id;            // item from pool table        

      this.editedItem.id = 0;    // ticket id - insert 2 ticket table
      this.editedItem.username = this.$store.state.loginUser.username;
      console.log(this.editedItem);
      
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };      
      this.$http.post('php/apiTicket.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
        }, response => { this.result = 'Failed to save data to server.'; } 
        );
      // update count
      this.editedItem.id=item.id;    // pool id - update
      postdata = { op: "updateCount", "data": this.editedItem };
      this.$http.post('php/apiPool.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' } })
        .then(response => {
        },    response => { this.result = 'Failed to load data to server.'; }
        );
      // refresh
      this.editedItem.entrants++;
      Object.assign(this.pools[this.editedIndex], this.editedItem); 
      //================================================ 
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
    },
    getRounds: function (organiser) {
      console.log("1) getRounds for "+organiser);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getRounds", organiser: organiser };    
      this.$http.post('php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            var results = response.body.data;
            this.rounds=[];                                          // 1) round list for a organiser
            for (var i=0; i < results.length; i++) {
              this.rounds.push(results[i].round);
            };
            this.round = (results.length > 0) ? this.rounds[0] : ''; // 2) round
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    getAllData: function (organiser, round) {
      console.log("1) getAllData");
      this.result = 'Getting data from server...';
      var postdata = { op: "getPools", data: { organiser: organiser, round: round } };    // name, date
      this.$http.post('php/apiPool.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          this.pools = response.body.data;
          console.log(this.pools);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
    this.vcash    = this.$store.state.loginUser.vcash;
    this.organiser = this.$store.state.sport.organiser;
    this.username = this.$store.state.loginUser.username;
    this.getRounds(this.organiser);   // trigger getGames function (watch)
  }
});      

const ticketStatus = Vue.component('ticketstatuscomponent', {
  template: /* syntax: html */ `
  <v-content>
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>

  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Ticket Management</v-toolbar-title></v-toolbar>
      <v-container fluid grid-list-md>
        <v-flex xs12>
          <v-card dark color="primary">
            <v-card-title>Ticket Status History<v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-card-title>     
            <v-data-table :headers="headers" :items="tickets" :search="search"> 
              <template slot="items" slot-scope="props">                            
                <td class="text-xs-left">{{ props.item.username }}</td>
                <td class="text-xs-left">{{ props.item.organiser }}/{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.start | moment }}-{{ props.item.end | moment }}</td>
                <td class="text-xs-left">{{ props.item.pool_type }} / {{ props.item.pool_id }}</td>
                <td class="text-xs-left">{{ props.item.entry_cost | currency(2) }}</td>
                <td class="text-xs-left">{{ props.item.entry_quorum}} / {{ props.item.entrants}}</td>
                <td class="text-xs-left">{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
                <td class="text-xs-left">{{ props.item.created | moment }}</td>
                <td>{{ props.item.status }} / {{ props.item.id }}</td>
                <td>
                  <template v-if="props.item.status === 'pending'">      
                     <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </template>
                </td>
              </template>
               <template slot="footer">
                <td colspan=2><strong>My Balance</strong></td>
                <td colspan=2>Cash Balance:{{ $store.state.loginUser.cash | currency(2) }}</td>
                <td colspan=2>Virtual Cash Balance:{{ $store.state.loginUser.vcash | currency(2) }}</td>
               </template>
            </v-data-table>    
          </v-card>
        </v-flex>   
      </v-container>
    </v-layout>
  </v-container>    
        
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>              
  `,
  data () {
    return {
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { id: 0, username: '', organiser: '', round: '', start:'', end: ''
          ,pool_type: '', pool_id:'', entry_cost: '', entry_quorum:'', entrants:''
          ,pool_prize: '', payout: '', created: ''
          , id: '', status: '' },
      pagination: {},
      headers: [   
        { text: 'Username', value: 'username'},
        { text: 'Organiser/Round', value: 'organiser'},
        { text: 'Start-End', value: 'start'},        
        { text: 'Pool Type/Id', value: 'pool_type' },
        { text: 'Entry Cost', value: 'entry_cost' },
        { text: 'Quorum/Count', value: 'entry_quorum' },
        { text: 'Prize/Payout', value: 'pool_prize' },
        { text: 'Date', value: 'created' }, 
        { text: 'Status/Id', value: 'status' }      
      ],
      tickets: [],
      search: '',
      username: ''
    }
  },
  filters: {
    moment: function (date) { return moment(date).format('L'); }
  },
  methods: {
    updateUserStore(username) {
      var postdata = { op: "getUserByName", username: username };   
      this.$http.post('php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          this.$store.commit('modifyMyRecord', response.body.data[0] );   // update store with new cash, vcash balance
        }, response => { this.result = 'Failed to save data to server.'; 
      });   // http.post 2
    },   
    deleteItem: function(item){
      this.editedItem               = item;
      this.editedItem.balcash       = this.$store.state.loginUser.cash;
      this.editedItem.balvcash      = this.$store.state.loginUser.vcash;
      console.log("29) deleteItem", this.editedItem);
      var r = confirm("Are you sure to delete this item ("+item.id+':'+item.activity
                +" date:"+item.created+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "deleteUpdate", data: this.editedItem};
        this.$http.post('php/apiTicket.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => {
                                this.updateUserStore(this.editedItem.username);
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      // 1) buy ticket from pools
      // 2) ticket already has user recorded ?????
      this.result = 'Getting data from server...';
      var postdata = { op: "getUserTickets", username: this.username };
      this.$http.post('php/apiTicket.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.tickets = response.body.data;
                              console.log(this.tickets);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){
    console.log("21) beforeMount:");
    this.username = this.$store.state.loginUser.username;
    this.getAllData(); }
  });
//********************************************************
 const betStatus = Vue.component('betstatuscomponent', {   // ticket_games
  template: /* syntax: html */ `
  <v-content>
    <navbars></navbars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>

  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Bet Status/Result(Read Only)</v-toolbar-title></v-toolbar>
      <v-container fluid grid-list-md>
        <v-flex xs12>
          <v-card dark color="primary">
            <v-card-title>Bet Status History<v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-card-title>     
            <v-data-table :headers="headers" :items="tgames" :search="search"> 
              <template slot="items" slot-scope="props">                            
                <td class="text-xs-left">{{ props.item.username }}</td>
                <td class="text-xs-left">{{ props.item.organiser }}/{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.home_team }}/{{ props.item.away_team }}/
                                         {{ props.item.start | moment }}</td>
                <td class="text-xs-left">{{ props.item.bet_team }} / {{ props.item.bet_date | moment }}</td>
                <td class="text-xs-left">{{ props.item.ticket_id }}</td>
                <td>{{ props.item.status }}</td>
                <td>{{ props.item.game_id }}</td>
                <td>{{ props.item.id }}</td>
                <td>
                  <template v-if="props.item.status === 'pending'">      
                     <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </template>
                </td>
              </template>
               <template slot="footer">
                <td colspan=2><strong>My Balance</strong></td>
                <td>Cash Balance:{{ $store.state.loginUser.cash | currency(2) }}</td>
                <td colspan=2>Virtual Cash Balance:{{ $store.state.loginUser.vcash | currency(2) }}</td>
               </template>
            </v-data-table>    
          </v-card>
        </v-flex>   
      </v-container>
    </v-layout>
  </v-container>    
        
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>              
  `,
  data () {
    return {
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { username: '', organiser: '', round: '', home_team: '', away_team: '', bet_team: ''
          ,bet_date: '', start: '', status: '', ticket_id:'', gid: '', id: ''},   // id=game_id, game_date missing
      pagination: {},
      headers: [   
        { text: 'Username', value: 'username'},
        { text: 'Organiser/Round', value: 'organiser'},
        { text: 'Home/Away Team/Date', value: 'home_team'},        
        { text: 'Bet Team/Date', value: 'bet_team' },
        { text: 'Ticket Id', value: 'ticket_id' },
        { text: 'Status', value: 'status' },        
        { text: 'Game Id', value: 'game_id' },  
        { text: 'Id', value: 'id' }      
      ],
      tgames: [],
      search: '',
      username: ''
    }
  },
  filters: {
    moment: function (date) { return moment(date).format('L'); }
  },
  methods: {
    deleteItem: function(item){
      this.editedItem       = item;
      this.editedItem.gid   = item.id;
      this.editedItem.tid   = item.ticket_id;    
      console.log("29) deleteItem", this.editedItem);
      var r = confirm("Are you sure to delete this item ("+item.id+':'+item.ticket_id
        +" game:"+item.home_team + " vs "+ item.away_team+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", data: this.editedItem};
        this.$http.post('php/apiTicketGames.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => {
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      this.result = 'Getting data from server...';
      var postdata = { op: "getTicketGamesByUser", username: this.username };
      this.$http.post('php/apiTicketGames.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.tgames = response.body.data;
                              console.log(this.tgames);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){
    console.log("21) beforeMount:");
    this.username = this.$store.state.loginUser.username;
    this.getAllData(); }
  });
 
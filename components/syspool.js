const poolManager=Vue.component('poolmanager', { 
  template: /* syntax: html */ `
  <div>
    <sysmenu sitename="System Maintenances"></sysmenu>
    <v-container fluid grid-list-lg text-xs-center>
      <v-layout row wrap>
        <v-flex xs6><pooltable></pooltable></v-flex>
        <v-flex xs3><poolweektabs @clicked-childselected="getUsers"></poolweektabs></v-flex>
        <v-flex xs3><poolusertable @clicked-child2selected="getUserGames"
                                    :selected="selected" :data="userlist"></poolusertable></v-flex>
        <v-flex xs12>
          <poolusergames :poollist="gamelist">
            <v-toolbar-title>Games {{selected.orgweek}}
            </v-toolbar-title> 
            <v-spacer></v-spacer>
            <v-btn flat>Username:{{selected.username}}</v-btn>
            <v-btn flat>Pool#{{selected.pool_id}}</v-btn>
          </poolusergames></v-flex>
      </v-layout>
    </v-container>
  </div>
  `,
  data() {
    return {
      selected: {},
      userlist: [],
      gamelist: [],
      tgames: [],  
    }
  },
  methods: {
    getUsers(citem) {
      this.selected = citem;
      console.log("71) getTickets:citem", citem);   // orgweek, pid 
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getPoolGames", data: citem };   // orgweek, pid
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data; 
          this.userlist = alasql('SELECT orgweek, pool_id, username, count(*) as gamecount FROM ? ' 
                            +' where orgweek = ? and pool_id = ? group by orgweek, pool_id, username '
                  ,[this.tgames, citem.orgweek, citem.pool_id]);
          console.log("73) this.userlist", this.userlist);                            
        },   response => { this.result = 'Failed to load data to server.';
      });
    },  
    getUserGames(c2item) {
      this.selected = c2item;
      this.result = 'Getting data from server...'; 
      postdata = { op: "getPoolUserGames", data: c2item };   // orgweek, pid, username
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.gamelist = (response.body === null) ? [] : response.body.data;                             
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
    getAllData() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getPoolUserGames", data: { orgweek: orgweek } };
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {    
            if (response.body === null) { this.pools=[];  
            } else {              
              this.pools = response.body.data;           // A) data 1                            
       console.log("10) getPools, this.pools", this.pools);
       //---------------------------------------   
            };
       },   response => { this.result = 'Failed to load data to server.';
      });
    },
  }
});

Vue.component('pooltable', { 
  template: /* syntax: html */ `
  <div>
    <v-toolbar slot="header" class="mb-2" color="indigo darken-5" dark>
      <v-toolbar-title>Pools</v-toolbar-title>
        <v-btn flat> <v-icon small @click="changeRound(-7)">fast_rewind</v-icon>
          {{ round }}<v-icon small @click="changeRound(7)">fast_forward</v-icon>
        </v-btn>
        <span STYLE="font-size: 10pt">({{pstart | moment }}:{{pend | moment }})</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-card-title>                                                                <!-- 2 -->
          <v-layout row wrap>
            Organiser:
            <template v-for="org in organisers">
              <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
            </template>
          </v-layout>
        </v-card-title>         
      </v-toolbar-items>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="pools">                        
      <template slot="items" slot-scope="props">
        <!-- tr @click="child3Selected(props.item)" -->
          <td>{{ props.item.id}} / {{ props.item.pool_name}}</td>  
          <td>{{ props.item.pool_type}}</td>
          <td>{{ props.item.entry_cost}}</td>
          <td>{{ props.item.entry_quorum}} / {{ props.item.entrants}}</td>
          <td>{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
          <td>{{ props.item.total_collection}}/{{ props.item.total_collection}}</td>
          <td>{{ props.item.status}}</td>         
          <td>{{ props.item.status}}</td>  
          <td><v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
      </template>           
    </v-data-table>
    <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
          <v-layout row wrap>              
            <v-flex xs4><v-text-field label="Organiser" v-model="editedItem.organiser"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Round" v-model="editedItem.round"></v-text-field></v-flex>

            <v-flex xs4><v-text-field label="Pool Name" v-model="editedItem.pool_name"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Pool#"    v-model="editedItem.id" readonly></v-text-field></v-flex>  

            <v-flex xs3><v-text-field label="Pool Type"  v-model="editedItem.pool_type"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Entry Quorum"   v-model="editedItem.entry_quorum"></v-text-field></v-flex>   
            <v-flex xs3><v-text-field label="Entrants" v-model="editedItem.entrants"></v-text-field></v-flex>  
            <v-flex xs3><v-text-field label="Pool Prize"   v-model="editedItem.pool_prize"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>  
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
      pools: [],
      organiser: 'NBA',
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      round: '',
      pstart: '',
      pend: '',
      today: '',
      editdialog: false, 
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Pool# / Name', value: 'id' }      
          ,{ text: 'Pool Type', value: 'pool_type' } 
          ,{ text: 'Entry Cost', value: 'entry_cost' }
          ,{ text: 'Quorum/Entrants', value: 'entry_quorum' }                 
          ,{ text: 'Pool Prize/Payout', value: 'pool_prize' }                 
          ,{ text: 'Total Collection / Payout', value: 'total_collection' } 
          ,{ text: 'Status', value: 'status' }
               ],
      editedIndex: -1,
      editedItem: { 
              organiser: '',round:'', id: ''  ,pool_name: ''  ,pool_type:'' ,entry_cost: '' ,entry_quorum:''
              ,entrants: 0 ,pool_prize:'',payout:'', status: '', total_collection: 0, total_payout: 0
              },
        statuses: ['pending', 'closed'],            
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
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;    // 1) select organiser
        this.getAllData();                    // 2) get rounds & default round
      }
    },  
    //child3Selected(item) {  
    //  console.log("35) child3Selected", item);
    //  this.$router.push({name:'sysuser', params: {username: item.username} });           
      // this.$emit('clicked-child2selected', item);
    //},       
    close () { this.editdialog = false;  },    
    closeDialog () {
      console.log('51) closeDialog');
      this.editdialog = false;  
    },
    save: function () {
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };
      this.$http.post('/php/apiPool.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          this.result = response.body;
          this.close(); 
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
    changeRound(days) {    // prev, next buttons
      let objDate = moment(this.today, 'YYYY/MM/DD').toDate();   // this.today = string
      this.today = moment(objDate).add(days, 'days').format('YYYY/MM/DD');  // moment needs obj
      this.getRound();
    },
    getRound() {
      console.log("11) getRound",this.organiser, this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.today} };    
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
      }).then(response => { 
          if (response.body.data.length === 0) {
                this.round = "";
                this.pstart = "";
                this.pend ="";
                this.games = [];
          } else {
                this.round = response.body.data[0].round;
                this.pstart = response.body.data[0].start;
                this.pend = response.body.data[0].end;
                this.getAllData();  // asyn problem
          };
        },  response => { this.result = 'Failed to load data to server.';
      });
    },
    getAllData: function () {
      console.log("10) getAllData", this.organiser, this.today);
      this.result = 'Getting data to server...';
      var postdata = { op: "getOrgDatePools", data: { organiser: this.organiser, today: this.today } };
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => {
          if (response.body === null) { this.pools=[];  
          } else {              
            this.pools = response.body.data;
          };
          console.log("2) getAllData > this.pools", this.pools);
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  created() {
    this.organiser="NBA";
    this.today = moment().format('YYYY/MM/DD');
    this.getRound();
  }
}); 
Vue.component('poolusertable', { 
  props: { selected: {type: Object },
           data: {type: Array } },
  template: /* syntax: html */ `
  <div>
    <v-toolbar flat color="primary">
      <v-toolbar-title>Users [{{selected.orgweek}} Pool#{{selected.pool_id}}]</v-toolbar-title>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="uheaders" :items="data">                        
      <template slot="items" slot-scope="props">
        <tr @click="childSelected(props.item)">    
          <td>{{ props.item.orgweek}}</td>  
          <td>{{ props.item.pool_id}}</td>  
          <td>{{ props.item.username}} : {{ props.item.gamecount}}</td>
        </tr>
      </template>  
      <template slot="footer">
        <td colspan=2><strong>click row for game info</strong></td>
      </template>          
    </v-data-table> 
 </div>
  `,
 data() {
    return {  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      uheaders: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Pool#', value: 'pool_id' }             
                ,{ text: 'Username/Game Count', value: 'username' }
                ],
      gamelist: []
    }
  },
  methods: {  
    childSelected(item) { 
      console.log("1) poolusertable-getSelected", item);
      this.$emit('clicked-child2selected', item);
    },
  }  
});
Vue.component('poolweektabs', { 
  template: /* syntax: html */ `
  <div>
    <v-tabs v-model="tabs" color="purple" dark slider-color="yellow">                              <!-- 1 --->
      <v-btn flat>Pools</v-btn>
      <v-tab      v-for="filter in orgweeklist" :key="filter.orgweek">{{ filter.orgweek }}</v-tab>  <!-- 2 -->
      <v-spacer></v-spacer>

      <v-tab-item v-for="filter in orgweeklist" :key="filter.orgweek">                   <!-- 3 -->
        <v-data-table :pagination.sync="pagination" :headers="headers" 
                        :items="filtered_pItems(filter.orgweek)">         
          <template slot="items" slot-scope="props">
            <tr @click="getSelected(props.item)">
              <td class="text-xs-left">{{ props.item.orgweek}}</td>
              <td class="text-xs-left">{{ props.item.pool_id}}</td>
              <td class="text-xs-left">{{ props.item.usercount}}</td>
            </tr>                  
          </template>   
          <template slot="footer">
            <td><strong>click row for user info</strong></td>
          </template>              
        </v-data-table>
      </v-tab-item>
    </v-tabs>
  </div>
  `,
 data() {
    return {
      result: '',   
      tabs: '',      
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      headers: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Pool#', value: 'pool_id' }             
                ,{ text: 'User Count', value: 'usercount' }
                ],   
      selected: {},       
      orgweeklist: [],
      poollist: [],
      pools: [],
      tgames: []
    }
  },     
  methods: {
    getSelected(item) {
      console.log("31) getSelected", item);
      this.selected = item; 
      this.$emit('clicked-childselected', item);
    },    
    filtered_pItems (key) {  // 2) user
      const res = [];
      if (key) { 
        const selectedpools = this.poollist.filter(game => game.orgweek  === key );    // repeat for each orgweek
        return selectedpools; 
      };
      return res
    },
    getOrgWeekPool() {
      this.result = 'Getting data from server...'; 
      postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
          console.log("10) getOrgWeek, this.tgames", this.tgames);
          // to compute usercount, need to create array 1st
          var array        = alasql('SELECT orgweek, pool_id, username FROM ? GROUP BY orgweek, pool_id, username',[this.tgames]);              
          this.poollist    = alasql('SELECT orgweek, pool_id, COUNT(*) AS usercount FROM ? GROUP BY orgweek, pool_id',[array]);
          this.orgweeklist = alasql('SELECT orgweek FROM ? GROUP BY orgweek',[array]);  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("created");
    this.getOrgWeekPool();  
  }
});
Vue.component('poolusergames', { 
  props: { poollist: {type: Array } },   // orgweek, username, pool_id
  template: /* syntax: html */ `
  <div>
    <v-toolbar flat color="orange lighten-1"><slot></slot>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="tgheaders" 
                    :items="poollist">                        
      <template slot="items" slot-scope="props"> 
        <td>{{ props.item.game_id}}/{{ props.item.pool_id}}</td>    
        <td class="text-xs-left">{{ props.item.home_team}} vs {{ props.item.away_team}}</td>
        <td>{{ props.item.start | moment}}</td>
        <td>{{ props.item.bet_team}}</td>
        <td>{{ props.item.bet_amount}}</td>
      </template>   
       
    </v-data-table>
  </div>
  `,
  data() {
    return {
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      tgheaders: [ { text: 'Game#/Pool#',    value: 'game_id' }      
               ,{ text: 'Home/Away Team', value: 'home_team' }
               ,{ text: 'Game#/Date', value: 'start' } 
               ,{ text: 'Bet Team', value: 'bet_team' }
               ,{ text: 'Bet Amount', value: 'bet_amount' }
                 ],
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
});

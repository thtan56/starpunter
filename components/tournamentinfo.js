Vue.filter('currency', function(val, dec) { return accounting.formatMoney(val, '$', dec)     });
Vue.filter('number', function(val, dec) { return accounting.formatNumber(val, dec, ',', '.') });

const Breakfast = { template: '<div>Breakfast</div>' }

const daygames = Vue.component('dayGames', {
  props: { 'organiser': {type: String },
           'date'     : {type: String } },
  template: ` 
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-card flat>
        <v-toolbar color="pink" dark><v-toolbar-title>{{ organiser}} Games for that day {{ date }}</v-toolbar-title><v-spacer></v-spacer>
        <v-btn color="info" @click="newGame()">New Game</v-btn></v-toolbar>  
        <v-card-text>   
          <vuetable ref="vuetable" :api-mode="false" :fields="fields"
                :data-total="dataCount" :data-manager="dataManager"
                pagination-path="pagination" :per-page=rows_per_page :css="css.table"
                @vuetable:pagination-data="onPaginationData">


            <template slot="gamename" scope="props">
              <div>{{props.rowData.home_team}} vs {{props.rowData.away_team}}</div>
            </template>     

            <template slot="gamescores" scope="props">
              <div>{{props.rowData.home_score}}:{{props.rowData.away_score}}</div>
            </template>  

            <template slot="actions" slot-scope="props">
              <div class="table-button-container">
                <button class="btn btn-warning" @click="editItem(props.rowData)">
                  <span class="glyphicon glyphicon-pencil"></span> Edit</button>&nbsp;&nbsp;
                <button class="btn btn-danger" @click="deleteRow(props.rowData)">
                  <span class="glyphicon glyphicon-trash"></span> Delete</button>&nbsp;&nbsp;
              </div>
            </template>   
          </vuetable>
          <vuetable-pagination ref="pagination" class="pull-right" 
                @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>      
  `,
  data() { 
    return {
//------------------------------------------
      games: [],           // define in dataManager function (no action required in html)
      rows_per_page: 10,
      fields: [
          {name: 'organiser',sortField: 'organiser'},
          {name: 'weekno',sortField: 'weekno'},
          {name: 'date', sortField: 'date' },
          {name: '__slot:gamename', title: 'Teams' },
          {name: 'round' },
          {name: 'winner' },
          {name: '__slot:gamescores', title: 'Home/Away Score' },
          {name: 'id' },                  
          {name: '__slot:actions',title: 'Actions', titleClass: 'text-center'},
      ],
      dataCount: 0,
      searchFor: "",     
//-----------------------------------------------------
      css: { 
        table: {
          tableClass: "table table-striped table-bordered",
          loadingClass: "loading",
          ascendingIcon: "glyphicon glyphicon-chevron-up",
          descendingIcon: "glyphicon glyphicon-chevron-down",
          handleIcon: "glyphicon glyphicon-menu-hamburger",
          renderIcon: function (classes, options) {
            return '<span class="' + classes.join(' ') + '"></span>'
          }
        }
      },
      //-----------------------------------------
      result: '',
      error: '',
    }
  },
  watch: {
    games (newVal, oldVal)  { this.$refs.vuetable.refresh()},
  },
  created() { 
    this.getAllData();  
  },
  mounted() { this.$refs.vuetable.setData(this.games); },
  methods: {
    //========= A) vuetable 2 routines =======================================================
    onPaginationData(paginationData) { this.$refs.pagination.setPaginationData(paginationData); }, 
    onChangePage(page)               { this.$refs.vuetable.changePage(page); },
    editRow(rowData) {   alert("You clicked edit on" + JSON.stringify(rowData));    },
    deleteRow(rowData) { alert("You clicked delete on" + JSON.stringify(rowData));  },
    dataManager(sortOrder, pagination) {
      let data = this.games;
      if (this.searchFor) {                          // search function (can be generic if search not needed)
        let txt = new RegExp(this.searchFor, "i");
        data = _.filter(data, function(item) {      // pass data record
          return (
            item.name.search(txt) >= 0 ||          // data field 1
            item.organiser.search(txt) >= 0           // data field 2
          );
        });
      };
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        data = _.orderBy(data, sortOrder[0].sortField, sortOrder[0].direction);
      };
      pagination = this.$refs.vuetable.makePagination(data.length);
      return {
        pagination: pagination,
        data: _.slice(data, pagination.from - 1, pagination.to)
      };
    },      // dataManager
    //=============================================================================
    getAllData() {
      console.log("1) getAllData:"+this.organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getDayGames", key: [this.organiser, this.date] };
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.games = response.body.data;
          console.log('91) betNgame > getalldata');
          console.log(this.games);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  }        // methods 
  //==================================================
});  
//****************************************************
const gamesummary = Vue.component('gameSummary', {
  template: ` 
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-card flat>
        <v-toolbar color="pink" dark><v-toolbar-title>Tournament Summary</v-toolbar-title><v-spacer></v-spacer>
        <v-btn color="info" @click="newGame()">New Game</v-btn></v-toolbar>  
        <v-card-text>   
          <vuetable ref="vuetable" :api-mode="false" :fields="fields"
                :data-total="dataCount" :data-manager="dataManager"
                pagination-path="pagination" :per-page=rows_per_page :css="css.table"
                @vuetable:pagination-data="onPaginationData">
            
            <template slot="actions" slot-scope="props">
              <div class="table-button-container">
                <button class="btn btn-warning" @click="editItem(props.rowData)">
                  <span class="glyphicon glyphicon-pencil"></span> Edit</button>&nbsp;&nbsp;
                <button class="btn btn-danger" @click="deleteRow(props.rowData)">
                  <span class="glyphicon glyphicon-trash"></span> Delete</button>&nbsp;&nbsp;
              </div>
            </template>
            
            <template slot="code" slot-scope="props">
              <router-link :to="'/Games/' + props.rowData.organiser +'/'+ props.rowData.date">
                {{ props.rowData.date }}
              </router-link>
            </template>            

          </vuetable>
          <vuetable-pagination ref="pagination" class="pull-right" 
                @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>      
  `,
  data() { 
    return {
//------------------------------------------
      games: [],           // define in dataManager function (no action required in html)
      rows_per_page: 10,
      fields: [
          {name: 'organiser',sortField: 'organiser'},
          {name: 'weekno',sortField: 'weekno'},
          {name: 'date', sortField: 'date' },
          {name: 'round', sortField: 'round' },
          {name: 'gamecount' },
          {name: '__slot:actions',title: 'Actions', titleClass: 'text-center'},
          {name: '__slot:code', title: 'Game of that day' }
      ],
      dataCount: 0,
      searchFor: "",     
//-----------------------------------------------------
      css: { 
        table: {
          tableClass: "table table-striped table-bordered",
          loadingClass: "loading",
          ascendingIcon: "glyphicon glyphicon-chevron-up",
          descendingIcon: "glyphicon glyphicon-chevron-down",
          handleIcon: "glyphicon glyphicon-menu-hamburger",
          renderIcon: function (classes, options) {
            return '<span class="' + classes.join(' ') + '"></span>'
          }
        }
      },
      //-----------------------------------------
      result: '',
      error: '',
    }
  },
  watch: {
    games (newVal, oldVal)  { this.$refs.vuetable.refresh()},
  },
  created() { 
    this.getAllData();  
  },
  mounted() { this.$refs.vuetable.setData(this.games); },
  methods: {
    //========= A) vuetable 2 routines =======================================================
    onPaginationData(paginationData) { this.$refs.pagination.setPaginationData(paginationData); }, 
    onChangePage(page)               { this.$refs.vuetable.changePage(page); },
    editRow(rowData) {   alert("You clicked edit on" + JSON.stringify(rowData));    },
    deleteRow(rowData) { alert("You clicked delete on" + JSON.stringify(rowData));  },
    dataManager(sortOrder, pagination) {
      let data = this.games;
      if (this.searchFor) {                          // search function (can be generic if search not needed)
        let txt = new RegExp(this.searchFor, "i");
        data = _.filter(data, function(item) {      // pass data record
          return (
            item.name.search(txt) >= 0 ||          // data field 1
            item.organiser.search(txt) >= 0           // data field 2
          );
        });
      };
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        data = _.orderBy(data, sortOrder[0].sortField, sortOrder[0].direction);
      };
      pagination = this.$refs.vuetable.makePagination(data.length);
      return {
        pagination: pagination,
        data: _.slice(data, pagination.from - 1, pagination.to)
      };
    },      // dataManager
    //=============================================================================
    getAllData() {
      this.result = 'Getting data from server...';
      var postdata = { op: "getGameSummary" };
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.games = response.body.data;
          console.log('91) betNgame > getalldata');
          console.log(this.games);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  }        // methods 
  //==================================================
});  

const org = Vue.component('nba2Component', {
  props: { 'organiser': {type: String } },
  template: `
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-card flat>
        <v-toolbar color="pink" dark><v-toolbar-title>{{organiser}} Tournament</v-toolbar-title><v-spacer></v-spacer>
        <v-btn color="info" @click="newGame()">New Game</v-btn></v-toolbar>  
        <v-card-text>   
          <vuetable ref="vuetable" :api-mode="false" :fields="fields"
                :data-total="dataCount" :data-manager="dataManager"
                pagination-path="pagination" :per-page=rows_per_page :css="css.table"
                @vuetable:pagination-data="onPaginationData">
            <template slot="actions" slot-scope="props">
              <div class="table-button-container">
                <button class="btn btn-warning" @click="editItem(props.rowData)">
                  <span class="glyphicon glyphicon-pencil"></span> Edit</button>&nbsp;&nbsp;
                <button class="btn btn-danger" @click="deleteRow(props.rowData)">
                  <span class="glyphicon glyphicon-trash"></span> Delete</button>&nbsp;&nbsp;
              </div>
            </template>
          </vuetable>
          <vuetable-pagination ref="pagination" class="pull-right" 
                @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
        </v-card-text>
      </v-card>
    </v-layout>
 <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span><v-spacer></v-spacer>id:{{editedItem.id}}
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>
              <v-flex xs2>
        <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select>
              </v-flex>
              <v-flex xs5><v-combobox v-model="editedItem.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
              <v-flex xs5><v-combobox v-model="editedItem.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
            
              <v-flex xs4><v-text-field label="Venue" v-model="editedItem.venue"></v-text-field></v-flex>
              <v-flex xs4>   
                <!-- =============== date picker ==========================  -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.date">
                  <v-text-field slot="activator" label="Game date" v-model="editedItem.date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedItem.date" no-title scrollable>

                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedItem.date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <!-- --------------------------------------------------------------------------- -->
              </v-flex>    
              <v-flex xs4><v-text-field label="Round" v-model="editedItem.round"></v-text-field></v-flex>

              <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score"></v-text-field></v-flex> 
              <v-flex xs4><v-combobox v-model="editedItem.status" :items="['pending','closed']" label="Status:"></v-combobox></v-flex>
            </v-layout>

            <v-tabs slot="extension" v-model="tabs" color="grey" align-with-title>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs">
              <v-tab-item><v-icon>supervisor_account</v-icon>
                <v-layout wrap>
                  <v-flex xs4><v-text-field label="Winner" v-model="editedItem.winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Pool#" v-model="editedItem.pool_id"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>             
              <v-tab-item><v-icon>waves</v-icon></v-tab-item>
              <v-tab-item>
                <v-icon>motorcycle</v-icon>
                <v-layout wrap>
                  <v-flex xs4><v-text-field label="Winner" v-model="editedItem.winner"></v-text-field></v-flex>          
                </v-layout>
              </v-tab-item>
       
              <v-tab-item>
                <v-icon>attach_money</v-icon>
                <v-layout wrap>
                  <!-- *** administrator area  *** -->
                  <v-flex xs4><v-text-field label="Winner" v-model="editedItem.winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
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
  </v-container>      
  `,
  data() { 
    return {
//------------------------------------------
      games: [],
      rows_per_page: 10,
      fields: ['__handle', '__checkbox', '__sequence',
          {name: 'home_team', sortField: 'home_team', title: '<span class="orange glyphicon glyphicon-user"></span> Home Team'},
          {name: 'away_team', sortField: 'away_team', title: '<span class="orange glyphicon glyphicon-user"></span> Away Team'},

          {name: 'organiser',sortField: 'organiser'},
          {name: 'date',sortField: 'date'},
          {name: 'venue', sortField: 'venue'},
          {name: 'round',sortField: 'round'},
          {name: 'home_score',   sortField: 'home_score'},
          {name: 'away_score',   sortField: 'away_score'},
          {name: '__slot:actions',title: 'Actions', titleClass: 'text-center'}
      ],
      dataCount: 0,
      searchFor: "",     
//-----------------------------------------------------
      css: { 
        table: {
          tableClass: "table table-striped table-bordered",
          loadingClass: "loading",
          ascendingIcon: "glyphicon glyphicon-chevron-up",
          descendingIcon: "glyphicon glyphicon-chevron-down",
          handleIcon: "glyphicon glyphicon-menu-hamburger",
          renderIcon: function (classes, options) {
            return '<span class="' + classes.join(' ') + '"></span>'
          }
        }
      },
      //-----------------------------------------
      editedIndex: -1,
      editedItem: { name: '', organiser: '', venue: '', date: '', home_score: 0, away_score: 0,
              home_team: '', away_team: '', round: '',
              pool_id: 0, username: '', id: 0 },
      editdialog: false,
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      menu: false,
      tabs: null,
      tabItems: ['Head 2 Head', 'Over / Under', 'Standalone', 'Result'],

      teams: [],

      result: '',
      error: '',
    }
  },
  watch: {
    games (newVal, oldVal)  { this.$refs.vuetable.refresh()},
    organiser (newVal, oldVal)  { this.getItems(newVal); }
  },
  created() { this.getItems(this.organiser);  },
  mounted() { this.$refs.vuetable.setData(this.games); },
  computed: {
    formTitle () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
  },
  methods: {
    changeOrganiser(selectObj) {
      this.editedItem.organiser = selectObj;
      this.getTeams(selectObj);
      console.log(this.editedItem.organiser);
    },
    //========= A) vuetable 2 routines =======================================================
    onPaginationData(paginationData) { this.$refs.pagination.setPaginationData(paginationData); }, 
    onChangePage(page)               { this.$refs.vuetable.changePage(page); },
    editRow(rowData) {   alert("You clicked edit on" + JSON.stringify(rowData));    },
    deleteRow(rowData) { alert("You clicked delete on" + JSON.stringify(rowData));  },
    dataManager(sortOrder, pagination) {
      let data = this.games;
      if (this.searchFor) {                          // search function (can be generic if search not needed)
        let txt = new RegExp(this.searchFor, "i");
        data = _.filter(data, function(item) {      // pass data record
          return (
            item.name.search(txt) >= 0 ||          // data field 1
            item.organiser.search(txt) >= 0           // data field 2
          );
        });
      };
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        data = _.orderBy(data, sortOrder[0].sortField, sortOrder[0].direction);
      };
      pagination = this.$refs.vuetable.makePagination(data.length);
      return {
        pagination: pagination,
        data: _.slice(data, pagination.from - 1, pagination.to)
      };
    },      // dataManager
    //=============================================================================
    closeDialog () {
      console.log('51) closeDialog');
//    eventBus.$emit('reloadbettable',this.bettedItem);
//      this.getAllData();     // reload
      this.editdialog = false;  
    },
      newGame () {
        this.editedIndex = -1;
 //       this.editedItem.username = this.$store.state.loginUser.username;
        this.editedItem.id = 0;
        this.editedItem.organiser = '';
        this.editedItem.venue = '';
        this.editedItem.date ='';
        this.editedItem.home_score = 0;
        this.editedItem.away_score = 0;
        this.editedItem.home_team = '';
        this.editedItem.away_team = '';
        this.editedItem.round = '';

        this.editedItem.pool_id = 0;
        this.editdialog = true;  
      },
      editItem: function(item){
        this.editedIndex = this.games.indexOf(item);
        this.editedItem = Object.assign({}, item);

        this.editedItem.organiser = item.organiser;
        this.editedItem.venue = item.venue;
        this.editedItem.date = item.date;

        this.editedItem.home_team = item.home_team;
        this.editedItem.away_team = item.away_team;
        this.editedItem.round     = item.round;
        this.editedItem.home_score = item.home_score;
        this.editedItem.away_score = item.away_score;

        this.editedItem.id = item.id;
        this.editdialog = true;  
        console.log('101) editItem: this.editedItem');
        console.log(this.editedItem);
      },
      deleteItem: function(item){
        var r = confirm("Are you sure to delete this item ("+item.name+ ")?");
        if(r==true) {
          this.result = 'Deleting data to server...';
          var postdata = { op: "delete", id: item.id };
          this.$http.post('php/apiGame.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }})
            .then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
            },      response => { this.result = 'Failed to delete data.'; }
            );
        }
      },
      save() {
        if(this.editedItem.home_team=='' || this.editedItem.away_team=='' 
            || this.editedItem.organiser=='' || this.editedItem.date =='' ){     // mysql name (match) problem 
          this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
          return;
        };

//        if (this.editedIndex > -1) {
//          Object.assign(this.games[this.editedIndex], this.editedItem);
//        } else {
//          this.editedItem.status = 'pending';
//          this.games.push(this.editedItem);     // new
//        };  
        
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.editedItem };
        this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            this.getItems(this.editedItem.organiser);
            this.$refs.vuetable.refresh()
          }, response => { this.result = 'Failed to save data to server.'; }
          );
        this.close();
      },
 //     close () { this.$emit('update:dialog', false) },
    close () {
      this.editdialog = false;
//        this.$emit('close-dialog')
    },
    getTeams(organiser) {
      console.log("11) getTeams-call axios"+organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgTeamNames", id: organiser };
      this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.teams = response.body.data;
          console.log(this.teams);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    getItems(organiser) {
      console.log("11) getItems-call axios"+organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgGames", id: organiser };
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.games = response.body.data;
          console.log('91) betNgame > getalldata');
          console.log(this.games);
        },      response => { this.result = 'Failed to load data to server.';
      });
      this.getTeams(organiser);
    },
  }        // methods 
  //==================================================
});  

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    loginUser: { username: 'thtan99', role: 'guest', email: 'guest@gmail.com' },
    baseUrl: 'http://vueapp.test/database/',
    resultUrl: 'https://www.footywire.com/afl/footy/ft_match_list',
    xchgRate: 2.5 
  },
  mutations: {
    modifyMyRecord (state, newUser) {
        state.loginUser = newUser;
    }
  }
});

const routes = [
  { path: '/login', component: Login },
  { path: '/signup', component: Register },
  { path: '/Breakfast', component: Breakfast },
  { path: '/Summary', component: gamesummary },
  { path: '/Games/:organiser/:date', component: daygames, props: true },  
  { path: '/pools/:gameid', name: "GamePools", component: PoolList, props: true },
  { path: '/organiser/:organiser', component: org, props: true },
  { path: '/calendar/:organiser',  component: gamecalendar, props: true },
  { path: '/calendar', name: "Calendar", component: Calendar },
  { path: '/calendar2/:id', name: "CalendarDetail", component: CalendarDetail, props: true },
  { path: '/calendar2/test', name: "calendarTest", component: CalendarTest },
]

const router = new VueRouter({  routes })

Vue.use(Vuetable);       // vue-table-2

new Vue({
  el: '#app',
  router,
  store,
  props: {  },
  components:{
    'vuetable':Vuetable.Vuetable,
    'vuetable-pagination-info': Vuetable.VuetablePaginationInfo,
    'vuetable-pagination': Vuetable.VuetablePagination,
  },
  data() { 
    return {
      active: null,
    }
  }
});


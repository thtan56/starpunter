Vue.filter('currency', function(val, dec) { return accounting.formatMoney(val, '$', dec)     });
Vue.filter('number', function(val, dec) { return accounting.formatNumber(val, dec, ',', '.') });

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
        <v-card-title><span class="headline">{{formTitle}}</span><v-spacer></v-spacer>id:{{editedgame.id}}
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>
              <v-flex xs2>
        <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedgame.organiser" ></v-select>
              </v-flex>
              <v-flex xs5><v-combobox v-model="editedgame.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
              <v-flex xs5><v-combobox v-model="editedgame.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
            
              <v-flex xs4><v-text-field label="Venue" v-model="editedgame.venue"></v-text-field></v-flex>
              <v-flex xs4>   
                <!-- =============== date picker ==========================  -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedgame.date">
                  <v-text-field slot="activator" label="Game date" v-model="editedgame.date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedgame.date" no-title scrollable>

                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedgame.date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <!-- --------------------------------------------------------------------------- -->
              </v-flex>    

              <v-flex xs4><v-text-field label="Home Score" v-model="editedgame.home_score"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedgame.away_score"></v-text-field></v-flex> 
              <v-flex xs4><v-combobox v-model="editedgame.status" :items="['pending','closed']" label="Status:"></v-combobox></v-flex>
            </v-layout>

            <v-tabs slot="extension" v-model="tabs" color="grey" align-with-title>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs">
              <v-tab-item><v-icon>supervisor_account</v-icon>
                <v-layout wrap>
                  <v-flex xs4><v-text-field label="Winner" v-model="editedgame.winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Pool#" v-model="editedgame.pool_id"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>             
              <v-tab-item><v-icon>waves</v-icon></v-tab-item>
              <v-tab-item>
                <v-icon>motorcycle</v-icon>
                <v-layout wrap>
                  <v-flex xs4><v-text-field label="Winner" v-model="editedgame.winner"></v-text-field></v-flex>          
                </v-layout>
              </v-tab-item>
       
              <v-tab-item>
                <v-icon>attach_money</v-icon>
                <v-layout wrap>
                  <!-- *** administrator area  *** -->
                  <v-flex xs4><v-text-field label="Winner" v-model="editedgame.winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Home Score" v-model="editedgame.home_score"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Away Score" v-model="editedgame.away_score"></v-text-field></v-flex>
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
      editedgame: { name: '', organiser: '', venue: '', date: '', home_score: 0, away_score: 0,
              pool_id: 0, username: '', id: 0 },
      editdialog: false,
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
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
      this.editedgame.organiser = selectObj;
      this.getTeams(selectObj);
      console.log(this.editedgame.organiser);
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
 //       this.editedgame.username = this.$store.state.loginUser.username;
        this.editedgame.id = 0;
        this.editedgame.name = '';
        this.editedgame.organiser = '';
        this.editedgame.venue = '';
        this.editedgame.date ='';
        this.editedgame.home_score = 0;
        this.editedgame.away_score = 0;
        this.editedgame.home_team = '';
        this.editedgame.away_team = '';

        this.editedgame.pool_id = 0;
        this.editdialog = true;  
      },
      editItem: function(item){
        this.editedIndex = this.games.indexOf(item);
        this.editedgame = Object.assign({}, item);

        this.editedgame.name = item.name;
        this.editedgame.organiser = item.organiser;
        this.editedgame.venue = item.venue;
        this.editedgame.date = item.date;

        this.editedgame.home_team = item.home_team;
        this.editedgame.away_team = item.away_team;
        this.editedgame.home_score = item.home_score;
        this.editedgame.away_score = item.away_score;

        this.editedgame.id = item.id;
        this.editdialog = true;  
        console.log('101) editItem: this.editedgame');
        console.log(this.editedgame);
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
        if(this.editedgame.home_team=='' || this.editedgame.away_team=='' 
            || this.editedgame.organiser=='' || this.editedgame.date =='' ){     // mysql name (match) problem 
          this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
          return;
        };
        this.editedgame.name = this.editedgame.home_team + " vs "+this.editedgame.away_team;
        if (this.editedIndex > -1) {
          Object.assign(this.games[this.editedIndex], this.editedgame);
        } else {
          this.editedgame.status = 'pending';
          this.games.push(this.editedgame);     // new
        };  
        
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.editedgame };
        this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
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

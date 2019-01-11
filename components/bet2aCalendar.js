const gamecalendar = Vue.component("gameCalendar", {
  props: { organiser: { type: String } },
  template: ` 
<v-content>
  <v-container fluid grid-list-md>
    <div>
      <v-tabs v-model="active" color="blue" dark slider-color="yellow">

        <v-card color="blue">
          <v-card-text>** Calendar **</v-card-text>
        </v-card>

        <v-tab to="/calendar/NBA">NBA<v-icon>calendar_view_day</v-icon></v-tab>
        <v-tab to="/calendar/NBL">NBL<v-icon>calendar_view_day</v-icon></v-tab>  
        <v-tab to="/calendar/AFL">AFL<v-icon>calendar_view_day</v-icon></v-tab>
        <v-tab to="/calendar/NFL">NFL<v-icon>calendar_view_day</v-icon></v-tab> 
        <v-tab to="/calendar/Asian Games">Asian Games<v-icon>calendar_view_day</v-icon></v-tab>            
      </v-tabs>
    </div>

    <v-data-iterator :items="games"
      :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" content-tag="v-layout" row wrap>
      <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg4>
        <v-card>
          <v-card-title><h4>{{ props.item.date }}({{ props.item.organiser }})</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile v-for="(game, index) in props.item.games" :key="index">
              <v-list-tile-content>{{index+1}} ) {{ game.home_team }} vs {{ game.away_team }} : {{ game.round }} </v-list-tile-content>
              <v-list-tile-content class="align-end">
                
                <v-card-actions>
                  <v-btn flat icon>
                    <v-icon small class="mr-2" @click="editItem(game.game_id)">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon :to="{ name:'GamePools', params: { gameid: game.game_id } }" >
                    <v-icon>shopping_cart</v-icon>
                  </v-btn>
                </v-card-actions>

              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-data-iterator>
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
              <v-flex xs4><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>
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

              <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score"></v-text-field></v-flex> 
              <v-flex xs4><v-combobox v-model="editedItem.status" :items="['pending','closed']" label="Status:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Round" v-model="editedItem.round"></v-text-field></v-flex>

      
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
</v-content>
  `,
  data: () => ({
    rowsPerPageItems: [4, 8, 12, 16],
    pagination: {
      rowsPerPage: 4
    },
    games: [],
    game: [],
    teams: [],
    result: "",
    error: "",
    menu: false,
    tabs: null,
    active: null,

    organisers: ["NBA", "NBL", "NFL", "AFL", "Asian Games"],
    statuses: ["pending", "closed"],
    editedIndex: -1,
    editedItem: {
      name: "",
      organiser: "",
      venue: "",
      date: "",
      status: "",
      home_score: 0,
      away_score: 0,
      status: "",
      round: "",
      pool_id: 0,
      username: "",
      id: 0
    },
    editdialog: false,

    tabItems: ["Head 2 Head", "Over / Under", "Standalone", "Result"]
  }),
  watch: {
    organiser(newVal, oldVal) {
      this.getItems(newVal);
    }
  },
  created() {
    this.getItems(this.organiser);
  },
  computed: {
    formTitle() {
      return this.editedItem.id > 0 ? "Edit Game" : "New Game";
    }
  },
  methods: {
    changeOrganiser(selectObj) {
      this.editedItem.organiser = selectObj;
      this.getTeams(selectObj);
      console.log(this.editedItem.organiser);
    },
    getTeams(organiser) {
      console.log("11) getTeams-call axios" + organiser);
      this.result = "Getting data from server...";
      var postdata = { op: "getOrgTeamNames", id: organiser };
      this.$http
        .post("php/apiTeam.php", JSON.stringify(postdata), {
          headers: { "Content-Type": "application/json" }
        })
        .then(
          response => {
            this.teams = response.body.data;
            console.log(this.teams);
          },
          response => {
            this.result = "Failed to load data to server.";
          }
        );
    },
    editItem(gameid) {
      this.result = "Getting data from server...";
      var postdata = { op: "getGame", id: gameid };
      this.$http
        .post("php/apiGame.php", JSON.stringify(postdata), {
          headers: { "Content-Type": "application/json" }
        })
        .then(
          response => {
            this.game = response.body.data[0]; // only 1 row
            this.editedItem = this.game;
            this.editdialog = true;
          },
          response => {
            this.result = "Failed to load data to server.";
          }
        );
    },
    save() {
      if (
        this.editedItem.home_team == "" ||
        this.editedItem.away_team == "" ||
        this.editedItem.organiser == "" ||
        this.editedItem.date == ""
      ) {
        // mysql name (match) problem
        this.error = "game name, organiser and date fields are required"; // use select `match`, ....
        return;
      }
      this.editedItem.name =
        this.editedItem.home_team + " vs " + this.editedItem.away_team;
      if (this.editedIndex > -1) {
        Object.assign(this.games[this.editedIndex], this.editedItem);
      } else {
        this.editedItem.status = "pending";
        this.games.push(this.editedItem); // new
      }

      this.error = "";
      this.result = "Saving data to server...";
      var postdata = { op: "save", data: this.editedItem };
      this.$http
        .post("php/apiGame.php", postdata, {
          headers: { "Content-Type": "application/json" }
        })
        .then(
          response => {},
          response => {
            this.result = "Failed to save data to server.";
          }
        );
      this.close();
    },
    close() {
      this.editdialog = false;
    },
    getItems(organiser) {
      this.result = "Getting data from server...";
      var postdata = { op: "getOrgJGames", id: organiser };
      this.$http
        .post("php/apiGame.php", JSON.stringify(postdata), {
          headers: { "Content-Type": "application/json" }
        })
        .then(
          response => {
            this.games = response.body.data;
            console.log("11) calendar > getItems");
            console.log(this.games);
          },
          response => {
            this.result = "Failed to load data to server.";
          }
        );
    }
  }
});

//const poolSummary = 
Vue.component('poolComponent', {
  template: `
  <div id="poolTable">
  <v-card>
    <v-card-title>Pool Management<v-spacer></v-spacer>
      <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
      </v-text-field>
    </v-card-title>
    <v-data-table :headers="columns" :items="bets" :search="search"> 
      <template slot="items" slot-scope="props">                            
        <td>{{ props.item.pool_id }}</td><td>{{ props.item.username }}</td><td>{{ props.item.count }}</td>
        <td class="justify-center layout px-0">
             <v-icon small class="mr-2" @click="joinPool(props.item)">edit</v-icon>join
        </td>   
      </template> 
      <template slot="footer">
        <td><strong>Notes:</strong></td>
        <td colspan='2'>3 participants for contest W1P10G3 (week 1, $10 pool, 3-game)<br>
        Each has selected 3 games<br>
        Week 2 has 2 participants who selected 2 games each<br>
        thtan56 can join the contest for W2P10G2
        </td>
        <td>
<!--        <td><enterContest></enterContest></td>  -->
        </td>
      </template> 
    </v-data-table>
 <!-- **************************************** 
      dialog -edit
      ======================================== -->                                  
      <v-toolbar flat color="white">
        <v-dialog v-model="contestdialog" max-width="1000px">
          <v-card dark color="blue-grey">
            <v-card-title><span class="headline">New Bet</span></v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.loginUser.username label="Username" readonly background-color="red"></v-text-field></v-flex>
                  <v-flex xs12 sm6 md6><v-text-field v-model="displayDate" label="Date" readonly background-color="red"></v-text-field></v-flex>
                  <v-flex xs12 sm6 md12><v-text-field v-model="joinedItem.id" label="Pool#" readonly background-color="red"></v-text-field></v-flex>

                  <!-- checkboxes to select required games (2 or 3 games)  -->

                <v-flex xs4>
                  <v-select v-model="joinedItem.organiser" :items="organisers" label="Select your organiser:" @change="change2Organiser" background="green"></v-select>
                </v-flex>
                <v-flex xs4><v-select v-model="joinedItem.home_team" :items="teams" label="Home team:" background="green"></v-select></v-flex>
                <v-flex xs4><v-select v-model="joinedItem.away_team" :items="teams" label="Away team:" background="green"></v-select></v-flex>  
 
 <v-flex xs12>** My Bet History **</v-flex>  
 <v-data-table :headers="headers" :items="pools" v-model="selected" item-key="id" select-all class="elevation-1">
    <template slot="items" slot-scope="props">
      <td><v-checkbox v-model="props.selected" primary hide-details></v-checkbox></td>
      <td>{{ props.item.organiser }}:{{ props.item.home_team }} vs {{ props.item.away_team }}
      </td>
       <td><v-text-field slot="input" v-model="props.item.home_odd" label="home odd"></v-text-field></td>
              <td><v-text-field slot="input" v-model="props.item.away_odd" label="away odd"></v-text-field></td>
       <td><v-text-field slot="input" v-model="props.item.bet_amount" label="bet amount"></v-text-field></td>
    </template>
  </v-data-table>

                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" flat @click.native="close">Cancel</v-btn>
              <v-btn color="black" flat @click.native="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
  </v-card>       
  </div>
  `,
  data () {
    return {
      search: '',
      columns: [ { text: 'Pool#', value: 'pool_id' }, { text: 'Username', value: 'username'}, { text: 'Count', value: 'count'} ],
      bets: [],
      contestdialog: false,
      joinedIndex: -1,
      joinedItem: { pool_id: '', username: '', count: 0, organiser: '' },    
      headers: [ { text: 'organiser', value: 'organiser' } ],
      selected: [],
      pools: [],
      teams: [],
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      organiser: '',
      result: '',
    }
  },
  computed: {
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('MM/DD/YYYY');
      }
    }
  },
  methods: {
    //=============================================================================
    change2Organiser(selectObj) {
      this.joinedItem.organiser = selectObj;
      this.getTeams(selectObj);
    },
    getTeams(organiser) {
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgTeamNames", id: organiser };
      this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.teams = response.body.data;
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    //========================================
    getAllData() {
      let qry = 'database/json_mybet_pools.php';    // summary from bet table
      axios.get(qry)
        .then(response => { 
          this.bets = response.data;
          console.log('1) getAllData-this.bets');
          console.log(this.bets);
        })  
        .catch(error => { console.log(error) });  
    },
    joinPool (item) {
      let qry = 'database/json_basketball_matches.php';   // details from bet_pool
      axios.post(qry, { data: item, op: "getPoolGames" } )
        .then(response => { 
          this.pools = response.data; 
          console.log('1) joinPool-this.pools');
          console.log(this.pools);
//          this.joinedIndex = this.bets.indexOf(item);
  //        this.joinedItem = Object.assign({}, item);
          this.joinedItem = this.pools[0];
          this.joinedItem
          this.contestdialog = true;
        })  
        .catch(error => { console.log(error) }); 
    },
    save () {
      console.log('save');
      console.log(this.selected);   // ok
//      this.boughtItem.uom = 'vcash';
//      this.boughtItem.username = this.$store.state.loginUser.username;
//      this.boughtItem.exchange_rate = this.$store.state.xchgRate;
//      this.boughtItem.uom = 'vcash';
//      let qry = 'database/json_cashflow_post.php';
//      axios.post(qry, { data: this.boughtItem } )
//        .then(response => { 
//        });  
//      console.log('save new bet');
//      console.log(this.boughtItem);
      this.close();
    },
    //----------------------------------------
    close () {
      this.contestdialog = false;
      setTimeout(() => {
        this.joinedItem = Object.assign({}, this.defaultItem);
      }, 300);
    },
  },
  beforeMount() { this.getAllData(); }
});

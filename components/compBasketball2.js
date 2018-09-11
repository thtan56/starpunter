const nbaBet = Vue.component('nbaComponent', {
  template: `
  <v-content>
    <navbars></navbars>
    <h2>Basketball</h2>    
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm4>
          <v-card color="purple" dark>
            <v-card-title primary class="title">My Betting Records</v-card-title>
            <v-card-text><betComponent></betComponent></v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm8>
          <v-card color="blue lighten-2" dark>  <!-- white table (without dark)  -->
            <v-card-title class="title">NBA 2018 Schedule</v-card-title>
            <v-card-text><schComponent organiser="NBA"></schComponent></v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
  `,
});
const nblBet = Vue.component('nblComponent', {
  template: `
  <v-content>
    <navbars></navbars>
    <h2>Basketball</h2>    
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm4>
          <v-card color="purple" dark>
            <v-card-title primary class="title">My Betting Records</v-card-title>
            <v-card-text><betComponent></betComponent></v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm8>
          <v-card color="blue lighten-2" dark>  <!-- white table (without dark)  -->
            <v-card-title class="title">NBL 2018 Schedule</v-card-title>
            <v-card-text><schComponent organiser="NBL"></schComponent></v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
  `,
});

const asiaBet = Vue.component('asiaComponent', {
  template: `
  <v-content>
    <navbars></navbars>
    <h2>Basketball</h2>    
    <v-container fluid grid-list-lg>
      <v-layout row wrap>

        <v-flex d-flex xs12 sm6>
          <v-card color="purple" dark>
            <v-card-title primary class="title">My Betting Records</v-card-title>
            <v-card-text><betComponent></betComponent></v-card-text>
          </v-card>
        </v-flex>
      
        <v-flex d-flex xs12 sm6>
          <v-card color="blue lighten-2" dark>  <!-- white table (without dark)  -->
            <v-card-title class="title">Asia Games 2018 Schedule</v-card-title>
            <v-card-text><schComponent organiser="Asian Games"></schComponent></v-card-text>
          </v-card>
        </v-flex>
      
      </v-layout>
    </v-container>
  </v-content>
  `,
});

const betTable = Vue.component('betComponent', {
  template: `
  <div id="betTable">
    <!-- ========================================= -->
    <!-- 1) new bet dialog  -->
    <!-- ========================================= -->
    <v-dialog v-model="betdialog" max-width="1000px">
      <v-btn slot="activator" color="primary" dark class="mb-2">New Bet</v-btn>
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">My New Bet</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs4><v-text-field label="Game Name" v-model="bettedItem.game_name"></v-text-field></v-flex>
              <v-flex xs4><v-combobox v-model="bettedItem.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Venue" v-model="bettedItem.venue"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Odd" v-model="bettedItem.bet_odd"></v-text-field></v-flex>
              <v-flex xs4>
                <v-text-field v-model=$store.state.loginUser.username label="Username" readonly background-color="red"></v-text-field>
              </v-flex>

              <v-flex xs4>   <!-- date picker -->
                <v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="bettedItem.game_date">
                  <v-text-field slot="activator" label="Game date" v-model="bettedItem.game_date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="bettedItem.game_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu1.save(bettedItem.game_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>    
              <v-flex xs4><v-text-field label="Bet/Pool Amount" v-model="bettedItem.bet_amount"></v-text-field></v-flex>
            </v-layout>
      
        <v-tabs slot="extension" v-model="btabs" color="grey" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="btabs">
          <v-tab-item><v-icon>supervisor_account</v-icon><v-layout wrap>
            <v-flex xs12>
              <v-radio-group v-model="bettedItem.bet_type" row label="bet type:"><v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>

            <v-flex xs4><v-text-field label="Bet Winner" v-model="bettedItem.bet_winner"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Pool#" v-model="bettedItem.pool_id"></v-text-field></v-flex>
          </v-layout>
          </v-tab-item>             
          <v-tab-item><v-icon>waves</v-icon><v-layout wrap>
            <v-flex xs12>
              <v-radio-group v-model="bettedItem.bet_type" row label="bet type:">
                <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm6 md4><v-text-field v-model="bettedItem.bet_score1" label="bet score1" background-color="green"></v-text-field></v-flex>
          </v-layout>
          </v-tab-item>
          <v-tab-item><v-icon>motorcycle</v-icon><v-layout wrap>
            <v-flex xs12>
              <v-radio-group v-model="bettedItem.bet_type" row label="bet type:">
                <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>

            <v-flex xs4><v-text-field label="Bet Winner" v-model="bettedItem.bet_winner"></v-text-field></v-flex>          
            <v-flex xs12 sm6 md4>
              <v-radio-group v-model="bettedItem.bet_odd_type" :mandatory="false" label="odd type: " row>  
                <v-radio label="Win" value="win"></v-radio>
                <v-radio label="Lose" value="lose"></v-radio>
              </v-radio-group>
            </v-flex>            
          </v-layout>
          </v-tab-item>
          <v-tab-item><v-icon>attach_money</v-icon><v-layout wrap>
            <!-- *** administrator area  *** -->
            <v-flex xs4><v-text-field label="Game Winner" v-model="bettedItem.game_winner"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Home Score" v-model="bettedItem.home_score"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Away Score" v-model="bettedItem.away_score"></v-text-field></v-flex>
          </v-layout>
          </v-tab-item>
        </v-tabs-items>
      <!-- ========================================= -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" flat @click.native="bclose">Cancel</v-btn>
          <v-btn color="white" flat @click.native="bsave">Save</v-btn>
          Status: {{ result }}
          <span class="badge badge-danger">{{error}}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>  
    <!-- ============================================= -->
    <!-- 2) my bet datatable  -->
    <!-- ============================================= -->
      <v-btn color="white" flat @click.native="reload">Refresh</v-btn>
    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">
      <v-tab v-for="filter in filterList" :key="filter.game">{{filter.status}}</v-tab>
        <v-tab-item v-for="filter in filterList" :key="filter.status">

          <v-data-table :headers="columns" :items="filteredBets(filter.status)">

            <template slot="items" slot-scope="props">   
              <td class="text-xs-left">{{ props.item.organiser }}</td>   
              <td class="text-xs-left">{{ props.item.game_name }}</td>                             
              <td class="text-xs-left">{{ props.item.game_date | moment }}</td>
              <td class="text-xs-left">{{ props.item.score1 }} - {{ props.item.score2 }}</td>
              <td class="text-xs-left">
                {{ props.item.bet_amount }} - 
                {{ estReturns(props.item.bet_amount, props.item.bet_odd) }}</td>
              <td class="text-xs-left">{{ props.item.bet_score1 }} - {{ props.item.bet_score2 }}</td>
              <td>{{ props.item.bet_type }}-{{ props.item.bet_odd_type }}</td>
              <td>{{ props.item.bet_odd }}</td>
              <td style="display:none;">{{ props.item.id }}</td>
              <template v-if="props.item.status == 'open'">   
                <td class="justify-center layout px-0">
                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>              
              </template >       
            </template>      
          </v-data-table>         
        </v-tab-item>
      </v-tab>
    </v-tabs>
    <!-- **************************************** 
       3) dialog -edit bet
      ======================================== -->                              
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">My Bet - Edit</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
     
      <v-flex xs4><v-text-field label="Game Name" v-model="editedItem.game_name" readonly background-color="red"></v-text-field></v-flex>
      <v-flex xs4><v-text-field label="Organiser" v-model="editedItem.organiser" readonly background-color="red"></v-text-field></v-flex>
      <v-flex xs4><v-text-field label="Venue" v-model="editedItem.venue" readonly background-color="red"></v-text-field></v-flex>
      <v-flex xs4><v-text-field label="Odd" v-model="editedItem.bet_odd"></v-text-field></v-flex>

      <v-flex xs4><v-text-field v-model=$store.state.loginUser.username label="Username" readonly background-color="red"></v-text-field></v-flex>

      <v-flex xs4>   <!-- date picker -->
        <v-menu ref="menu2" lazy :close-on-content-click="false" v-model="menu2" transition="scale-transition" 
                offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.game_date">
          <v-text-field slot="activator" label="Game date" v-model="editedItem.game_date" prepend-icon="event" readonly></v-text-field>
          <v-date-picker v-model="editedItem.game_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu2.save(editedItem.game_date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>    

      <v-flex xs4><v-text-field label="Bet/Pool Amount" v-model="editedItem.bet_amount"></v-text-field></v-flex>
      </v-layout>
      
      <v-tabs slot="extension" v-model="btabs" color="grey" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="btabs">
        <v-tab-item><v-icon>supervisor_account</v-icon>     <!-- head 2 head -->
          <v-layout row wrap> 
            <v-flex xs12>
              <v-radio-group v-model="editedItem.bet_type" row label="bet type:"><v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>

            <v-flex xs4><v-text-field label="Bet Winner" v-model="editedItem.bet_winner"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Pool#" v-model="editedItem.pool_id"></v-text-field></v-flex>
          </v-layout>
        </v-tab-item>             
        <v-tab-item><v-icon>waves</v-icon>                  <!-- over / under -->
          <v-layout row wrap> 
            <v-flex xs12>
              <v-radio-group v-model="editedItem.bet_type" row label="bet type:">
                <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.bet_score1" label="bet score1" background-color="green"></v-text-field></v-flex>

            <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score" readonly background-color="red"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score" readonly background-color="red"></v-text-field></v-flex>
          </v-layout>
        </v-tab-item>
        <v-tab-item><v-icon>motorcycle</v-icon><v-layout row wrap> 
          <v-flex xs12>
            <v-radio-group v-model="editedItem.bet_type" row label="bet type:">
              <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
            </v-radio-group>
          </v-flex>

          <v-flex xs4><v-text-field label="Bet Winner" v-model="editedItem.bet_winner"></v-text-field></v-flex>          
          <v-flex xs12 sm6 md4>
            <v-radio-group v-model="editedItem.bet_odd_type" :mandatory="false" label="odd type: " row>  
              <v-radio label="Win" value="win"></v-radio>
              <v-radio label="Lose" value="lose"></v-radio>
            </v-radio-group>
          </v-flex>
          </v-layout>
        </v-tab-item>
        <v-tab-item><v-icon>attach_money</v-icon>
          <v-layout row wrap> 
            <!-- *** administrator area  *** -->
            <v-flex xs4><v-text-field label="Game Winner" v-model="editedItem.game_winner"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Home Score" v-model="editedItem.home_score"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score"></v-text-field></v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs-items>
      <!-- ========================================= -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="close">Cancel</v-btn>
          <v-btn color="black" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  `,
  data () {
    return {
      tabs: null,
      btabs: null,
      tabItems: ['Head 2 Head', 'Over / Under', 'Standard / Standalone', 'Result'],
      filterList: [
        { status: 'open' },
        { status: 'closed' }
      ],
      columns: [   
        { text: 'Organiser', value: 'organiser' }, 
        { text: 'Name', value: 'name' },  
        { text: 'Date', value: 'date' },    
        { text: 'Scores', value: 'score1' },
        { text: 'Bet/Return', value: 'bet_amount'},
        { text: 'Bet Scores', value: 'bet_score1' },
        { text: 'Bet type', value: 'bet_type' },
        { text: 'Odd', value: 'bet_odd' },
//        { text: 'Id', value: 'id' }            
      ],            
      editdialog: false,
      betdialog: false,

      editedIndex: -1,
      editedItem: { game_name: '', organiser: '', venue: '', game_date: '', game_winner: '', home_score: 0, away_score: 0,
              bet_score1: 0, bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 }, 

      bettedIndex: -1,
      bettedItem: { game_name: '', organiser: '', venue: '', game_date: '', game_winner: '', home_score: 0, away_score: 0,
              bet_score1: 0, bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },   

      bettypes: ['head2head', 'over', 'under', 'standard'],
      usernames: [],
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
      menu1: false,    // new
      menu2: false,     // edit
      error:'',
      result:'',

      mybets: [],
    }
  },
  created () {
    let qry = 'database/json_mybet.php?username=' + this.$store.state.loginUser.username;
    axios.get(qry)
      .then(response => { 
        this.mybets = response.data;
       })  
      .catch(error => { console.log(error) });  
  },
  methods: {
    reload () {    // new bets from schedule components
      let qry = 'database/json_mybet.php?username=' + this.$store.state.loginUser.username;
      axios.get(qry)
        .then(response => { 
          this.mybets = response.data; 
        })  
        .catch(error => { console.log(error) });  
    },
    estReturns(val, odd) { return val * odd },
    filteredBets(key) {             // cannot in computed
      const res = this.mybets
      if (key) { return this.mybets.filter(mybet => mybet.status === key) }
      return res
    },
    editItem (item) {
      this.editedIndex = this.mybets.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editdialog = true;
    },
    deleteItem (item) {
      const index = this.mybets.indexOf(item);
      var r = confirm('Are you sure you want to delete this item (' + this.mybets[index].game_name + ') ?');
      if (r == true) {
        this.mybets.splice(index, 1);          // remove deleted item  
        let qry = 'database/json_mybet_delete.php';
        axios.post(qry, { data: item, op: "delete" } )
          .then(response => { 
          });
      } 
    },
   //------------------------------
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.mybets[this.editedIndex], this.editedItem);
        let qry = 'database/json_mybet_post.php';
        axios.post(qry, { data: this.editedItem } )
        .then(response => { 
        });  
      } else {
        this.mybets.push(this.editedItem);
      }
      this.close();
    },
    bsave() {
      if(this.bettedItem.game_name=='' || this.bettedItem.organiser=='' || this.bettedItem.game_date =='' ){     // mysql name (match) problem 
        this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
        return;
      };
      this.bettedItem.username = this.$store.state.loginUser.username;
      this.bettedItem.status = 'open';

      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.bettedItem };
      this.$http.post('php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
        this.mybets.push(this.bettedItem);       // append to datatable
//          this.result = response.body;
//            this.getMyBetData();                 // refresh datatable
        }, response => { this.result = 'Failed to save data to server.'; }
        );
      this.bclose();
    },
    //----------------------------------------
    close () {
      this.editdialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    bclose () {
      this.betdialog = false;
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format('L');
    }
  }
});

const gameSchedule = Vue.component('schComponent', {
  props:[ 'organiser' ],
  template: `
  <div id='NBAschedule'>
    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
      <v-tab v-for="filter in filterList" :key="filter.status">{{ filter.status }}</v-tab>
      <v-tab-item v-for="filter in filterList" :key="filter.status">
        <v-text-field label="Search" v-model="search" append-icon="search" single-line hide-detail></v-text-field>
        <v-data-table :pagination.sync="pagination" :headers="columns" :items="filtered2Items(filter.status)"
            :search="search">
          <template slot="items" slot-scope="props">                    
                <td style="display:none;">{{ props.item.id }}</td>
                <td style="display:none;">{{ props.item.status }}</td>
                <td style="display:none;">{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.date | moment }}</td>
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.odd }}</td>
                <td class="text-xs-left">{{ props.item.score1 }} - {{ props.item.score2 }}</td>
                <td class="justify-center layout px-0">
                  <v-btn color="blue darken-1" flat @click="betItem(props.item)">place bet</v-btn>
                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
          </template>              
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
             Your search for "{{ search }}" found no results.
          </v-alert> 
        </v-data-table>
      </v-tab-item>   
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <!-- *********************** -->
      <!-- tab 1 (Round/Venue)     -->
      <!-- ======================= --> 
      <v-tab-item>
        <v-toolbar flat color="white">
          <v-toolbar-title><v-icon>pets</v-icon>{{ organiser }} Tournament</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- ***************************************** -->
          <!-  dialog 1 --> edit button ()
          <! ==================================== -->
          <v-dialog v-model="editdialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">New Game</v-btn>
            <v-card>
              <v-card-title><span class="headline">{{ form1Title }}</span></v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.round" label="Round"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.date" label="Date"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.name" label="Home v away teams"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.odd" label="Odd"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.score1" label="score1"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.score2" label="score2"></v-text-field></v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>   
          <!-- ***************************************** -->
          <!-- dialog 2) for 'place bet' button          -->
          <!-- ========================================= -->
          <v-dialog v-model="betdialog" max-width="1000px">
            <v-btn slot="activator" color="primary" dark class="mb-2">New Bet</v-btn>
            <v-card dark color="blue-grey">
              <v-card-title><span class="headline">{{ form2Title }}</span></v-card-title>
              <v-card-text>
                <v-container grid-list-md>
 
            <v-layout wrap>
              <v-flex xs4><v-text-field label="Game Name" v-model="bettedItem.game_name"></v-text-field></v-flex>
              <v-flex xs4><v-combobox v-model="bettedItem.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Venue" v-model="bettedItem.venue"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Odd" v-model="bettedItem.bet_odd"></v-text-field></v-flex>
              <v-flex xs4>
                <v-text-field v-model=$store.state.loginUser.username label="Username" readonly background-color="red"></v-text-field>
              </v-flex>

              <v-flex xs4>   <!-- date picker -->
                <v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="bettedItem.game_date">
                  <v-text-field slot="activator" label="Game date" v-model="bettedItem.game_date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="bettedItem.game_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu1.save(bettedItem.game_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>    
              <v-flex xs4><v-text-field label="Bet/Pool Amount" v-model="bettedItem.bet_amount"></v-text-field></v-flex>
            </v-layout>
      
        <v-tabs slot="extension" v-model="btabs" color="grey" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="btabs">
          <v-tab-item><v-icon>supervisor_account</v-icon><v-layout wrap>
            <v-flex xs12>
              <v-radio-group v-model="bettedItem.bet_type" row label="bet type:"><v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>

            <v-flex xs4><v-text-field label="Bet Winner" v-model="bettedItem.bet_winner"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Pool#" v-model="bettedItem.pool_id"></v-text-field></v-flex>
          </v-layout>
          </v-tab-item>             
          <v-tab-item><v-icon>waves</v-icon><v-layout wrap>
            <v-flex xs12>
              <v-radio-group v-model="bettedItem.bet_type" row label="bet type:">
                <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm6 md4><v-text-field v-model="bettedItem.bet_score1" label="bet score1" background-color="green"></v-text-field></v-flex>
          </v-layout>
          </v-tab-item>
          <v-tab-item><v-icon>motorcycle</v-icon><v-layout wrap>
            <v-flex xs12>
              <v-radio-group v-model="bettedItem.bet_type" row label="bet type:">
                <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-flex>

            <v-flex xs4><v-text-field label="Bet Winner" v-model="bettedItem.bet_winner"></v-text-field></v-flex>          
            <v-flex xs12 sm6 md4>
              <v-radio-group v-model="bettedItem.bet_odd_type" :mandatory="false" label="odd type: " row>  
                <v-radio label="Win" value="win"></v-radio>
                <v-radio label="Lose" value="lose"></v-radio>
              </v-radio-group>
            </v-flex>            
          </v-layout>
          </v-tab-item>
          <v-tab-item><v-icon>attach_money</v-icon><v-layout wrap>
            <!-- *** administrator area  *** -->
            <v-flex xs4><v-text-field label="Game Winner" v-model="bettedItem.game_winner"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Home Score" v-model="bettedItem.home_score"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Away Score" v-model="editedItem.away_score"></v-text-field></v-flex>
          </v-layout>
          </v-tab-item>
        </v-tabs-items>
      <!-- ========================================= -->               
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="white" flat @click.native="betclose">Cancel</v-btn>
                <v-btn color="white" flat @click.native="bet2save">Save</v-btn>
                Status: {{ result }}
                <span class="badge badge-danger">{{error}}</span>
              </v-card-actions>
            </v-card>
          </v-dialog>  
          <!-- ***************************************** -->
        </v-toolbar>     
      </v-tab-item>      
    </v-tabs-items>
  </div>
  `,
  data () {
    return {
//      items: [ 'User', 'Product', 'videos', 'images', 'news'],
      users: [],
      isActive: false, 
      search: '',
      tabs: null,

      filterList: [
        { status: 'open' },
        { status: 'closed' }
      ],
      games: [],
      mybets: [],
      columns: [
        { text: 'Date', value: 'date' },
        { text: 'name', value: 'name' },        
        { text: 'Odd', value: 'odd' },
        { text: 'Scores', value: 'score1' }
      ],
      
      btabs: null,
      tabItems: ['Head 2 Head', 'Over / Under', 'Standard / Standalone', 'Result'],

      editdialog: false,
      editedIndex: -1,
      editedItem: { game_name: '', organiser: '', venue: '', game_date: '', game_winner: '', bet_score1: 0,
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },  
      
      betdialog: false,
      bettedIndex: -1,
      bettedItem: { game_name: '', organiser: '', venue: '', game_date: '', game_winner: '', bet_score1: 0,
              bet_odd: 0, bet_type: '', pool_id: 0, username: '', bet_winner: '', bet_amount: 0, id: 0 },  
      bettypes: ['head2head', 'over', 'under', 'standard'],
      usernames: [],
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
      menu1: false,    // new
      error:'',
      result:'',

      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 0
      }      
    };
  },
  computed: {
    form1Title () { return this.editedIndex === -1 ? 'New Game' : 'Edit Game' },
    form2Title () { return "Place Bet"; },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0;
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    }
  },
  watch: {
    editdialog (val) { val || this.close() },
    betdialog (val) { val || this.close() }
  },
  created () {
    let qry = 'database/json_basketball.php?organiser=' + this.organiser;
    axios.get(qry)
      .then(response => { 
        this.games = response.data;                       // 1) data table
        let obj1 = _.countBy(this.games, 'round');   // 2) list of round
        let obj2 = _.countBy(this.games, 'venue');
        this.roundList = [''];  // dummy
        this.venueList = [''];  // dummy 
        for (let [key, value] of Object.entries(obj1)) { this.roundList.push(key) }
        for (let [key, value] of Object.entries(obj2)) { this.venueList.push(key) }
        this.venueList.sort();
      })  
      .catch(error => { console.log(error) });
    //===============================================    
  },
  mounted() { this.isActive = this.selected; },

  methods: {
    filtered2Items (key) {
      const res = this.games
      if (key) { 
        if (key === 'Search') { return res };
        return this.games.filter(game => game.status === key) 
      };
      return res
    },
    after1selection (item) { this.$nextTick(() => { this.gameVenue = null }) },  // clear opposite select
    after2selection (item) { this.$nextTick(() => { this.gameRound = null }) },
    // -------------------
    editItem (item) {
      this.editedIndex = this.games.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editdialog = true;
    },
    betItem (item) {
      this.bettedIndex = this.games.indexOf(item);
      this.bettedItem = Object.assign({}, item);
      this.bettedItem.game_name = item.name;
      this.bettedItem.game_date = item.date;
      this.bettedItem.bet_odd = item.odd;

      this.betdialog = true;
    },
    //-------------------   
    deleteItem (item) {
      const index = this.games.indexOf(item);
      confirm('Are you sure you want to delete this item (' + this.games[index].name + ') ?') && this.games.splice(index, 1);
    },
    deleteBetItem (item) {
      const index = this.games.indexOf(item);
      confirm('Are you sure you want to delete this bet item (' + this.games[index].name + ') ?') && this.games.splice(index, 1);
    },
    //------------------------------
    save () {
      console.log('editsave');
      if (this.editedIndex > -1) {
        Object.assign(this.games[this.editedIndex], this.editedItem);

        let qry = 'database/json_basketball_post.php';
        axios.post(qry, { data: this.editedItem } )
          .then(response => { });
      } else {
        this.games.push(this.editedItem);
      }
      this.close();
    },
    bet2save() {
      if(this.bettedItem.game_name=='' || this.bettedItem.organiser=='' || this.bettedItem.game_date =='' ){     // mysql name (match) problem 
        this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
        return;
      };
      this.bettedItem.id = 0;    // insert (no editing in game schedule componenent)
      this.bettedItem.username = this.$store.state.loginUser.username;
      this.bettedItem.status = 'open';

      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.bettedItem };
      this.$http.post('php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
        this.mybets.push(this.bettedItem);       // append to datatable
//          this.result = response.body;
//            this.getMyBetData();                 // refresh datatable
        }, response => { this.result = 'Failed to save data to server.'; }
        );
      this.betclose();
    },
    //----------------------------------------
    close () {
      this.editdialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    betclose () {
      this.betdialog = false;
      setTimeout(() => {
        this.bettedItem = Object.assign({}, this.defaultItem);
        this.bettedIndex = -1;
      }, 300);
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).format('L');
    }
  }
});

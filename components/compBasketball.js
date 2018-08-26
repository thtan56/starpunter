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
            <v-card-text><btComponent></btComponent></v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm8>
          <v-card color="blue lighten-2" dark>  <!-- white table (without dark)  -->
            <v-card-title class="title">NBA 2018 Schedule</v-card-title>
            <v-card-text><schComponent gametype="NBA 2018"></schComponent></v-card-text>
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
            <v-card-text><btComponent></btComponent></v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm8>
          <v-card color="blue lighten-2" dark>  <!-- white table (without dark)  -->
            <v-card-title class="title">NBL 2018 Schedule</v-card-title>
            <v-card-text><schComponent gametype="NBL 2018"></schComponent></v-card-text>
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
            <v-card-text><btComponent></btComponent></v-card-text>
          </v-card>
        </v-flex>
      
        <v-flex d-flex xs12 sm6>
          <v-card color="blue lighten-2" dark>  <!-- white table (without dark)  -->
            <v-card-title class="title">Asia Games 2018 Schedule</v-card-title>
            <v-card-text><schComponent gametype="Asian Games 2018"></schComponent></v-card-text>
          </v-card>
        </v-flex>
      
      </v-layout>
    </v-container>
  </v-content>
  `,
});

const betTable = Vue.component('btComponent', {
  template: `
  <div id="betTable">
  <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">
    <v-tab v-for="filter in filterList" :key="filter.game">{{filter.status}}</v-tab>
      <v-tab-item v-for="filter in filterList" :key="filter.status">

          <v-data-table :headers="columns" :items="filteredBets(filter.status)">
            <template slot="items" slot-scope="props">   
              <td class="text-xs-left">{{ props.item.game }}</td>   
              <td class="text-xs-left">{{ props.item.match }}</td>                             
              <td class="text-xs-left">{{ props.item.date | moment }}</td>
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
      dialog -edit
      ======================================== -->                                  
  <v-tabs-items v-model="tabs">
    <v-tab-item>
      <v-toolbar flat color="white">
        <v-dialog v-model="editdialog" max-width="500px">
          <v-card dark color="blue-grey">
            <v-card-title><span class="headline">My Bets</span></v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12><v-text-field v-model="editedItem.match" label="Home v away teams" readonly background-color="red"></v-text-field></v-flex>
                  <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>
                  <v-flex xs12 sm6 md6><v-text-field v-model="editedItem.bet_odd" label="Bet Odd" readonly background-color="red"></v-text-field></v-flex>

                  <v-flex xs12 sm6 md4>
                    Odd type:
                    <v-radio-group v-model="editedItem.bet_odd_type" :mandatory="false">
                      <v-radio label="Win" value="win"></v-radio>
                      <v-radio label="Lose" value="lose"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    Bet type:
                    <v-radio-group v-model="editedItem.bet_type" :mandatory="false">
                      <v-radio label="Over" value="over"></v-radio>
                      <v-radio label="Under" value="under"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.bet_score1" label="bet score1" background-color="green"></v-text-field></v-flex>
                  <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.bet_amount" label="bet amount" background-color="green"></v-text-field></v-flex>
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
    </v-tab-item>
  </v-tabs-items>

  </div>
  `,
  data () {
    return {
      tabs: null,
      filterList: [
        { status: 'open' },
        { status: 'closed' }
      ],
      columns: [   
        { text: 'Game', value: 'game' }, 
        { text: 'Match', value: 'match' },  
        { text: 'Date', value: 'date' },    
        { text: 'Scores', value: 'score1' },
        { text: 'Bet/Return', value: 'bet_amount'},
        { text: 'Bet Scores', value: 'bet_score1' },
        { text: 'Bet type', value: 'bet_type' },
        { text: 'Odd', value: 'bet_odd' },
//        { text: 'Id', value: 'id' }            
      ],            
      editdialog: false,
      editedIndex: -1,
      editedItem: { date: '', match: '', bet_score1: '', bet_score2: '' },
      mybets: [],
    }
  },
  created () {
    let qry = 'database/json_mybet.php?username=' + this.$store.state.loginUser.username;
    axios.get(qry)
      .then(response => { this.mybets = response.data; })  
      .catch(error => { console.log(error) });  
  },
  methods: {
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
        //------------------------------
    save () {
      console.log('save');
      if (this.editedIndex > -1) {
        console.log('save edit bet');
        console.log(this.editedIndex);
        console.log(this.editedItem);
        Object.assign(this.mybets[this.editedIndex], this.editedItem);

        let qry = 'database/json_post_mybet.php';
        axios.post(qry, { data: this.editedItem } )
        .then(response => { 
        });  
      } else {
        console.log('save new bet');
        console.log(this.editedItem);
        this.mybets.push(this.editedItem);
      }
      this.close();
    },
    //----------------------------------------
    close () {
      this.editdialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format('L');
    }
  }
});

const gameSchedule = Vue.component('schComponent', {
  props:[ 'gametype' ],
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
                <td class="text-xs-left">{{ props.item.match }}</td>
                <td class="text-xs-left">{{ props.item.venue }}</td>
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
          <v-toolbar-title><v-icon>pets</v-icon>{{ gametype }} Tournament</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- ***************************************** -->
          <!-  dialog 1 --> edit button ()
          <! ==================================== -->
          <v-dialog v-model="editdialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
            <v-card>
              <v-card-title><span class="headline">{{ form1Title }}</span></v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.round" label="Round"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.date" label="Date"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.match" label="Home v away teams"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.venue" label="Venue"></v-text-field></v-flex>
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
          <v-dialog v-model="betdialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">New Bet</v-btn>
            <v-card dark color="blue-grey">
              <v-card-title><span class="headline">{{ form2Title }}</span></v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>

                    <v-flex xs12 sm6 md6><v-text-field v-model="bettedItem.round" label="Round" readonly background-color="red"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md6><v-text-field v-model="bettedItem.date" label="Date" readonly background-color="red"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md12><v-text-field v-model="bettedItem.match" label="Home v away teams" readonly background-color="red"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md12><v-text-field v-model="bettedItem.venue" label="Venue" readonly background-color="red"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md6><v-text-field v-model="bettedItem.bet_score1" label="score1" background-color="green"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md6><v-text-field v-model="bettedItem.bet_score2" label="score2" background-color="green"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md6><v-text-field v-model="bettedItem.bet_amount" label="bet amount($)" background-color="green"></v-text-field></v-flex>
                
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="black" flat @click.native="betclose">Cancel</v-btn>
                <v-btn color="black" flat @click.native="save">Save</v-btn>
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
//      gameRound: null,      // selected
//      gameVenue: null,      
//      roundList: [],
//      venueList: [],
//        { text: 'Id', value: 'id' },        
//        { text: 'Status', value: 'status' },
//        { text: 'Round', value: 'round' },
      filterList: [
        { status: 'open' },
        { status: 'closed' }
      ],
      games: [],
      mybets: [],
      columns: [
        { text: 'Date', value: 'date' },
        { text: 'Match', value: 'match' },        
        { text: 'Venue', value: 'venue' },
        { text: 'Scores', value: 'score1' }
      ],
      
      editdialog: false,
      editedIndex: -1,
      editedItem: { round: '', date: '', match: '', venue: '', score1: '', score2: '' },
      
      betdialog: false,
      bettedIndex: -1,
      bettedItem: { round: '', date: '', match: '', venue: '', score1: '', score2: '', 
        bet_amount: '', bet_score1: '', bet_score2: ''},

      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 0
      }      
    };
  },
  computed: {
    form1Title () { return this.editedIndex === -1 ? 'New Item' : 'Edit Item' },
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
    console.log('1) compBasketball: created:'+this.$store.state.loginUser.username);
    console.log('2) this.gametype property');
    console.log(this.gametype);

    let qry = 'database/json_basketball.php?game=' + this.gametype;
    axios.get(qry)
      .then(response => { 
        this.games = response.data;                       // 1) data table
        console.log('2) this.games');
        console.log(this.games);
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
      console.log("100) filteredItems");
      console.log(key)
      const res = this.games
      console.log("101) this.games");
      console.log(this.games);
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
      this.betdialog = true;
    },
    //-------------------   
    deleteItem (item) {
      const index = this.games.indexOf(item);
      confirm('Are you sure you want to delete this item (' + this.games[index].match + ') ?') && this.games.splice(index, 1);
    },
    deleteBetItem (item) {
      const index = this.games.indexOf(item);
      confirm('Are you sure you want to delete this bet item (' + this.games[index].match + ') ?') && this.games.splice(index, 1);
    },
    //------------------------------
    save () {
      console.log('save');
      if (this.editedIndex > -1) {
        console.log('save edit game');
        console.log(this.editedIndex);
        Object.assign(this.games[this.editedIndex], this.editedItem);
      } else {
        console.log('save new game');
        console.log(this.editedItem);
        this.games.push(this.editedItem);
      }
      this.close();
    },
    betsave () {
      console.log('save');
      if (this.bettedIndex > -1) {
        console.log('save edit my-bet');
        console.log(this.bettedIndex);
        Object.assign(this.games[this.bettedIndex], this.bettedItem);
      } else {
        console.log('save new my-bet');
        console.log(this.bettedItem);
        this.games.push(this.bettedItem);
      }
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

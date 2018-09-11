const poolSummary = Vue.component('poolComponent', {
  template: `
  <div id="poolTable">
  <v-card>
    <v-card-title>Pool Management<v-spacer></v-spacer>
      <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
      </v-text-field>
    </v-card-title>
    <v-data-table :headers="columns" :items="betpools" :search="search"> 
      <template slot="items" slot-scope="props">                            
        <td>{{ props.item.pool }}</td><td>{{ props.item.username }}</td><td>{{ props.item.count }}</td>
        <td class="justify-center layout px-0">
             <v-icon small class="mr-2" @click="joinItem(props.item)">edit</v-icon>join
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
        <v-dialog v-model="contestdialog" max-width="500px">
          <v-card dark color="blue-grey">
            <v-card-title><span class="headline">My Bets</span></v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6><v-text-field v-model=$store.state.loginUser.username label="Username" readonly background-color="red"></v-text-field></v-flex>
                  <v-flex xs12 sm6 md6><v-text-field v-model="displayDate" label="Date" readonly background-color="red"></v-text-field></v-flex>
                  <v-flex xs12 sm6 md12><v-text-field v-model="joinedItem.pool" label="Pool" readonly background-color="red"></v-text-field></v-flex>

                  <!-- checkboxes to select required matches (2 or 3 games)  -->
                  <v-flex xs12 sm6 md4><v-text-field v-model="joinedItem.match" label="match" background-color="green"></v-text-field></v-flex>

 <v-data-table :headers="headers" :items="matches" v-model="selected" item-key="id" select-all class="elevation-1">
    <template slot="items" slot-scope="props">
      <td><v-checkbox v-model="props.selected" primary hide-details></v-checkbox></td>
      <td>{{ props.item.match }}</td>
       <td><v-text-field slot="input" v-model="props.item.odd" label="odd"></v-text-field></td>
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
      columns: [ { text: 'Pool', value: 'pool' }, { text: 'Username', value: 'username'}, { text: 'Count', value: 'count'} ],
      betpools: [],
      contestdialog: false,
      joinedIndex: -1,
      joinedItem: { pool: '', username: '', count: 0, match: '' },    
      headers: [ { text: 'Match', value: 'match' } ],
      selected: [],
      matches: []
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
    getAllData() {
      let qry = 'database/json_mybet_pools.php';
      axios.get(qry)
        .then(response => { 
          this.betpools = response.data;
          console.log('1) getAllData-this.betpools');
          console.log(this.betpools);
        })  
        .catch(error => { console.log(error) });  
    },
    joinItem (item) {
      let qry = 'database/json_basketball_matches.php';
      axios.get(qry)
        .then(response => { 
          this.matches = response.data; 
          console.log('1) joinItem-this.matches');
          console.log(this.matches);
          this.joinedIndex = this.betpools.indexOf(item);
          this.joinedItem = Object.assign({}, item);
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

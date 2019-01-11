const gametable = Vue.component('gameTable', {
  props: { 'organiser': {type: String } },
  template: `
  <v-content>
    <navbars :role=myRole></navbars>
    <h2>Football</h2>    
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12><v-icon>pets</v-icon>{{organiser}} Tournament
          <v-layout wrap>
            <v-flex xs6 sm3><v-select label="Round" :items="roundList" v-model="selectedRound"  @input="filterItems"></v-select></v-flex>
            <v-flex xs6 sm3><v-select label="Week" :items="weekList" v-model="selectedWeek"  @input="filterItems"></v-select></v-flex>
          </v-layout>
          <v-card flat>
            <v-card-text>Rounds                  
              <v-data-table :headers="columns"
              :pagination.sync="pagination"
               :items="filteredItems">
                <template slot="items" slot-scope="props">               
                  <td class="text-xs-left">{{ weekNo(props.item.date) }}</td>
                  <td class="text-xs-left">{{ props.item.date }}</td>
                  <td class="text-xs-left">{{ props.item.organiser }}</td>
                  <td class="text-xs-left">{{ props.item.home_team }}</td>
                  <td class="text-xs-left">{{ props.item.away_team }}</td>
                  <td class="text-xs-left">{{ props.item.round }}</td>
                  <td class="text-xs-left">{{ props.item.venue }}</td>
                  <td class="text-xs-left">{{ props.item.result }}</td>
                  <td>{{ props.item.id }}</td>
                  <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>              
              </v-data-table>
            </v-card-text>
          </v-card>   
        </v-flex>
      </v-layout>
    </v-container>
    </v-content>
  `,
  data () {
    return {
      search: '',
      selectedRound: '',
      selectedWeek: '',
      roundList: [],
      weekList: [],

      games: [],
      filteredItems: [], 
      columns: [
        { text: 'Week#', value: 'weekno' }, { text: 'Date', value: 'date' }, 
        { text: 'Organiser', value: 'organiser' },         { text: 'Home Teams', value: 'home_team' },        
        { text: 'Away Teams', value: 'away_team' }, { text: 'Round', value: 'round' },{ text: 'Venue', value: 'venue' },
        { text: 'Results', value: 'result' }, { text: 'Id', value: 'id' } ],
      editedIndex: -1,
      editedItem: { round: '', date: '', home_team: '', away_team:'', venue: '', result: '' },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 0
      }           
    };
  },
  computed: {
    myRole() { return this.$store.state.myRole; },
    formTitle () { return this.editedIndex === -1 ? 'New Item' : 'Edit Item' },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0;
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    },
  },
  watch: { organiser (newVal, oldVal)  { this.getAllData(newVal); }  },
  created () { this.getAllData(this.organiser); },
  methods: {
    filterItems(item) {
      console.log("11) filterItems");
      console.log(this.games);
      if (this.selectedWeek) {
        this.filteredItems = _.filter(this.games, row => row.weekno === item);
      } else {
        this.filteredItems = _.filter(this.games, row => row.round === item);
      };
      console.log(this.filteredItems);

//      }
    }, 
    weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },
    getAllData(organiser) {
      this.result = 'Getting data from server...';
      let postdata = { op: "getOrgGames", id: organiser };
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' } })
        .then(response => { 
          this.games = response.body.data;
          this.filteredItems=this.games;
          let obj1 = _.countBy(this.games, 'round');   // 2) list of round
          let obj2 = _.countBy(this.games, 'weekno');   // 2) list of round
          this.roundList = [''];  // dummy
          this.weekList = [''];  // dummy
          for (let [key, value] of Object.entries(obj1)) { this.roundList.push(key) };
          for (let [key, value] of Object.entries(obj2)) { this.weekList.push(key) }      
        },      response => { this.result = 'Failed to load data to server.'; }
        );
    },
  }
});

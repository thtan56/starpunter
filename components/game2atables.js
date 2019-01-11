const gametable = Vue.component('gameTable', {
  props: { 'organiser': {type: String } },
  template: `
  <v-content>
    <navbars :role=myRole></navbars>
    <h2>Football</h2>    
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>

    <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs>
    
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-icon>globe</v-icon>
        <v-card flat>
          <v-card-title>AFL Tournament
            <v-spacer></v-spacer>
            <v-text-field label="Search" v-model="search" append-icon="search" single-line hide-detail></v-text-field>
          </v-card-title>
          <v-data-table
            :pagination.sync="pagination"
            :headers="columns" :items="games" :search="search">
            <template slot="items" slot-scope="props">                    
              <td class="text-xs-left">{{ weekNo(props.item.date) }}</td>
              <td class="text-xs-left">{{ props.item.date }}</td>
              <td class="text-xs-left">{{ props.item.home_team }}</td>
              <td class="text-xs-left">{{ props.item.away_team }}</td>
              <td class="text-xs-left">{{ props.item.round }}</td>
              <td class="text-xs-left">{{ props.item.venue }}</td>
              <td class="text-xs-left">{{ props.item.result }}</td>
              <td>{{ props.item.id }}</td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>              
          </v-data-table>    
        </v-card>
      </v-tab-item>   

      <v-tab-item>
        <v-toolbar flat color="white">
          <v-toolbar-title><v-icon>pets</v-icon>{{organiser}} Tournament</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
            <v-card>
              <v-card-title><span class="headline">{{ formTitle }}</span></v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.date" label="Date"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.home_team" label="Home Team"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.away_team" label="Away Team"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.round" label="Round"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.venue" label="Venue"></v-text-field></v-flex>
                    <v-flex xs12 sm6 md4><v-text-field v-model="editedItem.result" label="Result"></v-text-field></v-flex>
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

        </v-toolbar>

        <v-layout wrap>
          <v-flex xs6 sm3><v-select label="Week"  :items="weekList" v-model="gameWeek"   @input="after3selection"></v-select></v-flex>
          <v-flex xs6 sm3><v-select label="Round" :items="roundList" v-model="gameRound" @input="after1selection"></v-select></v-flex>
          <v-flex xs6 sm3><v-select label="Venue" :items="venueList" v-model="gameVenue" @input="after2selection"></v-select></v-flex>
        </v-layout>
        <v-card flat>
          <v-card-text>Rounds
            <!--  :items="filteredItems"  -->                        
            <v-data-table 
              :pagination.sync="pagination"
              :headers="columns" 
              :items="games"
              :custom-filter="filterItems">

              <template slot="items" slot-scope="props">               
                <td class="text-xs-left">{{ weekNo(props.item.date) }}</td>
                <td class="text-xs-left">{{ props.item.date }}</td>
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
      </v-tab-item>

    </v-tabs-items>
    
    </v-flex>
    </v-layout>
    </v-container>
    </v-content>
  `,
  data () {
    return {
//      items: [ 'User', 'Product', 'videos', 'images', 'news'],
      users: [],
      isActive: false, 
      dialog: false,
      search: '',
      tabs: null,
      gameWeek: null,      // selected
      gameRound: null,      // selected
      gameVenue: null,      
      roundList: [],
      weekList: [],
      venueList: [],
      items: [ 'Search','Rounds'],
      games: [],
      columns: [
        { text: 'Week#', value: 'weekno' },
        { text: 'Date', value: 'date' },
        { text: 'Home Teams', value: 'home_team' },        
        { text: 'Away Teams', value: 'away_team' },  
        { text: 'Round', value: 'round' },
        { text: 'Venue', value: 'venue' },
        { text: 'Results', value: 'result' },
        { text: 'Id', value: 'id' },
      ],
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
    myRole() {
      return this.$store.state.myRole;
    },
    filteredItems () {
      console.log('51) filteredItems-gameWeek');
      console.log(this.gameWeek);
      console.log(this.games);
      if (this.gameWeek) {    // not null
        return this.games.filter((i) => { return (i.weekno === this.gameWeek.toString()) });      
      } else if (this.gameRound) {    // not null
        return this.games.filter((i) => { return (i.round === this.gameRound) });
      } else if (this.gameVenue) {
        return this.games.filter((i) => { return (i.venue === this.gameVenue) });
      } else { return this.games.filter((i) => { return true }) }   // null, null => all
    },
    formTitle () { return this.editedIndex === -1 ? 'New Item' : 'Edit Item' },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0;
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    }
  },
  watch: {
    dialog (val) { val || this.close() },
    organiser (newVal, oldVal)  { this.getItems(newVal); }
  },
  created () {
    this.getItems(this.organiser);
  },
  mounted() { this.isActive = this.selected; },

  methods: {
    filterItems(items, search, filter) {
      if (this.gameWeek) {
        search = this.gameWeek.toString();
        return items.filter(row=> filter(row.weekno === search));        
      } else if (this.gameRound) {
        search = this.gameRound.toString().toLowerCase();
        return items.filter(row=> filter(row.round === search));   
      } else if (this.gameVenue) {
        search = this.gameVenue.toString().toLowerCase();
        return items.filter(row=> filter(row.venue === search)); 
      };
    },   
    after1selection (item) { this.$nextTick(() => { this.gameVenue = null }) },  // clear opposite select
    after2selection (item) { this.$nextTick(() => { this.gameRound = null }) },
    after3selection (item) { this.$nextTick(() => { this.gameWeek = null }) },

    weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },


    editItem (item) {
      this.editedIndex = this.games.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem (item) {
      const index = this.games.indexOf(item);
      confirm('Are you sure you want to delete this item (' + this.games[index].home_team 
                                                    + " vs "+ this.games[index].away_team +') ?') && this.games.splice(index, 1);
    },
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
    close () {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    getItems(organiser) {
      console.log("11) getAllData:"+organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgGames", id: organiser };
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' } })
        .then(response => { 
          this.games = response.body.data;
          console.log("12)this.games");
          console.log(this.games);
          if (this.games === undefined || this.games.length == 0) { this.games = []; };
          
          let obj1 = _.countBy(this.games, 'round');   // 2) list of round
          let obj2 = _.countBy(this.games, 'venue');
          let obj3 = _.countBy(this.games, 'weekno');
          this.roundList = [''];  // dummy
          this.weekList = [''];  // dummy
          this.venueList = [''];  // dummy 
          for (let [key, value] of Object.entries(obj1)) { this.roundList.push(key) }
          for (let [key, value] of Object.entries(obj2)) { this.venueList.push(key) }
          for (let [key, value] of Object.entries(obj3)) { this.weekList.push(key) }
          this.venueList.sort();
        },      response => { this.result = 'Failed to load data to server.'; }
        );
    },
  }
});

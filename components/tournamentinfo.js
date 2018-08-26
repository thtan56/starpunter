Vue.filter('currency', function(val, dec) {
    return accounting.formatMoney(val, '$', dec)
});
Vue.filter('number', function(val, dec) {
    return accounting.formatNumber(val, dec, ',', '.')
});

const demo = new Vue({
  el: '#app',
  store,
  props: {  },
  data () {
    return {
//      items: [ 'User', 'Product', 'videos', 'images', 'news'],
      users: [],
      isActive: false, 
      dialog: false,
      search: '',
      tabs: null,
      gameRound: null,      // selected
      gameVenue: null,      
      roundList: [],
      venueList: [],
      items: ['Rounds', 'Search'],
      games: [],
      columns: [
        { text: 'Id', value: 'id' },        
        { text: 'Round', value: 'round' },
        { text: 'Date', value: 'date' },
        { text: 'Home_v_Away Teams', value: 'home_v_away_teams' },        
        { text: 'Venue', value: 'venue' },
        { text: 'Results', value: 'result' }
      ],
      editedIndex: -1,
      editedItem: { round: '', date: '', home_v_away_teams: '', venue: '', result: '' },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 0
      }      
    };
  },
  computed: {
    filteredItems () {
      if (this.gameRound) {    // not null
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
    dialog (val) { val || this.close() }
  },
  created () {
    console.log('1) Profile:created' + this.$store.state.baseUrl);
    let qry = 'database/json_afl2018.php';   
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
  },
  mounted() { this.isActive = this.selected; },

  methods: {
    after1selection (item) { this.$nextTick(() => { this.gameVenue = null }) },  // clear opposite select
    after2selection (item) { this.$nextTick(() => { this.gameRound = null }) },
    editItem (item) {
      this.editedIndex = this.games.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem (item) {
      const index = this.games.indexOf(item);
      confirm('Are you sure you want to delete this item (' + this.games[index].home_v_away_teams + ') ?') && this.games.splice(index, 1);
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
    }
  }
});

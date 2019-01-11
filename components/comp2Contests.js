Vue.component('contests', {
		props: { 
      'organiser': {type: String }
     },
		template: `
			<v-layout row justify-center>
        <v-card flat>
          <v-card-text>Rounds                        
            <v-data-table :pagination.sync="pagination" :headers="columns" :items="filteredItems">
              <template slot="items" slot-scope="props">                    
                <td>{{ props.item.id }}</td>
                <td class="text-xs-left">{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.date }}</td>
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.organiser }}</td>
                <td class="text-xs-left">{{ props.item.venue }}</td>
                <td class="text-xs-left">{{ props.item.result }}</td>
                <td class="justify-center layout px-0">
                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
              </template>              
            </v-data-table>
          </v-card-text>
        </v-card>
			</v-layout>
  	`,
  	data () {
    	return {
				organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
				bettypes: ['head2head', 'over', 'under', 'standard' ],
				menu: false,
        btabs: null,
        tabItems: ['Head 2 Head', 'Over / Under', 'Standard', 'Result'],
        menu1: false,    // new
        error:'',
        result:'',
			}
		},
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
      organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
      games: [],
      columns: [
        { text: 'Id', value: 'id' },        
        { text: 'Round', value: 'round' },
        { text: 'Date', value: 'date' },
        { text: 'Home_v_Away Teams', value: 'name' },    
        { text: 'Organiser', value: 'organiser' },        
        { text: 'Venue', value: 'venue' },
        { text: 'Results', value: 'result' }
      ],
      editedIndex: -1,
      editedItem: { round: '', date: '', name: '', venue: '', result: '' },
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
    let qry = 'database/json_basketball.php?organiser=AFL';   
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
  

  methods: {
			save() {
        console.log("1) save: this.mybet");
        console.log(this.mybet);
      	if(this.mybet.game_name=='' || this.mybet.organiser=='' || this.mybet.game_date =='' || this.mybet.bet_type=='' ){     // mysql name (match) problem 
        	this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
        	return;
      	};
     		
        this.mybet.username = this.$store.state.loginUser.username;
        if (this.mybet.id === 0) { this.mybet.status = 'pending'; };

      	this.error = '';
      	this.result = 'Saving data to server...';
      	var postdata = { "op": "save", "data": this.mybet };
      	this.$http.post('php/apiBet.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        	.then(response => {
        	}, response => { this.result = 'Failed to save data to server.'; }
        	);
      	this.close();
    	},
      close () {
        this.$emit('close-dialog')
      },
    }
});
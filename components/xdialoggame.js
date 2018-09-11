Vue.component('dialog2game', {
		props: { 
      'game': {type: Object },
      'dialog' : {type: Boolean, default: false }
     },
		template: `
			<v-layout row justify-center>
	    <v-dialog v-model="dialog" max-width="1000px">
      	<v-card dark color="blue-grey">
        	<v-card-title><span class="headline">Game Management</span></v-card-title>
        	<v-card-text>
          	<v-container grid-list-md>  
              <v-layout wrap>
                <v-flex xs4><v-text-field label="Game Name" v-model="game.name"></v-text-field></v-flex>
                <v-flex xs4><v-combobox v-model="game.organiser" :items="organisers" label="Select your organiser:"></v-combobox></v-flex>
                <v-flex xs4><v-text-field label="Venue" v-model="game.venue"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Odd" v-model="game.odd"></v-text-field></v-flex>

                <v-flex xs4><v-text-field label="Id" v-model="game.id" readonly background-color="red"></v-text-field></v-flex>

                <v-flex xs4>   <!-- date picker -->
                  <v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="game.date">
                    <v-text-field slot="activator" label="Game date" v-model="game.date" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="game.date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu1.save(game.date)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>    

                <v-flex xs4><v-text-field label="Game Winner" v-model="game.winner"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Home Score" v-model="game.home_score"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Away Score" v-model="game.away_score"></v-text-field></v-flex> 
              </v-layout>

              <v-tabs slot="extension" v-model="btabs" color="grey" align-with-title>
                <v-tabs-slider color="yellow"></v-tabs-slider>
                <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
              </v-tabs>

              <v-tabs-items v-model="btabs">
                <v-tab-item><v-icon>supervisor_account</v-icon>
                  <v-layout wrap>
                    <v-flex xs4><v-text-field label="Winner" v-model="game.winner"></v-text-field></v-flex>
                    <v-flex xs4><v-text-field label="Pool#" v-model="game.pool_id"></v-text-field></v-flex>
                  </v-layout>
                </v-tab-item>             
                <v-tab-item><v-icon>waves</v-icon></v-tab-item>
                <v-tab-item>
                  <v-icon>motorcycle</v-icon>
                  <v-layout wrap>
                    <v-flex xs4><v-text-field label="Winner" v-model="game.winner"></v-text-field></v-flex>          
                  </v-layout>
                </v-tab-item>
       
                <v-tab-item>
                  <v-icon>attach_money</v-icon>
                  <v-layout wrap>
                    <!-- *** administrator area  *** -->
                    <v-flex xs4><v-text-field label="Winner" v-model="game.winner"></v-text-field></v-flex>
                    <v-flex xs4><v-text-field label="Home Score" v-model="game.home_score"></v-text-field></v-flex>
                    <v-flex xs4><v-text-field label="Away Score" v-model="game.away_score"></v-text-field></v-flex>
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
			</v-layout>
  	`,
  	data () {
    	return {
				organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
				bettypes: ['head2head', 'over', 'under', 'standard' ],
				menu: false,
        btabs: null,
        tabItems: ['$10 pool', '$25 pool', '$50 pool', 'Result'],
        menu1: false,    // new
        error:'',
        result:'',
			}
		},
		created() {
		},
  	methods: {
			save() {
      	if(this.game.name=='' || this.game.organiser=='' || this.game.date =='' ){     // mysql name (match) problem 
        	this.error = 'game name, organiser and date fields are required';           // use select `match`, ....
        	return;
      	};
     		this.game.status = 'open';
      	this.error = '';
      	this.result = 'Saving data to server...';
      	var postdata = { "op": "save", "data": this.game };
      	this.$http.post('php/apiGame.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        	.then(response => {
        	}, response => { this.result = 'Failed to save data to server.'; }
        	);
      	this.close();
    	},
 //   	close () { this.$emit('update:dialog', false) },
      close () {
        this.$emit('close-dialog')
      },
    }
});

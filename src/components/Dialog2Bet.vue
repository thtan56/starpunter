// Vue.component('dialog2bet', {
<template>
	<v-layout row justify-center>
	  <v-dialog v-model="dialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs2>
                <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="mybet.organiser" ></v-select>
              </v-flex>
              <v-flex xs5><v-combobox v-model="mybet.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
              <v-flex xs5><v-combobox v-model="mybet.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
              <v-flex xs4><v-text-field label="Odd" v-model="mybet.bet_odd"></v-text-field></v-flex>
              <v-flex xs4><v-text-field v-model="mybet.username" label="Username" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Id" v-model="mybet.id" readonly background-color="red"></v-text-field></v-flex>
              <v-flex xs4>   <!-- date picker -->
                <v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="mybet.game_date">
                  <v-text-field slot="activator" label="Game date" v-model="mybet.game_date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="mybet.game_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu1.save(mybet.game_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>    
              <v-flex xs4><v-text-field label="Bet/Pool Amount" v-model="mybet.bet_amount"></v-text-field></v-flex>
            </v-layout>
            
            <v-tabs slot="extension" v-model="btabs" color="grey" align-with-title>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="btabs">
              <v-tab-item><v-icon>supervisor_account</v-icon>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-radio-group v-model="mybet.bet_type" row label="bet type:"><v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs4><v-text-field label="Bet Winner" v-model="mybet.bet_winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Pool#" v-model="mybet.pool_id"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>             
              <v-tab-item><v-icon>waves</v-icon>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-radio-group v-model="mybet.bet_type" row label="bet type:">
                      <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs12 sm6 md4><v-text-field v-model="mybet.bet_score1" label="bet score1" background-color="green"></v-text-field></v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item><v-icon>motorcycle</v-icon>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-radio-group v-model="mybet.bet_type" row label="bet type:">
                      <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs4><v-text-field label="Bet Winner" v-model="mybet.bet_winner"></v-text-field></v-flex>          
                  <v-flex xs12 sm6 md4>
                    <v-radio-group v-model="mybet.bet_odd_type" :mandatory="false" label="odd type: " row>  
                      <v-radio label="Win" value="win"></v-radio>
                      <v-radio label="Lose" value="lose"></v-radio>
                    </v-radio-group>
                  </v-flex>            
                </v-layout>
              </v-tab-item>
              <v-tab-item><v-icon>attach_money</v-icon>
                <v-layout wrap>
                  <!-- *** administrator area  *** -->
                  <v-flex xs4><v-text-field label="Game Winner" v-model="mybet.game_winner"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Home Score" v-model="mybet.home_score"></v-text-field></v-flex>
                  <v-flex xs4><v-text-field label="Away Score" v-model="mybet.away_score"></v-text-field></v-flex>
                  <v-flex xs4>
                    <v-radio-group v-model="mybet.status" :mandatory="false" label="Status: " row>  
                      <v-radio label="pending" value="pending"></v-radio>
                      <v-radio label="closed" value="closed"></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs-items>
         	</v-container>
       	</v-card-text>
     	  <v-card-actions>
     	    <v-spacer></v-spacer>
     	    <v-btn color="white" flat @click.native="close">Cancel</v-btn>
     	    <v-btn color="white" flat @click.native="save">Save</v-btn>
     	  </v-card-actions>
      </v-card>
 	  </v-dialog>  
  </v-layout>
</template>
<script>
export default {
  name: 'nblBet',
	props: { 
    'mybet': {type: Object },
    'dialog' : {type: Boolean, default: false }
  },
  data () {
    return {
			organisers: ['NBA', 'NBL', 'NFL', 'AFL', 'Asian Games'],
			bettypes: ['head2head', 'over', 'under', 'standard', 'odd' ],
      teams: [],
			menu: false,
      btabs: null,
      tabItems: ['Head 2 Head', 'Over / Under', 'Standard', 'Result'],
      menu1: false,    // new
      error:'',
      result:'',
		}
	},
	created() {
    // this.dialog = true;
    this.mybet.username = this.$store.state.loginUser.username;
    // 	this.mybet.status = 'pending';
	},
  computed: {
    formTitle () { return this.mybet.id === 0 ? 'New Bet' : 'Edit Bet' },
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('MM/DD/YYYY');
      }
    }
  },
  methods: {
    changeOrganiser(selectObj) {
      this.mybet.organiser = selectObj;
      this.getTeams(selectObj);
    },
    getTeams(organiser) {
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgTeamNames", id: organiser };
      this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
        headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.teams = response.body.data;
          console.log(this.teams);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
		save() {
      console.log("1) save: this.mybet");
      console.log(this.mybet);
    	if(this.mybet.home_team=='' || this.mybet.away_team=='' || this.mybet.organiser=='' || this.mybet.game_date =='' || this.mybet.bet_type=='' ){     // mysql name (match) problem 
      	this.error = 'home and away team, organiser and date fields are required';           // use select `match`, ....
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
};
</script>

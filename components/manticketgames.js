const manTicketGames = Vue.component('ticketgamescomponent', {
  template: /* syntax: html */ `
  <v-layout column>
    <v-toolbar color="pink" dark><v-toolbar-title>Ticket Games Management(bet)</v-toolbar-title></v-toolbar>
    <v-container fluid grid-list-md>
      <v-form v-model="valid" ref="form">
        <v-layout row wrap>        
          <v-flex xs2>
            <v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select>
          </v-flex>
          <v-flex xs3><v-combobox v-model="editedItem.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
          <v-flex xs3><v-combobox v-model="editedItem.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
          <v-flex xs2><v-text-field label="Bet Team" v-model="editedItem.bet_team"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Winner" v-model="editedItem.game_winner"></v-text-field></v-flex>

          <v-flex xs2><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>                
          <v-flex xs2><v-text-field label="Odd Date" v-model="editedItem.odd_date"></v-text-field></v-flex>

          <v-flex xs2><v-text-field label="Game#"   v-model="editedItem.game_id"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Ticket#" v-model="editedItem.ticket_id"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Pool#" v-model="editedItem.pool_id"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Username" v-model="editedItem.username"></v-text-field></v-flex>

          <v-flex xs2><v-text-field label="Bet Score" v-model="editedItem.bet_score"></v-text-field></v-flex>
          <v-flex xs2><v-combobox v-model="editedItem.status" :items="['pending','successful']" label="Status:"></v-combobox></v-flex>  
          <v-flex xs2><v-text-field label="id" v-model="editedItem.id"></v-text-field></v-flex>  
        </v-layout>
        <v-btn @click="save">save</v-btn>
        Status: {{ result }}
        <span class="badge badge-danger">{{error}}</span>
      </v-form>
    </v-container>
    <v-container fluid grid-list-md>
      <v-flex xs12>
        <v-card dark color="primary">
          <div>
            Organiser:
            <template v-for="org in organisers">
              <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
            </template>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>     
            <v-data-table :headers="headers" :items="bets" :pagination.sync="pagination" :search="search">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.organiser}}:{{ props.item.home_team}} vs {{ props.item.away_team}}</td>
                <td>{{ props.item.round}}</td>
                <td>{{ props.item.game_id}}/$json->{'data'}->{'ticket_id'}/$json->{'data'}->{'pool_id'}
                <td>{{ props.item.username}}/{{ props.item.bet_score}}</td>
                <td>{{ props.item.bet_team}}:{{ props.item.game_winner}}</td>
                <td>{{ props.item.home_odd}}:{{ props.item.away_odd}}/{{ props.item.odd_date}}</td>
                <td>{{ props.item.status}}</td>
                <td>{{ props.item.id}}</td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
              </template>
              <template slot="footer">
                <td colspan="100%">
                  <strong>Notes: Just fill the blanks to register a new game, status=close to disallow further entry</strong>
                </td>
              </template>
            </v-data-table>
          </div>            
        </v-card>
      </v-flex>
    </v-container>
  </v-layout>
  `,
  data () {
    return {
      menu: false,
      search: '',
      result: '',
      error: '',
      valid: false,
  
      editedIndex: -1,
      editedItem: { organiser: '', home_team: '', away_team: '',round: ''
           ,username: '',game_id: '', ticket_id:'',pool_id: 0, bet_score: '', bet_team: '', game_winner: ''
           ,home_odd: 0, away_odd: 0, odd_date: ''
           ,status: '', selected_odd: 1,  id: 0 },
      organiser: 'NBA',  
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],

      teams: [],
      bets: [],
      pagination: {},
      headers: [ { text: 'Home vs Away Team', value: 'home_team' }  
            ,{ text: 'Round', value: 'round' }
            ,{ text: 'Game#/Ticket#/Pool#', value: 'game_id' }
            ,{ text: 'Username/Bet Income', value: 'username' }
            ,{ text: 'Bet Team/Winner', value: 'bet_team' }
            ,{ text: 'Home/Away/Date Odd', value: 'home_odd' }
            ,{ text: 'Status', value: 'status' },{ text: 'Id', value: 'id' } ],
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    check: function(e) {
      if (e.target.checked) {
        console.log(e.target.value)
        this.organiser = e.target.value;
        console.log(this.organiser);
        this.getAllData();
      }
    },
    changeOrganiser(selectObj) {
      this.editedItem.organiser = selectObj;
      this.getTeams(selectObj);
      console.log(this.editedItem.organiser);
    },
    getTeams(organiser) {
      console.log("11) getTeams-call axios"+organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgTeamNames", id: organiser };
      this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.teams = response.body.data;
          console.log(this.teams);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },        
    save: function () {
      console.log("21) save, editedItem", this.editedItem);
      if ( this.editedItem.home_team==='' || this.editedItem.away_team==='' 
        || this.editedItem.organiser==='' ){
        swal({
          title: '<strong>Error!!</strong>',
          type: 'info',
          html: '** Home or away team, organiser fields are required',
          showCloseButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
        });  
      } else {
        var saveitems = this.editedItem;    // updated too early - async
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": saveitems };
        this.$http.post('php/apiTicketGames.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
              this.result = response.body;
              this.getAllData();                 // refresh datatable
              this.editedItem = '';            
          }, response => { this.result = 'Failed to save data to server.'; }
        );
      };    // end of if
    },
    editItem: function(item){ this.editedItem = item; },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item ("+item.id+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiTicketGames.php', JSON.stringify(postdata),{
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.result = response.body;
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },          
    getAllData: function () {
      console.log('1) manticketgames.js: getAllData');
      this.result = 'Getting data from server...';
      var postdata = { op: "getTicketGamesByOrg", organiser: this.organiser };
      this.$http.post('php/apiTicketGames.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.bets = response.body.data;
            console.log(this.bets);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },    // end of methods
  beforeMount(){
        this.getAllData(); 
  },
});
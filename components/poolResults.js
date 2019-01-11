const poolResults = Vue.component('poolresultcomponent', {
  template: `
  <v-content>
    <topmenu></topmenu>
    <v-layout row wrap>
      <v-flex xs12>    
        <v-toolbar color="pink" dark>
          <v-toolbar-title>{{pageTitle}}, 
            <v-btn flat> <v-icon small @click="changeRound(-7)">fast_rewind</v-icon>
              {{ round }}<v-icon small @click="changeRound(7)">fast_forward</v-icon>
            </v-btn>
            <span STYLE="font-size: 10pt">({{pstart | moment }}:{{pend | moment }})</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
            <v-card-title>                                                                <!-- 2 -->
              <v-layout row wrap>
                Organiser:
                <template v-for="org in organisers"><input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
                </template>
              </v-layout>            
            </v-card-title>
            <v-btn :disabled="role != 'manager'" color="info" @click="update">Compute Pool Winners</v-btn>         
          </v-toolbar-items>
        </v-toolbar>

        <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
          <v-tab v-for="filter in quorumList" :key="filter.pool_type">{{ filter.pool_type }}</v-tab>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
          <v-tab-item v-for="filter in quorumList" :key="filter.pool_type">
            <v-data-table :headers="headers" :pagination.sync="pagination" :search="search" 
                  :items="filtered2Items(filter.pool_type)">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.organiser }}</td>      <td>{{ props.item.round}}</td> 
                <td>{{ props.item.pool_id}}</td><td>{{props.item.pool_type }}</td>
                <td>{{ props.item.username}}</td> 
                <td>{{ props.item.total_score}}</td>   
                <td>{{ props.item.rank}}</td> 
                <td>{{ props.item.payout}}/{{ props.item.top}}</td>
                <td>{{ props.item.pool_prize}}</td>    <td>{{ props.item.income}}</td>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-content>
  `,
  data () {
    return {
      tickets: [],
      ticket: [],
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      tabs: null,
      tabItems: ['Head2Head', 'Group'],
      quorumList: [
          { pool_type: 'head2head' },
          { pool_type: 'group' }
      ],
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      organiser: 'NBA',
      username:'',
      round: '',
      pstart: '',
      pend: '',
      today: '',
      teams: [],

      selected:[], 
      filtered: [],
      headers: [ { text: 'Organiser', value: 'organiser' },{ text: 'Round', value: 'round' }
              ,{ text: 'Pool#', value: 'pool_id' }        ,{ text: 'Pool Type', value: 'pool_type' }
              ,{ text: 'Username', value: 'username' },{ text: 'Total Score', value: 'total_score' }
              ,{ text: 'Rank', value: 'rank' },{ text: 'Payout/Top', value: 'payout'} 
              ,{ text: 'Pool Prize', value: 'pool_prize'}
              ,{ text: 'Income', value: 'income' } ],
      search: '',     
    }
  },
  computed: { 
    role() { return this.$store.state.loginUser.role; },
    pageTitle() { return 'Pool Winners for the week ' + moment().format('W') },   
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    formatNumber(value) { return accounting.formatNumber(value,2) },
    weekNo(date) { return moment(date, "YYYY-MM-DD").week(); },
    change2Organiser(selectObj) { this.getTeams(selectObj); },
    filtered2Items (key) {
      const res = this.tickets;
      if (key) { 
        if (key === 'Search') { 
          console.log("15) Search", key);
          return res };
        let results=_.filter(this.tickets, ticket => ticket.pool_type === key);
        return results;
      };
      return res
    },
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;
        this.getRound();
      }
    },   
    //---------------------------------------
    update() {
      console.log("21) update-PoolWinners");
      var result = 'Getting data from server...'; 
      var postdata = { op: "updatePoolWinners", data: {organiser: this.organiser, round: this.round} };   // no used yet    
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), 
                      { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
        },  response => { result = 'Failed to load data to server.';
      });
      swal({
        title: '<strong>Update Pool Winners!</strong>',
        type: 'info',
        html: '** Done **',
        showCloseButton: true,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
      });  

    },
    getAllData() {
      console.log("11) getAllData", this.organiser, this.round);
      var result = 'Getting data from server...'; 
      var postdata = { op: "getTicketStatus2", data: {organiser: this.organiser, round: this.round} };    
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), 
                      { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            this.tickets = response.body.data;
            console.log("13) this.tickets");
            
            //=============================
            this.selected=['NBA'];     // default filter (1st time)
            this.filtered = _.filter(this.tickets, (ticket) => _.includes(this.selected, ticket.organiser) );
        },  response => { result = 'Failed to load data to server.';
      });
    },
    changeRound(days) {    // prev, next buttons
        let objDate = moment(this.today, 'YYYY/MM/DD').toDate();   // this.today = string
        this.today = moment(objDate).add(days, 'days').format('YYYY/MM/DD');  // moment needs obj
        this.getRound();
    },
    getRound() {
      console.log("11) getRound",this.organiser, this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.today} };    
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            if (response.body.data.length === 0) {
                this.round = "";
                this.pstart = "";
                this.pend ="";
                this.tickets = [];
            } else {
                this.round = response.body.data[0].round;
                this.pstart = response.body.data[0].start;
                this.pend = response.body.data[0].end_dt;
                this.getAllData();  // asyn problem
            };
        },  response => { this.result = 'Failed to load data to server.';
      });
    },    
  },    // end of method
  beforeMount(){ 
    this.organiser = this.$store.state.sport.organiser;
    this.username = this.$store.state.loginUser.username;
    this.today = moment().format('YYYY/MM/DD');    
    this.getRound();
  }
});

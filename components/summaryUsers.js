const userSummary2 = Vue.component('usersummarycomponent', {
  template: `
  <v-content>
    <topmenu></topmenu>
    <topboxes></topboxes>   
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs3><userscashchart></userscashchart></v-flex>
        <v-flex xs3><usersscorechart></usersscorechart></v-flex>
        <v-flex xs3><userprofitschart :username="selected.username"></userprofitschart></v-flex>        
        <v-flex xs3><userinfo2 :userData="userinfo">Profile:{{selected.username}}</userinfo2></v-flex>
        <v-flex xs3><userticketsummary @clicked-childselected="getUsers"></userticketsummary></v-flex>
        <v-flex xs9>
          <userweektickettable :ticketData="tickets">
                Tickets - [{{selected.orgweek}} Username: {{selected.username}}]
            <template for="totals" slot="totalsSlot">
              <td><strong>Total Cost / Income:</strong></td>
              <td :style="totals.cost > totals.income ? {'color':'red'} : {'color':'green'}">
                      {{totals.cost}} / {{totals.income}}</td>
            </template>
          </userweektickettable>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
  `,
  data() {
    return {
      selected: {},
      userinfo: {},
      tickets: [],
      totals: { cost: 0, income: 0}     
    }
  },
  methods: {
    getUserTickets() {
      console.log("153) getUserTickets");
      var result = 'Getting data from server...';
      var postdata = { op: "getUserTickets2", data: this.selected };    // orgweek, username   
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null) { this.tickets = [];      
          } else {                      this.tickets = response.body.data;
            console.log("155)this.tickets", this.tickets);
            this.totals = alasql('SELECT sum(entry_cost::NUMBER) as cost, sum(income::NUMBER) as income FROM ? '
                              ,[this.tickets])[0];  
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },   
    getUsers(citem) {
      console.log("151) getUsers:citem", citem);
      this.selected = citem;
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserByName", username: this.selected.username };    // username   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null || response.body === "") { this.userinfo = {};      
          } else {  
              this.userinfo = response.body.data[0];
              this.getUserTickets();
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  }    
});
Vue.component('userweektickettable', {
  props: { ticketData: {type: Array } },                   
  template: `
  <div>
    <v-toolbar flat color="deep-orange" dark>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>Ticket</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :pagination.sync="pagination" :items="ticketData">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}} / {{ props.item.ticket_id}}</td>
        <td>{{ props.item.start | moment}} / {{ props.item.end_dt | moment}}</td> 
        <td>{{ props.item.pool_id}} / {{ props.item.pool_name}}/ {{ props.item.entry_quorum}}</td>
        <td>{{ props.item.entry_cost}} / {{ props.item.income}}</td> 
        <td>{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
        <td>{{ props.item.entrants}}</td>
        <td>{{ props.item.total_score}}</td> 
        <td>{{ props.item.gamecount}}</td> 
      </template>
      <template slot="footer">
        <slot name="totalsSlot"></slot>
      </template>     
    </v-data-table>
  </div>
  `,
  data () {
    return {
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      headers: [ { text: 'Username/Ticket#', value: 'username' }
              ,{ text: 'Start / End', value: 'start' }
              ,{ text: 'Pool#/Name/Quorum', value: 'pool_id' }  
              ,{ text: 'Entry Cost/Income', value: 'entry_cost' }
              ,{ text: 'Pool Prize/Payout', value: 'pool_prize' }
              ,{ text: 'Entrants', value: 'entrants' }
              ,{ text: 'Total Score', value: 'total_score' }
              ,{ text: 'Game Count', value: 'gamecount' }  
                ],
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {},
  created() {}
});

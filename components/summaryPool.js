const poolSummary = Vue.component('poolsummarycomponent', {
  template: `
  <v-content>
    <homebars></homebars>
    <topboxes></topboxes>   
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs2>
          <v-layout row wrap>
            <v-flex xs12><poolusersummary @clicked-childselected="getPoolTickets"></poolusersummary></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs10>  
          <v-layout row wrap>
            <v-flex xs4><summarychart>Sport Weekly Summary</summarychart></v-flex>
            <v-flex xs4><summarystackchart>Pool Tickets Chart (Calendar Week)</summarystackchart></v-flex>
            <v-flex xs4><poolinfo  :poolData="poolinfo">Pool# {{selected.pool_id}}</poolinfo></v-flex>
            <v-flex xs12>
              <poolweektable :ticketData="ticketlist">
                  Pools - [{{selected.orgweek}} Pool#{{selected.pool_id}}]
                <template for="totals" slot="totalsSlot">
                  <td><strong>Total Cost / Income:</strong></td>
                  <td :style="totals.cost > totals.income ? {'color':'red'} : {'color':'green'}">
                    {{totals.cost}} / {{totals.income}}</td>
                </template>           
              </poolweektable>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
  `,
  data() {
    return {
      selected: {},
      ticketlist: [],
      poolinfo:{},
      initinfo: { entry_cost:'', entry_quorum:'', entrants:0, pool_prize: '', pool_type: ''
                  ,pool_name: '', status: ''},  
      totals: { cost: 0, income: 0}
    }
  },
  methods: {
    getPoolTickets(citem) {
      this.selected = citem;
      console.log("10)getPoolTickets-this.selected", this.selected);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getTicketStatus", data: this.selected };    // orgweek, pid   
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          if (response.body === null) {
            this.ticketlist = [];
            this.poolinfo = this.initinfo;      
            this.totals = { cost:0, income: 0 };  
          } else {
            this.ticketlist = response.body.data;
            console.log("11)this.ticketlist", this.ticketlist);
            this.poolinfo = (this.ticketlist.length === 0) ? this.initinfo : this.ticketlist[0];
            this.totals = alasql('SELECT sum(entry_cost::NUMBER) as cost, sum(income::NUMBER) as income FROM ? '
                              ,[this.ticketlist])[0];     
          };    
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  }
});

Vue.component('poolweektable', {
  props: { ticketData: {type: Array }, 
           totals: {type: Object } },          
  template: `
  <div>
    <v-toolbar flat color="deep-orange" dark>
      <v-toolbar-title><slot></slot></v-toolbar-title>
      </v-toolbar>
      <v-spacer></v-spacer>
      <v-btn flat>Tickets</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :pagination.sync="pagination" :items="ticketData">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.username}}/{{ props.item.ticket_id}}</td>    
        <td>{{ props.item.total_score}}</td>   
        <td>{{ props.item.rank}}</td> 
        <td>{{ props.item.entry_cost}}/{{ props.item.income}}</td>
        <td>{{ props.item.payout}}/{{ props.item.top}}</td>
        <td>{{ props.item.pool_prize}}</td>
      </template>
      <template slot="footer"><slot name="totalsSlot"></slot></template>
    </v-data-table>
  </div>
  `,
  data () {
    return {
      pagination: { page: 1, rowsPerPage: 10, totalItems: 0 },
      headers: [ { text: 'Username/Ticket#', value: 'username' },{ text: 'Total Score', value: 'total_score' }
              ,{ text: 'Rank', value: 'rank' }
              ,{ text: 'Entry Cost/Income', value: 'entry_cost'} 
              ,{ text: 'Payout/Top', value: 'payout'} 
              ,{ text: 'Pool Prize', value: 'pool_prize'} ],
    }
  }
});

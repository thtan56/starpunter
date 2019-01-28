// Vue.component('buyTickets', {
<template>
  <v-container fluid grid-list-md>
    <topmenu></topmenu>
    <v-toolbar slot="header" class="mb-2" color="indigo darken-5" dark>
      <v-toolbar-title>Buy Ticket for week: {{pstart | moment }}:{{pend | moment }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>{{ round }}</v-btn> 
        <v-card-title>                                                                <!-- 2 -->
          <v-layout row wrap>
            Organiser:
            <div v-for="org in organisers" :key="org">
              <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
            </div>
          </v-layout>
        </v-card-title>
        <v-btn flat>V-cash balance:$ {{vbal}}</v-btn>         
      </v-toolbar-items>
    </v-toolbar>
    <v-data-iterator :items="pools" :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination"
        content-tag="v-layout" row wrap>
      <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg4>    <!-- lg3 = control width -->
        <v-card color='green'>     <!-- 1 box -->
          <v-card-title class="subheading font-weight-bold">
            Entry cost:{{ props.item.entry_cost }}-{{ props.item.organiser }}           
          </v-card-title>
          {{ props.item.round }} : {{ props.item.start | moment}} - {{ props.item.end_dt | moment }}
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Entry Quorum:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.entrants }} / {{ props.item.entry_quorum }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Pool Prize:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.pool_prize }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Payout:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.payout }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Pool Name:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.pool_name }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Pool Type:</v-list-tile-content>            
              <v-list-tile-content class="align-end">{{ props.item.pool_type }}</v-list-tile-content>
            </v-list-tile>  
            <v-list-tile>
              <v-list-tile-content>Pool#:</v-list-tile-content>            
              <v-list-tile-content class="align-end">{{ props.item.id }}</v-list-tile-content>
            </v-list-tile>          
            <!-- ============================================================ 
              disable button         if entrants == 2
              only manager           can edit & delete pool
            -->
            <v-icon :disabled="!exceedQuorum(props.item.entry_quorum, props.item.entrants)"
              small @click="buyItem(props.item)">add_shopping_cart
              </v-icon>
              <span v-if="!exceedQuorum(props.item.entry_quorum, props.item.entrants)">closed</span>           
          </v-list>
        </v-card>
      </v-flex>

      <v-toolbar slot="footer" class="mt-2" color="indigo" dark dense flat>
        <v-toolbar-title class="subheading">click on shopping cart to 'buy game ticket'. Pools must be created first</v-toolbar-title>
      </v-toolbar>
    </v-data-iterator>
  </v-container>  
</template>

<script>
import topmenu from './TopMenu.vue';
import moment from 'moment';

export default {
  name: 'buyTicket',
  components: { topmenu },   // 2
  data () {
    return {
      valid: false,  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 4 },
      placebetdialog: false,

      editedIndex: -1,
      editedItem: { entry_cost: 0, entrants: 0, entry_quorum: 0, pool_prize: 0
        ,payout: '', id: 0,  pool_id: 0, pool_name: '', pool_type: '', start: '', end_dt: ''
        ,username: '' },
      pools: [],
      teams: [],
      sport: {},     // cannot use sport: []
      organiser: 'NBA',
      round: '',

      username:'thtan56',
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],

      pstart: '',
      pend: '',
    }
  },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    vbal() { return this.$store.state.loginUser.vcash; },
    formTitle () { return this.editedIndex === -1 ? 'New Pool' : 'Edit Pool' },
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('YYYY/MM/DD');
      }
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;    // 1) select organiser
        this.getRound();                    // 2) get rounds & default round
      }
    },
    //=================================================================
    exceedQuorum(strQuorum, icount) {
      let regex= /[+]/g;
      let found = strQuorum.match(regex);
      if (found != null) { return true;      // + exist => unlimited
      } else {
        return ( icount == parseInt(strQuorum) ? false : true )   
      }
    },
    updateUserStore(username) {
      var postdata = { op: "getUserByName", username: username };   
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => {
          this.$store.commit('modifyMyRecord', response.body.data[0] );   // update store with new cash, vcash balance
        }, response => { this.result = 'Failed to save data to server.'; 
      });   // http.post 2
    },   
    buyItem: function(item){
      if (item.entry_cost > this.$store.state.loginUser.vcash) {
        this.$swal({
          title: '<strong>Error! Insufficient fund!</strong>',
          type: 'info',
          html: '** You cannot bought ticket <br>'
                  +'<u>Pool#'+this.editedItem.pool_id+' of type '
                  + this.editedItem.pool_type
                  +'</u><br>Entry cost:<u>'+this.editedItem.entry_cost+'</u>'
                  +'<br>due to insufficient fund<br>buy additional vcash first',
          showCloseButton: true,
          confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
        });  
      } else {
        this.editedIndex = this.pools.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItem.pool_id   = item.id;            // item from pool table        

        this.editedItem.username = this.$store.state.loginUser.username;
        this.editedItem.balcash  = this.$store.state.loginUser.cash;
        this.editedItem.balvcash = this.$store.state.loginUser.vcash;

        console.log("21) buyItem",this.editedItem);
      
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "insertUpdate", "data": this.editedItem };    // reduce vcash bal in users table  
        this.$http.post('/php/apiTicket.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { 
                            this.updateUserStore(this.editedItem.username);
          }, response => {  this.result = 'Failed to save data to server.'; } 
          );
        // update count
//        this.editedItem.id=item.id;    // pool id - update
        postdata = { op: "updateCount", "pid": this.editedItem.pool_id };
        console.log("23) postdata", postdata);                      
        this.$http.post('/php/apiPool.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' } })
          .then(response => {
          },    response => { this.result = 'Failed to load data to server.'; }
          );
        // refresh
        this.editedItem.entrants++;
        Object.assign(this.pools[this.editedIndex], this.editedItem); 
        //================================================ 
        this.$swal({
          title: '<strong>Congratulation!</strong>',
          type: 'info',
          html: '** You have just bought ticket <br>'
                  +'<u>Pool#'+this.editedItem.pool_id+' of type '
                  + this.editedItem.pool_type
                  +'</u><br>Entry cost:<u>'+this.editedItem.entry_cost+'</u>',
          showCloseButton: true,
          confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
        });
      };   // else    
    },
    getRound: function () {
      console.log("11)BT: getRound",this.organiser, this.displayDate);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.displayDate} };    
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            if (response.body.data.length === 0) {
              this.round = "";
              this.pstart = "";
              this.pend ="";
            } else {
              this.round = response.body.data[0].round;
              this.pstart = response.body.data[0].start;
              this.pend = response.body.data[0].end_dt;
            };
            this.getAllData();  // asyn problem
        },  response => { this.result = 'Failed to load data to server.';
      });
    },
    getAllData: function () {
      console.log("12)BT: getAllData", this.organiser, this.round);
      this.result = 'Getting data from server...';
      var postdata = { op: "getPools", data: { organiser: this.organiser, round: this.round } };    // name, date
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            if (response.body.data.length === 0) {  
              this.$swal({
                title: '<strong>STOP!! Pool info not found!</strong>',
                type: 'info',
                html: '** Report to Manager **'
                  +'<br>Create Pools for '
                  +'<br>Organiser#<u>'+this.organiser
                  + ' '+ this.round +'</u>',
                showCloseButton: true,
                confirmButtonText: '<i class="material-icons">thumb_up</i> OK!',
              });
            } else {
              console.log("12) response.body", response.body);
              this.pools = response.body.data;
              console.log(this.pools);
            };
       },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
    console.log("1) BuyT:beforeMount");
    this.username = this.$store.state.loginUser.username;
    this.organiser = this.$store.state.sport.organiser;
    this.getRound();
  }
};
</script>

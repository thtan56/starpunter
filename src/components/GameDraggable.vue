// const gamedraggable = Vue.component('game-draggable', {
// drag to bought ticket for a logged in user ??????
<template>
  <v-container fluid grid-list-md>
    <topmenu></topmenu>
    <v-layout row wrap>
      <v-toolbar color="pink" dark>
        <v-toolbar-title>Games Selection for the Week: {{pstart | moment }}:{{pend | moment }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>{{ round }}</v-btn>  
          <v-card-title>                                                                <!-- 2 -->
            <v-layout row wrap>
              Organiser:
              <div v-for="org in organisers" :key="org"><input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
              </div>
            </v-layout>
          </v-card-title>         
        </v-toolbar-items>
      </v-toolbar>
    </v-layout>
    <!-- ******************************************************* -->
    <v-layout row wrap>
      <v-flex xs9>
        <v-card color="blue-grey darken-2" class="white--text" height="100%">
          <v-card-text>V-cash balance:$<div class="headline">{{vcash}}</div></v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card color="blue lighten-2" dark>
          <v-card-text>
            <draggable v-model="trashZone" class="dropzone trashzone" 
                  id="trash" :options="trashOptions">
              <img src="/images/trash.png" />
            </draggable>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- ============================================================== -->
    <v-layout row wrap>
      <v-flex xs4>  
        <section class="list">
          {{vcash}}
          <header>Game Events</header>
          <draggable class="drag-area" 
                  :list="games" 
                  :options="gameOptions"
                  :move="checkMove"
                  :element="'article'"
                  @add="onAdd($event, false)"  
                  @change="afterAdd2">    
            <article class="card" v-for="game in games" :key="game.id" :data-id="game.id">
              <header>{{game.id}}:{{ game.home_team }}:{{ game.away_team }}<br>{{game.start | moment}}</header>
              <!-- skip game.start, game.round now -->             
            </article>
          </draggable>
        </section>
      </v-flex>
      <!-- ============================================================== -->     
      <v-flex xs8>  
        <v-layout row wrap>    
          <v-flex md6 v-for="(item, index) in tickets" :key=index>
            <v-toolbar color="indigo" dark>
              <v-toolbar-title>Ticket {{ item.id }}:Pool#{{item.pool_id}}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card dark color="blue-grey">
              <v-card-text>
                  <v-layout wrap>
  <v-flex xs5><v-text-field label="Type" v-model="item.pool_type"      outline readonly></v-text-field></v-flex>
  <v-flex xs3><v-text-field label="Cost" v-model="item.entry_cost"     outline readonly></v-text-field></v-flex>
  <v-flex xs4><v-text-field label="Quorum" v-model="item.entry_quorum" outline readonly></v-text-field></v-flex>
  <v-flex xs3><v-text-field label="Count" v-model="item.entrants"   outline readonly></v-text-field></v-flex>
  <v-flex xs4><v-text-field label="Prize" v-model="item.pool_prize"    outline readonly></v-text-field></v-flex>
  <v-flex xs4><v-text-field label="Payout" v-model="item.payout"       outline readonly></v-text-field></v-flex>
                  </v-layout>
              </v-card-text>
            </v-card>      
            <v-card color="cyan darken-2" class="white--text">
              {****** Drop game here ********}
              <draggable class="drag-area" 
                      :id="item.id"  
                      :list="item.games"
                      :options="ticketOptions" 
                      :element="'article'" 
                      @end="end($event, item.id)"
                      @add="onAdd($event, true)"  
                      @change="afterAdd($event, item.id)">
                <div v-for="game in item.games" :key="game.id">
                  <header>{{ game.id }}:{{game.home_team}}:{{game.away_team}}:{{game.bet_team}}
                  </header> 
                </div>
              </draggable>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>  
    </v-layout>
    <!-- ======================================================================= -->
    <v-dialog v-model="betdialog" max-width="500px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Select Your Favorite Team</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-radio-group v-model="selectedItem.bet_team" row label="" background-color="green">
                <v-radio v-for="item in bet_teams" :key="item" :label="item" :value="item"></v-radio>
              </v-radio-group>
            </v-layout> 
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="saveBet">Bet</v-btn>
          <v-btn color="black" flat @click.native="cancelBet">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>  
  </v-container>
</template>
<script>
import draggable from 'vuedraggable'
import topmenu from './TopMenu.vue';
export default {
  name: 'gamedraggable',
  components: { topmenu, draggable },   // 2
  data () {
    return {
      organiser: 'NBA',
      username:'thtan56',
      vcash: 0,

      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      round: '',
      rounds:[],
      games: [],
      sport: {},         // store
      selectedItem: {tid: '', pool_id: '', gid: '', home_team:'', away_team: '', bet_team: '', username: '', organiser: '', round: ''},
      bet_teams: [],
      betdialog: false,
      duplicated: false,
      
      tickets: [],
      tickets2: [],
      ticketsNew: this.tickets,
      gamesNew: this.games,      
      editable: true,
      isDragging: false,
      delayedDragging: false,
      trashZone: [],
      trashOptions: {group: { name: 'trash', draggable: '.dropitem', put: () => true, pull: false } },
      gameOptions: { group: { name: 'status', pull:'clone', put:false } },  // don't remove selected game
      ticketOptions: { group: 'status', animation: 150 },

      pstart: '',
      pend: '',
    }
  },    // end of data
  computed: {
    dragOptions() {
      return { animation: 0, group: "description", disabled: !this.editable, ghostClass: "ghost" };
    },
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('YYYY/MM/DD');
      }
    }
  },
  watch: {
    isDragging(newValue) {
      console.log("isDragging");
      console.log(newValue);
      if (newValue) {
        this.delayedDragging = true;
        return;      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
/*    round (newValue) {                // trigger when value change in round
      console.log('201)watch round:'+newValue+'>'+this.organiser);
      this.sport.organiser=this.organiser;
      this.sport.round=newValue;
      this.$store.commit('modifySportRecord', this.sport);
      this.getGames();
      this.getTickets();
    }
*/  
  },    // end of watch
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods:{
    checkMove: function(evt) { return true; },
    end(event, tid) { // only when move to trash, otherwise onAdd trigger
      console.log('199)end', event); 
      //=========================
      this.selectedItem.tid = event.from.id;   // gid from update function

      console.log('ticket#->destination',event.from.id,'->', event.to.id); 
      if (event.to.id=="trash") {
        // 1) bet cancelled - update entrants in the ticket
        var selectedTicket = this.tickets[this.selectedItem.tid-1];
        var newcount = parseInt(selectedTicket.entrants) - 1;
        this.tickets[this.selectedItem.tid-1].entrants = newcount;
        // 2) delete game from ticketgames & update count in ticket
        console.log("191) remove from ticket#", event.from.id);
        console.log(this.selectedItem);
        this.result = 'Getting data from server...'; 
        var postdata = { op: "delete", data: this.selectedItem  };  
        this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
          },      response => { this.result = 'Failed to load data to server.';
        });     
      };
    },
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;    // 1) select organiser
        this.getRound();                    // 2) get rounds & default round
      }
    },
    //=================================================================
    add: function(){      this.list.push({name:'Juan'}); },
    replace: function(){  this.list=[{name:'Edgard'}]},
    clone: function(el){  return {  name : el.name + ' cloned' } },
    log: function (evt){ console.log(evt) },

    orderList() { this.list = this.list.sort((one, two) => { return one.order - two.order; }); },
    onMove({ relatedContext, draggedContext }) {
      console.log("onMove");
      console.log(relatedContext);
      console.log(draggedContext);
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    //=============================
    onAdd(event, status) {
      console.log("19) onAdd");       // do file updating here (not in afterAdd())
      console.log(event);             // true => add to ticket table (retrieve info using id & update record to ticket)
      console.log(status);            // false => remove from ticket table (use organiser, home_team, away_team, start)
      console.log(event.target);
      this.selectedItem.gid = event.item.getAttribute('data-id');   // 1) game.id
      if (status) {     // true: move game to selected ticket
        this.selectedItem.tid=event.target.id;                        // 2) ticket id
        //****************************************
        //  check entry quorum for excess limit
        var limitcheck = this.getLimitCheck(this.selectedItem.tid, this.selectedItem.gid);
        console.log("20) limitcheck", limitcheck);
        if (limitcheck.length === 0) {
          console.log("21) It is OK - no entry yet");
        } else {
//          if (limitcheck.quorum)
          console.log("20) check quorum & count");
        };
        //=================================================
        var targetIndex = this.getTargetIndex(this.selectedItem.tid, this.tickets);
        // search selected ticket box for home_team using game.id 
        let targetList=this.tickets[targetIndex].games;  // no ticket, moving from ticket to game box
        console.log("29) onAdd: targetList", targetList);   // games in selectedTicket
        this.selectedItem.home_team='';
        this.selectedItem.away_team="";
        for (var i=0; i < targetList.length; i++) {     // foreach ticket
          if (this.selectedItem.gid == targetList[i].id) {
            this.selectedItem.home_team=targetList[i].home_team;     // 3) look for home_team from targets
            this.selectedItem.away_team=targetList[i].away_team;     
            break;
          };
        };
      };
    },
    afterAdd2(event) { console.log("999) afterAdd2", event); },
    afterAdd(event, tid) {
      console.log("11) afterAdd", event);
      console.log("12) this.selectedItem", this.selectedItem);
      if (event.hasOwnProperty("removed")) {       // move game in tickets to trash
        this.selectedItem.gid      =event.removed.element.id;
        this.selectedItem.home_team=event.removed.element.home_team;
        this.selectedItem.away_team=event.removed.element.away_team;
        console.log("14) removing "+ this.selectedItem.id + this.selectedItem.home_team + this.selectedItem.away_team);
      } else if (event.hasOwnProperty("added")) {  // move game to tickets box
        console.log("16) adding");
        this.selectedItem.gid       = event.added.element.id;               // 1) gid
        this.selectedItem.home_team = event.added.element.home_team;        // 2)
        this.selectedItem.away_team = event.added.element.away_team;        // 3)
        this.selectedItem.username  = this.$store.state.loginUser.username; // 4)
        this.selectedItem.organiser = this.organiser;                       // 5)
        this.selectedItem.round     = this.round;                           // 6)   
        this.selectedItem.tid       = tid;
        /* ***************************************************************** */
        // 0) prepare teams selection
        this.bet_teams = [];                                                // 7)
        this.bet_teams.push(this.selectedItem.home_team);
        this.bet_teams.push(this.selectedItem.away_team);
        /* **************************************************************** */
        // 1) check quorum
        console.log("17) this.selectedItem.tid:", this.selectedItem.tid);
        console.log("18) this.tickets", this.tickets);
        var targetIndex = this.getTargetIndex(this.selectedItem.tid, this.tickets);
        if (this.tickets[targetIndex].entrants===this.tickets[targetIndex].entry_quorum) {
          var gamelist = this.tickets[targetIndex].games;
          console.log("19) gamelist", gamelist);  // is new game in the list ????
          var gid = this.selectedItem.gid
          this.tickets[targetIndex].games = this.getQ1UpdatedList(gid, gamelist);  // remove entry
          this.$swal({
            title: '<strong>Exceed Quorum Limit!</strong>',
            type: 'info',
            html: '** Bet rejected **<br>'
                      +'Game <u>'+this.selectedItem.home_team+' vs '+ this.selectedItem.away_team
                      +'</u><br> already meet the quorum<br>in Ticket <u>'+this.selectedItem.tid+'</u>',
            showCloseButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
          }); 
        } else {
          /* ************************************************************************* */
          // 2) check duplicate
          var gamelist = this.tickets[targetIndex].games;
          var gid = this.selectedItem.gid
          this.tickets[targetIndex].games = this.getD1UpdatedList(gid, gamelist);  // remove entry if duplicated
          if (this.duplicated) {
            this.$swal({
              title: '<strong>Duplication!</strong>',
              type: 'info',
              html: '** Bet rejected **<br>'
                  +'Game <u>'+this.selectedItem.home_team+' vs '+ this.selectedItem.away_team
                  +'</u><br> already in the betting list<br>in Ticket <u>'+this.selectedItem.tid+'</u>',
              showCloseButton: true,
              confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK!',
            });
          } else {
            /* ************************************************************************* */
            // 3) bet accepted - update entrants in the ticket
            var selectedTicket = this.tickets[targetIndex];
            var newcount = parseInt(selectedTicket.entrants) + 1;
            this.tickets[targetIndex].entrants = newcount;
            console.log("18) selectedTicket:", selectedTicket);

            this.betdialog = true;     // select team to bet
          };   // duplicated                                        
        };     // quorum
      };       // added
    },
    getTargetIndex(tid, ticketlist) {
      for (var i=0; i < ticketlist.length; i++) {     // foreach game
        if (tid === ticketlist[i].id) { break; }
      };
      return i;                              
    },
    //---------------------------------------
    getQ1UpdatedList(newgid, gamelist) {
      var results=[];
      for (var i=0; i < gamelist.length; i++) {     // foreach game
        if (newgid !== gamelist[i].id) { 
          results.push(gamelist[i]);
        } else if (gamelist[i].bet_team === undefined || gamelist[i].bet_team === "" ) {
          // skip  
        } else { // found game but old record
          results.push(gamelist[i]);
        };
      };
      return results;                              
    },    
    getD1UpdatedList(newgid, gamelist) {
      var results=[];
      var foundcount=0;
      for (var i=0; i < gamelist.length; i++) {     // foreach game
        if (newgid === gamelist[i].id) { foundcount++; }  
      };
      this.duplicated = (foundcount > 1) ? true : false;      // result 1
      //================================================
      var foundwrite=0;
      for (i=0; i < gamelist.length; i++) {           // foreach game
        if (newgid !== gamelist[i].id) { results.push(gamelist[i]);
        } else if (!this.duplicated) {          // found & not duplicated
          gamelist[i].bet_team=this.selectedItem.bet_team; // update bet team
          results.push(gamelist[i]);
        } else if (gamelist[i].bet_team !== undefined) {  // found game but old record
          if (foundwrite < 1) {
            results.push(gamelist[i]);
            foundwrite++;
          }
        };   // else skip new duplicate game
      };
      return results;                               // result 2
    },
    getD2UpdatedBetList(newgid, gamelist) {
      var results=[];
      for (i=0; i < gamelist.length; i++) {           // foreach game
        if (newgid === gamelist[i].id) { 
          gamelist[i].bet_team=this.selectedItem.bet_team; // update bet team
        };
        results.push(gamelist[i]);
      };
      return results;
    },
    cancelBet() { this.betdialog = false; },
    //=====================================================================
    saveBet() {
      var targetIndex = this.getTargetIndex(this.selectedItem.tid, this.tickets);    
      var gamelist              = this.tickets[targetIndex].games;
      this.selectedItem.pool_id = this.tickets[targetIndex].pool_id;    // last process
      console.log("40) saveBet:this.tickets", this.tickets, targetIndex);
      console.log("41) this.tickets[targetIndex]", this.tickets[targetIndex]); 

      var gid = this.selectedItem.gid
      this.tickets[targetIndex].games = this.getD2UpdatedBetList(gid, gamelist);

      this.result = 'Getting data from server...'; 
      var postdata = { op: "saveGame2Ticket", data: this.selectedItem };  
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), 
          { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
        },      response => { this.result = 'Failed to load data to server.';
      });
      this.betdialog = false;
    },
    getLimitCheck(tid, gid) {
      var results = [];
      this.result = 'Getting data from server...'; 
      var postdata = { op: "countEntry", data: { tid: tid, gid: gid } };  
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), 
          { headers: { 'Content-Type': 'application/json' }
        }).then(response => { results = response.body.data;
                              return results;
        },      response => { this.result = 'Failed to load data to server.';
      });
      return results;
    },
    getGames: function () {
      console.log("20) getGames:"+this.organiser+":"+this.round);
      this.games=[];
      if (this.round !== '') { 
        this.result = 'Getting data from server...'; 
        var postdata = { op: "getOrgRndGames", data: { organiser: this.organiser, round: this.round } };    
        this.$http.post('/php/apiGame.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
          }).then(response => { this.games = response.body.data;
          },      response => { this.result = 'Failed to load data to server.';
        });
      };
    },
    getTickets: function () {
      console.log('30) getTickets');            // plus games
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgRndTickets", data: { organiser: this.organiser, round: this.round, username: this.username } }; 
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.tickets = response.body.data;
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    getRound: function () {
      console.log("11) getRound",this.organiser, this.displayDate);
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
            this.getGames();  // asyn problem
            this.getTickets();
        },  response => { this.result = 'Failed to load data to server.';
      });
    },
  }, // end of methods
  mounted(){    // 1st time
    this.username = this.$store.state.loginUser.username;
    this.vcash    = this.$store.state.loginUser.vcash;
    this.organiser = this.$store.state.sport.organiser;
    this.getRound();
  }  
};
</script>

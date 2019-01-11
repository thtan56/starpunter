const Home = Vue.component('homepage', {
  template: /* syntax: html */ `
  <v-content>
    <homebars></homebars>
    <topboxes></topboxes>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar color="blue-grey" dark>
        <v-toolbar-title>Game Plans for the week</v-toolbar-title>
          <v-toolbar-items>
            <v-flex xs3 v-for="org in organisers" :key="org.name">
              <v-btn flat color="white">
                <img :src="org.img" class="mb-4"/> 
                  <v-checkbox :value="org.name" :key="org.name" :label="org.name" v-model="selected"
                       :id="org.name"></v-checkbox>   <!-- 1st filter: use watch to intercept change  -->
              </v-btn>
            </v-flex>
            <v-flex xs3>
              <v-btn flat><v-icon small @click="changeRound(-7)">fast_rewind</v-icon>
                {{ round }} <v-icon small @click="changeRound(7)">fast_forward</v-icon>
              </v-btn> 
              <v-btn flat>{{today}}</v-btn>
            </v-flex>  
          </v-toolbar-items>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs9>
          <homepools   :selected="selected" :today="today"></homepools>
          <v-layout row wrap>
            <v-flex xs6><leaderboard></leaderboard></v-flex>
            <v-flex xs6><gameboard></gameboard></v-flex>    <!-- active games with ticket bought -->
          </v-layout>
        </v-flex>
        <v-flex xs3>
          <userlist></userlist>
          <usersummary :selected="selected" :today="today"></usersummary></v-flex>
      </v-layout>
      </v-container>
  </v-content>
  `,
  data () {
    return {
      organiser: 'NBA',
      round: '',
      today: '',
      username:'thtan56',
      organisers: [
              { name: 'NBA',  img: '/images/NBA2.png', link: '/game/NBA' },
              { name: 'NBL',  img: '/images/NBL2.png', link: '/game/NBL' },
              { name: 'AFL',  img: '/images/afl2.png', link: '/game/AFL' },
              { name: 'NFL',  img: '/images/nfl2.png', link: '/game/NFL' }
              ],
      sport: {},     // cannot use sport: []
      selected: [],             
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {    
    changeRound(days) {
      let objDate = moment(this.today, 'YYYY/MM/DD').toDate();   // this.today = string
      this.today = moment(objDate).add(days, 'days').format('YYYY/MM/DD');  // moment needs obj
      this.getRound();
    },
    getRound: function () {
      console.log("20) getRound",this.organiser, this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.today} };   
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            console.log("22) reponse.body", response.body); 
            if (response.body.data.length === 0) { this.round = "";
            } else {     this.round = response.body.data[0].round; };
            console.log("23) this.round", this.round);
        },  response => { this.result = 'Failed to load data to server.';
      });
    },  
    //===================================
  },
  // update store - with round and today date
  beforeRouteEnter (to, from, next) {   
    var sport = {};
    var organiser = "NBA";                            // 1) default
    let $today = new Date;                            
    var today = moment($today).format('YYYY/MM/DD');  // 2)  
    var round = "";                                   // 3)
    console.log("10) beforeRouteEnter", organiser, today);
    var result = 'Getting data from server...'; 
    var postdata = { op: "getOrgCurrentRound", 
                   data: {organiser: organiser, today: today} };
    axios.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
          if (response.data.length === 0) {  
            swal({
              title: '<strong>STOP!! Period info not found for today!</strong>',
              type: 'info',
              html: '** Ask system manager to setup the period for today',
              showCloseButton: true,
              confirmButtonText: '<i class="fa fa-thumbs-up"></i> Cancel!',
            });                 
          } else {
            sport.organiser= organiser;                   // 1
            sport.today    = today;                       // 2
            sport.round    = response.data.data[0].round; // 3
            store.commit('modifySportRecord', sport);     
            next(vm => vm.posts = response.data)
          };
        },      response => { this.result = 'Failed to load data to server.';
    });
  },
  created(){
    this.username  = this.$store.state.loginUser.username;   // update during login   but what if not login
    this.organiser = this.$store.state.sport.organiser;      // 1)
    this.round     = this.$store.state.sport.round;          // 2)
    this.today     = this.$store.state.sport.today;          // 3) important, use for 2nd organiser
    console.log("29) today", this.today);
    this.selected  =[this.organiser];     // default filter (1st time) 
  }
});  
// ********************************************
const HomeBarsComponent = Vue.component('homebars', {
  template: /* syntax: html */`
  <header>
    <div v-if="!customer"><menunon></menunon></div>
    <div v-else><menucust></menucust></div>
  </header>
  `,
  computed: {
    customer() { return this.$store.state.loginUser.username === "" ? false : true },
  },  
});
Vue.component('menucust', {
  template: /* syntax: html */`
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list><leftsidebar></leftsidebar></v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">Home</router-link></v-toolbar-title>
      <topbar></topbar>
      <topsportbar></topsportbar>
      <v-spacer></v-spacer>
      <div v-if="role === 'manager'"><topadmbar></topadmbar></div>
      Hello {{displayUser}}
      <v-btn flat color="yellow">vcash:{{vbal}}</v-btn>
      {{displayToday}}
      {{displayWeek}}
    </v-toolbar>
  </div>
  `,
  data: () => { return { drawer: false } },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    vbal() { return this.$store.state.loginUser.vcash; },
    displayToday() { return this.$store.state.sport.today; },
    displayWeek() { return 'Week:'+moment().format('W') },  
    displayUser() { return this.$store.state.loginUser.username; },   
  },
});
Vue.component('menunon', {
  template: /* syntax: html */`
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title"  :to="item.link" router>
          <v-list-tile-action><v-icon>{{ item.icon }}</v-icon></v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">Starpunter</router-link></v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      {{displayToday}}
      {{displayWeek}}
    </v-toolbar>
  </div>
  `,
  data: () => { return { drawer: false } },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: 'home', title: 'Home',    link:'/'},
        { icon: 'face', title: 'Sign up', link:'/signup'},
        { icon: 'lock_open', title: 'Sign in', link:'/login'} ];
      return menuItems;
    },
    displayToday() { return this.$store.state.sport.today; },  
    displayWeek() { return 'Week:'+moment().format('W') }  
  },  
});
//============================================
Vue.component('topboxes', {
  template: `
  <!-- Info boxes -->
  <div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="info-box">
        <span class="info-box-icon bg-aqua"><i class="ion ion-ios-gear-outline"></i></span>
        <div class="info-box-content">
          <span class="info-box-text">
            <router-link :to="{name: 'poolSummary'}">Plans</router-link>
          </span><span class="info-box-number">
          <small>
          <ul id="pools">
            <li v-for="pool in poolcounts" :key="pool.orgweek">
              <b>{{ pool.orgweek }}</b>={{ pool.poolcount }}
            </li>
          </ul>
          </small></span>
        </div></div></div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="info-box">
        <span class="info-box-icon bg-red"><i class="fa fa-google-plus"></i></span>
        <div class="info-box-content">
          <span class="info-box-text">
            <router-link :to="{name: 'gameSummary'}">Games</router-link>
          </span><span class="info-box-number"><small>
          <ul id="games">
            <li v-for="game in gamecounts" :key="game.orgweek">
              <b>{{ game.orgweek }}</b>={{ game.gamecount }}
            </li>
          </ul>
          </small></span>
        </div></div></div>
    <!-- fix for small devices only -->
    <div class="clearfix visible-sm-block"></div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="info-box">
        <span class="info-box-icon bg-green"><i class="ion ion-ios-cart-outline"></i></span>
        <div class="info-box-content">
          <span class="info-box-text">Tickets</span><span class="info-box-number"><small>
          <ul id="tickets">
            <li v-for="ticket in ticketcounts" :key="ticket.orgweek">
              <b>{{ ticket.orgweek }}</b>={{ ticket.ticketcount }}
            </li>
          </ul>
          </small></span>
        </div></div></div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="info-box">
        <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>
        <div class="info-box-content">
          <span class="info-box-text">
            <router-link :to="{name: 'userSummary'}">Members</router-link>
          </span>
          <span class="info-box-number">
          {{users.usercount}}
          </span>
        </div></div></div>
  </div>
`,
  data: () => { 
    return { 
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      today: '',
      gamecounts: [],
      poolcounts: [],
      ticketcounts: [],
      users: {} 
    }
  },
  methods: {  
    getStatistics(data) {
      var mydata      = data.pools;
      var mylist      = alasql('SELECT orgweek, pool_id FROM ? GROUP BY orgweek, pool_id',[mydata]);              
      this.poolcounts = alasql('SELECT orgweek, COUNT(*) AS poolcount FROM ? GROUP BY orgweek',[mylist]);
      //-----------------------------------
      mydata = data.tickets;
      mylist             = alasql('SELECT orgweek, ticket_id FROM ? GROUP BY orgweek, ticket_id',[mydata]);              
      this.ticketcounts  = alasql('SELECT orgweek, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek',[mylist]);   
      //-----------------------------------
      mydata = data.games;
      mylist           = alasql('SELECT orgweek, game_id FROM ? GROUP BY orgweek, game_id',[mydata]);              
      this.gamecounts  = alasql('SELECT orgweek, COUNT(*) AS gamecount FROM ? GROUP BY orgweek',[mylist]);
      this.users = data.users[0];        
    },
    getAllData() {
      var result = 'Getting data from server...';
      var postdata = { op: "getOrgsWeeks", 
                      data: {organisers: this.organisers, today: this.today} };    
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.getStatistics(response.body.data);
             
        },      response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
    console.log("1) topboxes");
    this.organiser = this.$store.state.sport.organiser;
    this.today = moment().format('YYYY/MM/DD');   
    this.getAllData();                        // get this.pools
  }   
});
//------------------------------------------------------------       

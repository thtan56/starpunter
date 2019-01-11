Vue.use(Vuetify, {
  theme: {
    primary: '#b71c1c',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
});
Vue.use(Vuex);

const Attractions = { template: '<div>Attractions</div>' }
const Breakfast = { template: '<div>Breakfast</div>' }
const Meat = { template: '<div>Meat</div>' }
const Sushi = { template: '<div>Sushi</div>' }
const Users = { template: '<div>Users</div>' }
const Signup = { template: '<div>Signup</div>' }
//const Login = { template: '<div>Login</div>' }

const store = new Vuex.Store({
  state: {
    loginUser: { username: '', role: 'guest', email: 'demo@gmail.com', vcash: 0 },
    baseUrl: 'http://vueapp.test/database/',
    resultUrl: 'https://www.footywire.com/afl/footy/ft_match_list',
    xchgRate: 2.5,
    myevent: '',
    sport: { organiser: 'NBA', round: 'Round 4', today: '2018/12/20' },   // default keys   - servicebet 
  },
  mutations: {
    modifyMyRecord (state, newUser)     { state.loginUser = newUser; },
    modifyEventRecord (state, newEvent) { state.myevent = newEvent;  },
    modifySportRecord (state, newSport)   { state.sport = newSport; },     // same as organiser
  }
});

const routes = [
//  { path: '/', redirect: '/calendar/list-views.html' },
//  { path: '/',              component: Home },                      // homeinfo.js
  { path: '/user'   ,       component: loginCustomer },     // components/customerinfo.js    - old cust home
//  { path: '/faqs'   ,       component: myfaqs },       
  { path: '/manager',       component: loginManager },     // components/customerinfo.js
  { path: '/homecalendar',  component: homeCalendar },                      // homeinfo.js
  { path: '/', component: NBAnews },               
  { path: '/breakfast', component: Breakfast },
  { path: '/meat', component: Meat },
  { path: '/sushi', component: Sushi },
  { path: '/betPools',  component: BetPools},           // 2) nTop games
  { path: '/betOdds',  component: BetOdds},           // 2) nTop games
  { path: '/gameH2H',  component: nGames},           // 2) nTop games
  { path: '/cashbalance', component: cashBalance },  // 3e) 
  { path: '/vcashbalance', component: vcashBalance },  // 3f) 


  { path: '/basketballNBL', component: nblBet },
  { path: '/basketballNBA', component: nbaBet },
  { path: '/AG2018Bas', component: asiaBet },  
  { path: '/gameNRL', component: NRL },    
  { path: '/product', component: Product },

  { path: '/signup', component: Register },
  { path: '/login', component: Login },



  { path: '/password/:activity', component: password, props: true }, 
  { path: '/request/:activity', component: request, props: true },             // 3a) withdraw, deposit, buy, sell (components/compcash)
  { path: '/requeststatus/:activity', component: requeststatus, props: true }, // 3a) withdraw, deposit status (history) 

  { path: '/ticket/buy',    component: buyTicket},     // 3c) buy scheme based tickets to place bet (components/serviceaccount)
  { path: '/ticket/status', component: ticketStatus},  //     status & history
  { path: '/bet/dragdrop',  component: placeBet},    // 3d) drag & drop game to certain ticket (components/serviceaccount)
  { path: '/bet/status',    component: betStatus},    // status & history (with deletion)
  { path: '/poolResults',  component: poolResults},           // manager  ?????
  { path: '/gameSummary',  name: "gameSummary", component: gameSummary},           // manager
  { path: '/poolSummary',  name: "poolSummary", component: poolSummary},           // manager  
  { path: '/userSummary2', name: "userSummary", component: userSummary2},         // manager 
  { path: '/gameResults',  component: GameResults},           // manager
  { path: '/bet/MyResults',  component: BetMyResults},       // customer
  { path: '/bet/Leaders', component: BetLeaders},       // customer

  { path: '/newsNBA', component: NBAnews },
  { path: '/newsAFL', component: AFLnews },

  { path: '/faqs', component: FAQs },
  { path: '/game/:organiser', component: gametable, props: true },
  { path: '/calendar/:organiser',  component: gamecalendar, props: true },
  { path: '/pools/:gameid', name: "GamePools", component: PoolList, props: true },
  { path: '/betgames/:ticketid',  name: "betGames", component: betGames, props: true },
  { path: '/homegames/:username', name: "homeGames", component: homeGames, props: true },
  { path: '/gamehome/:game_id',   name: "gameHome", component: gameHome, props: true },
  { path: '/userhome/:username',  name: "userHome", component: userHome, props: true },
//==========================================
//  { path: '/user/:userId', name: 'secured', component: loginCustomer },
  { path: '/user/:username', name: "sysuser", component: sysUser, props: true },
  { path: '/statement', name: 'soa', component: statement }, // statements.js, withdraw, deposit status (history)   


  { path: '/usermanager', component: userManager },     // components/customerinfo.js
  { path: '/poolmanager', component: poolManager }, 
  { path: '/sysmanager',  beforeEnter() { location.href='sysManager.html' } },

  { path: '/schedule/game', beforeEnter() { location.href='fcGame.html' } },
  { path: '/schedule/period', beforeEnter() { location.href='fcPeriod.html' } }
 
//  { path: '/Games/:organiser/:date', component: daygames, props: true },  
//  { path: '/organiser/:organiser', component: org, props: true },
//  { path: '/userguide', component: userGuide },
//  { path: '/rateguide', component: rateGuide },

]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

window.eventBus = new Vue();

Vue.component('echart', VueECharts);  // register to use (global variable)
const vm = new Vue({
  el: '#app',
  components: { gamedraggable },    // end of components
  router,
  store,
  data: { },
  methods: {},
  created () {
    console.log('1) main.js :created');  // cannot have logic here due to async file reading
//    eventBus.$on('reload', (data) => this.reload(data));  
  }
});

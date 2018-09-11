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
    loginUser: { username: 'thtan99', role: 'guest', email: 'guest@gmail.com' },
    baseUrl: 'http://vueapp.test/database/',
    resultUrl: 'https://www.footywire.com/afl/footy/ft_match_list',
    xchgRate: 2.5 
  },
  mutations: {
    modifyMyRecord (state, newUser) {
        state.loginUser = newUser;
    }
  }
});

const routes = [
  { path: '/', component: NBAnews },                  // { path: '/', component: Attractions },
  { path: '/breakfast', component: Breakfast },
  { path: '/meat', component: Meat },
  { path: '/sushi', component: Sushi },
  { path: '/gameAFL', component: AFL },
  { path: '/gameH2H',  component: nGames},           // 2) nTop games
  { path: '/gameResults',  component: GameResults},           // 2) nTop games
  { path: '/gamePools',  component: GamePools},           // 2) nTop games
  { path: '/gameOdds',  component: GameOdds},           // 2) nTop games
  { path: '/basketballNBL', component: nblBet },
  { path: '/basketballNBA', component: nbaBet },
  { path: '/AG2018Bas', component: asiaBet },  
  { path: '/gameNRL', component: NRL },    
  { path: '/product', component: Product },
  { path: '/signup', component: Register },
  { path: '/login', component: Login },
  { path: '/newsNBA', component: NBAnews },
  { path: '/newsAFL', component: AFLnews },
  { path: '/user/:userId', name: 'secured', component: loginCustomer },
  { path: '/user', component: loginCustomer },
  { path: '/faqs', component: FAQs },
//  { path: '/userguide', component: userGuide },
//  { path: '/rateguide', component: rateGuide },
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

window.eventBus = new Vue();

const myparent = new Vue({
  el: '#app',
  router,
  store,
  data () {
    return {
      roles: ['guest', 'customer', 'manager'],
    }
  },
  computed: {
    roleName(val) {
      return this.roles[val]
    }
  },
  created () {
    console.log('1) main.js :created');

//    eventBus.$on('reload', (data) => this.reload(data));  
  },
  methods: {
  }       // methods
});

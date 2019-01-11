const store = new Vuex.Store({
  state: {
    loginUser: { username: 'thtan56', role: 'customer', email: 'thtan56@gmail.com' },
    baseUrl: 'http://vueapp.test/database/',
    resultUrl: 'https://www.footywire.com/afl/footy/ft_match_list',
    xchgRate: 2.5,
    myevent: '',
    sport: { organiser: 'NBA', round: 'Round 4' },   // default keys 
  },
  mutations: {
    modifyMyRecord (state, newUser)     { state.loginUser = newUser; },
    modifyEventRecord (state, newEvent) { state.myevent = newEvent; },
    modifySportRecord (state, newSport)  { state.sport = newSport; },     // same as organiser
  }
});
window.eventBus = new Vue();
// create a root instance
const vm = new Vue({
  store,
  el: '#app',
  components: { gamedraggable },    // end of components
  data () { return {} },
});   // Vue

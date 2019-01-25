import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store(
  {
    state: {
      loginUser: { username: '', role: 'guest', email: 'demo@gmail.com', vcash: 0 },
      baseUrl: 'http://vueapp.test/database/',
      resultUrl: 'https://www.footywire.com/afl/footy/ft_match_list',
      xchgRate: 2.5,
      myevent: '',
      sport: { organiser: 'NBA', round: 'Round 4', today: '2018/12/20' }
    },
    mutations: {
      modifyMyRecord (state, newUser) { state.loginUser = newUser },
      modifyEventRecord (state, newEvent) { state.myevent = newEvent },
      modifySportRecord (state, newSport) { state.sport = newSport }
    }
  }
)

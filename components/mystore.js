const store = new Vuex.Store({
  state: {
    myId: 't.h.tan@dunelm.org.uk',
    baseUrl: 'http://vueapp.test/database/',
    resultUrl: 'https://www.footywire.com/afl/footy/ft_match_list',
    xchgRate: 100
  },
  mutations: {
    modifyMyId (state, newId) {
      state.myId = newId;
    }
  }
});

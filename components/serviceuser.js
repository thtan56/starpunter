Vue.filter('currency', function(val, dec) {
    return accounting.formatMoney(val, '$', dec)
});
Vue.filter('number', function(val, dec) {
    return accounting.formatNumber(val, dec, ',', '.')
});

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    loginUser: { username: 'thtan56', role: 'customer', email: 'thtan56@gmail.com' },
    baseUrl: 'http://vueapp.test/database/',
    resultUrl: 'https://www.footywire.com/afl/footy/ft_match_list',
    xchgRate: 2.5,
    sport: { organiser: 'NBA', round: 'Round 4', today: '2018/12/20' }  
  },
  mutations: {
    modifyMyRecord (state, newUser) { state.loginUser = newUser; },
    modifySportRecord (state, newSport)   { state.sport = newSport; }     // same as organiser    
  }
});

const demo = new Vue({
  el: '#app',
  store,
  data: {
    tabs: null,
    items: [ 'User', 'Team','Period', 'Request', 'Plan', 'Pool', 'Games', 'Ticket', 'Ticket Games', 'Bet' ],
    result: '',
    error: '',
    user: { id: 0, username: '', email: '', role: '', address1: '', address2: '', town: '',
            firstname: '', lastname: '', postcode: '', country: '', bankbsb: '', bankaccount: ''},
    users: [],
    search: '',
    pagination: {},
    headers: [
      { text: 'User Name', value: 'username' },
      { text: 'Email', value: 'email' },
      { text: 'Role', value: 'role' }, { text: 'Address1', value: 'address1' }, { text: 'Address2', value: 'address2' }
    ],
    countries: ['Australia', 'Canada', 'China', 'France', 'Malaysia', 'Singapore', 'United Kingdom', 'United States'],
    roles: ['customer', 'manager', 'guest'],
    valid: false,
    emailRules: [     (v) => !!v || 'E-mail is required',
                      (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid' ],
    usernameRules: [  (v) => !!v || 'Username is required',
                      (v) => v && v.length <= 10 || 'Username must be less than 10 characters'],
    menuItems: [{ title: "Period", href:"fcPeriod.html" }
                ,{ title: "Game",  href:"fcGame.html" } ],
  },
  methods: {
    save: function () {
      if(this.user.username=='' ||  this.user.email==''){
        this.error = 'username and email fields are required';
        return;
      }
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.user };
      //console.log(JSON.stringify(postdata));
      this.$http.post('php/apiUser.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          this.result = response.body;
          this.getAllData();                 // refresh datatable
          this.user.id = 0;                  // problem if next new record only has few fields entries 
          this.user.email = '';         this.user.role = '';
          this.user.address1 = '';      this.user.address2 = '';
          this.user.firstname = '';     this.user.lastname = '';
          this.user.town = '';          this.user.postcode = '';
          this.user.country = '';
          this.user.bankbsb = '';       this.user.bankaccount = '';               
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ this.user = item; },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiUser.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { 
            this.result = response.body;
            this.getAllData();
          }, response => { this.result = 'Failed to delete data.'; }
          );
      }
    },
    getAllData: function () {
      this.result = 'Getting data to server...';
      var postdata = { op: "getUsers" };
      this.$http.post('php/apiUser.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => {
          this.result = '';
          this.users = response.body.data;
          console.log("2) getAllData > this.users");
          console.log(this.users);
        }, response => { this.result = 'Failed to load data to server.'; }
        );
      }
    },
    beforeMount(){  this.getAllData(); }
});
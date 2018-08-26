Vue.filter('currency', function(val, dec) {
    return accounting.formatMoney(val, '$', dec)
});
Vue.filter('number', function(val, dec) {
    return accounting.formatNumber(val, dec, ',', '.')
});

const demo = new Vue({
  el: '#app',
  data () {
    return {
      loading: false,
      status: '', 
      user: { id: 0, firstname: '', lastname: '', username: '', password: '', email: '', role: '', address1: '', address2: '', town: '', postcode: '', country: '', bankbsb: '', bankaccount: '' },
      countries: ['Australia', 'Canada', 'France', 'Malaysia', 'United Kingdom', 'United States'],
      roles: ['player', 'manager', 'administrator', 'guest'],
      submitted: false,
      error: '',
      result: ''   
    };
  },
  methods: {
    save: function () {
      if(this.user.username=='' || this.user.password=='' || this.user.email==''){
        this.error = 'username, password and email fields are required';
        return;
      }
      this.error = '';
      this.result = 'Saving data to server...';
        let postdata = { "op": "save", "data": this.user };
        //console.log(JSON.stringify(postdata));
        this.$http.post('php/apiUser.php', postdata, { 
          headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          let uid = this.user.email;
          this.result = response.body;
          this.user.id = 0;
          this.user.username = '';
          this.user.password = '';
          this.user.email = '';
          window.location.href = 'apiCustomer.html?uid='+uid;
          console.log('save:'+uid);
        }, response => {
          this.result = 'Failed to save data to server.';
        });
      },
    }    
    
});

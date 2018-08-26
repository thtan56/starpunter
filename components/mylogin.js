const demo = new Vue({
  el: '#app',
  store,
  data () {
    return {
      loading: false,
      model: { username: 'admin@isockde.com', password: 'password' },
      user: { username: '', password: '', email: '', role: '' }
    }
  },
  computed: {
    myId () {
      return this.$store.state.myId;
    },
  },
  methods: {
    updateId () {
      this.$store.commit('modifyMyId', this.model.username);
      console.log('updateId');
      console.log(this.$store.state.myId);
    },
    login () {
      console.log('1) login');
      let qry = 'database/json_users_email.php?email=' + this.model.username;
      console.log(qry);   
      axios.get(qry)
        .then(response => { 
          this.user = response.data[0];
          console.log(this.user);
        })  
        .catch(error => { console.log(error) });  
      this.updateId();      // ignore
      this.loading = true;
      setTimeout(() => {
          if (this.user.role === 'manager') {
            window.location.href = 'apiManager.html?uid='+this.model.username;              
          } else if (this.user.role.length===0) {
            window.location.href = 'apiNotRegistered.html?uid='+this.model.username;
          } else {
            window.location.href = 'apiCustomer.html?uid='+this.model.username;
          }  
      }, 1000);      
      //  this.$router.push({ name: 'Secured', params: { id: this.model.username }});  // dashboard v2
      //}, 1000);
    },  
  }
});

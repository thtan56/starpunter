Vue.filter('currency', function(val, dec) {
    return accounting.formatMoney(val, '$', dec)
});
Vue.filter('number', function(val, dec) {
    return accounting.formatNumber(val, dec, ',', '.')
});

const demo = new Vue({
    el: '#app',
    data: {
        items: [ 'User', 'Product', 'videos', 'images', 'news'],
        result: '',
        error: '',
        user: { id: 0, username: '', password: '', email: '', role: '', address1: '', address2: '', town: '',
                firstname: '', lastname: '', postcode: '', country: '', bankbsb: '', bankaccount: ''},
        users: [],
        search: '',
        pagination: {},
        headers: [
            { text: 'User Name', value: 'username' }, { text: 'Password', value: 'password' }, { text: 'Email', value: 'email' },
            { text: 'Role', value: 'role' }, { text: 'Address1', value: 'address1' }, { text: 'Address2', value: 'address2' }
        ],
        countries: ['Australia', 'Canada', 'China', 'France', 'Malaysia', 'Singapore', 'United Kingdom', 'United States'],
        roles: ['customer', 'manager', 'guest'],
        valid: false,
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        usernameRules: [
          (v) => !!v || 'Username is required',
          (v) => v && v.length <= 10 || 'Username must be less than 10 characters'
        ]
    },
    methods: {
        save: function () {
            if(this.user.username=='' || this.user.password=='' || this.user.email==''){
                this.error = 'username, password and email fields are required';
                return;
            }
            this.error = '';
            this.result = 'Saving data to server...';
            var postdata = { "op": "save", "data": this.user };
            //console.log(JSON.stringify(postdata));
            this.$http.post('php/apiUser.php', postdata,{
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                this.getAllData();
                
                this.result = response.body;
                this.user.id = 0;
                this.user.username = '';
                this.user.password = '';
                this.user.email = '';
                this.user.role = '';
                this.user.address1 = '';
                this.user.address2 = '';
                this.user.town = '';
                this.user.firstname = '';
                this.user.lastname = '';
                this.user.postcode = '';
                this.user.country = '';
                this.user.bankbsb = '';
                this.user.bankaccount = '';                
            }, response => {
                    this.result = 'Failed to save data to server.';
            });
        },
        editItem: function(item){
            this.user.id = item.id;
            this.user.username = item.username;
            this.user.password = item.password;
            this.user.email = item.email;
            this.user.role = item.role;
            this.user.address1 = item.address1;
            this.user.address2 = item.address2;
            this.user.town = item.town;
            this.user.firstname = item.firstname;
            this.user.lastname = item.lastname;
            this.user.postcode = item.postcode;
            this.user.country = item.country;
            this.user.bankbsb = item.bankbsb;
            this.user.bankaccount = item.bankaccount;
        },
        deleteItem: function(item){
            var r = confirm("Are you sure to delete this item?");
            if(r==true) {
                this.result = 'Deleting data to server...';
                var postdata = { op: "delete", id: item.id };
                this.$http.post('php/apiUser.php', JSON.stringify(postdata),{
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => { this.result = response.body;
                                      this.getAllData();
                }, response => { this.result = 'Failed to delete data.';
                });
            }
        },
        getAllData: function () {
            this.result = 'Getting data to server...';
            var postdata = { op: "getUsers" };
            this.$http.post('php/apiUser.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                this.result = '';
                this.users = response.body.data;
            }, response => { this.result = 'Failed to load data to server.';
            });
        }
    },
    beforeMount(){ this.getAllData(); }
});
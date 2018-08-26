Vue.filter('currency', function(val, dec) {
    return accounting.formatMoney(val, '$', dec)
});
Vue.filter('number', function(val, dec) {
    return accounting.formatNumber(val, dec, ',', '.')
});

const cashFlow = Vue.component('cashComponent', {
  template: `
  <div id="cashTable">
  <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">
    <v-tab v-for="filter in filterList" :key="filter.activity">{{filter.activity}}</v-tab>
      <v-tab-item v-for="filter in filterList" :key="filter.activity">

          <v-data-table :headers="columns" :items="filteredRecords(filter.activity)">
            <template slot="items" slot-scope="props">   
              <td class="text-xs-left">{{ props.item.username }}</td>                             
              <td class="text-xs-left">{{ props.item.date | moment }}</td>
              <td class="text-xs-left">{{ props.item.value }}</td>
              <td class="text-xs-left">{{ props.item.activity }}</td>
              <td class="text-xs-left">{{ props.item.description }}</td>
              <td>{{ props.item.reference_number }}</td>
              <td>{{ props.item.id }}</td>
            </template>      
          </v-data-table>         
      </v-tab-item>
    </v-tab>
  </v-tabs>
  </div>
  `,
  data () {
    return {
      tabs: null,
      filterList: [
        { activity: 'deposit' },
        { activity: 'withdrawal' }
      ],
      columns: [   
        { text: 'Username', value: 'username' },  
        { text: 'Date', value: 'date' },    
        { text: 'Amount($)', value: 'value'},
        { text: 'Activity', value: 'activity' },
        { text: 'Description', value: 'description' },
        { text: 'Reference', value: 'reference_number' },
        { text: 'Id', value: 'id' }            
      ],
      myrecords: [],
    }
  },
  created () {
    let qry = 'database/json_cashflow.php?username=' + this.$store.state.loginUser.username;
    axios.get(qry)
      .then(response => { this.myrecords = response.data; })  
      .catch(error => { console.log(error) });  
  },
  methods: {
    filteredRecords(key) {
      const res = this.myrecords
      if (key) { return this.myrecords.filter(myrecord => myrecord.activity === key) }
      return res
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format('L');
    }
  }
});

const loginCustomer=Vue.component('custComponent', {
  template: `
  <v-content>
    <navbars></navbars>
    <h2>My Profile</h2>    
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm12 md6 class="my-3">
          <v-card color="grey lighten-4" flat height="200px">
          
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-side-icon><img src="images/tristars2.png" width="70" height="40"></v-toolbar-side-icon>
      <v-toolbar-title>AFL Tournaments</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tabs slot="extension" v-model="tabs" color="grey" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
        
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            Personal content
            <v-flex xs12 sm6 d-flex><v-text-field append-icon="person" label="Username" type="text" v-model="user.username"></v-text-field></v-flex>
            <v-flex xs12 sm6 d-flex><v-text-field append-icon="lock" label="Password" type="password" v-model="user.password"></v-text-field></v-flex>
            <v-flex xs6><v-text-field append-icon="email" label="Email" type="text" v-model="user.email"></v-text-field></v-flex>
            <v-flex xs6>
              <v-combobox v-model="user.role" :items="roles" label="Select your role:"></v-combobox>
            </v-flex>
          </v-card-text></v-card></v-tab-item>             
      <v-tab-item>
        <v-icon>motorcycle</v-icon>
        <v-card flat>
          <v-card-text>
            Address content
            <v-layout row wrap>
              <v-flex xs6><v-text-field append-icon="person" label="First name" type="text" v-model="user.firstname"></v-text-field></v-flex>
              <v-flex xs6><v-text-field append-icon="person" label="Last name" type="text" v-model="user.lastname"></v-text-field></v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs6><v-text-field append-icon="home" name="address1" label="Address 1" type="text" v-model="user.address1"></v-text-field></v-flex>
              <v-flex xs6><v-text-field append-icon="home" name="address2" label="Address 2" type="text" v-model="user.address2"></v-text-field></v-flex>
            </v-layout> 
          </v-card-text></v-card></v-tab-item>
      <v-tab-item>
        <v-icon>pets</v-icon>
        <v-card flat>
          <v-card-text>
            Banking Details
            <v-layout row wrap>
              <v-flex xs4><v-text-field append-icon="home" label="Town" type="text" v-model="user.town"></v-text-field></v-flex>
              <v-flex xs4><v-text-field append-icon="home" label="Postcode" type="text" v-model="user.postcode"></v-text-field></v-flex>
              <v-flex xs4><v-select append-icon="outlined_flag" label="Country" v-model="user.country" :items="countries"></v-select></v-flex>
            </v-layout>                        
            <v-layout row wrap>
              <v-flex xs6><v-text-field append-icon="outlined_flag" name="bsb" label="Bank BSB" type="text" v-model="user.bankbsb"></v-text-field></v-flex>
              <v-flex xs6><v-text-field append-icon="home" name="bankaccount" label="Bank account" type="text" v-model="user.bankaccount"></v-text-field></v-flex>
            </v-layout>  
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-icon>build</v-icon>
        <v-card>
        <v-card-text>
          <btComponent></btComponent>
        </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-icon>account_balance</v-icon>
        <v-card>
        <v-card-text>
          <cashComponent></cashComponent>
        </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-icon>face</v-icon>
        <v-card>
        <v-card-text>other</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md6 class="my-3">
          <v-card color="grey lighten-4" flat height="200px">

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
   </v-content>
  `,
  props: {  },
  data () {
    return {
      isActive: false, 
      tabs: null,
      items: ['Personal', 'Address', 'Account', 'Order History', 'Cash Flow', 'Contracts'],
      loading: false,
      status: '', 
      user: { firstname: '', lastname: '', username: '', password: '', email: '', role: '', address1: '', address2: '', town: '', postcode: '', country: '', bankbsb: '', bankaccount: '' },
      countries: ['Australia', 'Canada', 'France', 'Malaysia', 'United Kingdom', 'United States'],
      roles: ['player', 'manager', 'administrator', 'guest'],
      submitted: false
    };
  },
  computed: {
    username() {
      return this.$store.state.loginUser.username;
    }
  },
  created () {
    console.log('1) customerinfo.js: created');
    let qry = 'database/json_users_email.php?email=' + this.$store.state.loginUser.email;   //this.$route.params.userId;
    console.log(qry);   
    axios.get(qry)
      .then(response => { 
        this.user = response.data[0];
        console.log(this.user);
      })  
      .catch(error => { console.log(error) });  
  },
  mounted() { this.isActive = this.selected; },     
});

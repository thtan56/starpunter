const sysManager=Vue.component('sysmanager', {
  template: `
  <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 class="my-3">
          <v-card color="grey lighten-4" flat height="300px">

    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-side-icon><img src="images/tristars2.png" width="70" height="40"></v-toolbar-side-icon>
      <v-toolbar-title>AFL Tournaments</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon href="/home.html"><v-icon>home</v-icon></v-btn>
      <v-btn icon href="/profile.html"><v-icon>folder_open</v-icon></v-btn>

      <v-btn color="success" href="/apiUser.html">Users<v-icon>account_box</v-icon></v-btn>
      <v-btn color="warning" href="/apiProduct.html">New Products<v-icon>directions_run</v-icon></v-btn>
      <v-btn color="info" href="/apiTournament.html#/organiser/nba">Games<v-icon>directions_run</v-icon></v-btn>
      <v-btn color="warning" href="/apiCustomer.html">Customer Profile<v-icon>account_box</v-icon></v-btn>      
      <v-btn color="error" href="/apiRegister.html">Sign Up<v-icon>how_to_reg</v-icon></v-btn>
      <v-btn color="success" href="/apiLogin.html">Sign in<v-icon>input</v-icon></v-btn>
      <!-- v-btn color="info" href="/apiLogin.html">Log out<v-icon>logout</v-icon></v-btn> -->
      <v-btn color="info" href="index.html#/login">Log out<v-icon>logout</v-icon></v-btn>
      <v-btn icon><v-icon>search</v-icon></v-btn>
      <v-btn icon><v-icon>more_vert</v-icon></v-btn>

      <v-tabs slot="extension" v-model="tabs" color="cyan" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-layout column>
          <v-toolbar color="pink" dark><v-toolbar-title>User Management</v-toolbar-title></v-toolbar>
          <v-container fluid grid-list-md>
            <v-form v-model="valid" ref="form">
              <v-layout row wrap>
                <v-flex xs4><v-text-field label="User Name" v-model="user.username" :rules="usernameRules" :counter="10"></v-text-field></v-flex>
                <v-flex xs4><v-combobox v-model="user.role" :items="roles" label="Select your role:"></v-combobox></v-flex>
                <v-flex xs4><v-text-field label="First name" v-model="user.firstname"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Last name" v-model="user.lastname"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Email" v-model="user.email" :rules="emailRules"></v-text-field></v-flex>
                <v-flex xs6><v-text-field label="Address 1" v-model="user.address1"></v-text-field></v-flex>
                <v-flex xs6><v-text-field label="Address 2" v-model="user.address2"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Post Code" v-model="user.postcode"></v-text-field></v-flex>
                <v-flex xs4><v-text-field label="Town" v-model="user.town"></v-text-field></v-flex>
                <v-flex xs4><v-select label="Country" v-model="user.country" :items="countries"></v-select></v-flex>         
                <v-flex xs6><v-text-field label="Bank BSB" v-model="user.bankbsb"></v-text-field></v-flex>
                <v-flex xs6><v-text-field label="Bank Account" v-model="user.bankaccount"></v-text-field></v-flex>
              </v-layout>
              <v-btn @click="save" :class="{ red: !valid, green: valid }">save</v-btn>
              Status: {{ result }}
              <span class="badge badge-danger">{{error}}</span>
              <!-- <button v-on:click="getAllData" class="btn btn-danger">Fetch Data from Server</button> -->
            </v-form>
          </v-container>
          <v-container fluid grid-list-md>
            <v-flex xs12>
              <v-card dark color="primary">
                <div>
                  <v-data-table :headers="headers" :items="users" :search ="search" :pagination.sync="pagination">
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.username}}</td>   <!-- td>{{ props.item.password}}</td  -->
                      <td>{{ props.item.email}}</td>
                      <td>{{ props.item.role}}</td><td>{{ props.item.address1}}</td><td>{{ props.item.address2}}</td>
                      <td class="justify-center layout px-0">
                        <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                        <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </div>            
              </v-card>
            </v-flex>
          </v-container>
        </v-layout>
      </v-tab-item>
      <!-- **************************************************************** -->
      <v-tab-item><v-icon>build</v-icon><v-card><v-card-text><teamcomponent></teamcomponent></v-card-text></v-card></v-tab-item>
      <v-tab-item><v-icon>waves</v-icon><v-card><v-card-text><periodcomponent></periodcomponent></v-card-text></v-card></v-tab-item> <!-- check point 1 -->
      <v-tab-item><v-icon>waves</v-icon><v-card><v-card-text><requestcomponent></requestcomponent></v-card-text></v-card></v-tab-item> <!-- check point 1 -->
      <v-tab-item><v-icon>waves</v-icon><v-card><v-card-text><poolcomponent></poolcomponent></v-card-text></v-card></v-tab-item>
      <v-tab-item><v-icon>waves</v-icon><v-card><v-card-text><gamecomponent></gamecomponent></v-card-text></v-card></v-tab-item>
      <v-tab-item><v-icon>waves</v-icon><v-card><v-card-text><ticketcomponent></ticketcomponent></v-card-text></v-card></v-tab-item>
      <v-tab-item><v-icon>waves</v-icon><v-card><v-card-text><ticketgamescomponent></ticketgamescomponent></v-card-text></v-card></v-tab-item>
      <v-tab-item><v-icon>motor</v-icon><v-card><v-card-text><betcomponent></betcomponent></v-card-text></v-card></v-tab-item>
      <!-- ***************************************************  -->
    </v-tabs-items>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  `,
  props: {  },
  data () {
    return {
      isActive: false, 
      tabs: null,
      items: ['Personal', 'Address', 'Account','Tickets','Cash Flow', 'Bet History', 'Games', 'Pool Summary', 'Contracts'],
      loading: false,
      status: '', 
      user: { firstname: '', lastname: '', username: '', email: '', role: '', address1: '', address2: '', town: '', postcode: '', country: '', bankbsb: '', bankaccount: '' },
      countries: ['Australia', 'Canada', 'France', 'Malaysia', 'United Kingdom', 'United States'],
      roles: ['player', 'manager', 'administrator', 'guest'],
      submitted: false,

      save: '',
   tabs: null,
    items: [ 'User', 'Team','Period', 'Request', 'Pool', 'Games', 'Ticket', 'Ticket Games', 'Bet' ],
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
                      (v) => v && v.length <= 10 || 'Username must be less than 10 characters']




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

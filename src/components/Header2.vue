<template>
  <div>
    <v-toolbar dark class="primary">
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">{{sitename}}</router-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          <div v-if="item.link === ''">
            <v-menu offset-y open-on-hover>
              <v-btn flat primary slot="activator">{{item.title}}<v-icon>arrow_drop_down</v-icon></v-btn>
              <v-list>
                <v-list-tile v-for="(item, i) in item.subMenus" :key="i" @click="$router.push(item.link)">
                  <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
                  <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
          <div v-else>
            <v-btn flat primary slot="activator">{{item.title}}</v-btn>
          </div>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>
      <!-- div v-if="role === 'manager'">
        <topadmbar></topadmbar>
      </div -->
<script>
import store from '../store';
export default {
  name: 'my-header',
  // use store: props: { 'username': {type: String} },
  data () {
    return {
      sitename: 'Starpunter',
      drawer: true,
      menuItems: [],
      menuPrivate: [
        { icon: 'settings_voice', title: 'Home', link:'/' },
        { icon: 'room', title: 'Logout', link: '/login' },  
        { icon: 'settings_voice', title: 'Report Card', link:'',  subMenus: [
              { title: 'My Game Result',    icon: 'rowing'     , link: '/bet/myResults' },
              { title: 'Leadership Ladder' ,icon: 'euro_symbol', link: '/bet/leaders' },
              { divider: true, inset: true },
              { title: 'Pool Result'       ,icon: 'rowing'     , link: '/poolResults'},
              { title: 'Game Result'       ,icon: 'rowing'     , link: '/gameResults'},
              { divider: true, inset: true },
              { title: 'Game Summary'      ,icon: 'rowing'     , link: '/gameSummary'},   // format same as pool result                
              { title: 'Pool Summary'      ,icon: 'rowing'     , link: '/poolSummary'},
              { title: 'User Summary2'      ,icon: 'rowing'     , link: '/userSummary2'},
              ]},
        { icon: 'shopping_cart',             title: 'Bet',       link: '', subMenus: [     
              { title: 'Place Bet', icon: 'rowing',       link: '/bet/dragdrop' },
              { title: 'Bet Status', icon: 'euro_symbol', link: '/bet/status' }
              ]},
        { icon: 'room', title: 'Buy/Sell', link: '', subMenus: [
              { title: 'Buy vCash', icon: 'account_circle',  link: '/request/buy' },
              { title: 'Buy vCash Status', icon: 'lock',     link: '/requeststatus/buy' },
              { divider: true, inset: true },
              { title: 'Buy Ticket', icon: 'account_circle', link: '/ticket/buy' },
              { title: 'Buy Ticket Status', icon: 'lock',    link: '/ticket/status'},
              { divider: true, inset: true },
              { title: 'Sell vCash', icon: 'account_circle', link: '/request/sell' },
              { title: 'Sell vCash Status', icon: 'lock',  link: '/requeststatus/sell' }  
              ]},
        { icon: 'euro_symbol', title: 'Deposit/Withdrawal', link: '', subMenus: [
              { title: 'Deposit Cash', icon: 'account_circle', link: '/request/deposit' },
              { title: 'Deposit Status', icon: 'lock',  link: '/requeststatus/deposit' },
              { divider: true, inset: true },
              { title: 'Withdraw Cash', icon: 'account_circle', link: '/request/withdraw' },
              { title: 'Withdraw Status', icon: 'lock',  link: '/requeststatus/withdraw' }
              ]},
        { icon: 'account_circle', title: 'My Account', link: '', subMenus: [
              { title: 'Customer Info', icon: 'account_circle', link: '/user' },
              { title: 'Change Password', icon: 'lock',  link: '/password/change' },
              { title: 'Reset Password', icon: 'lock',  link: '/password/reset' },
              { title: 'Statement of Account', icon: 'lock',  link: '/statement' },
              { title: 'Log Out',       icon: 'logout', link: '../login' }
              ]}          
      ],
      menuPublic: [
        { icon: 'shopping_cart',  title: 'Register', link: '/register' },  
        { icon: 'room', title: 'Login', link: '/login' },
        { icon: 'euro_symbol', title: 'Echart1', link: '/echart1' },
        { icon: 'settings_voice', title: 'Cash Bar', link: '/echart2' },       
        { icon: 'euro_symbol', title: 'Games', link: '/games' },
        { icon: 'account_circle', title: 'Pools', link: '/pools' }     
      ]
    }  
  },
  // props: ['cartItemCount'],
  computed: {
    role() { return this.$store.state.loginUser.role }
  },
  methods: {
    showCheckout () { this.$router.push({name: 'Form'}) },
    logoff() {
      const { $router, $store } = this;
      $store.dispatch('LOGOFF').then(() => {
        $router.go({ name: 'login' });
      });
    }
  },
  beforeMount () { 
    console.log('1) Header.vue: beforeMount');
    console.log('3) default user role:', this.$store.state.loginUser.role); 
    var username=this.$store.state.loginUser.username;
    console.log('5) username length:', username.length); 
    if (username.length) {
      this.menuItems = this.menuPrivate;
      console.log('7) Header.vue: already login');   // not zero
    } else {
      this.menuItems = this.menuPublic;      
      console.log('8) Header.vue: Not login yet');   // zero
    };
    console.log('9) username:', this.$store.state.loginUser.username)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a { text-decoration: none; color: black; }
.router-link-exact-active {color: blue; }
</style>

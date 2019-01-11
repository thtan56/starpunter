// 1) general public
// 2) need v-bind :myrole in line 10
// 3)   where as role="guest" in index.html (cannot v-bind, otherwise problem)
//-----------------------------
// 4) component:
//    1a) navbars (top & left menus)
//     b) public
//     c) customer
//     d) manager 
//    2a) topboxes
//=========================================
Vue.component('navbars', {
  template: `
  <section class="menu">
    <div v-if="role === 'manager'"><manager></manager></div>
    <div v-else-if="role === 'customer'"><customer></customer></div>
    <div v-else-if="role === 'guest'"><public></public></div>
  </section>
  `,
  computed: {
    role() {
      return this.$store.state.loginUser.role;
    },
  }
});
const navBars = Vue.component('public', {
  template: /* syntax: html */ `
  <div>
    <v-navigation-drawer :clipped="clipped" v-model="drawer" enable-resize-watcher app dark class="primary lighten-3">
      <v-layout row>
        <v-flex xs12 sm12 offset-sm1>
          <v-card>
            <v-toolbar color="teal" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title>Highlights</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>more_vert</v-icon></v-btn>
            </v-toolbar>
            <v-list>
                <v-list-tile v-for="(item, i) in games" :key="i" @click="" :to="item.path">
                  <v-list-tile-action><v-icon>{{ item.action }}</v-icon></v-list-tile-action>
                  <v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
            </v-list>
          </v-card>

          <v-card>
            <v-toolbar color="teal" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title>News</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>more_vert</v-icon></v-btn>
            </v-toolbar>
            <v-list>
              <v-list-tile v-for="(item, i) in newsfeeds" :key="i" @click="" :to="item.path">
                <v-list-tile-action><v-icon>{{ item.action }}</v-icon></v-list-tile-action>
                <v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>


          <v-card>  
            <v-toolbar color="teal" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title>Others</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>more_vert</v-icon></v-btn>
            </v-toolbar>

            <v-list>
              <v-list-group v-for="item in items" v-model="item.active" :key="item.title" :prepend-icon="item.action" no-action>
                <v-list-tile slot="activator"><v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content></v-list-tile>
                
                <v-list-tile v-for="subItem in item.items" :key="subItem.title" @click="" :to="subItem.path">
                  <v-list-tile-content><v-list-tile-title>{{ subItem.title }}</v-list-tile-title></v-list-tile-content>
                  <v-list-tile-action><v-icon>{{ subItem.action }}</v-icon></v-list-tile-action>
                </v-list-tile>
              </v-list-group>
            </v-list>

          </v-card>
        </v-flex>
      </v-layout>
     
    </v-navigation-drawer>
    <!-- end of left menu bar ************************** -->
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>


      <v-btn v-for="item in menuItems" :key="item.title" :to="item.path">
        <v-icon>{{ item.icon }}</v-icon>{{ item.title }}
      </v-btn>

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to='/game/NBA'><img src="images/NBA2.jpg" alt="NBA" class="mb-2" /></v-btn>
        <v-btn to='/game/NBL'><img src="images/NBL2.png" alt="NBL" class="mb-2" /></v-btn>
        <v-btn to='/game/AFL'><img src="images/afl2.png" alt="AFL" class="mb-3" /></v-btn>
        <v-btn to='/game/NFL'><img src="images/nfl2.png" alt="NFL" class="mb-2" /></v-btn>   

        <v-menu bottom left>
          <v-btn slot="activator" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-menu>
      </v-toolbar-items>
      <v-toolbar-title>{{ username }}:{{ myrole }}</v-toolbar-title>
    </v-toolbar>
  </div>
  `,
  data () {
    return {
      clipped: false,
      drawer: false,     // close - left menu bar by default
      menuItems: [
        { icon: 'face', title: 'Sign up', path: '/signup'},
        { icon: 'lock_open', title: 'Sign in', path: '/login' }
      ],
      items: [
        { action: 'help_outline', title: 'Documentations', items: [
              { title: 'User Guide', path: '/userguide' },
              { title: 'Exchange Rate Conversion', path: '/rateguide' } ]},
        { action: 'local_activity', title: 'Basketballs', items: [
              { title: 'Asia Games 2018 Basketball', path: '/AG2018Bas' },
              { title: 'NBA 2018 Basketball', path: '/basketballNBA' },
              { title: 'NBL 2018 Basketball', path: '/basketballNBL' } ]},
        { action: 'restaurant',     title: 'Sport Feeds', active: true, items: [
              { title: 'News Feed-Basketball (NBA)', path: '/newsNBA' },
              { title: 'News Feed-Football (AFL)', path: '/newsAFL' } ]},
        { action: 'local_offer', title: 'Promotions', items: [ 
              { title: 'New Products', path: '/product' } ] }
      ],
      games: [
        { action: 'rowing', title: 'Bets for the week ' + moment().format('W'), path: '/calendar/NBL' },
        { action: 'local_activity', title: 'Asia Games 2018 Basketball', path: '/AG2018Bas' },
        { action: 'local_offer', title: 'NBA 2018 Basketball', path: '/basketballNBA' },
        { action: 'directions_run', title: 'NBL 2018 Basketball', path: '/basketballNBL' }
      ],
      newsfeeds: [
        { action: 'local_activity', title: 'Basketball (NBA)', path: '/newsNBA' },
        { action: 'restaurant', title: 'Football (AFL)', path: '/newsAFL' },
        { action: 'help_outline', title: 'Faqs Database', path: '/faqs' },
      ],
    }
  },
  computed: {
    myrole() {
      return this.$store.state.loginUser.role;
    },
    username() {
      return this.$store.state.loginUser.username;
    }
  }
});
//============================
// 2) secured navigation bars - customer
const navBars2 = Vue.component('customer', {
  template: /* syntax: html */ `
  <div>
    <v-navigation-drawer :clipped="clipped" v-model="drawer" enable-resize-watcher app dark class="primary lighten-3">
      <v-layout row>
        <v-flex xs12 sm12 offset-sm1>
<!-- B) Betting system *********************************************************  -->
          <v-card>
            <v-toolbar color="teal" dark><v-toolbar-title>Betting System</v-toolbar-title></v-toolbar>
            <v-list>
<!-- group 2 (buy ticket, place bet) ============================================== -->
<!-- group 2 -->
              <v-list-tile v-for="(item, i) in games2" :key="i" @click="" :to="item.path">
                <v-list-tile-action><v-icon>{{ item.action }}</v-icon></v-list-tile-action>
                <v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content>
              </v-list-tile>
<!-- group 3 (summary) ============================================== -->              
              <v-list-group v-for="item in items3" v-model="item.active" :key="item.title" :prepend-icon="item.action" no-action>
<!-- level 1 -->
                <v-list-tile slot="activator"><v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content></v-list-tile>
<!-- level 2 -->
                <v-list-tile v-for="subItem in item.items" :key="subItem.title" @click="" :to="subItem.path">
                  <v-list-tile-content><v-list-tile-title>{{ subItem.title }}</v-list-tile-title></v-list-tile-content>
                  <v-list-tile-action><v-icon>{{ subItem.action }}</v-icon></v-list-tile-action>
                </v-list-tile>
              </v-list-group>              
<!-- ============================================================== -->
            </v-list>
          </v-card>
          <!-- ****************************************************** -->
          <v-card>
            <v-toolbar color="teal" dark><v-toolbar-title>Miscellaneous</v-toolbar-title></v-toolbar>
            <v-list>
              <v-list-group v-for="item in items" v-model="item.active" :key="item.title" :prepend-icon="item.action" no-action>
                <v-list-tile slot="activator"><v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content></v-list-tile>
                
                <v-list-tile v-for="subItem in item.items" :key="subItem.title" @click="" :to="subItem.path">
                  <v-list-tile-content><v-list-tile-title>{{ subItem.title }}</v-list-tile-title></v-list-tile-content>
                  <v-list-tile-action><v-icon>{{ subItem.action }}</v-icon></v-list-tile-action>
                </v-list-tile>
              </v-list-group>
            </v-list>
            <v-menu offset-x open-on-hover>
              <v-btn primary slot="activator">
                <v-icon>rowing</v-icon>Beta1<v-icon>arrow_drop_down</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="(item, i) in games" :key="i" @click="" :to="item.path">
                  <v-list-tile-action><v-icon>{{ item.action }}</v-icon></v-list-tile-action>
                  <v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>

    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <!-- ========================================= -->
      <v-menu offset-y open-on-hover>
        <v-btn primary slot="activator">Results<v-icon>arrow_drop_down</v-icon></v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in menuResultItems" :key="i" @click="$router.push(item.link)">
            <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
            <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Bet<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menuBetItems" :key="i" @click="$router.push(item.link)">
              <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
              <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Buy/Sell<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menuBuySellItems" :key="i" @click="$router.push(item.link)">
              <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
              <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Deposit/Withdrawal<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menuCashItems" :key="i" @click="$router.push(item.link)">
              <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
              <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">My Account<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menuProfileItems" :key="i" @click="$router.push(item.link)">
              <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn icon to='/basketballNBA'><img src="images/NBA2.jpg" alt="NBA" class="mb-1" /></v-btn>
        <v-btn icon to='/basketballNBL'><img src="images/NBL2.png" alt="NBL" class="mb-1" /></v-btn>
        <v-btn icon to='/game/AFL'><img src="images/afl2.png" alt="AFL" class="mb-3" /></v-btn>
        <v-btn icon to='/game/NFL'><img src="images/nfl2.png" alt="NFL" class="mb-3" /></v-btn>   

        <!-- v-btn icon href="/checkout.html"><v-icon>shopping_cart</v-icon></v-btn -->
      </v-toolbar-items>
      <v-toolbar-title>Hello {{ username }}-{{ myrole }}</v-toolbar-title>
      <v-subheader>Preferred Sport:{{ organiser }}:{{ round }}({{ displayDate }})</v-subheader>
    </v-toolbar>
  </div>
  `,
  data () {
    return {
      menuResultItems: [
        { title: 'My Game Result', icon: 'rowing',  link: '/bet/myResults' },
        { title: 'Leadership Ladder', icon: 'euro_symbol', link: '/bet/leaders' },
      ], 
      menuBetItems: [
        { title: 'Place Bet', icon: 'rowing',  link: '/bet/dragdrop' },
        { title: 'Bet Status', icon: 'euro_symbol',     link: '/bet/status' },
      ], 
      menuBuySellItems: [
        { title: 'Buy vCash', icon: 'account_circle',  link: '/request/buy' },
        { title: 'Buy vCash Status', icon: 'lock',     link: '/requeststatus/buy' },
        { divider: true, inset: true },
        { title: 'Buy Ticket', icon: 'account_circle', link: '/ticket/buy' },
        { title: 'Buy Ticket Status', icon: 'lock',    link: '/ticket/status' },
        { divider: true, inset: true },
        { title: 'Sell vCash', icon: 'account_circle', link: '/request/sell' },
        { title: 'Sell vCash Status', icon: 'lock',  link: '/requeststatus/sell' },
      ], 
      menuCashItems: [
        { title: 'Deposit Cash', icon: 'account_circle', link: '/request/deposit' },
        { title: 'Deposit Status', icon: 'lock',  link: '/requeststatus/deposit' },
        { divider: true, inset: true },
        { title: 'Withdraw Cash', icon: 'account_circle', link: '/request/withdraw' },
        { title: 'Withdraw Status', icon: 'lock',  link: '/requeststatus/withdraw' },
      ],      
      menuProfileItems: [
        { title: 'Customer Info', icon: 'account_circle', link: '/user' },
        { title: 'Change Password', icon: 'lock',  link: '/password/change' },
        { title: 'Reset Password', icon: 'lock',  link: '/password/reset' },
        { title: 'Log Out',       icon: 'logout', link: '../login' },
      ],
      clipped: false,
      drawer: false,     // close - left menu bar by default
      menuItems: [
//        { icon: 'supervisor_account', title: 'NBL', path: '/gameNBL' },
//        { icon: 'supervisor_account', title: 'AFL', path: '/gameAFL' },
        { icon: 'logout', title: 'Log out', path: '../login' }
      ],
      items: [
        { action: 'local_activity', title: 'Basketballs', items: [
              { title: 'Asia Games 2018 Basketball', path: '/AG2018Bas' },
              { title: 'NBA 2018 Basketball', path: '/basketballNBA' },
              { title: 'NBL 2018 Basketball', path: '/basketballNBL' } ]},
        { action: 'school', title: 'Footballs', items: [ { title: 'AFL Tournaments', path: '/gameAFL' } ]},
        { action: 'directions_run', title: 'Rifles', items: [ { title: 'List Item' }]},
        { action: 'healing', title: 'BaseBalls', items: [ { title: 'List Item' } ]},
        { action: 'content_cut', title: 'Hockeys', items: [ { title: 'List Item' } ] },
        { action: 'local_offer', title: 'Promotions', items: [ 
              { title: 'New Products', path: '/product' } ] }
      ],
      //======== group 2: betting system ===================================
      games2: [
        { action: 'rowing',       title: 'Place Bet',  path: '/bet/dragdrop'},
        { action: 'rowing',       title: 'Bet Status', path: '/bet/status'}
      ],
      items3: [
        { action: 'school', title: 'c) My Summary', items: [
                 { title: 'Cash Balance', path: '/cashbalance' },
                 { title: 'vCash Balance', path: '/vcashbalance' } ] }
      ],
      //======== group 3: miscellaneous ===============================================
      games: [
//        { action: 'rowing', title: 'Bets for the week (quorum based) ' + moment().format('W'), path: '/gameH2H' },
        { action: 'rowing', title: 'Bets for the week ' + moment().format('W'), path: '/calendar/NBL' },
        { action: 'euro_symbol', title: 'Odd Bet for the week ' + moment().format('W'), path: '/betOdds'},
        { action: 'local_activity', title: 'Results for the week ' + moment().format('W'), path: '/gameResults'}, 
        { action: 'local_activity', title: 'Players for the week ' + moment().format('W'), path: '/betPools'},  
        { action: 'rowing',       title: 'Head2Head Bet', path: '/gameH2H'},  

        { action: 'local_offer',    title: 'NBA 2018 Basketball', path: '/basketballNBA' },
        { action: 'directions_run', title: 'NBL 2018 Basketball', path: '/basketballNBL' },
        { action: 'help_outline',   title: 'Faqs Database', path: '/faqs' },
      ],
    }
  },
  computed: {
    myrole()   { return this.$store.state.loginUser.role; },
    username() { return this.$store.state.loginUser.username; },
    organiser(){ return this.$store.state.sport.organiser; },
    round()    { return this.$store.state.sport.round; },
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('DD/MM/YYYY');
      }
    }
  }
});
// 3) secured navigation bars - administrator
const navBars3 = Vue.component('manager', {
  template: `
  <div>
    <v-navigation-drawer :clipped="clipped" v-model="drawer" enable-resize-watcher app dark class="primary lighten-3">
      <v-layout row>
        <v-flex xs12 sm12 offset-sm1>

          <v-card>
            <v-toolbar color="teal" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title>Highlights(path)</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>more_vert</v-icon></v-btn>
            </v-toolbar>
            <!-- ========================================= -->
            <v-menu offset-x open-on-hover>
              <v-btn primary slot="activator">
                <v-icon>rowing</v-icon>Beta1<v-icon>arrow_drop_down</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="(item, i) in menuBetaItems" :key="i" @click="$router.push(item.link)">
                  <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            <!-- ========================================= -->
            <v-list>
                <v-list-tile v-for="(item, i) in games" :key="i" @click="" :to="item.path">
                  <v-list-tile-action><v-icon>{{ item.action }}</v-icon></v-list-tile-action>
                  <v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
            </v-list>
          </v-card>

          <v-card>
            <v-toolbar color="teal" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title>Maintenances(href)</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>more_vert</v-icon></v-btn>
            </v-toolbar>
            <v-list>
                <v-list-tile v-for="(item, i) in maintenances" :key="i" @click="" :href="item.path">
                  <v-list-tile-action><v-icon>{{ item.action }}</v-icon></v-list-tile-action>
                  <v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
            </v-list>
          </v-card>

          <v-card>
            <v-toolbar color="teal" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title>Miscellaneous</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>more_vert</v-icon></v-btn>
            </v-toolbar>

            <v-list>
              <v-list-group v-for="item in items" v-model="item.active" :key="item.title" :prepend-icon="item.action" no-action>
                <v-list-tile slot="activator"><v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content></v-list-tile>
                
                <v-list-tile v-for="subItem in item.items" :key="subItem.title" @click="" :to="subItem.path">
                  <v-list-tile-content><v-list-tile-title>{{ subItem.title }}</v-list-tile-title></v-list-tile-content>
                  <v-list-tile-action><v-icon>{{ subItem.action }}</v-icon></v-list-tile-action>
                </v-list-tile>
              </v-list-group>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>

    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-subheader>{{ username }}:{{ myrole }}<br>{{ displayDate }}:{{ organiser }}:{{ round }} 
      </v-subheader>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to='/basketballNBA'><img src="images/NBA2.jpg" alt="NBA" class="mb-2" /></v-btn>
        <v-btn to='/basketballNBL'><img src="images/NBL2.png" alt="NBL" class="mb-2" /></v-btn>
        <v-btn to='/game/AFL'><img src="images/afl2.png" alt="AFL" class="mb-3" /></v-btn>
        <v-btn to='/game/NFL'><img src="images/nfl2.png" alt="NFL" class="mb-3" /></v-btn>
        <v-btn icon href="/checkout.html"><v-icon>shopping_cart</v-icon></v-btn>
        <v-btn icon href="/database/json_bet_results.php"><v-icon>build</v-icon></v-btn>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Results<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menuResultItems" :key="i" @click="$router.push(item.link)">
              <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
              <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Bet<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menuBetItems" :key="i" @click="$router.push(item.link)">
              <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
              <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Buy<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menu1Items" :key="i" @click="$router.push(item.link)">
              <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Sell<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menu2Items" :key="i" @click="$router.push(item.link)">
              <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Payment<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menu3Items" :key="i" @click="$router.push(item.link)">
              <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">Withdrawal<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menu4Items" :key="i" @click="$router.push(item.link)">
              <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
        <v-menu offset-y open-on-hover>
          <v-btn primary slot="activator">My Account<v-icon>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menu5Items" :key="i" @click="$router.push(item.link)">
              <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- ========================================= -->
      </v-toolbar-items>
    </v-toolbar>
  </div>
  `,
  data () {
    return {
      menuResultItems: [
        { title: 'My Game Result', icon: 'rowing',  link: '/bet/myResults' },
        { title: 'Leadership Ladder', icon: 'euro_symbol', link: '/bet/leaders' },
        { divider: true, inset: true },
        { title: 'Game Result', icon: 'account_circle', link: '/GameResults' },
      ], 
      menuBetItems: [
        { title: 'Place Bet', icon: 'rowing',  link: '/bet/dragdrop' },
        { title: 'Bet Status', icon: 'euro_symbol',     link: '/bet/status' }
      ], 
      menu1Items: [
        { title: 'vCash', icon: 'account_circle',  link: '/request/buy' },
        { title: 'vCash Status', icon: 'lock',     link: '/requeststatus/buy' },
        { title: 'Ticket', icon: 'account_circle', link: '/ticket/buy' },
        { title: 'Ticket Status', icon: 'lock',    link: '/ticket/status' },
      ], 
      menu2Items: [
        { title: 'vCash', icon: 'account_circle', link: '/request/sell' },
        { title: 'vCash Status', icon: 'lock',  link: '/requeststatus/sell' },
      ], 
      menu3Items: [
        { title: 'Cash', icon: 'account_circle', link: '/request/deposit' },
        { title: 'Status', icon: 'lock',  link: '/requeststatus/deposit' },
      ], 
      menu4Items: [
        { title: 'Cash', icon: 'account_circle', link: '/request/withdraw' },
        { title: 'Status', icon: 'lock',  link: '/requeststatus/withdraw' },
      ],      
      menu5Items: [
        { title: 'Customer Info', icon: 'account_circle', link: '/user' },
        { title: 'Change Password', icon: 'lock',  link: '/password/change' },
        { title: 'Reset Password', icon: 'lock',  link: '/password/reset' },
        { title: 'Check out',    icon: 'shopping_cart',  link: '/buyticket' },
        { title: 'Log Out',       icon: 'logout', link: '../login' },
      ],
      menuBetaItems: [
        { action: 'rowing',      title: 'Customer Info', icon: 'account_circle', link: '/user' },
        { action: 'euro_symbol', title: 'Change Password', icon: 'lock',  link: '/password/change' },
        { title: 'Reset Password', icon: 'lock',  link: '/password/reset' },
        { title: 'Check out',    icon: 'shopping_cart',  link: '/buyticket' },
        { title: 'Game Results',  icon: '',       link: '/gameResults' },
        { title: 'Log Out',       icon: 'logout', link: '../login' },
      ],
      clipped: false,
      drawer: true,
      menuItems: [
//        { icon: 'supervisor_account', title: 'NBL', path: '/gameNBL' },
//        { icon: 'supervisor_account', title: 'AFL', path: '/gameAFL' },
        { icon: 'logout', title: 'Log out', path: '/login' }
      ],
      items: [
        { action: 'local_activity', title: 'Basketballs', items: [
              { title: 'Asia Games 2018 Basketball', path: '/AG2018Bas' },
              { title: 'NBA 2018 Basketball', path: '/basketballNBA' },
              { title: 'NBL 2018 Basketball', path: '/basketballNBL' } ]},
        { action: 'school', title: 'Top N Games', items: [ { title: 'Top N Games' , path: '/gameAFL' } ]},      
        { action: 'school', title: 'Footballs', items: [ { title: 'AFL Tournament' , path: '/gameAFL' } ]},
        { action: 'directions_run', title: 'Rifles', items: [ { title: 'List Item' }]},
        { action: 'healing', title: 'BaseBalls', items: [ { title: 'List Item' } ]},
        { action: 'content_cut', title: 'Hockeys', items: [ { title: 'List Item' } ] },
        { action: 'local_offer', title: 'Promotions', items: [ 
              { title: 'New Products', path: '/product' } ] }
      ],
      games: [
        { action: 'rowing', title: 'Bets for the week ' + moment().format('W'), path: '/calendar/NBL' },    // quorum
        { action: 'euro_symbol', title: 'Odd Bet for the week ' + moment().format('W'), path: '/betOdds'},
     
        { action: 'local_activity', title: 'Players for the week ' + moment().format('W'), path: '/betPools'},
        { action: 'local_activity', title: 'Results for the week ' + moment().format('W'), path: '/gameResults'}, 

        { action: 'local_offer', title: 'My Games in the week' + moment().format('W'), path: '/basketballNBL' },
        { action: 'directions_run', title: 'Players List', path: '/users' },
        { action: 'help_outline', title: 'Faqs Database', path: '/faqs' },

        { action: 'school',       title: 'Place Bet', path: '/bet/dragdrop'},  // ddGame.html 
        { action: 'rowing',       title: 'Bet Status', path: '/bet/status'},

        { action: 'rowing',       title: 'Head2Head Bet', path: '/gameH2H'},   
      ],
      maintenances: [
        { action: 'local_activity', title: 'System Manager', path: 'apiUser.html' },
        { action: 'event', title: 'Game Scheduling', path: 'fcGame.html' },
        { action: 'event', title: 'Period Scheduling', path: 'fcPeriod.html' },
        { action: 'local_activity', title: 'Create Game Pools', path: 'php/PoolGamesCreate.php' },
        { action: 'local_offer', title: 'products', path: 'apiProduct.html' },
        { action: 'local_offer', title: 'games', path: 'apiTournament.html' },
      ],
    }
  },
  computed: {
    myrole()   { return this.$store.state.loginUser.role;},
    username() { return this.$store.state.loginUser.username; },
    organiser(){ return this.$store.state.sport.organiser; },
    round()    { return this.$store.state.sport.round; },    
    displayDate: {
      get: function () {
        let $today = new Date;
        return moment($today).format('DD/MM/YYYY');
      }
    }
  }
});
//==================== 2nd row : summaryboxes ==================
Vue.component('topboxes', {
  template: `
    <!-- Info boxes -->
    <div class="row">
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-aqua"><i class="ion ion-ios-gear-outline"></i></span>
          <div class="info-box-content">
            <span class="info-box-text">CPU Traffic</span><span class="info-box-number">90<small>%</small></span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->

      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-red"><i class="fa fa-google-plus"></i></span>
          <div class="info-box-content">
            <span class="info-box-text">Likes</span><span class="info-box-number">41,410</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->

      <!-- fix for small devices only -->
      <div class="clearfix visible-sm-block"></div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-green"><i class="ion ion-ios-cart-outline"></i></span>
          <div class="info-box-content">
            <span class="info-box-text">Sales</span><span class="info-box-number">760</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->

      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">New Members</span>
            <span class="info-box-number">2,000</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->

`,
  data: function () {
    return {
      user: null,
      token: null,
      userInfo: {
        messages: [{1: 'test', 2: 'test'}],
        notifications: [],
        tasks: []
      },
      error: '',
    }
  },
});


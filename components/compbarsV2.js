const TopMenu=Vue.component('topmenu', {
  template: `
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list>
        <leftsidebar></leftsidebar>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Home</router-link>
      </v-toolbar-title>
      
      <topbar></topbar>
      <topsportbar></topsportbar>
      <div v-if="role === 'manager'">
        <topadmbar></topadmbar>
      </div>
    </v-toolbar>
  </div>
  `,
  data: () => { return { drawer: false } },
  computed: {
    role() {
      return this.$store.state.loginUser.role;
    },
  }        
});
const TopAdmBarComponent=Vue.component('topadmbar', {
  template: `
        <v-menu offset-y open-on-hover>
            <v-btn flat primary slot="activator">Administration<v-icon>arrow_drop_down</v-icon></v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in maintenances" :key="i" @click="" :to="item.path">
                <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
                <v-list-tile-title v-else><v-icon>{{ item.action }}</v-icon>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
  `,
  data: () => {
    return {
      maintenances: [
        { action: 'local_activity', title: 'User Manager', path: '/usermanager'},   // 'apiUser.html' },
        { action: 'local_activity', title: 'System Manager', path: '/sysmanager'},   // 'apiUser.html' },
        { action: 'local_activity', title: 'Pool Manager', path: '/poolmanager'},   // 'apiUser.html' },        
        { action: 'event',          title: 'Game Scheduling', path: '/schedule/game' },        // fcGame.html' },
        { action: 'event',          title: 'Period Scheduling', path: '/schedule/period'},     // fcPeriod.html' },
        { action: 'event',          title: 'Game Result Updates',path: '/gameResults'},   // 1) when game is over
        { action: 'event',          title: 'Pool Result Updates(Final)',path: '/poolResults'},   // 2) when season is over (for the week)                            
        { divider: true, inset: true },
        { action: 'local_activity', title: 'Create Game Pools', path: 'php/PoolGamesCreate.php' },
        { action: 'local_offer',    title: 'products', path: 'apiProduct.html' },
        { action: 'local_offer',    title: 'games', path: 'apiTournament.html' } ],
    }        
  }
});
const TopSportBarComponent=Vue.component('topsportbar', {
  template: `
    <v-menu offset-y open-on-hover>
      <v-btn color=primary slot="activator">Sports<v-icon>arrow_drop_down</v-icon></v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in menuSportItems" :key="i" @click="$router.push(item.link)">
              <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
              <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
  `,
  data: () => {
    return {
      menuSportItems: [
              { title: 'NBA',  img: 'images/NBA2.jpg', link: '/game/NBA' },
              { title: 'NBL',  img: 'images/NBL2.jpg', link: '/game/NBL' },
              { title: 'AFL',  img: 'images/afl2.png', link: '/game/AFL' },
              { title: 'NFL',  img: 'images/nfl2.png', link: '/game/NFL' },
              { title: 'Calendar',  link: '/homecalendar' }
              ]
    }
  }        
});
const TopBarComponent=Vue.component('topbar', {
  template: `
    <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon> 
          <v-menu offset-y open-on-hover>
            <v-btn flat primary slot="activator">{{item.title}}<v-icon>arrow_drop_down</v-icon></v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in item.subMenus" :key="i" @click="$router.push(item.link)">
                <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
                <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn flat to="/faqs">
          <span>FAQs</span>
          <v-icon right>help</v-icon>
        </v-btn>
    </v-toolbar-items>
  `,
  data: () => {
    return {
      menuItems: [
        { icon: 'settings_voice',        title: 'Report Card',       link:'', subMenus: [
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
        { icon: 'room', title: 'Buy/Sell', link: '/buysell', subMenus: [
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
      ]
    }
  }        
});
const LeftSideBarComponent=Vue.component('leftsidebar', {
  template: `
    <v-list-group no-action sub-group value="true">
      <v-list-tile slot="activator"><v-list-tile-title>Activities</v-list-tile-title></v-list-tile>

      <v-list-tile v-for="item in menuItems" :key="item.title"  :to="item.link" router>
        <v-list-tile-content>
          <!-- =========================================== -->
          <v-menu offset-x open-on-hover>
            <v-btn flat primary slot="activator">{{item.title}}<v-icon>arrow_drop_down</v-icon></v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in item.subMenus" :key="i" @click="$router.push(item.link)">
                <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
                <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <!-- --------------------------------------------- -->
        </v-list-tile-content>
        <v-list-tile-action><v-icon>{{ item.icon }}</v-icon></v-list-tile-action>
      </v-list-tile>
    </v-list-group>
  `,
  data: () => {
    return {
      menuItems: [
        { icon: 'room',               title: 'Report Card',          link:'/results', subMenus: [
              { title: 'My Game Result', icon: 'rowing',         link: '/bet/myResults' },
              { title: 'Leadership Ladder', icon: 'euro_symbol', link: '/bet/leaders' },
              { title: 'Pool Result'       ,icon: 'rowing'     , link: '/poolResults'},
              { title: 'Game Summary'      ,icon: 'rowing'     , link: '/gameSummary'},   // format same as pool result         
              { title: 'Game Result'       ,icon: 'rowing'     , link: '/gameResults'}   
              ]},
        { icon: 'person',             title: 'Bet',       link: '/bet', subMenus: [     
              { title: 'Place Bet', icon: 'rowing',       link: '/bet/dragdrop' },
              { title: 'Bet Status', icon: 'euro_symbol', link: '/bet/status' }
              ]},
        { icon: 'supervisor_account', title: 'Buy/Sell', link: '/buysell', subMenus: [
              { title: 'Buy vCash', icon: 'account_circle',  link: '/request/buy' },
              { title: 'Buy vCash Status', icon: 'lock',     link: '/requeststatus/buy' },
              { divider: true, inset: true },
              { title: 'Buy Ticket', icon: 'account_circle', link: '/ticket/buy' },
              { title: 'Buy Ticket Status', icon: 'lock',    link: '/ticket/status'},
              { divider: true, inset: true },
              { title: 'Sell vCash', icon: 'account_circle', link: '/request/sell' },
              { title: 'Sell vCash Status', icon: 'lock',  link: '/requeststatus/sell' }  
              ]},
        { icon: 'account_circle', title: 'Deposit/Withdrawal', link: '/depositwd', subMenus: [
              { title: 'Deposit Cash', icon: 'account_circle', link: '/request/deposit' },
              { title: 'Deposit Status', icon: 'lock',  link: '/requeststatus/deposit' },
              { divider: true, inset: true },
              { title: 'Withdraw Cash', icon: 'account_circle', link: '/request/withdraw' },
              { title: 'Withdraw Status', icon: 'lock',  link: '/requeststatus/withdraw' }
              ]},
        { icon: 'account_circle', title: 'Profile', link: '/profile', subMenus: [
              { title: 'Customer Info', icon: 'account_circle', link: '/user' },
              { title: 'Change Password', icon: 'lock',  link: '/password/change' },
              { title: 'Reset Password', icon: 'lock',  link: '/password/reset' },
              { title: 'Log Out',       icon: 'logout', link: '../login' }
              ]}
      ]
    }
  }        
});

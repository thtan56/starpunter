const TopBarComponent=Vue.component('topbar', {
  props: { location: {type: String},
           offset:   {type: String} },
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
    <!-- =======  top bar ================================== -->
    </v-toolbar-items>
  `,
  data: () => {
    return {
      menuItems: [
        { icon: 'settings_voice',               title: 'Results',          link:'/results', subMenus: [
              { title: 'My Game Result', icon: 'rowing',         link: '/bet/myResults' },
              { title: 'Leadership Ladder', icon: 'euro_symbol', link: '/bet/leaders' }
              ]},
        { icon: 'shopping_cart',             title: 'Bet',       link: '/bet', subMenus: [     
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
        { icon: 'euro_symbol', title: 'Deposit/Withdrawal', link: '/depositwd', subMenus: [
              { title: 'Deposit Cash', icon: 'account_circle', link: '/request/deposit' },
              { title: 'Deposit Status', icon: 'lock',  link: '/requeststatus/deposit' },
              { divider: true, inset: true },
              { title: 'Withdraw Cash', icon: 'account_circle', link: '/request/withdraw' },
              { title: 'Withdraw Status', icon: 'lock',  link: '/requeststatus/withdraw' }
              ]},
        { icon: 'account_circle', title: 'My Account', link: '/profile', subMenus: [
              { title: 'Customer Info', icon: 'account_circle', link: '/user' },
              { title: 'Change Password', icon: 'lock',  link: '/password/change' },
              { title: 'Reset Password', icon: 'lock',  link: '/password/reset' },
              { title: 'Log Out',       icon: 'logout', link: '../login' }
              ]}
      ]
    }
  }        
});
// const LeftSideBarComponent=Vue.component('leftsidebar', {
<template>
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
</template>

<script>
export default {
  name: 'leftsidebar',
  data () {
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
        { con: 'supervisor_account', title: 'Buy/Sell', link: '/buysell', subMenus: [
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
};
</script>

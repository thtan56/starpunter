// const navBars3 = Vue.component('manager', {
<template>
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
            <v-list>
                <v-list-tile v-for="(item, i) in games" :key="i" :to="item.path">
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
                <v-list-tile v-for="(item, i) in maintenances" :key="i" :href="item.path">
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
                
                <v-list-tile v-for="subItem in item.items" :key="subItem.title" :to="subItem.path">
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
      <v-toolbar-title>{{ username }}:{{ myrole }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to='/basketballNBA'><img src="images/NBA2.png" alt="NBA" class="mb-2" /></v-btn>
        <v-btn to='/basketballNBL'><img src="images/NBL2.png" alt="NBL" class="mb-2" /></v-btn>
        <v-btn to='/gameAFL'><img src="images/afl.png" alt="AFL" class="mb-3" /></v-btn>
        <v-btn to='/gameNRL'><img src="images/NRL2.png" alt="NRL" class="mb-2" /></v-btn> 
        <v-btn icon href="/checkout.html"><v-icon>shopping_cart</v-icon></v-btn>

        <v-btn v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <v-btn icon><v-icon>more_vert</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  name: 'manager',
  data () {
    return {
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
        { action: 'local_activity', title: 'Bets for the week ' + moment().format('W'), path: '/gameH2H' },
        { action: 'local_activity', title: 'Players for the week ' + moment().format('W'), path: '/gamePools'},
        { action: 'local_activity', title: 'Results for the week ' + moment().format('W'), path: '/gameResults'}, 
        { action: 'euro_symbol', title: 'Bets for the week (odd based) ' + moment().format('W'), path: '/gameOdds'},
        { action: 'local_offer', title: 'My Games in the week' + moment().format('W'), path: '/basketballNBL' },
        { action: 'directions_run', title: 'Players List', path: '/users' },
        { action: 'help_outline', title: 'Faqs Database', path: '/faqs' },
        { action: 'rowing',         title: 'Head to Head Games', path: '/gameH2H'},
      ],

      maintenances: [
        { action: 'local_activity', title: 'users/teams/games/bets', path: 'apiUser.html' },

        { action: 'local_offer', title: 'products', path: 'apiProduct.html' },
        { action: 'local_offer', title: 'games', path: 'apiTournament.html' },
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
};
</script>

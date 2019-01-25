// const TopAdmBarComponent=Vue.component('topadmbar', {
<template>
  <v-menu offset-y open-on-hover>
    <v-btn flat primary slot="activator">Administration<v-icon>arrow_drop_down</v-icon></v-btn>
      <v-list>
        <v-list-tile v-for="(item, i) in maintenances" :key="i" :to="item.path">
          <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
          <v-list-tile-title v-else><v-icon>{{ item.action }}</v-icon>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
</template>

<script>
export default {
  name: 'topadmbar',
  data () {
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
        { action: 'local_activity', title: 'Create Game Pools', path: 'php/PoolGamesCreate.php' },  // production
        { divider: true, inset: true },
        { action: 'local_offer',    title: 'products', path: 'apiProduct.html' },  // test
        { action: 'local_offer',    title: 'games', path: 'apiTournament.html' },  // test
        { action: 'local_activity', title: 'AFL News', path: '/newsAFL'},    // test  
        { action: 'local_activity', title: 'NBA News', path: '/newsNBA'}     // test 
        ],
    }        
  }
};
</script>

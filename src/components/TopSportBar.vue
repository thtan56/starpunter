// const TopSportBarComponent=Vue.component('topsportbar', {
<template>
  <v-menu offset-y open-on-hover>
    <v-btn color=primary slot="activator">Sports<v-icon>arrow_drop_down</v-icon></v-btn>
    <v-list>
      <v-list-tile v-for="(item, i) in menuSportItems" :key="i" @click="$router.push(item.link)">
        <v-divider v-if="item.divider" :inset="item.inset" :key="i"></v-divider>
        <v-list-tile-title v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'topsportbar',
  data () {
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
};
</script>

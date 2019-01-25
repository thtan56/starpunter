// Vue.component('sysmenu', {
<template>
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title"  :to="item.link" router>
          <v-list-tile-action><v-icon>{{ item.icon }}</v-icon></v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark color="cyan">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">{{sitename}}</router-link></v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'sysmenu',   // component name
  props: { sitename: {type: String } },
  data: () => { return { drawer: false } },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: 'home', title: 'Home',    link:'/'},
        { icon: 'face', title: 'Sign up', link:'/signup'},
        { icon: 'lock_open', title: 'Sign in', link:'/login'}, 
        { icon: 'lock_open', title: 'User Manager', link:'/usermanager'},
        { icon: 'lock_open', title: 'System Manager', link:'/sysmanager'},
        { icon: 'lock_open', title: 'Pool Manager', link:'/poolmanager'},
        { icon: 'lock_open', title: 'Test1', link:'/test1'},
        { icon: 'lock_open', title: 'Test2', link:'/test2'},      
         ];
      return menuItems;
    },
  },  
};
</script>

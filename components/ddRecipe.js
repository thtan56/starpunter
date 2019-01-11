const Recipes = Vue.component('recipecomp', {
  template: `
    <v-navigation-drawer persistent v-model="drawer" app>
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action><v-icon>home</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Home</v-list-tile-title></v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action><v-icon>contact_mail</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Contact</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Recipes</v-toolbar-title>
    </v-toolbar>
  `,
});
//=======================================================================
// create a root instance
new Vue({
  el: '#app',
  data: () => ({ drawer: false }),
  components: { 
    'recipecomp': Recipes,
    'menuplan': MenuPlan
  },
});
 //   draggable,

<template>
  <v-content>
    <homebars></homebars>
    <topboxes></topboxes>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar color="blue-grey" dark>
          <v-toolbar-title>Home Page</v-toolbar-title>
        </v-toolbar>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import homebars from './HomeBars.vue'
import topboxes from './TopBoxes.vue';
export default {
  name: 'Home',
  components: { homebars, topboxes }
}
</script>

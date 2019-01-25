// const AFLnews = Vue.component('feed-item2', {
<template>
    <v-content>
      <!-- navbars role="guest"></navbars -->
      <h2> AFL News - Sports News Australia</h2>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 v-for="item in items" :key="item.index">
            <v-card :color="item.feedColor">
              <v-card-title primary-title><div class="headline">{{item.title}} ({{item.pubDate | dtFormat2}})</div></v-card-title>
              <v-card-text>{{item.content | maxText2 }}</v-card-text>
              <v-card-actions><v-btn flat target="_new" :href="item.link">Read on {{item.feedTitle}}</v-btn></v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>     
  </template>
<script>
import Feeds from '../assets/js/newsfeed.js';
import dateFilter from '../filters/feedDateFilter.js';

const textFilter = function(text) {
  // remove html
  text = text.replace(/<.*?>/gi, '')
  if (text.length > 500) text = text.substr(0, 500)
  return text
}
export default {
  name: 'AFLnews',
  props:[ 'color','title','content','link','feedtitle', 'posted' ],
  components: { Feeds },
  filters: {
    dtFormat2: dateFilter,
    maxText2: textFilter
  },
  data() {
    return {
      drawer:true,
      addURL: 'https://www.sportsnews.com.au/category/afl/feed',
      urlError:false,
      urlRules:[],
      feeds: [],
      allItems: [],
      selectedFeed:null
    }
  },
  computed: {
    items:function() {
      if(this.allItems.length === 0) return [];
      let items = [];       // filter
      if(this.selectedFeed) {
        console.log('filtered');
        items = this.allItems.filter(item => {
          return item.feedPk == this.selectedFeed.rsslink;
        });
      } else { items = this.allItems; }
      console.log('computed');
      console.log(items);
      items = items.sort((a, b) => {
        return new Date(b.isoDate) - new Date(a.isoDate);
      });
      return items;
    }
  },
  created() {
    console.log('1) created');
    this.showFeed(this.addURL);
  },
  methods:{
    showFeed(feedURL) {
      fetch(Feeds.rssAPI+encodeURIComponent(feedURL))
        .then(res => res.json())
        .then(res => {
          res.feed.color = Feeds.colors[this.feeds.length % (Feeds.colors.length-1)];     //assign a color first
          res.feed.items.forEach(item => {              // ok, add the items (but we append the url as a fk so we can filter later)
            item.feedPk = this.addURL;
            item.feedColor = res.feed.color;
            this.allItems.push(item);
          });       
        })
    },
  }
};
</script>

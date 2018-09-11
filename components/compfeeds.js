const discoverAPI = 'https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/discoverRss';
const rssAPI = 'https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/getRss?url=';
const colors = ["cyan", "indigo","blue","light-blue","teal","light-green","blue-grey"];

Vue.filter('maxText', function(text) {
  //remove html
  text = text.replace(/<.*?>/gi,'');
  if(text.length > 500) text = text.substr(0,500);
  return text;
});


Vue.filter('dtFormat', function(s) {
  if(!window.Intl) return s;
  // convert to date
  if(!(s instanceof Date)) {
    let orig = s;
    s = new Date(s);
    if(s == 'Invalid Date') return orig;
  }
 
  return new Intl.DateTimeFormat().format(s);
});

const NBAnews = Vue.component('feed-item', {
  props:[ 'color','title','content','link','feedtitle', 'posted' ],
  template: `
    <v-content>
      <navbars></navbars>
      <h2> Basketball News - Sports News Australia</h2>    
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 v-for="item in items" :key="item.index">
            <v-card :color="item.feedColor">
              <v-card-title primary-title><div class="headline">{{item.title}} ({{item.pubDate | dtFormat}})</div></v-card-title>
              <v-card-text>{{item.content | maxText }}</v-card-text>
              <v-card-actions><v-btn flat target="_new" :href="item.link">Read on {{item.feedTitle}}</v-btn></v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  `,
  data() {
    return {
      drawer:true,
      addURL:'https://www.sportsnews.com.au/category/basketball/feed',
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
    console.log('1) created-compfeeds.js');
    this.showFeed(this.addURL);
  },
  methods:{
    showFeed(feedURL) {
      console.log('2) showFeed');
      fetch(rssAPI+encodeURIComponent(feedURL))
        .then(res => res.json())
        .then(res => {
          res.feed.color = colors[this.feeds.length % (colors.length-1)];     //assign a color first
          res.feed.items.forEach(item => {              // ok, add the items (but we append the url as a fk so we can filter later)
            item.feedPk = this.addURL;
            item.feedColor = res.feed.color;
            this.allItems.push(item);
          });       
        })
    },
  }
});
const AFLnews = Vue.component('feed-item2', {
  props:[ 'color','title','content','link','feedtitle', 'posted' ],
  template: `
    <v-content>
      <navbars role="guest"></navbars>
      <h2> AFL News - Sports News Australia</h2>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 v-for="item in items" :key="item.index">
            <v-card :color="item.feedColor">
              <v-card-title primary-title><div class="headline">{{item.title}} ({{item.pubDate | dtFormat}})</div></v-card-title>
              <v-card-text>{{item.content | maxText }}</v-card-text>
              <v-card-actions><v-btn flat target="_new" :href="item.link">Read on {{item.feedTitle}}</v-btn></v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>     
  `,
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
      fetch(rssAPI+encodeURIComponent(feedURL))
        .then(res => res.json())
        .then(res => {
          res.feed.color = colors[this.feeds.length % (colors.length-1)];     //assign a color first
          res.feed.items.forEach(item => {              // ok, add the items (but we append the url as a fk so we can filter later)
            item.feedPk = this.addURL;
            item.feedColor = res.feed.color;
            this.allItems.push(item);
          });       
        })
    },
  }
});

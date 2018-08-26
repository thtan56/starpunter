//not being used yet :>
const discoverAPI = 'https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/discoverRss';
const rssAPI = 'https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/getRss?url=';

// list of colors to iterate through
/* original COMPLETE list ...
const colors = ["red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","blue-grey","grey"];
*/
// nicer, I think, list
const colors = ["indigo","blue","cyan","light-blue","teal","light-green","blue-grey"];

Vue.filter('maxText', function(text) {
	//remove html
	text = text.replace(/<.*?>/gi,'');
	if(text.length > 500) text = text.substr(0,500);
	return text;
});

let app = new Vue({ 
	el: '#app',
	data() {
		return {
			drawer:true,
			showIntro:false,
			addFeedDialog:false,
			addURL:'http://feeds.feedburner.com/raymondcamdensblog',
			feedURL2: 'https://www.sportsnews.com.au/category/basketball/feed',
			urlError:false,
			urlRules:[],
			feeds:[],
			allItems:[],
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
			items = items.sort((a, b) => {
				return new Date(b.isoDate) - new Date(a.isoDate);
			});
			return items;
		}
	},
	created() {
		console.log('1) created');
		this.restoreFeeds();           // to display side  
		if(this.feeds.length === 0) this.showIntro = true;
		this.showFeed(this.feedURL2);
//		localStorage.removeItem('feeds');
	},
	methods:{
		addFeed() {
			console.log('Add Feed');
			this.addFeedDialog = true;
		},
		allFeeds() { this.selectedFeed = null; },
		addFeedAction() {
			console.log('11) addFeedAction');
			this.urlError = false;
			this.urlRules = [];
			//first, see if new
			if(this.feeds.findIndex((feed) => {
				return (feed.rsslink === this.addURL);
			}) >= 0) {
				this.urlError = true;
				this.urlRules = ["URL already exists."];
				return;
			} else {
				console.log('11b) fetch:'+this.addURL);
				fetch(rssAPI+encodeURIComponent(this.addURL))
				.then(res => res.json())
				.then(res => {
					console.log('11c)res:');
					console.log(res);
					this.addURL = '';   	// ok for now, assume no error, cuz awesome
					res.feed.color = colors[this.feeds.length % (colors.length-1)];   	//assign a color first
					res.feed.items.forEach(item => {							// ok, add the items (but we append the url as a fk so we can filter later)
						item.feedPk = this.addURL;
						item.feedColor = res.feed.color;
						this.allItems.push(item);
					});					
					delete res.feed.items;						// delete items			
					res.feed.rsslink = this.addURL;   // add the original rss link
					this.feeds.push(res.feed);
					this.addFeedDialog = false;
					this.showIntro = false;		//always hide intro
					this.storeFeeds();		//persist the feed, but not the items
				});
			}

		},
		filterFeed(feed) {
			console.log('21) filterFeed');
			console.log(feed);
			this.selectedFeed = feed;
			console.log('21b) fetch:'+feed.feedUrl);
			this.showFeed(feed.feedURL);
		},
		showFeed(feedURL) {
			fetch(rssAPI+encodeURIComponent(feedURL))
				.then(res => res.json())
				.then(res => {
					this.addURL = '';   	// ok for now, assume no error, cuz awesome
					res.feed.color = colors[this.feeds.length % (colors.length-1)];   	//assign a color first
					res.feed.items.forEach(item => {							// ok, add the items (but we append the url as a fk so we can filter later)
						item.feedPk = this.addURL;
						item.feedColor = res.feed.color;
						this.allItems.push(item);
					});				
				})
		},
		loadFeed(feed) {
			console.log('3) loadFeed');
			console.log(feed);
			fetch(rssAPI+encodeURIComponent(feed.rsslink))
			.then(res => res.json())
			.then(res => {
				// ok for now, assume no error, cuz awesome
				res.feed.items.forEach(item => {
					item.feedPk = feed.rsslink;
					item.feedTitle = feed.title;
					item.feedColor = feed.color;
					this.allItems.push(item);
				});
			});
		},
		restoreFeeds() {
			console.log('2) restoreFeeds');
			let feeds = localStorage.getItem('feeds');
			console.log(feeds);

			if(feeds) {
				this.feeds = JSON.parse(feeds);
				this.feeds.forEach((feed,idx) => {
					feed.color = colors[idx % (colors.length-1)];
					this.loadFeed(feed);
				});
			}
		},
		storeFeeds() {
			console.log('calling storeFeeds');
			localStorage.setItem('feeds', JSON.stringify(this.feeds));
		}
	}
});

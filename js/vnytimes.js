// ./app.js
const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const ApiKey = "85073cd9ef9647d49428c40c697baa7b";

function buildUrl(url) {
	return NYTBaseUrl + url + ".json?api-key="+ApiKey;
}

const vm = new Vue({
	el: '#app',

	data: {
		posts:''
	},
	mounted() {	this.getPosts('home'); },
	methods: {
		getPosts(section) {
			let url = buildUrl(section);
			axios.get(url).then((response) => {
				this.posts = response.data.results;
				console.log("1) getPosts:"+section) 
				console.log(this.posts);
			}).catch(error => { console.log(error); });
		}
	}   		// methods
});

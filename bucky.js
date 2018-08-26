
Vue.component('toggle-component', {
	props: ['content'],
  template:`
  <div>
  	<button @click='toggle()'>Open/Close</button>
               <span v-show=\"isOpen\">{{ content }} clicked {{ clicked }}</span>
  </div>
	`,
	data: function () {
		return {
			isOpen: false,
			clicked: 0

		}
	},
	methods: {
		toggle: function () {
			this.isOpen = !this.isOpen;
			this.clicked += 1;
		}
	}
});

new Vue({
    el: '#app',
    data: {
    	isOpen: false
    },
    methods: {
    }
});

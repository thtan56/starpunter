const Foo = {template: '<div>foo component</div>'};
const Form1 = Vue.component('simpletemplate', {
	template: '<p>button v-on:click="say" class="btn btn-primary">Speak from component</button></p>',
	data: function() {
		return {
			yourname: 'vue.js 2.0'
			}
	},
	methods: {
		say: function() {
			alter('hello' + this.$data.yourname + '!');
		}
	}
});
const Form2 = Vue.component('xtemplate', {
	
})
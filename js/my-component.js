
var component1 =  httpVueLoader('vue/my-component.vue');

new Vue({
	el: '#my-app',
 	components: {
   		'my-component' : component1
 	},
 	data: {
 	},
 	methods:{
 	}
});

var component1 =  httpVueLoader('vue/my-todo.vue');

Vue.component('todo-item', {
	props: ['todo'],
    template: '<li>{{ todo.task }}</li>'
});

new Vue({
	el: '#my-app2',
 	components: {
   		'my-todo' : component1
 	},
	data: {
    	todos: [
        	{ task: 'Learn JavaScript'},
            { task: 'Learn VueJS'},
            { task: 'Build awesome stuff'}
         ]
    },
 	methods:{
 	}
});
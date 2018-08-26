<template>
	<div id="app">
		<h3>Hello World</h3>
		<br>
		{{ fullName }}
		<p>
		</p>
		<br>
	</div>
</template>
<script>
	export default {
		name: 'app',
		components: {	
		},
		data() {
			return {
				level: 500,
				firstName: "Thian Huat",
				lastName: "Tan"
			}
		},
		computed: {
			fullName() {
				return this.firstName + " " + this.lastName
			}
		},
		methods: {

		}
	}     // export
</script>
<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>

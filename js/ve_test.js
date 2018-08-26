import VueEvents from '../lib/vue-events-3.1.0.js'
Vue.use(VueEvents)
//import VueEvents from 'vue-events';
//VueEvents ('vue-events');
//Vue.use(VueEvents);
// create a root instance
new Vue({
    data() {
        return {
            exports:'',
            eventData: {
                foo: 'baz'
            }
        }
    },
    mounted() {
      var exports="";
        // Option #1
        this.$events.fire('testEvent', this.eventData);
        // Option #2
        this.$events.emit('testEvent', this.eventData);
        // Option #3
        this.$events.$emit('testEvent', this.eventData);
    }

});

// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vuetify'
import './plugins/sweetalert2'
import VueResource from 'vue-resource'
import VueShowdown from 'vue-showdown'
//---------------------------------------
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // bs 4 - topboxes
import 'font-awesome/css/font-awesome.min.css';
import 'admin-lte/dist/css/AdminLTE.min.css';  // bs 3
import 'admin-lte/dist/css/skins/skin-blue.min.css';
Vue.use(VueResource)
Vue.use(VueShowdown)
// import fullCalendar from 'vue-fullcalendar'
// Vue.component('full-calendar', fullCalendar)
//-------------------------------
window.eventBus = new Vue();
Vue.config.productionTip = false;
import './filters/myGlobalFilters.js';
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

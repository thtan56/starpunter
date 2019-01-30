// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vuetify'
import './plugins/sweetalert2'
import './plugins/awesome'
import './plugins/showdown'
import './plugins/resource'
//---------------------------------------
import 'bootstrap/dist/css/bootstrap.min.css'; // bs 4 - topboxes
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'admin-lte/dist/css/AdminLTE.min.css';  // bs 3
import 'admin-lte/dist/css/skins/skin-blue.min.css';
// import 'font-awesome/css/font-awesome.min.css';  // fas 4
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

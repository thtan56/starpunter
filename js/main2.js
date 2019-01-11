const Users = { template: '<div>Users</div>' }
const Signup = { template: '<div>Signup</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Baz = { template: '<div>baz</div>' }

const router = new VueRouter({
  mode: 'history',
  routes : [
    { path: '/usermanager', component: userManager },     // components/customerinfo.js
    { path: '/poolmanager', component: poolManager },  
    { path: '/user/:username', name: "sysuser", component: sysUser, props: true },
    { path: '/sysmanager',  beforeEnter() { location.href='sysManager.html' } },  
    { path: '/test1',  components: { default: Foo, a: Bar, b: Baz }  },  
    { path: '/test2',  components: { default: Baz, a: Bar, b: Foo }  } 
  ]
})

const vm = new Vue({
  el: '#app',
  router,
  data: { 
    selected: {},
  },
  methods: {
    updateSelected(obj) {
      this.selected = obj;     // from child tgame-list
    }
  },
  created () {
    console.log('1) main2.js :created');  // cannot have logic here due to async file reading
    router.replace('/usermanager')
  }
});

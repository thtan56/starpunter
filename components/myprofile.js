Vue.use(Vuetable);       // vue-table-2

Vue.component('echart', VueECharts);  // register to use
Vue.component('v-select',VueSelect.VueSelect);

Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
//        {path : '/videos',  name: 'allVideos', component: Videos },
//        {path : '/videos/:id/edit', name: 'editVideo', component: VideoEdit },
    ]
});

new Vue({
  el: '#app',
  router,
  store,
//  components:{
//    'vuetable':Vuetable.Vuetable,
//    'vuetable-pagination-info': Vuetable.VuetablePaginationInfo,
//    'vuetable-pagination': Vuetable.VuetablePagination,
//    cComponent,
//    tComponent,
//  },
  data () {
    return {
      tabs: null,
      g1items: ['Customer Info', 'Order History', 'Tournaments', 'Contracts'],
      username: '', 
      loading: false,

      submitted: false,
      //      baseUrl: 'http://vueapp.test/database/',
      search: '',
      pagination: {},
      selected: [],
      totals: { lastprice: 50, dividend: 200 },
      rows: [],
      columns: [
        { text: 'Id', value: 'id' },        
        { text: 'Ticker', value: 'ticker' },
        { text: 'Sector', value: 'sector' },
        { text: 'PE', value: 'pe' },        
        { text: 'Earning', value: 'earning' },
        { text: 'Dividend', value: 'dividend' },
        { text: 'Last Price', value: 'lastprice' },        
        { text: 'Avg Returns', value: 'retavg' },
        { text: 'Std Dev', value: 'stddev' },
        { text: 'Sharpe', value: 'sharpe' },
        { text: 'Max DrawDown', value: 'maxdrawdown' }
      ]
    };
  },
  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0;
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    }
  },
  created () {
    console.log('1) Profile:created' + this.$store.state.myId);
    let qry = this.$store.state.baseUrl + 'json_stocks_sector.php?sector=FINANCE';   
    axios.get(qry)
      .then(response => { 
        this.rows = response.data;
        console.log('this.rows');
        console.log(this.rows);
      })  
      .catch(error => { console.log(error) });      
  },
  mounted: function () {
    console.log('2) mounted');      // get data for dt3sharpes table
    // this.$refs.vuetable2.setData(this.dt2finances);   // *** 4) dt2finances
  },
  methods: { }      
});

Vue.use(Vuetable);       // vue-table-2

Vue.component('my2datatable', {
  template:
  `
  `
});
// create a root instance
new Vue({
  el: '#dt2',
  components:{
    'vuetable':Vuetable.Vuetable,
    'vuetable-pagination-info': Vuetable.VuetablePaginationInfo,
    'vuetable-pagination': Vuetable.VuetablePagination
  },
  data() { 
    return {
//------------------------------------------      
      fields2: ['ticker', 'qtr'], 
      localData2: [],      
      dataCount2: 0,        
//-----------------------------------------------------
      css: { 
        table: {
          tableClass: "table table-striped table-bordered",
          loadingClass: "loading",
          ascendingIcon: "glyphicon glyphicon-chevron-up",
          descendingIcon: "glyphicon glyphicon-chevron-down",
          handleIcon: "glyphicon glyphicon-menu-hamburger",
          renderIcon: function (classes, options) {
            return '<span class="' + classes.join(' ') + '"></span>'
          }
        }
      }
    }
  },
  computed: {  },
  watch: {
    localData2 (newVal, oldVal) { this.$refs.vuetable2.refresh()}
  },
  created() {
    console.log("1) created-call axios");
    axios
      .get("json_stocks_fin2.php")
      .then(response => { 
        this.localData2 = response.data.data;
        console.log("1c) axios2->localData2 (5)");
//        console.log(this.localData2); 
      });     
  },
  mounted() {
    this.$refs.vuetable2.setData(this.localData2);    
    console.log("3) mounted: localData2(empty):", this.localData2);
    console.log("3c) localData2 links to vuetable2");    
  },
  methods: {
    onPaginationData2(paginationData) {this.$refs.pagination2.setPaginationData(paginationData); },    
    onChangePage2(page)              { this.$refs.vuetable2.changePage(page); },    
    dataManager2(sortOrder, pagination) {               
      console.log("2c) dataManager2 (4)");
      let local = this.localData2;                                   // 1) localData2
      if (sortOrder.length > 0) { local = _.orderBy(local, sortOrder[0].sortField, sortOrder[0].direction); };
      pagination = this.$refs.vuetable2.makePagination(local.length); // 2) vuetable2  - total records; change 3 fields: curr_page, from , to
      return {
        pagination: pagination,                                      
        data: _.slice(local, pagination.from - 1, pagination.to)
      };
    }      // dataManager
  }        // methods 
});
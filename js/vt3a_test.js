Vue.use(Vuetable);       // vue-table-2

//Vue.component('my-detail-row', DetailRow);
Vue.component('my1datatable', {
//  props: { 
//    rowData:  { type: Object, required: true },
//    rowIndex: { type: Number },
//    setData: Function },
  template:
  ` 
  `,
//  methods: { onClick (event) { console.log('my-detail-row: on-click', event.target)}}
});   
// create a root instance
new Vue({
  el: '#dt1',
  components:{
    'vuetable':Vuetable.Vuetable,
    'vuetable-pagination-info': Vuetable.VuetablePaginationInfo,
    'vuetable-pagination': Vuetable.VuetablePagination
  },
  data() { 
    return {
//------------------------------------------       
      fields: ['__handle', '__checkbox', '__sequence',
          {name: 'name', sortField: 'name', title: '<span class="orange glyphicon glyphicon-user"></span> Full Name'},
          {name: 'email',sortField: 'email'},
          {name: 'birthdate',sortField: 'birthdate'},
          {name: 'nickname', sortField: 'nickname'},
          {name: 'gender',   sortField: 'gender'},
          {name: '__slot:actions',title: 'Actions', titleClass: 'text-center'}
      ],
      localData: [],
      dataCount: 0,
      searchFor: "",   
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
    localData (newVal, oldVal)  { this.$refs.vuetable.refresh()},
  },
  created() {
    console.log("1) created-call axios");
    axios
      .get("https://vuetable.ratiw.net/api/users?per_page=100")
      .then(response => { 
        this.localData = response.data.data;
        console.log("1b) axios1->localData (4)");
      });
  },
  mounted() {
    this.$refs.vuetable.setData(this.localData); 
    console.log("3) mounted: localData(empty):", this.localData);
    console.log("3b) localData  links to vuetable"); 
  },
  methods: {
    onPaginationData(paginationData) { this.$refs.pagination.setPaginationData(paginationData); }, 
    onChangePage(page)               { this.$refs.vuetable.changePage(page); }, 
    editRow(rowData) {   alert("You clicked edit on" + JSON.stringify(rowData));    },
    deleteRow(rowData) { alert("You clicked delete on" + JSON.stringify(rowData));  },
    dataManager(sortOrder, pagination) {
      console.log("2b) dataManager (4b) (call twice: 2(empty) & last(with data) ): ");
//      console.log(sortOrder, pagination, this.localData);
      let data = this.localData;
      if (this.searchFor) {                          // search function (can be generic if search not needed)
        let txt = new RegExp(this.searchFor, "i");
        data = _.filter(data, function(item) {      // pass data record
          return (
            item.name.search(txt) >= 0 ||          // data field 1
            item.email.search(txt) >= 0 ||          // data field 2
            item.nickname.search(txt) >= 0          // data field 3
          );
        });
      };
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        data = _.orderBy(data, sortOrder[0].sortField, sortOrder[0].direction);
      };
      pagination = this.$refs.vuetable.makePagination(data.length);
      return {
        pagination: pagination,
        data: _.slice(data, pagination.from - 1, pagination.to)
      };
    },      // dataManager
  }        // methods 
});
//===========================
// notes
// I managed to reload vuetable for non-api table when data is changed in the background with 
//    this.$refs.vuetable.setData(this.data).
//
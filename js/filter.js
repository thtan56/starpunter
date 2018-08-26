Vue.use(VueTables)
//Vue.use(VueTables.ClientTable);       // vue-table-2
//Vue.component('v-select',VueSelect.VueSelect);

const ClientTable = VueTables.ClientTable
const Event = VueTables.Event // import eventbus

console.log(VueTables);
Vue.use(ClientTable)

new Vue({
  el: "#people",
  methods: {
  	applyFilter(letter) {
    	this.selectedLetter = letter;
    	Event.$emit('vue-tables.filter::alphabet', letter);
    }
  },
  data() {
    return {
    	letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    selectedLetter: '',
      columns: ['ticker', 'price', 'sector', 'favorite', 'sharpe', 'mdd', 'close', 'retavg', 'sd'],
      tableData: [
        { id: 1,  name: "John", age: "20"},
        { id: 2,  name: "Jane", age: "24"}, 
        { id: 3,  name: "Susan",age: "16"},
        { id: 4,  name: "Chris",age: "55"},
        { id: 5,  name: "Dan",  age: "40"}],
      options: {
        customFilters: [{
          name: 'alphabet',
          callback: function(row, query) {
            return row.ticker[0] == query;
          }
        }]
      }
    }
  },
  created() {
    console.log("1) created()");
    axios.get('json_stocks_sharpe_all.php')      // get sector list
      .then( response => {
        this.tableData = response.data;
      })
      .catch(error => { console.log(error); });
//   this.drawGroupCharts("F", 1);    // favourite 1
  }
});

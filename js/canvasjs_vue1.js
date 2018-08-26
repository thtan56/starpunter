var vm2= new Vue({
  el: '#app',
  data() {
    return {
      dps : [],
      loading: false,

      chartOptions: {
    	  title: {text: "CanvasJS Chart in Vue.js"},
        data: [ {
          type: "bar",
          dataPoints: []
        }]
      },
      chart : null      
    }
  },
  mounted: function () {
    this.fillData();
    console.log("dps2");
    console.log(this.dps);    
    this.chartOptions.data[0].type = "column";
//		this.chart = new CanvasJS.Chart("chartContainer", this.chartOptions);
    //    this.chartOptions.data[0].dataPoints = this.dps;

//    this.chart.render();
  },
  methods: {
    fillData: function() {
      axios.get('json_fav_stocks.php?favorite=1')
      .then( (response) => {
        this.dps = response.data;                  
      }, (error) => {
        console.log(error);
      })     
    }
  },
});
//      for (var i=0; i < data.length; i++) {
//        this.chartOptions.data[0].dataPoints.push({
//                    label: data[i].label,
//                    y: data[i].y
//        });
//          dataPoints: [
//            { x: 10, y: 71 },
//            { x: 20, y: 55 },
//            { x: 30, y: 50 },
//            { x: 40, y: 65 },
//            { x: 50, y: 95 },
//            { x: 60, y: 68 },
//            { x: 70, y: 28 },
//            { x: 80, y: 34 },
//            { x: 90, y: 14 }
//          ]
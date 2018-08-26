window.onload = function() {
	var dataSets = [];
	var tickers = [];
	$.getJSON("json_group_tickers.php?type=F&groupid=1", addTickers);
	$.getJSON("json_daily_group.php?type=F&groupid=1", addPrices);
	var chart = new CanvasJS.Chart("chartContainer", {
		height: 400,
		animationEnabled: true,
		theme: "light2",
		title: { text: "Daily Prices - Favorite 1" },
		axisX: { title: "Date", labelAngle: 50 },
		axisY: { title: "Units", titleFontSize: 24 },
		data: []
	});
	function addTickers(data) {					// transfer data to tickers
		console.log('1) addTickers');
		for (var i = 0; i < data.length; i++) {
			tickers.push(data[i].ticker);
		}
		console.log(tickers);
	}
	function addPrices(data) {
		console.log('2) addPrices');
		console.log(data);
		for (var i=0; i < tickers.length; i++) { dataSets.push([]); }   // create array - prepare for pushing data  (2-D array)
		for (var i = 0; i < data.length; i++) {
			for (var t=0; t < tickers.length; t++) {
				if (data[i].ticker==tickers[t]) {
					dataSets[t].push({ x: new Date(data[i].date), y: data[i].price });
				}
			}
		};

		var newSeries = [];							// creating new series
		for(var i=0; i < tickers.length; i++) {
			newSeries = {type:"line", showInLegend: true, name: tickers[i], dataPoints : dataSets[i] };
			chart.options.data.push(newSeries);
		}
		chart.render();	
//		chart.data[0].set("dataPoints", dataPoints1);     // to modify data
	}
}

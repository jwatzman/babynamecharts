var xhr = new XMLHttpRequest();
xhr.open('GET', 'names.db', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function (e) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	window.db = db;

	var v = db.exec('SELECT year,rank FROM names WHERE name = "Joshua" AND gender = 1 ORDER BY year ASC;')[0].values;

	var chart = new Highcharts.Chart({
		chart: {
			type: 'line',
			renderTo: 'chart',
			zoomType: 'x'
		},
		series: [{
			name: 'Rank',
			data: v
		}],
		title: {
			text: 'Boys named Joshua',
		},
		xAxis: {
			minTickInterval: 1
		},
		yAxis: {
			reversed: true,
			min: 0,
			minTickInterval: 1,
			title: {
				text: 'Rank'
			}
		}
	});
};
xhr.send();

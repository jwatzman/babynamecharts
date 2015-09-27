var xhr = new XMLHttpRequest();
xhr.open('GET', 'names.db', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function (e) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	window.db = db;

	var v = db.exec('SELECT year,rank FROM names WHERE name = "Joshua" AND gender = 1 ORDER BY year ASC;')[0].values;
	var labels = [];
	var data = [];
	v.forEach(function(val) {
		labels.push(val[0]);
		data.push(val[1]);
	});

	var ctx = document.getElementById("chart").getContext("2d");
	var chart = new Chart(ctx).Bar({
		labels: labels,
		datasets: [
			{
				label: 'Boys named Joshua',
				data: data
			}
		]
	}, {
		barValueSpacing: 0,
		barDatasetSpacing: 0
	});
};
xhr.send();

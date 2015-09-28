var xhr = new XMLHttpRequest();
xhr.open('GET', 'names.db', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function (e) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	window.db = db;

	google.load('visualization', '1', {'packages':['corechart'], 'callback': function () {
		var v = db.exec('SELECT year,rank FROM names WHERE name = "Joshua" AND gender = 1 ORDER BY year ASC;')[0].values;
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Year');
		data.addColumn('number', 'Rank');
		data.addRows(v);
		var options = {'title': 'Boys named Joshua', 'vAxis': {direction: -1}, 'hAxis': {format: ''}};
		var chart = new google.visualization.LineChart(document.getElementById('gchart'));
		chart.draw(data, options);
	}});
};
xhr.send();

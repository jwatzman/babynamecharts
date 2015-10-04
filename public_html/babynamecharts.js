(function () {

var db = null;
var chart = null;

function init() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'names.db', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function (e) {
		var uInt8Array = new Uint8Array(this.response);
		db = new SQL.Database(uInt8Array);

		chart = new Highcharts.Chart({
			chart: {
				type: 'line',
				renderTo: 'chart',
				zoomType: 'x'
			},
			series: [{
				name: 'Rank'
			}],
			title: {
				text: 'Ready!'
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

		var name_form = document.getElementById('name_form');
		name_form.addEventListener("submit", function (e) {
			e.preventDefault();
			search_by_name(
				name_form.elements.name.value,
				name_form.elements.gender.value === "boys"
			);
		});
	};

	xhr.send();
}

function search_by_name(name, gender) {
	var query =
		'SELECT year,rank FROM names '+
		'WHERE name = :name AND gender = :gender '+
		'ORDER BY year ASC;';

	var stmt = db.prepare(query);
	stmt.bind({':name': name, ':gender': gender});

	var data = []
	while (stmt.step()) {
		data.push(stmt.get());
	}

	stmt.free();

	var gender_text = gender ? 'Boys' : 'Girls';
	chart.series[0].setData(data);
	chart.setTitle({text: gender_text + ' named ' + name});
}

init();

})();

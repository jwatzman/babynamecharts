(function () {

var db = null;
var name_chart = null;
var year_chart = null;

function init() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'names.db', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function (e) {
		var uInt8Array = new Uint8Array(this.response);
		db = new SQL.Database(uInt8Array);

		name_chart = new Highcharts.Chart({
			chart: {
				events: {
					click: function (e) {
						search_by_year(
							Math.round(e.xAxis[0].value),
							name_chart.gender
						);
					}
				},
				renderTo: 'name_chart',
				type: 'line',
				zoomType: 'x'
			},
			tooltip: {
				shared: true
			},
			series: [{
				events: {
					click: function (e) {
						search_by_year(e.point.x, name_chart.gender);
					}
				},
				name: 'Rank',
				yAxis: 0
			}, {
				name: 'Absolute Number',
				yAxis: 1
			}],
			title: {
				text: 'Ready!'
			},
			xAxis: {
				minTickInterval: 1
			},
			yAxis: [{
				labels: {
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				min: 0,
				minTickInterval: 1,
				reversed: true,
				title: {
					style: {
						color: Highcharts.getOptions().colors[0]
					},
					text: 'Rank'
				}
			}, {
				labels: {
					style: {
						color: Highcharts.getOptions().colors[1]
					}
				},
				min: 0,
				opposite: true,
				title: {
					style: {
						color: Highcharts.getOptions().colors[1]
					},
					text: 'Absolute Number'
				}
			}]
		});

		year_chart = new Highcharts.Chart({
			chart: {
				type: 'column',
				renderTo: 'year_chart'
			},
			series: [{
				events: {
					click: function (e) {
						search_by_name(e.point.name, year_chart.gender);
					}
				},
				name: 'Absolute Number'
			}],
			title: {
				text: 'Ready!'
			},
			xAxis: {
				type: 'category'
			},
			yAxis: {
				title: {
					text: 'Absolute Number'
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

		var year_form = document.getElementById('year_form');
		year_form.addEventListener("submit", function (e) {
			e.preventDefault();
			search_by_year(
				year_form.elements.year.value,
				year_form.elements.gender.value === "boys"
			);
		});
	};

	xhr.send();
}

function search_by_name(name, gender) {
	var query =
		'SELECT year,rank,occurances FROM names '+
		'WHERE name = :name AND gender = :gender '+
		'ORDER BY year ASC;';

	var stmt = db.prepare(query);
	stmt.bind({':name': name, ':gender': gender});

	var rank_data = [];
	var occurances_data = [];
	while (stmt.step()) {
		var row = stmt.get();
		rank_data.push([row[0], row[1]]);
		occurances_data.push([row[0], row[2]]);
	}

	stmt.free();

	var gender_text = gender ? 'Boys' : 'Girls';
	name_chart.series[0].setData(rank_data);
	name_chart.series[1].setData(occurances_data);
	name_chart.setTitle({text: gender_text + ' named ' + name});
	name_chart.gender = gender;
}

function search_by_year(year, gender) {
	var query =
		'SELECT name,occurances FROM names '+
		'WHERE year = :year AND gender = :gender AND rank <= 50 '+
		'ORDER BY rank ASC LIMIT 50;';

	var stmt = db.prepare(query);
	stmt.bind({':year': year, ':gender': gender});

	var data  = [];
	while (stmt.step()) {
		data.push(stmt.get());
	}

	stmt.free();

	var gender_text = gender ? 'Boys' : 'Girls';
	year_chart.series[0].setData(data);
	year_chart.setTitle({text: 'Top 50 ' + gender_text + ' from ' + year});
	year_chart.gender = gender;
}

init();

})();

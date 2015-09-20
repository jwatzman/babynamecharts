var xhr = new XMLHttpRequest();
xhr.open('GET', 'names.db', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function (e) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	window.db = db;
};
xhr.send();

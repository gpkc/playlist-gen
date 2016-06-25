const sqlite3 = require('sqlite3').verbose();

const similars = new sqlite3.Database('lastfm_similars.db', [sqlite3.OPEN_READONLY]);

let nodes = new Set();
nodes.add('asdf');
similars.each(
	'SELECT tid, target FROM similars_src',
	function(err, row) {
		nodes.add(row['tid']);
		let similars = row['target'].split(',');
		for (let i = 0; i < similars.length; i += 2) {
			nodes.add(similars[i]);
		}
	},
	function(err, rows) {
		console.log('n rows: ', + rows);
		console.log('n nodes: ', nodes.size);
		nodes = Array.from(nodes);
		console.log(nodes.length);
	}
);



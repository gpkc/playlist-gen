const math = require('mathjs');
const sqlite3 = require('sqlite3').verbose();

const songs = new sqlite3.Database('songs_index.db');

let P = null;

const playlist = function(item) {

};

const setTransitionMatrix = function() {
	songs.get('SELECT count(*) FROM Songs', function(err, row) {
		let numSongs = row['count(*)'];
		console.log(numSongs);
		const T = math.zeros(numSongs, numSongs, 'sparse');
		songs.each(
			'SELECT fromId, toId, w FROM Links;',
			function(err, row) {
//				T.set([row['fromId'], row['toId']], row['w']);
			},
			function(err, rows) {
				P = T;
			}
		);
	});
};

setTransitionMatrix();

module.exports = playlist;

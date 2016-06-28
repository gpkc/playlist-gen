const graphFactory = require('ngraph.graph');
const detectClusters = require('ngraph.louvain');

const sqlite3 = require('sqlite3').verbose();

const similars = new sqlite3.Database('lastfm_similars.db', [sqlite3.OPEN_READONLY]);


const storeSongsUidAndClusters = function(graph, nodes) {
	//TODO
}

const allSongsUidAndClusterize = function() {
	let nodes = new Map();

	let idx = 0;
	similars.each(
		'SELECT tid, target FROM similars_src;',
		function(err, row) {
			let row_id = -1;
			if(!nodes.has(row['tid'])) {
				row_id = idx++;
				nodes.set(row['tid'], row_id);
			} else {
				row_id = nodes.get(row['tid']);
			}

			let similars = row['target'].split(',');
			for (let i = 0; i < similars.length; i += 2) {
				let similar_id = -1;
				if(!nodes.has(similars[i])) {
					similar_id = idx++;
					nodes.set(similars[i], similar_id);
				} else  {
					similar_id = nodes.get(similars[i]);
				}
				if(similars[i+1] > 0.5) {
					graph.addLink(row_id, similar_id);
				}
			}
		},
		function(err, rows) {
			console.log('n rows: ', + rows);
			console.log('n nodes: ', nodes.size);
			let clusters = detectClusters(graph);
		}
	);
}
allSongsUidAndClusterize();
























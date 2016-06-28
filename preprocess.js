const graphFactory = require('ngraph.graph');
const detectClusters = require('ngraph.louvain');

const sqlite3 = require('sqlite3').verbose();

const similars = new sqlite3.Database('lastfm_similars.db', [sqlite3.OPEN_READONLY]);
const songs = new sqlite3.Database('songs_index.db'); // Songs indexes and partition

const storeSongsUidAndClusters = function(graph, clusters) {
	songs.serialize(function() {
		songs.run('DROP TABLE IF EXISTS Songs;');
		songs.run('CREATE TABLE Songs(tid TEXT, idx INT, com INT);');
		songs.run('BEGIN;');
		let idx = 0;
                graph.forEachNode(function(node) {
                        node.data = idx++;
                        songs.exec(`INSERT INTO Songs (tid, idx, com) VALUES ('${node.id}', ${node.data}, ${clusters.getClass(node.id)});`);
                });
		songs.run('COMMIT;');


		songs.run('DROP TABLE IF EXISTS Links;');
		songs.run('CREATE TABLE Links(fromId INT, toId INT, w REAL);');
                songs.run('BEGIN;');
		graph.forEachLink(function(link) {
			let fromId = graph.getNode(link.fromId).data;
			let toId = graph.getNode(link.toId).data;
			songs.exec(`INSERT INTO Links (fromId, toId, w) VALUES (${fromId}, ${toId}, ${link.data});`);
		});
                songs.run('COMMIT;');
	});
};

const allSongsClusterize = function() {
	let graph = graphFactory();
	similars.each(
		'SELECT tid, target FROM similars_src;',
		function(err, row) {
			let similars = row['target'].split(',');
			for (let i = 0; i < similars.length; i += 2) {
				if(similars[i+1] > 0.5) {
					graph.addLink(row['tid'], similars[i], similars[i+1]);
				}
			}

		},
		function(err, rows) {
			console.log('clusterizing ' + graph.getNodesCount() + ' nodes...');
			let clusters = detectClusters(graph);
			storeSongsUidAndClusters(graph, clusters);
		}
	);
};
allSongsClusterize();
























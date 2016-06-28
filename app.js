var express = require('express');
var cors = require('cors');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic('static', {'index': ['index.html']}))

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('unique_tracks.txt')
});

let entries = [];

lineReader.on('line', function (line) {
	songInfo = line.split('<SEP>');
	entries.push({
		id: songInfo[0],
		artist: songInfo[2],
		name: songInfo[3]
	});
});


app.use(cors());

function getIds(ar, what) {
  var key, value, results = [];
  var numRes = 4;
  for (key in ar) {
      if (ar.hasOwnProperty(key) && !isNaN(parseInt(key, 10))) {
          value = ar[key].name;
          if (value.substring(0, what.length) === what) {
              results.push(ar[key]);
              if(numRes-- == 0) break;
          }
      }
  }

  return results;
}

app.get('/autocomplete/:what', function(request, response) {
	response.json(getIds(entries, request.params.what));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


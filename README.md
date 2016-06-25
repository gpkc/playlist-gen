# playlist-gen
Playlist generator using node.js and the [Million Song Dataset](http://labrosa.ee.columbia.edu/millionsong/lastfm).
Based on the work [Music Playlist Generation based on Community
Detection and Personalized PageRank](http://web.stanford.edu/class/cs224w/projects_2015/Music_Playlist_Generation.pdf) for the
Class Projects of 2015 of [CS224W](http://web.stanford.edu/class/cs224w/projects.html) from Stanford University.

Running
=======
To get the server running for testing, do these steps:

1.  Grab the [similarity](http://labrosa.ee.columbia.edu/millionsong/sites/default/files/lastfm/lastfm_similars.db) table from the Million Song Dataset and place it in the DB folder.
2.  In the project folder, run `npm install` to install all the dependencies.
3.  Run `npm start`.
4.  Browse to `127.0.0.1:8000`.

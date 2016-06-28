# playlist-gen
Playlist generator using node.js and the [Million Song Dataset](http://labrosa.ee.columbia.edu/millionsong/lastfm).
Based on the work [Music Playlist Generation based on Community
Detection and Personalized PageRank](http://web.stanford.edu/class/cs224w/projects_2015/Music_Playlist_Generation.pdf) for the
Class Projects of 2015 of [CS224W](http://web.stanford.edu/class/cs224w/projects.html) from Stanford University.

Running
=======
To get the server running for testing, do these steps:

1.  Grab the [similarity](http://labrosa.ee.columbia.edu/millionsong/sites/default/files/lastfm/lastfm_similars.db) table from the Million Song Dataset and the [all track Echo Nest ID](http://labrosa.ee.columbia.edu/millionsong/sites/default/files/AdditionalFiles/unique_tracks.txt) and place those in the project folder.
2.  In the project folder, run `npm install` to install all the dependencies.
3.  Run `npm run preprocessjs`
4.  Install the pip packages: `Flask`, `Flask-Cors`, `scipy`, `networkx`, `python-louvain`.
5.  Run `npm run preprocesspy`.
6.  Run `npm run startjs`.
7.  Run `npm run startpy`.
8.  Browse to `127.0.0.1:8000`.

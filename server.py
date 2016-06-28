import json
from flask import Flask, Response
from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)

import os
import scipy.sparse
import sys
import sqlite3
import time

print "Initializing program, please wait..."

index = {}
conn = sqlite3.connect("songs_index_py.db")
with conn:
    cur = conn.cursor()
    cur.execute("SELECT tid, idx FROM Songs")
    while True:
        song = cur.fetchone()
        if not song:
            break
        index[song[0]]=song[1]
conn.close()

print "Reading community partition dict..."

partition, comm = {}, {}
inFile = open('partition.txt')
for line in inFile:
    fields = line.strip().split(',')
    partition[int(fields[0])] = int(fields[1])
inFile.close()
    
for nid,com in partition.iteritems():
    if com not in comm:
        comm[com] = []
    comm[com].append(nid)

print "Reading edge index and weight data..."

conn = sqlite3.connect("lastfm_similars.db")
row,col,data=[],[],[]

with conn:
    cur = conn.cursor()
    cur.execute("SELECT tid, target FROM similars_src")
    while True:
        song = cur.fetchone()
        if not song:
            break
        similars = song[1].split(",")
        row_idx = index[song[0]]
        for i in range(0,len(similars),2):
            row.append(row_idx)
            col.append(index[similars[i]])
            data.append(float(similars[i+1]))
conn.close()

print "Initialize transition matrix..."

# number of nodes
N = len(index)
# calculate the graph adjacency matrix as a scipy sparse matrix
mtx = scipy.sparse.coo_matrix((data,(row,col)),shape=(N,N))
compress = "csr"
mtx = mtx.asformat(compress)
  
# normalize the matrix 
rowSum = scipy.array(mtx.sum(axis=1)).flatten()
rowSum[rowSum != 0] = 1./rowSum[rowSum != 0]
invDiag = scipy.sparse.spdiags(rowSum.T, 0, N, N, format=compress)
mtx = invDiag * mtx
# identify sinking nodes index
sinking = scipy.where(rowSum == 0)[0]


# PageRank

def PPR(index,mtx,sinking,v=None,alpha=0.85,max_iter=100, tol=1e-6):

    """
    [Parameters]
    index: dictionary. tid-index pair of songs
    mtx: scipy.sparse.csr.csr_matrix. The transition matrix in scipy csr format.
    sinking: numpy.ndarray. Index of songs that has no out edges
    seed: list. Seed song indexes
    [Return type]
    dictionary. songs tid - score pairs
    """
    N = len(index)
    
    # starting rank
    x = scipy.repeat(1./N, N)
    
    # personalization vector 
    if v is None:
        v = scipy.repeat(1./N, N)
    v /= v.sum()

    #power iteration:
    for _ in xrange(max_iter):
        xlast = x
        x = alpha*(x*mtx + sum(x[sinking])*v) + (1-alpha)*v
        if scipy.absolute(x-xlast).sum() < tol:
            #nodes = sorted(index, key=index.get, reverse=False)
            #return dict(zip(nodes,x))
            scores = {}
            for key,value in index.iteritems():
                scores[key] = x[value]
            return scores
    raise RuntimeError('Power iteration failed to converge in %d iterations.' % max_iter)


print "Mapping track id to song metadata"

meta = {}
inFile = open('unique_tracks.txt')
for line in inFile:
    fields = line.strip().split('<SEP>')
    meta[fields[0]] = fields[2] + ': ' + fields[3]
inFile.close()

print "Done!"

@app.route("/playlist/<song>")
def get_playlist(song):
	seed = song
	seed_raw = seed.strip().split(";")
	seed = []
	for tid,song in meta.iteritems():
		for track in seed_raw:
			if song == track.encode('utf-8'):
				seed.append(index[tid])
	if len(seed) != len(seed_raw):
		return "No such song(s)!"

	discover_rate = 0.5
	listLength = 20

	t0 = time.time()
	v = scipy.repeat(discover_rate*0.01/float(N),N)
	for track in seed:
		for song in comm[partition[track]]:
			v[song] = 1./N
	for track in seed:
		v[track] = len(comm[partition[track]])/float(N)

	rank = PPR(index,mtx,sinking,v)
	playlist = sorted(rank, key=rank.get, reverse=True)
	t1 = time.time()

	scores = [rank[i] for i in playlist]

	print "Playlist generated in %.3f seconds" % (t1-t0)
	print "Playlist: "

	uniList = []
	i,j = 0,0
	while i < listLength:
		song = meta[playlist[j]]
		j += 1
		if song not in uniList:
			i += 1
			uniList.append(song)
			print song

	return Response(json.dumps(uniList),  mimetype='application/json')

if __name__ == "__main__":
    app.run(host='0.0.0.0')

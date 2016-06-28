import React from "react";

import Loading from 'react-loading'

export default class SongList extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { songs } = this.props;
    console.log(typeof songs);
    console.log(songs);
    return (
      <div>
        { songs.length > 0 ? <h2>Playlist gerada:</h2> : <h2></h2> }
        <ul>
          {
            songs.map( song => {
              return (<li><a href="#">{song}</a></li>);
            })
          }
        </ul>
      </div>
    );
  }
}

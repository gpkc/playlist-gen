import React from "react";

import SongList from './SongList'
import Loading from 'react-loading'
import SearchBar from 'search-bar-component'

import axios from 'axios'

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      "entries": [],
      "loading": false,
      "songs": []
    };

    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onChange(input, resolve) {
    axios.get('http://13.84.42.222:3000/autocomplete/' + input)
    .then(response => {
      this.setState({
        "entries": response.data
      });
      let entries = [];
      for(let e of response.data) {
        entries.push(e.artist + ' _-_ ' + e.name);
      }
      resolve(entries);
    })
    .catch(error => {
      console.log(error);
      resolve(['Erro na comunicação com o servidor!']);
    });
  }

  onSearch(input) {
    let strs = input.replace(' _-_ ', ': ');

    this.setState({
      "loading": true,
      "songs": []
    });

    axios.get('http://13.84.42.222:5000/playlist/' + strs)
    .then(response => {
      this.setState({
        "loading": false,
        "songs": response.data
      });
    })
    .catch(error => {
      this.setState({
        "loading": false,
        "songs": ['Erro na comunicação com o servidor!']
      });
    });

  }

  render() {
    let { loading, songs } = this.state;

    return (
      <div>
        <SearchBar
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        {
          loading ?
          <Loading type='bars' color='#e3e3e3' /> :
          <SongList songs={songs} />
        }
      </div>
    );
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const cachedData = localStorage.getItem(process.env.REACT_APP_DATA_VERSION);
console.log(process.env.REACT_APP_DATA_VERSION);

function fetchData() {
  ReactDOM.render(<div>Loading</div>, document.getElementById('root'));
  const xhr = new XMLHttpRequest();
  xhr.open('GET', process.env.PUBLIC_URL + '/standings.json');
  xhr.send();
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText);
    localStorage.clear();
    localStorage.setItem(process.env.REACT_APP_DATA_VERSION, xhr.responseText);
    render(data);
  };
}

if (cachedData) {
  try {
    let data = JSON.parse(cachedData);
    render(data);
  } catch (e) {
    fetchData();
  }
} else {
  fetchData();
}

function render(data) {
  ReactDOM.render(
    <App
      initialState={{
        teams: data.teams,
        page: 'team',
        team: data.teams[0],
        matches: data.matches,
        upcomingMatches: data.upcomingMatches
      }}
    />,
    document.getElementById('root')
  );
}

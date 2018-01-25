import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const localStorage = window.localStorage;

const cachedData =
  localStorage && localStorage.getItem(process.env.REACT_APP_DATA_VERSION);

function fetchData() {
  ReactDOM.render(<div>Loading</div>, document.getElementById('root'));
  const xhr = new XMLHttpRequest();
  xhr.open('GET', process.env.PUBLIC_URL + '/standings.json');
  xhr.send();
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText);
    localStorage && localStorage.clear();
    localStorage &&
      localStorage.setItem(
        process.env.REACT_APP_DATA_VERSION,
        xhr.responseText
      );
    renderUI(data);
  };
}

if (cachedData) {
  try {
    let data = JSON.parse(cachedData);
    renderUI(data);
  } catch (e) {
    fetchData();
  }
} else {
  fetchData();
}

function renderUI(data) {
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

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const xhr = new XMLHttpRequest();
xhr.open("GET", process.env.PUBLIC_URL + "/standings.json");
xhr.send();
xhr.onload = () => {
    const data = JSON.parse(xhr.responseText);
    ReactDOM.render(<App initialState={{
        teams: data.teams,
        page: "team",
        team: data.teams[0],
        matches: data.matches,
        upcomingMatches:data.upcomingMatches
    }}/>, document.getElementById('root'))
};


ReactDOM.render(<div>Loading</div>, document.getElementById('root'));


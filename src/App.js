import React, { Component } from 'react';
import './App.css';
import StandingsTable from './StandingsTable';
import TeamOverview from './TeamOverview';
import Schedule from './Schedule';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = props.initialState;
    this.state.sidebar = false;
  }

  toggleSideBar() {
    this.setState(state => ({ sidebar: !state.sidebar }));
  }

  sidebarOff() {
    this.setState({ sidebar: false });
  }

  render() {
    return (
      <Router>
        <div
          className="App-container"
          onClick={() => this.state.sidebar && this.sidebarOff()}
        >
          <header className="App-desktopHeader">
            <NavLink to="/" exact>
              STANDINGS
            </NavLink>
            <NavLink to="/schedule" exact>
              SCHEDULE
            </NavLink>
            <a>&nbsp;</a>
            <a
              href="https://overwatchleague.com/en-us/standings"
              style={{ marginLeft: 'auto' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Standings{' '}
              <i
                className="fas fa-external-link-alt"
                style={{ fontSize: '12px' }}
              />
            </a>
            <a
              href="https://overwatchleague.com/en-us/schedule"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Schedule{' '}
              <i
                className="fas fa-external-link-alt"
                style={{ fontSize: '12px' }}
              />
            </a>
          </header>
          <header className="App-mobileHeader">
            <i className="fa fa-bars" onClick={() => this.toggleSideBar()} />
          </header>
          <section
            className="App-sideBar"
            style={{ display: this.state.sidebar ? '' : 'none' }}
          >
            <NavLink to="/" exact>
              STANDINGS
            </NavLink>
            <NavLink to="/schedule" exact>
              SCHEDULE
            </NavLink>
            <a
              href="https://overwatchleague.com/en-us/standings"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Standings{' '}
              <i
                className="fas fa-external-link-alt"
                style={{ fontSize: '12px' }}
              />
            </a>
            <a
              href="https://overwatchleague.com/en-us/schedule"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Schedule{' '}
              <i
                className="fas fa-external-link-alt"
                style={{ fontSize: '12px' }}
              />
            </a>
          </section>
          <Route
            exact
            path="/"
            render={() => (
              <StandingsTable
                teams={this.state.teams}
                playedMatches={this.state.matches.length}
                totalMatches={
                  this.state.matches.length + this.state.upcomingMatches.length
                }
              />
            )}
          />
          <Route
            path="/team/:id.html"
            render={props => (
              <TeamOverview
                teams={this.state.teams}
                playedMatches={this.state.matches}
                upcomingMatches={this.state.upcomingMatches}
                match={props.match}
              />
            )}
          />

          <Route
            path="/schedule"
            render={() => (
              <Schedule
                teams={this.state.teams}
                matches={this.state.upcomingMatches}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;

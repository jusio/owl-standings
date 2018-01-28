import React, {Component} from 'react';
import './App.css';
import StandingsTable from './StandingsTable';
import TeamOverview from './TeamOverview';
import Schedule from './Schedule';
import {HashRouter as Router, Route, NavLink} from 'react-router-dom';
import Results from "./Results";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = props.initialState;
        this.state.sidebar = false;
    }

    toggleSideBar() {
        this.setState(state => ({sidebar: !state.sidebar}));
    }

    sidebarOff() {
        this.setState({sidebar: false});
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
                        <NavLink to="/results" exact style={{borderRight: "rgba(51, 51, 51, 0.06) 1px solid"}}>
                            LATEST RESULTS
                        </NavLink>
                    </header>
                    <header className="App-mobileHeader">
                        <i className="fa fa-bars" onClick={() => this.toggleSideBar()}/>
                    </header>
                    <section
                        className="App-sideBar"
                        style={{display: this.state.sidebar ? '' : 'none'}}
                    >
                        <NavLink to="/" exact>
                            STANDINGS
                        </NavLink>
                        <NavLink to="/schedule" exact>
                            SCHEDULE
                        </NavLink>
                        <NavLink to="/results" exact>RESULTS</NavLink>

                    </section>
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <StandingsTable
                                teams={this.state.teams}
                                playedMatches={this.state.matches.length}
                                totalMatches={
                                    this.state.matches.length + this.state.upcomingMatches.length
                                }
                                match={props.match}
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
                    <Route
                        path="/results"
                        render={() => (
                            <Results matches={this.state.matches} teams={this.state.teams}/>
                        )}
                    />
                </div>
            </Router>
        );
    }
}

export default App;

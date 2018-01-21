import React, {Component} from 'react';
import './App.css';
import StandingsTable from "./StandingsTable"
import TeamOverview from "./TeamOverview"
import {
    HashRouter as Router,
    Route
} from 'react-router-dom'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = props.initialState
    }


    render() {
        return (
            <Router>


                <div className="App-container">

                    <Route exact path="/" render={() => <StandingsTable
                        teams={this.state.teams}
                        playedMatches={this.state.matches.length}
                        totalMatches={this.state.matches.length + this.state.upcomingMatches.length}
                    />}/>
                    <Route path="/team/:id" render={(props) => (<TeamOverview teams={this.state.teams}
                                                                              playedMatches={this.state.matches}
                                                                              upcomingMatches={this.state.upcomingMatches}
                                                                              match={props.match}
                    />)}/>
                </div>

            </Router>
        );

    }


}

export default App;

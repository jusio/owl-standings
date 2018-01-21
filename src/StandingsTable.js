import React, {Component} from 'react';
import './StandingsTable.css';

import {
    Link
} from 'react-router-dom'

class StandingsTable extends Component {
    render() {

        const teams = this.props.teams;
        if (!teams || teams.length === 0) {
            return <div>Loading</div>
        }
        const rows = teams.map((team, index) => (
            <tr key={team.id}>
                <td><b>{index + 1}</b></td>
                <td style={{backgroundColor:"#"+team.color}}><img src={team.icon} alt="Team Icon" className="StandingsTable-teamIcon"/></td>
                <td style={{textAlign: "left",padding:0}}>
                    <Link to={"/team/" + team.id} className="StandingsTable-teamLink">{team.name}</Link>
                </td>
                <td>
                    {team.won}
                </td>
                <td>
                    {team.lost}
                </td>
                <td className="StandingsTable-mapPointsWon">
                    <span className="StandingsTable-mapPoints">{team.mapPoints.won}</span>&nbsp;:&nbsp;
                    <span className="StandingsTable-mapPoints">{team.mapPoints.lost}</span>&nbsp;:&nbsp;
                    <span className="StandingsTable-mapPoints">{team.mapPoints.draws}</span>
                </td>
            </tr>
        ));


        return <div>
            {this.props.playedMatches} of {this.props.totalMatches} matches
            played in Stage 1
            <a href="https://overwatchleague.com/en-us/standings" target="_blank" rel="noopener noreferrer">Official
                Standings <i className="fas fa-external-link-alt" style={{fontSize: "12px"}}/></a> <a
            href="https://overwatchleague.com/en-us/schedule" target="_blank" rel="noopener noreferrer">Official
            Schedule <i className="fas fa-external-link-alt" style={{fontSize: "12px"}}/></a>
            <table className="StandingsTable">
                <thead>
                <tr>
                    <th className="StandingsTable-rankColumn"/>
                    <th className="StandingsTable-iconColumn"/>
                    <th className="StandingsTable-teamNameColumn"/>
                    <th className="StandingsTable-wonGamesColumn">WON</th>
                    <th className="StandingsTable-lostGamesColumn">LOST</th>
                    <th className="StandingsTable-mapPointsColumn">MAPS W:L:D</th>
                </tr>

                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>
    }
}

export default StandingsTable
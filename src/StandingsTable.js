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
                <td><img src={team.icon} alt="Team Icon" className="StandingsTable-teamIcon"/></td>
                <td style={{textAlign: "left"}}>
                    <Link to={"/team/" + team.id}>{team.name}</Link>&nbsp;
                    <a href={team.website} target="_blank">
                        <i className="fas fa-external-link-alt" style={{fontSize: "12px"}}/>
                </a>
                </td>
                <td>
                    {team.won}
                </td>
                <td>
                    {team.lost}
                </td>
                <td className="StandingsTable-mapPointsWon">{team.mapPoints.won}</td>
                <td style={{width: "1px", paddingLeft: 0, paddingRight: 0}}>:</td>
                <td className="StandingsTable-mapPointsLost">
                    {team.mapPoints.lost}
                </td>
                <td>
                    {team.mapPoints.draws}
                </td>
            </tr>
        ));


        return <div>
            {this.props.playedMatches} of {this.props.totalMatches} matches
            played in Stage 1
            <a href="https://overwatchleague.com/en-us/standings" target="_blank">Official Standings <i className="fas fa-external-link-alt" style={{fontSize: "12px"}}/></a> <a
            href="https://overwatchleague.com/en-us/schedule" target="_blank">Official Schedule <i className="fas fa-external-link-alt" style={{fontSize: "12px"}}/></a>
            <table className="StandingsTable">
                <thead>
                <tr>
                    <th className="StandingsTable-rankColumn"/>
                    <th className="StandingsTable-iconColumn"/>
                    <th className="StandingsTable-teamNameColumn"/>
                    <th className="StandingsTable-wonGamesColumn">WON</th>
                    <th className="StandingsTable-lostGamesColumn">LOST</th>
                    <th colSpan={3} className="StandingsTable-mapPointsColumn">MAP POINTS</th>
                    <th>MAP DRAWS</th>
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
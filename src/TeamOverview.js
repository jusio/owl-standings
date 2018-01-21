import React, {Component} from 'react';
import './TeamOverview.css'

import {
    Link
} from 'react-router-dom'


function selectClass(first, second) {
    if (first > second) {
        return "TeamOverview-victory";
    }
    if (second > first) {
        return "TeamOverview-loss";
    }
    return "TeamOverview-draw";
}

class TeamOverview extends Component {

    constructor(props) {
        super(props);
        this.state = {mode: "played"}
    }

    renderRow(team, otherTeams, match) {
        const opponent = otherTeams[match.teams.filter(id => id !== team.id)[0]];
        const index = match.teams.indexOf(team.id);
        const opponentIndex = match.teams.indexOf(opponent.id);

        const results = match.mapData.reduce((acc, mapData) => {
            const opponentScore = mapData[2 + opponentIndex];
            const teamScore = mapData[2 + index];
            if (teamScore > opponentScore) {
                acc.won++;
            } else if (teamScore < opponentScore) {
                acc.lost++;
            }
            return acc;
        }, {won: 0, lost: 0});

        return <tr key={opponent.id}>
            <td className={"TeamOverview-scoreCell " + selectClass(results.won, results.lost)}>
                <a href={"https://overwatchleague.com/en-us/match/" + match.id} target="_blank" className="videoLink">
                    <i className="fas fa-external-link-alt"/>
                </a>
                <span className="teamPoints">{results.won}</span>:
                <span className="opponentPoints">{results.lost}</span>

            </td>
            <td style={{backgroundColor: "#" + opponent.color, color: "white", width: "2em"}}>
                <Link to={"/team/" + opponent.id}><img src={opponent.icon} style={{width: "2em"}} alt={opponent.name + " Icon"}/></Link>
            </td>
            <td className="TeamOverview-teamNameCell">
                <Link to={"/team/" + opponent.id}>{opponent.name}</Link>
            </td>
            {match.mapData.map(map => (

                <td title={map[1]}
                    className={"TeamOverview-scoreCell " + selectClass(map[2 + index], map[2 + opponentIndex])}
                    key={map[1]}>

                    <span className="teamPoints">{map[2 + index]}</span>:
                    <span className="opponentPoints">{map[2 + opponentIndex]}</span>
                    <br/>
                    <span style={{color: "#DDDDDD"}}>
                        <a href={"https://overwatchleague.com/en-us/match/" + match.id + "/game/" + map[0]}
                           target="_blank"
                           style={{display: map.length > 2 ? "" : "none"}} className="videoLink">
                        <i className=" fas fa-video"/>&nbsp;
                            {map[1]}
                    </a> </span>
                </td>
            ))}

        </tr>


    }

    render() {
        const team = this.props.teams.filter(team => team.id === this.props.match.params.id)[0];
        const winrate = (team.won / (team.won + team.lost)) * 100;
        const otherTeams = this.props.teams
            .filter(team => team.id !== this.props.match.params.id)
            .reduce((acc, team) => {
                acc[team.id] = team;
                return acc;
            }, {});

        const upcomingMatches = this.props.upcomingMatches.filter(match => match.teams.indexOf(team.id) > -1);
        const playedMatches = this.props.playedMatches.filter(match => match.teams.indexOf(team.id) > -1);

        const totalMatches = (upcomingMatches ? upcomingMatches.length : 0) + (playedMatches ? playedMatches.length : 0);

        return (
            <div className="TeamOverview">
                <Link to="/">Back to standings</Link>
                <div style={{backgroundColor: "#" + team.color, color: "#" + team.secondaryColor}}
                     className="TeamOverview-header">
                    <img src={team.icon} className="TeamOverview-logo" alt={team.name + " logo"}/>
                    <span className="TeamOverview-name">{team.name}</span>
                    &nbsp;
                    <a href={team.website} target="_blank"><i className="fas fa-external-link-alt" style={{
                        color: "#" + team.secondaryColor,
                        fontSize: "12px"
                    }}/></a>
                </div>

                {team.won + team.lost}/{totalMatches} matches played ({team.won} won, {team.lost} lost , {winrate}%
                winrate)
                <table style={{width: "100%"}}>
                    <thead>
                    <tr>
                        <th colSpan="3"/>
                        <th>Escort</th>
                        <th>Assault</th>
                        <th>CP</th>
                        <th>Hybrid</th>
                        <th>Tiebreaker</th>
                    </tr>
                    </thead>
                    <tbody>
                    {playedMatches && playedMatches.map(match => this.renderRow(team, otherTeams, match))}
                    <tr>
                        <td colSpan="8">{upcomingMatches ? upcomingMatches.length : 0} upcoming matches</td>
                    </tr>


                    {upcomingMatches.map(match => this.renderRow(team, otherTeams, match))}
                    </tbody>
                </table>


            </div>
        )
    }

}

export default TeamOverview;
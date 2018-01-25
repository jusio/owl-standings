import React, { Component } from 'react';
import './StandingsTable.css';
import Team from './component/Team';

class StandingsTable extends Component {
  render() {
    const teams = this.props.teams;
    if (!teams || teams.length === 0) {
      return <div>Loading</div>;
    }
    const rows = teams.map((team, index) => (
      <tr key={team.id}>
        <td>
          <b>{index + 1}</b>
        </td>
        {/*<td style={{backgroundColor:"#"+team.color}}><img src={team.icon} alt="Team Icon" className="StandingsTable-teamIcon"/></td>*/}
        <td style={{ textAlign: 'left', padding: 0 }}>
          {/*<Link to={"/team/" + team.id} className="StandingsTable-teamLink">{team.name}</Link>*/}
          <Team team={team} />
        </td>
        <td>{team.won}</td>
        <td>{team.lost}</td>
        <td className="StandingsTable-mapPointsWon">
          <span className="StandingsTable-mapPoints">{team.mapPoints.won}</span>&nbsp;:&nbsp;
          <span className="StandingsTable-mapPoints">
            {team.mapPoints.lost}
          </span>&nbsp;:&nbsp;
          <span className="StandingsTable-mapPoints">
            {team.mapPoints.draws}
          </span>
        </td>
      </tr>
    ));

    return (
      <div>
        <h3>
          {' '}
          {this.props.playedMatches} of {this.props.totalMatches} matches played
          in Stage 1
        </h3>
        <table className="StandingsTable">
          <thead>
            <tr>
              <th className="StandingsTable-rankColumn" />
              <th className="StandingsTable-teamNameColumn" />
              <th className="StandingsTable-wonGamesColumn">WON</th>
              <th className="StandingsTable-lostGamesColumn">LOST</th>
              <th className="StandingsTable-mapPointsColumn">MAPS W:L:D</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

export default StandingsTable;

import React, {Component} from 'react';
import './StandingsTable.css';
import Team from './component/Team';


const escortMaps = new Set(["junkertown", "dorado"]);
const assaultMaps = new Set(["Anubis", "Horizon"]);
const cpMaps = new Set(["oasis", "ilios", "lijiang"]);
const hybridMaps = new Set(["eichenwalde", "numbani"]);


const extractSummarys = (team, mapType) =>
    Object.keys(team.mapStats)
        .filter(mapName => mapType.has(mapName))
        .reduce((acc, mapName) => {

            const mapStat = team.mapStats[mapName];
            acc.won += mapStat[0];
            acc.lost += mapStat[1];
            acc.draws += mapStat[2];
            return acc;
        }, {won: 0, lost: 0, draws: 0});


class StandingsTable extends Component {
    render() {
        const teams = this.props.teams;
        if (!teams || teams.length === 0) {
            return <div>Loading</div>;
        }
        const rows = teams.map((team, index) => {
            const hybridStats = extractSummarys(team, hybridMaps);
            const assaultStats = extractSummarys(team, assaultMaps);
            const cpStats = extractSummarys(team, cpMaps);
            const escortStats = extractSummarys(team, escortMaps);
            return (
                <tr key={team.id}>
                    <td>
                        <b>{index + 1}</b>
                    </td>
                    <td style={{textAlign: 'left', padding: 0}}>
                        <Team team={team}/>
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
                    <td>
                        {hybridStats.won}:{hybridStats.lost}:{hybridStats.draws}
                    </td>
                    <td>
                        {assaultStats.won}:{assaultStats.lost}:{assaultStats.draws}
                    </td>
                    <td>
                        {cpStats.won}:{cpStats.lost}:{cpStats.draws}
                    </td>
                    <td>
                        {escortStats.won}:{escortStats.lost}:{escortStats.draws}
                    </td>
                </tr>
            );
        });
        return (
            <div>
                <h3>
                    {' '}
                    {this.props.playedMatches} of {this.props.totalMatches} matches played
                    in Stage 2
                </h3>
                <table className="StandingsTable">
                    <thead>
                    <tr>
                        <th className="StandingsTable-rankColumn"/>
                        <th className="StandingsTable-teamNameColumn"/>
                        <th className="StandingsTable-wonGamesColumn">WON</th>
                        <th className="StandingsTable-lostGamesColumn">LOST</th>
                        <th className="StandingsTable-mapPointsColumn">MAPS W:L:D</th>
                        <th><img
                            src={process.env.PUBLIC_URL + '/hybrid.svg'}
                            style={{width: '31px', height: '31px'}}
                            alt="Escort"
                        /></th>
                        <th>
                            <img
                                src={process.env.PUBLIC_URL + '/assault.svg'}
                                style={{width: '31px', height: '31px'}}
                                alt="Assault"
                            />
                        </th>
                        <th>
                            <img
                                src={process.env.PUBLIC_URL + '/cp.svg'}
                                style={{width: '31px', height: '31px'}}
                                alt="Control Point"
                            />
                        </th>
                        <th>
                            <img
                                src={process.env.PUBLIC_URL + '/escort.svg'}
                                style={{width: '31px', height: '31px'}}
                                alt="Hybrid"
                            />
                        </th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
}

export default StandingsTable;

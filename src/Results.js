import "./Results.css"
import React, {Component} from 'react';

import Team from './component/Team';

import moment from 'moment';

const MapTypeIcon = ({type}) => (<img
    src={process.env.PUBLIC_URL + '/' + type + '.svg'}
    style={{width: '20px', height: '20px', color: "rgba(0, 0, 0, 0.6)"}}
    alt="Hybrid"
/>);

const escortMaps = new Set(["junkertown", "dorado"]);
const assaultMaps = new Set(["Anubis", "Horizon"]);
const cpMaps = new Set(["oasis", "ilios", "lijiang"]);
const hybridMaps = new Set(["eichenwalde", "numbani"]);

const getMapType = (mapName) => {
    if (escortMaps.has(mapName)) {
        return "escort";
    }
    if (assaultMaps.has(mapName)) {
        return "assault";
    }
    if (cpMaps.has(mapName)) {
        return "cp"
    }
    if (hybridMaps.has(mapName)) {
        return "hybrid";
    }
};
const victoryClass = (val1, val2) => val1 > val2 ? "Results-victory" : "Results-loss";
const TeamRow = ({team, won, lost, mapData, index, opponentIndex}) => (
    <tr className={"Results-teamRow " + victoryClass(won, lost) + "Row"}>
        <td>
            <Team team={team} align="left"/>
        </td>
        <td className={"Results-matchResultCell " + victoryClass(won, lost)}>
            <span>{won}</span>
        </td>

        {mapData.map(mapData => (
            <td key={mapData[0]} className={"Results-mapScore " + victoryClass(mapData[index], mapData[opponentIndex])}>
                {mapData[index]}
            </td>))}

    </tr>);

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "sort": "asc",
            "filter": null
        };
    }

    renderMatch(team1, team2, matchData, index, array) {
        const result = matchData.mapData.reduce((acc, game) => {
            if (game[2] > game[3]) {
                acc[0]++;
            }
            if (game[3] > game[2]) {
                acc[1]++;
            }
            return acc;
        }, [0, 0]);
        console.log(array.length);

        const computeWeek = (index) => Math.ceil(index / 12);
        const computeDay = (index) => Math.ceil((index - (computeWeek(index) - 1) * 12) / 3);
        const currentWeek = computeWeek(array.length - index);
        const currentDay = computeDay(array.length - index);


        const previousWeek = index > 0 ? computeWeek(array.length - (index - 1)) : currentWeek - 1;
        const previousDay = index > 0 ? computeDay(array.length - (index - 1)) : currentDay - 1;

        const positionInStage = [];
        if (currentWeek !== previousWeek) {
            positionInStage.push("Week " + currentWeek);
        }
        if (currentDay !== previousDay) {
            positionInStage.push("Day " + currentDay);
        }


        const team1Row = (<TeamRow team={team1}
                                   won={result[0]}
                                   lost={result[1]}
                                   mapData={matchData.mapData}
                                   index={2}
                                   opponentIndex={3} key={team1.id}/>
        );
        const team2row = (<TeamRow team={team2}
                                   won={result[1]}
                                   lost={result[0]}
                                   mapData={matchData.mapData}
                                   index={3}
                                   opponentIndex={2} key={team2.id}/>
        );


        const rows = result[0] > result[1] ? [team1Row, team2row] : [team2row, team1Row];
        return (
            <tbody key={matchData.id}>
            <tr>
                <td style={{height: "3em"}}>
                    {previousDay !== currentDay && ("Week " + currentWeek + ", Day " + currentDay)}
                </td>
            </tr>
            <tr className="Results-headerRow">
                <th colSpan="2">{moment(matchData.date).format("HH:mm")}</th>

                {
                    matchData
                        .mapData
                        .map(data => data[1])
                        .map((type, key) => (
                            <th key={key} className="Results-mapHeader">
                                <MapTypeIcon type={getMapType(type)}/>
                                <br/>
                                {type}
                            </th>
                        ))
                }
            </tr>
            {rows}
            </tbody>
        );
    }

    render() {
        const teamMap = this.props.teams.reduce((acc, team) => {
            acc[team.id] = team;
            return acc;
        }, {});

        const matches = this.props.matches.sort((match1, match2) => {
            if (match1.date > match2.date) return -1;
            if (match2.date > match1.date) return 1;
            return 0;
        });

        return (
            <div className="Results">
                <table>
                    {matches.map((match, index, array) => this.renderMatch(teamMap[match.teams[0]], teamMap[match.teams[1]], match, index, array))}
                </table>
            </div>
        );
    }
}


export default Results;
import './TeamOverview.css';
import React, { Component } from 'react';
import Scores from './component/Scores';

import Team from './component/Team';

import moment from 'moment';

function selectClass(first, second) {
  if (first > second) {
    return 'TeamOverview-victory';
  }
  if (second > first) {
    return 'TeamOverview-loss';
  }
  return 'TeamOverview-draw';
}

class TeamOverview extends Component {
  constructor(props) {
    super(props);
    this.state = { mode: 'played' };
  }

  renderRow(team, otherTeams, match) {
    const opponent = otherTeams[match.teams.filter(id => id !== team.id)[0]];
    const index = match.teams.indexOf(team.id);
    const opponentIndex = match.teams.indexOf(opponent.id);

    const results = match.mapData.reduce(
      (acc, mapData) => {
        const opponentScore = mapData[2 + opponentIndex];
        const teamScore = mapData[2 + index];
        if (teamScore > opponentScore) {
          acc.won++;
        } else if (teamScore < opponentScore) {
          acc.lost++;
        }
        return acc;
      },
      { won: 0, lost: 0 }
    );

    const matchDate =
      results.lost !== 0 || results.won !== 0
        ? moment(match.date).format('MMM Do')
        : moment(match.date).fromNow();

    return (
      <tr key={opponent.id} className="matchRow">
        <td className="TeamOverview-dateColumn">{matchDate}</td>
        <td
          className={
            'TeamOverview-scoreCell ' + selectClass(results.won, results.lost)
          }
        >
          <a
            href={'https://overwatchleague.com/en-us/match/' + match.id}
            target="_blank"
            className="videoLink"
          >
            <i className="fas fa-external-link-alt" />
          </a>
          <span className="teamPoints">{results.won}</span>:
          <span className="opponentPoints">{results.lost}</span>
        </td>
        <td>
          <Team team={opponent} />
        </td>
        {match.mapData.map(map => (
          <td
            title={map[1]}
            className={
              'TeamOverview-scoreCell ' +
              selectClass(map[2 + index], map[2 + opponentIndex])
            }
            key={map[1]}
          >
            <Scores won={map[2 + index]} lost={map[2 + opponentIndex]}>
              <span style={{ color: '#DDDDDD' }}>
                <a
                  href={
                    'https://overwatchleague.com/en-us/match/' +
                    match.id +
                    '/game/' +
                    map[0]
                  }
                  target="_blank"
                  style={{ display: map.length > 2 ? '' : 'none' }}
                  className="videoLink"
                >
                  <i className=" fas fa-video" />&nbsp;{map[1]}
                </a>
              </span>
            </Scores>
            <span style={{ display: map.length === 2 ? '' : 'none' }}>
              {map[1]}
            </span>
          </td>
        ))}
        {match.mapData.length < 5 ? (
          <td className="TeamOverview-scoreCell">
            <Scores />
          </td>
        ) : (
          ''
        )}
      </tr>
    );
  }

  render() {
    const team = this.props.teams.filter(
      team => team.id === this.props.match.params.id
    )[0];
    const winrate = team.won / (team.won + team.lost) * 100;
    const otherTeams = this.props.teams
      .filter(team => team.id !== this.props.match.params.id)
      .reduce((acc, team) => {
        acc[team.id] = team;
        return acc;
      }, {});

    const upcomingMatches = this.props.upcomingMatches
      .filter(match => match.teams.indexOf(team.id) > -1)
      .sort((match1, match2) => {
        if (match1.date > match2.date) return 1;
        if (match2.date > match1.date) return -1;
        return 0;
      });
    const playedMatches = this.props.playedMatches
      .filter(match => match.teams.indexOf(team.id) > -1)
      .sort((match1, match2) => {
        if (match1.date > match2.date) return 1;
        if (match2.date > match1.date) return -1;
        return 0;
      });

    const totalMatches =
      (upcomingMatches ? upcomingMatches.length : 0) +
      (playedMatches ? playedMatches.length : 0);

    return (
      <div className="TeamOverview">
        <div
          style={{
            backgroundColor: '#' + team.color,
            color: '#' + team.secondaryColor
          }}
          className="TeamOverview-header"
        >
          <img
            src={team.icon}
            className="TeamOverview-logo"
            alt={team.name + ' logo'}
          />
          <span className="TeamOverview-name">{team.name}</span>
          &nbsp;
          <a href={team.website} target="_blank">
            <i
              className="fas fa-external-link-alt"
              style={{
                color: '#' + team.secondaryColor,
                fontSize: '12px'
              }}
            />
          </a>
        </div>

        <h3>
          {' '}
          {team.won + team.lost}/{totalMatches} matches played ({team.won} won,{' '}
          {team.lost} lost , {winrate}% winrate)
        </h3>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th colSpan="3" />
              <th>
                <img
                  src={process.env.PUBLIC_URL + '/escort.svg'}
                  style={{ width: '31px', height: '31px' }}
                  alt="Escort"
                />
              </th>
              <th>
                <img
                  src={process.env.PUBLIC_URL + '/assault.svg'}
                  style={{ width: '31px', height: '31px' }}
                  alt="Assault"
                />
              </th>
              <th>
                <img
                  src={process.env.PUBLIC_URL + '/cp.svg'}
                  style={{ width: '31px', height: '31px' }}
                  alt="Control Point"
                />
              </th>
              <th>
                <img
                  src={process.env.PUBLIC_URL + '/hybrid.svg'}
                  style={{ width: '31px', height: '31px' }}
                  alt="Hybrid"
                />
              </th>
              <th>
                <img
                  src={process.env.PUBLIC_URL + '/cp.svg'}
                  style={{ width: '31px', height: '31px' }}
                  alt="Control Point"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {playedMatches &&
              playedMatches.map(match =>
                this.renderRow(team, otherTeams, match)
              )}
            <tr>
              <td colSpan="8">
                <h3>
                  {upcomingMatches ? upcomingMatches.length : 0} upcoming
                  matches
                </h3>
              </td>
            </tr>

            {upcomingMatches.map(match =>
              this.renderRow(team, otherTeams, match)
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TeamOverview;

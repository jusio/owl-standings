import React, { Component } from 'react';

import Team from './component/Team';

import './Schedule.css';

import moment from 'moment';

class Schedule extends Component {
  render() {
    const teams = this.props.teams.reduce((acc, team) => {
      acc[team.id] = team;
      return acc;
    }, {});
    const sortedMatches = this.props.matches
      .sort((match1, match2) => {
        if (match1.date > match2.date) return 1;
        if (match2.date > match1.date) return -1;
        return 0;
      })
      .map((match, index, array) => {
        let dateDisplay;
        if (
          index === 0 ||
          moment(array[index - 1].date).format('MMM Do') !==
            moment(match.date).format('MMM Do')
        ) {
          dateDisplay =
            moment(match.date).format('MMMM Do dddd') +
            ' (' +
            moment(match.date).fromNow() +
            ')';
        } else {
          dateDisplay = '';
        }

        return [
          <div key={index} className="Schedule-dateRow">
            {dateDisplay}
          </div>,
          <div
            key={match.teams[0] + match.teams[1]}
            className={
              'Schedule-row ' + (index % 2 === 0 ? 'Schedule-rowEven' : '')
            }
          >
            <div className="Schedule-matchTime">
              {moment(match.date).format('HH:mm')}
            </div>
            <div className="Schedule-leftTeam">
              <Team team={teams[match.teams[0]]} align="right" />
            </div>
            <div style={{ padding: '5px 20px' }}>vs</div>
            <div className="Schedule-rightTeam">
              <Team team={teams[match.teams[1]]} align="left" />
            </div>
          </div>
        ];
      });

    return <div className="Schedule">{sortedMatches}</div>;
  }
}

export default Schedule;

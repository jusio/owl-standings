import React from 'react';
import { Link } from 'react-router-dom';

import './Team.css';

const Team = ({ team, align = 'left' }) => {
  return (
    <Link className={'Team Team-' + align} to={'/team/' + team.id + '.html'}>
      <img
        className="icon"
        style={{ backgroundColor: '#' + team.color }}
        src={team.icon}
        alt={team.name + ' logo image'}
      />

      <div className="teamName">{team.name}</div>
      <div className="teamId">{team.id}</div>
    </Link>
  );
};

export default Team;

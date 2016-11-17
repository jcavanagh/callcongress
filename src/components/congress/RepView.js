import React from 'react';

import RepProfile from './RepProfile';

export default class RepView extends React.Component {
  render() {
    return (
      <div>
        {this.props.legislators.map(member => <RepProfile key={member.bioguide_id} member={member} />)}
      </div>
    );
  }
}
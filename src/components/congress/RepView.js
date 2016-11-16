import React from 'react';

export default function RepView(props) {
  return (
    <div>
      {props.legislators.forEach(member => {
        <div>{`${member.first_name} ${member.last_name}`}</div>;
      })}
    </div>
  );
}
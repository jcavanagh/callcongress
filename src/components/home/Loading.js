import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export default function Loading(props) {
  return (
    <div style={{width: '100%', height: '100vh', textAlign: 'center'}}>
      <div style={{position: 'relative', height: '100%', top: '50%'}}>
        <div style={{transform: 'translateY(-100%)'}}>
          {props.message ? <div style={{marginBottom: 20}}>{props.message}</div> : null}
          <CircularProgress size={80} thickness={5} style={{}}/>
        </div>
      </div>
    </div>
  );
}
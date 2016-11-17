import React from 'react';

import RepView from '../congress/RepView';
import CongressProvider from '../../providers/congress';
import Loading from './Loading';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      legislators: []
    };
  }

  componentDidMount() {
    this.fetchReps(this.props.location);
    this.fetchLeadership();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location) {
      this.fetchReps(nextProps.location);
    }
  }

  fetchReps = async (location) => {
    const reps = await CongressProvider.legislators.locate(location);
    this.setState({
      legislators: reps
    });
  }

  fetchLeadership = async () => {
    const reps = await CongressProvider.legislators.leadership();
    this.setState({
      leadership: reps
    });
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        {this.state.legislators && this.state.leadership ?
          <div>
            <p style={{fontSize: 36}}>Your Elected Congress Members</p>
            <p style={{fontSize: 24}}>To call, just click the green button to get started</p>
            <RepView legislators={this.state.legislators} />
            <p style={{fontSize: 36}}>Congressional Leadership</p>
            <p style={{fontSize: 24}}>Sometimes you need to call the boss</p>
            <p style={{fontSize: 30}}>Senate</p>
            <RepView legislators={this.state.leadership.senate} />
            <p style={{fontSize: 30}}>House of Representatives</p>
            <RepView legislators={this.state.leadership.house} />
          </div> : <Loading message="Fetching representative information..." />
        }
      </div>
    );
  }
}
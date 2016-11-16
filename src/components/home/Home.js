import React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

import RepView from '../congress/RepView';
import CongressProvider from '../../providers/congress';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      legislators: []
    };
  }

  componentDidMount() {
    this.fetchReps();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location) {
      this.fetchReps();
    }
  }

  fetchReps = async () => {
    if(this.props.location) {
      const reps = await CongressProvider.legislators.locate(this.props.location);
      this.setState({
        legislators: reps
      });
    }
  }

  render() {
    return (
      <div>
        <AppBar title="CC" iconElementLeft={<IconButton />} />
        {this.state.legislators ?
          <RepView legislators={this.state.legislators} /> : null
        }
      </div>
    );
  }
}
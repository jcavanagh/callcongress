import React from 'react';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class RepProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
      phone: ''
    };
  }

  call = () => {
    axios.post('/api/call', {}, {
      params: {
        phone: this.state.phone,
        c_id: this.props.member.bioguide_id
      }
    });

    this.setState({
      dialogOpen: false
    });
  }

  showDialog = () => {
    this.setState({
      dialogOpen: true
    });
  }

  hideDialog = () => {
    this.setState({
      dialogOpen: false
    });
  }

  setPhone = (event) => {
    this.setState({
      phone: event.target.value,
    });
  }

  render() {
    const member = this.props.member;
    const leadershipRole = member.leadership_role ? <span>{member.leadership_role}<br/></span> : null;
    const name = `${member.title}. ${member.first_name} ${member.last_name}`;

    const dialogActions = [
      <RaisedButton label="Cancel" onTouchTap={this.hideDialog} />,
      <RaisedButton label="Call" primary={true} onTouchTap={this.call} />
    ];

    return (
      <div style={{display: 'inline-block', textAlign: 'center'}}>
        <Paper zDepth={2} style={{ width: 300, padding: '1px 20px 20px 20px', margin: 20 }}>
          <p style={{fontSize: 24}}>{leadershipRole}{name}<br/>{`(${member.party} - ${member.state})`}</p>
          <Paper zDepth={3} circle={true} style={{height: 150, width: 150, margin: 'auto', textAlign: 'center', overflow:'hidden'}}>
            <img
              alt={name}
              src={`https://theunitedstates.io/images/congress/450x550/${member.bioguide_id}.jpg`}
              style={{width:'100%', height:'110%'}}
            />
          </Paper>
          <div style={{marginTop: 20, cursor: 'pointer'}} onClick={this.showDialog}>
            <Paper zDepth={2} circle={true} style={{width: 60, height: 60, margin: 'auto', backgroundColor: '#449d44'}}>
              <FontIcon className="fa fa-phone" style={{top: 18, color: 'white'}} />
            </Paper>
          </div>
          <div style={{marginTop: 20}}>
            <a title="Email" href={`mailto:${member.oc_email}`} target="_blank">
              <FontIcon className="fa fa-envelope" style={{display: 'inline-block', marginRight: 20}} />
            </a>
            <a title="Facebook" href={`https://www.facebook.com/${member.facebook_id}`} target="_blank">
              <FontIcon className="fa fa-facebook-square" style={{display: 'inline-block', marginRight: 20}} />
            </a>
            <a title="Twitter" href={`https://www.twitter.com/${member.twitter_id}`} target="_blank">
              <FontIcon className="fa fa-twitter-square" style={{display: 'inline-block', marginRight: 20}} />
            </a>
            <a title="Website" href={`${member.website}`} target="_blank">
              <FontIcon className="fa fa-globe" style={{display: 'inline-block'}} />
            </a>
          </div>
        </Paper>
        <Dialog open={this.state.dialogOpen} onRequestClose={this.hideDialog} actions={dialogActions}>
          Enter your phone number (with area code) to connect to {name}:
          <TextField hintText="Your phone number, with area code" value={this.state.phone} onChange={this.setPhone} ref={field => field && field.focus()}/>
        </Dialog>
      </div>
    );
  }
}

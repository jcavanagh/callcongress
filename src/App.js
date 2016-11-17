import React from 'react';
import './App.css';

import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as Colors from 'material-ui/styles/colors';

import Home from './components/home/Home';
import Loading from './components/home/Loading';

const muiTheme = getMuiTheme({
  fontFamily: '"Myriad Set Pro","Helvetica Neue","Helvetica","Arial",sans-serif',
  palette: {
    primary1Color: Colors.blue700,
    primary2Color: Colors.blue900,
    accent1Color: Colors.redA200,
    pickerHeaderColor: Colors.blue700
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    const watchId = this.geolocate();
    this.state = {
      locationState: 'loading',
      geoWatchId: watchId
    };
  }

  componentWillUnmount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.clearWatch(this.state.geoWatchId);
    }
  }

  geolocate = () => {
    if ("geolocation" in navigator) {
      return navigator.geolocation.watchPosition((pos) => {
        const {coords: {latitude}, coords: {longitude}} = pos;

        this.setState({
          locationState: 'success',
          location: {
            latitude,
            longitude
          }
        });
      },(error) => {
        if(error.code === error.PERMISSION_DENIED) {
          //User has denied us, show text requesting access
          this.setState({
            locationState: 'denied'
          });
        }

        //Generic error
        this.setState({
          locationState: 'error'
        });
      });
    }
  }

  getComponent = () => {
    switch(this.state.locationState) {
      case 'loading':
        return <Loading message="Locating your representatives..." />;
      default:
        return <Home location={this.state.location} />;
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <AppBar title="CallCongress" />
            {this.getComponent()}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;

import React from 'react';
import './App.css';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './components/home/Home';

const muiTheme = getMuiTheme();

class App extends React.Component {
  constructor(props) {
    super(props);

    const watchId = this.geolocate();
    this.state = {
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
        const {coords: latitude, coords: longitude} = pos;

        this.setState({
          location: {
            latitude,
            longitude
          }
        });
      });
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Home location={location} />
      </MuiThemeProvider>
    );
  }
}

export default App;

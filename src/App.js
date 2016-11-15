import React from 'react';
import './App.css';

import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme();

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppBar title="CallCongress" />
      </MuiThemeProvider>
    );
  }
}

export default App;

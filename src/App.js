import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Routes from './routes'
import { blue, indigo,green } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    secondary: {
      // main: blue[900]
      main:green[900]
    },
    primary: {
      // main: indigo[700]
      main: green[700]
    }
  },
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Lato"',
      'sans-serif'
    ].join(',')
  }
});


class App extends Component {
  render() {
    return (
      <div>
      <MuiThemeProvider theme={theme}>
        <Routes />
      </MuiThemeProvider>
    </div>
    );
  }
}

export default App;

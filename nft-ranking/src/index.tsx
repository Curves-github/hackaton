import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MainStoreProvider } from './store';
import defaultTheme from './theme/default-theme';
import styles from './theme/global-styles';
import { Buffer } from 'buffer';

global.Buffer = Buffer

ReactDOM.render(
  <React.StrictMode>
    <MainStoreProvider>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <GlobalStyles styles={styles}/>
        <App />
      </ThemeProvider>
    </MainStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


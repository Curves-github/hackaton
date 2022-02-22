import { GlobalStyles, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MainStoreProvider } from './store';
import defaultTheme from './theme/default-theme';
import styles from './theme/global-styles';

ReactDOM.render(
  <React.StrictMode>
    <MainStoreProvider>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles styles={styles}/>
        <App />
      </ThemeProvider>
    </MainStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


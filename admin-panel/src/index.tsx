import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import defaultTheme from './theme/default-theme';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { MainStoreProvider } from './store';
import { Buffer } from 'buffer';

global.Buffer = Buffer

ReactDOM.render(
  <React.StrictMode>
    <MainStoreProvider>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline/>
        <App />
      </ThemeProvider>
    </MainStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

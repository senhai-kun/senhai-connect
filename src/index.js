import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import Slide from '@material-ui/core/Slide';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#0070f3',
            // contrastText: '#fff'
        },
        background: {
            // default: '#070c23',
            default: '#191919',
            paper: '#10194b',
            
        },
    },
    typography: {
        fontFamily: 'Open Sans'
    },
})

ReactDOM.render( 
    <ThemeProvider theme={theme} >
        <CssBaseline />
        <SnackbarProvider 
            maxSnack={2} 
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            TransitionComponent={Slide}
            preventDuplicate
            dense
        >
            <App />
        </SnackbarProvider>
    </ThemeProvider>
, document.getElementById('root') );

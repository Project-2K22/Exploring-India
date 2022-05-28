import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import Routes from './Routes';

const App = () => {
    const theme = createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 1000,
                lg: 1200,
                xl: 1536,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Routes />
        </ThemeProvider>
    );
};

export default App;

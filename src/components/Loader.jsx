import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import BaseContainer from './BaseContainer';

const Loader = () => {
    return (
        <BaseContainer w={'100%'}>
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        </BaseContainer>
    );
};

export default Loader;

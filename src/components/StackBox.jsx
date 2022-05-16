import React from 'react';
import { Box } from '@mui/material';

const StackBox = props => {
    return (
        <Box
            sx={{
                width: props.w,
                height: '100vh',
                paddingX: '40px',
                paddingTop: '40px',
                margin: 'auto',
            }}
        >
            {props.children}
        </Box>
    );
};

export default StackBox;

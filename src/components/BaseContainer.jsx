import { Container, CssBaseline } from '@mui/material';
import React from 'react';

const BaseContainer = props => {
    return (
        <Container maxWidth={props.w} sx={{ overflowX: 'hidden' }}>
            <CssBaseline />
            {props.children}
        </Container>
    );
};

export default BaseContainer;

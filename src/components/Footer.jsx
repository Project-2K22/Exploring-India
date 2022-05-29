import { Box } from '@mui/material';
import React from 'react';

const Footer = () => {
    return (
        <footer style={{ width: '100%', background: 'black', marginTop: '-10px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.5rem', minHeight: '40vh' }}>
                <p style={{ fontSize: '2rem', color: 'white' }}>We'd Love to Hear From You</p>
                <p style={{ fontSize: '2rem', marginTop: '-1.3rem', color: 'white' }}>Contact Us,</p>
                <p style={{ marginTop: '-1.3rem', color: 'gray' }}>email: sample@email.com | phone no: +914581252123</p>
                <div style={{ width: '12rem', height: '2px', backgroundColor: 'grey', marginTop: '-0.5rem' }}></div>
            </Box>
        </footer>
    );
};

export default Footer;

import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const SnackBarBox = ({ alert, setAlert }) => {
    const handleClose = () =>
        setAlert({ visible: false, message: '', type: '' });

    return (
        <Snackbar
            open={alert.visible}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={alert.type}
                sx={{ width: '100%' }}
            >
                {alert.message}
            </Alert>
        </Snackbar>
    );
};

export default SnackBarBox;

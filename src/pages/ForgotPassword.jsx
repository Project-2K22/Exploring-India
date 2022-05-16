import React, { useState } from 'react';
import { FormControl, Box, Typography, Grid, Button, Stack, FilledInput, InputLabel } from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';

import SnackBarBox from '../components/SnackBarBox';
import BaseContainer from '../components/BaseContainer';

import { auth, db } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { LoadingButton } from '@mui/lab';

// TODO: have to check todo functionality using .. real email id

const Signup = () => {
    const [email, setEmail] = useState('');

    const [alert, setAlert] = useState({
        visible: false,
        message: '',
        type: '',
    });

    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setEmail('');
    };

    const handleFormSubmit = () => {
        if (email === '') {
            setAlert({
                visible: true,
                message: 'Fill all details',
                type: 'info',
            });
            return;
        }
        // TODO: call firebase to register user

        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                // ..
                setLoading(false);
                resetForm();
            })
            .catch(error => {
                const errorMessage = error.message;
                setAlert({ visible: true, message: errorMessage, type: 'error' });
            });
    };

    return (
        <BaseContainer w={'xl'}>
            <SnackBarBox alert={alert} setAlert={setAlert} />
            <Grid Container>
                <Grid item sm={8}>
                    <Box
                        sx={{
                            width: '60%',
                            paddingX: '40px',
                            paddingTop: '40px',
                            margin: 'auto',
                        }}
                    >
                        <Box sx={{ marginBottom: '30px' }}>
                            <Typography variant="h1" fontWeight={'bold'}>
                                Forgot Password
                            </Typography>
                        </Box>
                        <div>
                            <Stack spacing={3}>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                                    <FilledInput
                                        id="outlined-adornment-email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        endAdornment={<EmailIcon />}
                                    />
                                </FormControl>

                                <LoadingButton loading={loading} onClick={handleFormSubmit} variant="contained">
                                    Send reset link
                                </LoadingButton>
                            </Stack>
                        </div>
                    </Box>
                </Grid>
                <Grid item sm={4}>
                    {/* <Box
                        component={'img'}
                        sx={{
                            width: '100%',
                            overflow: 'none',
                        }}
                        src="https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/auth_images%2Fsignup%2Fpexels-aaishi-maity-8897198.jpg?alt=media&token=1bfc2da7-19bb-4f06-bf79-23e94e327cad"
                        alt=""
                    /> */}
                </Grid>
            </Grid>
        </BaseContainer>
    );
};

export default Signup;

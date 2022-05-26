import React, { useState, useEffect } from 'react';
import { FormControl, Box, Typography, Button, Stack, FilledInput, InputLabel, CssBaseline, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';

import SnackBarBox from '../../components/SnackBarBox';
import StackBox from '../../components/StackBox';

import LinkTo from '../../components/LinkTo';

// firebase
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { child, get, ref } from 'firebase/database';

const AdminLogin = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [alert, setAlert] = useState({
        visible: false,
        message: '',
        type: '',
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const resetForm = () => {
        setForm({ email: '', password: '' });
    };

    const checkAdminPermission = uid => {
        const adminRef = ref(db);
        get(child(adminRef, `admins/${uid}`))
            .then(snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    if (data.granted === 'true') {
                        navigate('/admin/dashboard');
                        localStorage.setItem('admin_sign_in_status', true);
                    } else if (data.granted === 'false') {
                        setAlert({
                            visible: true,
                            message: "Your account has'nt verified by RootAdmin yet",
                            type: 'warning',
                        });
                    } else {
                        setAlert({
                            visible: true,
                            message: 'Your admin account request has been rejected',
                            type: 'error',
                        });
                    }
                } else {
                    setAlert({ visible: true, message: 'Your admin account is not valid', type: 'error' });
                }
            })
            .catch(error => setAlert({ visible: true, message: error, type: 'error' }));
    };

    const handleFormSubmit = () => {
        if (form.email === '' || form.password === '') {
            setAlert({
                visible: true,
                message: 'Fill all details',
                type: 'info',
            });
            return;
        }

        // TODO: call firebase to login user

        setLoading(true);
        signInWithEmailAndPassword(auth, form.email, form.password)
            .then(userCredential => {
                // Signed in
                const user = userCredential.user;
                setLoading(false);
                resetForm();
                // check admin permission
                checkAdminPermission(user.uid);
                // console.log(user);
            })
            .catch(error => {
                const errorMessage = error.message;
                setAlert({ visible: true, message: errorMessage, type: 'error' });
                setLoading(false);
            });
    };

    return (
        <>
            <CssBaseline />
            <SnackBarBox alert={alert} setAlert={setAlert} />
            <Box>
                <Grid container width={'100%'}>
                    <Grid item xs={12}>
                        <StackBox w={{ md: '70%', xs: '90%' }}>
                            <Box sx={{ marginBottom: '30px' }}>
                                <Typography variant={{ md: 'h1', xs: 'h2' }} fontWeight={'bold'}>
                                    Admin Sign In
                                </Typography>
                            </Box>
                            <div>
                                <Stack spacing={3}>
                                    <FormControl fullWidth variant="filled">
                                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                                        <FilledInput
                                            id="outlined-adornment-email"
                                            value={form.email}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value,
                                                })
                                            }
                                            endAdornment={<EmailIcon />}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth variant="filled">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <FilledInput
                                            id="outlined-adornment-password"
                                            type="password"
                                            value={form.password}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    password: e.target.value,
                                                })
                                            }
                                            endAdornment={<KeyIcon />}
                                        />
                                    </FormControl>
                                    <Stack
                                        direction={{ md: 'row', xs: 'column-reverse' }}
                                        alignItems={{ xs: 'flex-start' }}
                                        justifyContent="space-between"
                                        spacing={{ xs: 3 }}
                                    >
                                        <LinkTo to="/admin/register">
                                            <Button size="small" sx={{ color: 'gray' }}>
                                                Register yourself as Admin
                                            </Button>
                                        </LinkTo>
                                        <LoadingButton
                                            onClick={handleFormSubmit}
                                            variant="contained"
                                            loading={loading}
                                            color="error"
                                        >
                                            Admin Log In
                                        </LoadingButton>
                                    </Stack>
                                </Stack>
                            </div>
                        </StackBox>
                    </Grid>
                    {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
                </Grid>
            </Box>
        </>
    );
};

export default AdminLogin;

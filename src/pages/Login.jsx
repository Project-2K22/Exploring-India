import React, { useState, useEffect } from 'react';
import {
    FormControl,
    Box,
    Typography,
    Button,
    Stack,
    FilledInput,
    InputLabel,
    CssBaseline,
    Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';

import SnackBarBox from '../components/SnackBarBox';
import StackBox from '../components/StackBox';

import LinkTo from '../components/LinkTo';

// firebase
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                const uid = user.uid;
                navigate('/home');
            } else {
                navigate('/login');
            }
        });
    }, []);

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
                navigate('/home');
                resetForm();

                console.log(user);
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
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box sx={{ width: '50%' }}>
                    <StackBox w="70%">
                        <Box sx={{ marginBottom: '30px' }}>
                            <Typography variant="h1" fontWeight={'bold'}>
                                Sign In
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
                                <Stack direction={'row'} alignItems="center" justifyContent={'space-between'}>
                                    <Stack direction={'row'} spacing={2}>
                                        <LinkTo to="/signup">
                                            <Button size="small" sx={{ color: 'gray' }}>
                                                Sign Up
                                            </Button>
                                        </LinkTo>
                                        <LinkTo to="/forgot-password">
                                            <Button size="small" sx={{ color: 'gray' }}>
                                                Forgot Password
                                            </Button>
                                        </LinkTo>
                                    </Stack>
                                    <LoadingButton onClick={handleFormSubmit} variant="contained" loading={loading}>
                                        Log In
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </div>
                    </StackBox>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Box sx={{ width: '50%' }}>
                    <StackBox w="80%">
                        <Stack justifyContent="space-around">
                            <Box>
                                <Typography>Start planning your</Typography>
                                <Typography variant="h1" fontWeight="bold">
                                    Journey
                                </Typography>
                            </Box>
                            <Typography>“A journey of a thousand miles begins with a single step” – Lao Tzu</Typography>
                        </Stack>
                    </StackBox>
                </Box>
            </Stack>
        </>
    );
};

export default Login;

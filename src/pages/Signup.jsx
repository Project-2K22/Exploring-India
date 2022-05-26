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
    Paper,
    Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';

import SnackBarBox from '../components/SnackBarBox';

import LinkTo from '../components/LinkTo';

// firebase
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { set, ref } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import StackBox from '../components/StackBox';

const Signup = () => {
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                const uid = user.uid;
                navigate('/home');
            }
        });
    }, []);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [alert, setAlert] = useState({
        visible: false,
        message: '',
        type: '',
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const resetForm = () => {
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
    };

    const addUserIntoDatabase = (uid, data) => {
        set(ref(db, 'users/' + uid), { ...data })
            .then(() => {
                navigate('/user-preference', { state: { uid: uid } });
                localStorage.setItem('user-name', form.name);
                resetForm();
            })
            .catch(() => setAlert({ visible: true, message: 'Database error. Try again later.', type: 'error' }));
    };

    const handleFormSubmit = () => {
        if (form.name === '' || form.email === '' || form.password === '' || form.confirmPassword === '') {
            setAlert({
                visible: true,
                message: 'Fill all details',
                type: 'info',
            });
            return;
        }
        if (form.password !== form.confirmPassword) {
            setAlert({
                visible: true,
                message: "Password did'nt matched",
                type: 'error',
            });
            return;
        }
        // form validation done .. now call firebase
        setLoading(true);
        createUserWithEmailAndPassword(auth, form.email, form.password)
            .then(userCredential => {
                // Signed in
                setLoading(false);
                const user = userCredential.user;
                addUserIntoDatabase(user.uid, {
                    name: form.name,
                    email: form.email,
                    age: -1,
                    phoneno: -1,
                    gender: -1,
                    placeVisited: [],
                    dplink: `https://avatars.dicebear.com/api/avataaars/${form.name}.svg`,
                });
            })
            .catch(error => {
                const errorMessage = error.message;
                setAlert({ visible: true, message: errorMessage, type: 'error' });
                setLoading(false);
            });
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <SnackBarBox alert={alert} setAlert={setAlert} />
            <Box
                sx={{
                    background:
                        'url(https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/auth_images%2Fsignup%2Fpexels-krivec-ales-580151.jpg?alt=media&token=7db1be3a-843b-4ce2-8e09-4a61e3b2e46c)',
                    backgroundSize: 'cover',
                    objectFit: 'center',
                }}
            >
                <Grid container width={'100%'} direction="row">
                    <Grid item md={12} xs={12}>
                        <StackBox w={{ md: '80%', xs: '95%' }}>
                            <Box
                                sx={{
                                    padding: '20px',
                                    background: 'rgba( 255, 255, 255, 0.2 )',
                                    backdropFilter: 'blur( 20px )',
                                    WebkitBackdropFilter: 'blur( 20px )',
                                    border: '1px solid rgba( 255, 255, 255, 0.18 )',
                                }}
                            >
                                <Box sx={{ marginBottom: '30px' }}>
                                    <Typography variant={{ md: 'h1', xs: 'h2' }} fontWeight={'bold'}>
                                        Sign Up
                                    </Typography>
                                </Box>
                                <div>
                                    <Stack spacing={3}>
                                        <FormControl fullWidth variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-name"
                                                value={form.name}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        name: e.target.value,
                                                    })
                                                }
                                                endAdornment={<PersonIcon />}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                                            <FilledInput
                                                type="email"
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
                                        <FormControl fullWidth variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-confirm-password">
                                                Confirm Password
                                            </InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-confirm-password"
                                                type="password"
                                                value={form.confirmPassword}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        confirmPassword: e.target.value,
                                                    })
                                                }
                                                endAdornment={<KeyIcon />}
                                            />
                                        </FormControl>
                                        <Stack direction={'row'} alignItems="center" justifyContent={'space-between'}>
                                            <Stack direction={'row'} spacing={2}>
                                                <LinkTo to="/login">
                                                    <Button size="small" sx={{ color: 'black' }}>
                                                        Log In
                                                    </Button>
                                                </LinkTo>
                                            </Stack>
                                            <LoadingButton
                                                onClick={handleFormSubmit}
                                                variant="contained"
                                                loading={loading}
                                            >
                                                Sign Up
                                            </LoadingButton>
                                        </Stack>
                                    </Stack>
                                </div>
                            </Box>
                        </StackBox>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
};

export default Signup;

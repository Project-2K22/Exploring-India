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
    Grid,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem,
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

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        console.log(matches);
    }, [matches]);

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
            <Box
                sx={{
                    background:
                        'url(https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/auth_images%2Flogin%2Fpexels-francesco-ungaro-998646.jpg?alt=media&token=e3942308-c027-4656-af88-7aeeb462acd8    )',
                    backgroundSize: 'cover',
                    objectFit: 'center',
                }}
            >
                <Grid container width={'100%'}>
                    <Grid item md={12} xs={12}>
                        <StackBox w={{ md: '80%', xs: '100%' }}>
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
                                    <Typography fontSize={{ md: '3vw', xs: '5vw' }} fontWeight={'bold'}>
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
                                            {matches && (
                                                <Stack
                                                    direction={{ md: 'row', xs: 'column' }}
                                                    spacing={{ md: 2, xs: 0 }}
                                                >
                                                    <LinkTo to="/signup">
                                                        <Button size="small" sx={{ color: 'black' }}>
                                                            Sign Up
                                                        </Button>
                                                    </LinkTo>
                                                    <LinkTo to="/forgot-password">
                                                        <Button size="small" sx={{ color: 'black' }}>
                                                            Forgot Password
                                                        </Button>
                                                    </LinkTo>
                                                    <LinkTo to="/stackholder">
                                                        <Button size="small" sx={{ color: 'black' }}>
                                                            Upload Place details as stackholder
                                                        </Button>
                                                    </LinkTo>
                                                </Stack>
                                            )}
                                            {!matches && (
                                                <>
                                                    <Button
                                                        id="basic-button"
                                                        aria-controls={open ? 'basic-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={handleClick}
                                                        size="small"
                                                        sx={{ color: 'black' }}
                                                    >
                                                        Options
                                                    </Button>
                                                    <Menu
                                                        id="basic-menu"
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'basic-button',
                                                        }}
                                                    >
                                                        <MenuItem onClick={handleClose}>
                                                            <LinkTo to="/signup">
                                                                <Button size="small" sx={{ color: 'black' }}>
                                                                    Sign Up
                                                                </Button>
                                                            </LinkTo>
                                                        </MenuItem>
                                                        <MenuItem onClick={handleClose}>
                                                            <LinkTo to="/forgot-password">
                                                                <Button size="small" sx={{ color: 'black' }}>
                                                                    Forgot Password
                                                                </Button>
                                                            </LinkTo>
                                                        </MenuItem>
                                                        <MenuItem onClick={handleClose}>
                                                            <LinkTo to="/stackholder">
                                                                <Button size="small" sx={{ color: 'black' }}>
                                                                    Upload Place details as stackholder
                                                                </Button>
                                                            </LinkTo>
                                                        </MenuItem>
                                                    </Menu>
                                                </>
                                            )}
                                            <LoadingButton
                                                onClick={handleFormSubmit}
                                                variant="contained"
                                                loading={loading}
                                            >
                                                Log In
                                            </LoadingButton>
                                        </Stack>
                                    </Stack>
                                </div>
                                <div>
                                    <LinkTo to="/admin/signin">
                                        <Button size="small" sx={{ color: 'black' }}>
                                            Admin Login
                                        </Button>
                                    </LinkTo>
                                </div>
                            </Box>
                        </StackBox>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Login;

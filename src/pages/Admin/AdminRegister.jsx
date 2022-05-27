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
    Select,
    MenuItem,
    Grid,
    Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

import SnackBarBox from '../../components/SnackBarBox';

import LinkTo from '../../components/LinkTo';

// firebase
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { set, ref } from 'firebase/database';
import StackBox from '../../components/StackBox';
import ProgressBar from '../../components/ProgressBar';

const AdminRegister = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: '',
        phoneno: '',
        gender: '',
        dplink: '',
        confirmPassword: '',
        latitude: '',
        longitude: '',
    });
    const [file, setFile] = useState(null);

    const [alert, setAlert] = useState({
        visible: false,
        message: '',
        type: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.clear();
    }, []);

    const resetForm = () => {
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            age: '',
            gender: '',
            dplink: '',
            phoneno: '',
            latitude: '',
            longitude: '',
        });
    };

    const addUserIntoDatabase = (uid, data) => {
        set(ref(db, 'admins/' + uid), { ...data })
            .then(() => {
                setAlert({
                    visible: true,
                    message:
                        'Your admin request has been sent to officials. You will reveice an email either your account will be accepted or not',
                    type: 'success',
                });
                resetForm();
            })
            .catch(() => setAlert({ visible: true, message: 'Database error. Try again later.', type: 'error' }));
    };

    const uploadImage = file => {
        const types = ['image/jpeg', 'image/jpg', 'image/png'];
        const { type } = file;
        if (file && types.includes(type)) {
            setFile(file);
        } else {
            setAlert({
                visible: true,
                message: 'Image file type should be jpeg or png',
                type: 'error',
            });
            setFile(null);
        }
    };

    const handleFormSubmit = () => {
        if (Object.keys(form).filter(k => form[k] === '').length !== 0) {
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
                    name: form.firstName + ' ' + form.lastName,
                    email: form.email,
                    age: form.age,
                    phoneno: form.phoneno,
                    gender: form.gender,
                    dplink: form.dplink,
                    granted: 'false',
                    emailVerified: 'false',
                    phoneVerified: 'false',
                    latitude: form.latitude,
                    longitude: form.longitude,
                });
            })
            .catch(error => {
                const errorMessage = error.message;
                setAlert({ visible: true, message: errorMessage, type: 'error' });
                setLoading(false);
            });
    };

    const handleGeoLocationPermission = () => {
        window.navigator.geolocation.getCurrentPosition(position =>
            setForm({ ...form, latitude: position.coords.latitude, longitude: position.coords.longitude })
        );
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <SnackBarBox alert={alert} setAlert={setAlert} />
            <Box>
                <Grid container width={'100%'} direction="row">
                    <Grid item xs={12}>
                        <StackBox w={{ md: '70%', xs: '100%' }}>
                            <Box sx={{ marginBottom: '30px' }}>
                                <Typography fontSize={{ md: '3vw', xs: '5vw' }} fontWeight={'bold'}>
                                    Admin Registartion
                                </Typography>
                            </Box>
                            <div>
                                <Stack spacing={3}>
                                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={3}>
                                        <FormControl fullWidth variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-firstName">First Name</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-firstName"
                                                value={form.firstName}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        firstName: e.target.value,
                                                    })
                                                }
                                                endAdornment={<PersonIcon />}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-lastName">Last Name</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-lastName"
                                                value={form.lastName}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        lastName: e.target.value,
                                                    })
                                                }
                                                endAdornment={<PersonIcon />}
                                            />
                                        </FormControl>
                                    </Stack>
                                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={3}>
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
                                            <InputLabel htmlFor="outlined-adornment-email">Phone Number</InputLabel>
                                            <FilledInput
                                                type="tel"
                                                id="outlined-adornment-phoneno"
                                                value={form.phoneno}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        phoneno: e.target.value,
                                                    })
                                                }
                                                endAdornment={<PhoneIcon />}
                                            />
                                        </FormControl>
                                    </Stack>
                                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={3}>
                                        <FormControl fullWidth variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-age">Age</InputLabel>
                                            <FilledInput
                                                type="number"
                                                id="outlined-adornment-age"
                                                value={form.age}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        age: e.target.value,
                                                    })
                                                }
                                                endAdornment={<AccessibilityNewIcon />}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth variant="filled" sx={{ m: 1, minWidth: 215 }}>
                                            <InputLabel id="demo-simple-select-filled-label">Gender</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-filled-label"
                                                id="demo-simple-select-filled"
                                                value={form.gender}
                                                onChange={e => setForm({ ...form, gender: e.target.value })}
                                            >
                                                <MenuItem value={'Male'}>Male</MenuItem>
                                                <MenuItem value={'Female'}>Female</MenuItem>
                                                <MenuItem value={'Others'}>Others</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={3}>
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
                                    </Stack>
                                    <Stack
                                        direction={{ md: 'row', xs: 'column' }}
                                        alignItems={'flex-start'}
                                        justifyContent={'space-between'}
                                        spacing={{ xs: 3 }}
                                    >
                                        <Box>
                                            {form.latitude === '' && form.longitude === '' ? (
                                                <Button variant="outlined" onClick={handleGeoLocationPermission}>
                                                    Turn on your location
                                                </Button>
                                            ) : (
                                                <Alert severity="success">
                                                    Your location has been turned on successfully
                                                </Alert>
                                            )}
                                        </Box>
                                        <Box>
                                            {file && form.dplink === '' && (
                                                <ProgressBar
                                                    file={file}
                                                    setFile={setFile}
                                                    form={form}
                                                    setForm={setForm}
                                                    where={'admin_dps'}
                                                />
                                            )}
                                            {file === null && form.dplink === '' && (
                                                <Button
                                                    fullWidth={{ xs: true }}
                                                    variant="outlined"
                                                    component="label"
                                                    color="info"
                                                >
                                                    Upload your profile picture
                                                    <input
                                                        type="file"
                                                        hidden
                                                        onChange={e => uploadImage(e.target.files[0])}
                                                    />
                                                </Button>
                                            )}
                                            {file === null && form.dplink !== '' && (
                                                <Alert severity="success">
                                                    Your profile picture has been uploaded successfully
                                                </Alert>
                                            )}
                                        </Box>
                                    </Stack>
                                    <Stack
                                        direction={{ md: 'row', xs: 'column-reverse' }}
                                        alignItems="center"
                                        justifyContent={'space-between'}
                                    >
                                        <Stack direction={'row'} spacing={2}>
                                            <LinkTo to="/admin/signin">
                                                <Button size="small" sx={{ color: 'gray' }}>
                                                    Admin Log In
                                                </Button>
                                            </LinkTo>
                                            {/* TODO: create a section where admin can check their status*/}
                                            <Button size="small" sx={{ color: 'gray' }}>
                                                Check admin registration status
                                            </Button>
                                        </Stack>
                                        <LoadingButton
                                            color="error"
                                            onClick={handleFormSubmit}
                                            variant="contained"
                                            loading={loading}
                                            // fullWidth={{ md: false, xs: true }}
                                            sx={{ width: { xs: '100%', md: 'inherit' } }}
                                        >
                                            Admin Sign Up
                                        </LoadingButton>
                                    </Stack>
                                </Stack>
                            </div>
                        </StackBox>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
};

export default AdminRegister;

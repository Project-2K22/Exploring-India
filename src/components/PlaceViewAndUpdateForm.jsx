import React, { useEffect, useState } from 'react';
import {
    FilledInput,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Button,
    Typography,
    Paper,
    Box,
    Divider,
    Grid,
    LinearProgress,
} from '@mui/material';
import BaseContainer from './BaseContainer';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import SnackBarBox from './SnackBarBox';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { onValue, ref as DBREF, remove, update } from 'firebase/database';
import { db, storage } from '../firebase/config';
import { set } from 'firebase/database';
import { uuid } from '../helpers/uniqueIdGenerator';
import { useNavigate } from 'react-router-dom';

const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Input = ({ name, value, onChange }) => {
    return (
        <FormControl fullWidth variant="filled">
            <InputLabel htmlFor={`outlined-adornment-${name}`}>{capitalize(name)}</InputLabel>
            <FilledInput id={`outlined-adornment-${name}`} value={value} onChange={onChange} />
        </FormControl>
    );
};

const InputChild = ({ children, name }) => {
    return (
        <FormControl fullWidth variant="filled">
            <InputLabel htmlFor={`outlined-adornment-${name}`}>{capitalize(name)}</InputLabel>
            {children}
        </FormControl>
    );
};

const placeData = {
    city: '', //
    facts: [], //
    full_discription: '', //
    id: '',
    imagelinks: ['', '', '', '', ''], //
    latitude: '', //
    likes: 0,
    longitude: '', //
    name: '', //
    no: 1,
    others: [],
    placeVerified: false,
    short_description: '',
    state: '', //
    type: '', //
    uploaddate: Date.now(),
    visitors: 50,
    zipcode: '', //
};

const PlaceViewAndUpdateForm = ({ page, place, placeId }) => {
    const [form, setForm] = useState(place);
    const [prev, setPrev] = useState(place);
    const [fact, setFact] = useState({ id: '', data: '' });
    const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
    const [uploadLoading, setUploadLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onAddFacts = () => {
        if (fact.data !== '') setForm({ ...form, facts: [...form.facts, fact.data] });
        else setAlert({ visible: true, message: "You ca'nt add empty data", type: 'error' });
        setFact({ ...fact, data: '' });
    };

    const onUpdateFacts = () => {
        setForm({ ...form, facts: form.facts.map((f, k) => (k === fact.id ? (form.facts[fact.id] = fact.data) : f)) });
        setFact({ id: '', data: '' });
    };

    const FactsCard = ({ text, id }) => {
        return (
            <Stack direction={{ md: 'row', xs: 'column' }} alignItems="center" justifyContent={'space-between'}>
                <Box>{text}</Box>
                <Stack direction="row" spacing={3} pt={{ xs: '10px' }}>
                    <Button
                        onClick={() => {
                            setFact({ id: id, data: form.facts[id] });
                        }}
                    >
                        <ModeEditOutlineRoundedIcon />
                    </Button>
                    <Divider orientation="vertical" flexItem />
                    <Button
                        color="error"
                        onClick={() => {
                            setForm({ ...form, facts: form.facts.filter((f, k) => k !== id) });
                        }}
                    >
                        <DeleteForeverRoundedIcon />
                    </Button>
                </Stack>
            </Stack>
        );
    };

    const uploadImage = async (file, pos) => {
        setUploadLoading(true);
        const types = ['image/jpeg', 'image/jpg', 'image/png'];
        const { type } = file;
        if (file && types.includes(type)) {
            const fileExt = file.name.split('.')[1];
            const storageRef = ref(storage, `place_images_upload/${form.type}/${form.city}_${pos}.png`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                snapshot => {
                    let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(percentage);
                },
                error => setAlert({ visible: true, message: error, type: 'error' }),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(url => {
                        let arr = [...form.imagelinks.slice(0, pos), url, ...form.imagelinks.slice(pos + 1)];
                        setForm({
                            ...form,
                            imagelinks: arr,
                        });
                    });
                    setUploadLoading(false);
                }
            );
        } else {
            setAlert({
                visible: true,
                message: 'Image file type should be jpeg or png',
                type: 'error',
            });
        }
        // console.log(file);
    };

    const deleteImage = k => {
        if (window.confirm('Do you want to delete this picture?')) {
            let arr = [...form.imagelinks.slice(0, k), '', ...form.imagelinks.slice(k + 1)];
            setForm({
                ...form,
                imagelinks: arr,
            });
            const imageRef = ref(storage, `place_images_upload/${form.type}/${form.city}_${k}.png`);
            // Delete the file
            deleteObject(imageRef)
                .then(() => {
                    setAlert({
                        visible: true,
                        message: 'Image deleted successfully',
                        type: 'success',
                    });
                })
                .catch(error => {
                    // Uh-oh, an error occurred!
                    setAlert({
                        visible: true,
                        message: 'Image not deleted',
                        type: 'error',
                    });
                });
        }
    };

    const onPermit = t => {
        if (t === 'g') {
            update(DBREF(db, 'places/' + placeId), {
                placeVerified: true,
            })
                .then(() =>
                    setAlert({
                        visible: true,
                        message: 'Permission Granted',
                        type: 'success',
                    })
                )
                .catch(err =>
                    setAlert({
                        visible: true,
                        message: err,
                        type: 'error',
                    })
                );
        } else {
            update(DBREF(db, 'places/' + placeId), {
                placeVerified: 'rej',
            })
                .then(() =>
                    setAlert({
                        visible: true,
                        message: 'Permission Revoked',
                        type: 'warning',
                    })
                )
                .catch(err =>
                    setAlert({
                        visible: true,
                        message: err,
                        type: 'error',
                    })
                );
        }
    };

    const onDeletePlaceFromDatabase = () => {
        remove(DBREF(db, 'places/' + placeId))
            .then(() =>
                setAlert({
                    visible: true,
                    message: 'Data deleted successfully. Go back to admin page',
                    type: 'success',
                })
            )
            .catch(err =>
                setAlert({
                    visible: true,
                    message: err,
                    type: 'error',
                })
            );
        setForm(placeData);
    };

    const onSubmit = async () => {
        if (page === 'admin') {
            if (prev === form) {
                setAlert({
                    visible: true,
                    message: 'You have to add/update any data to submit',
                    type: 'info',
                });
                return;
            }
        }
        if (form.facts.length < 4) {
            setAlert({
                visible: true,
                message: 'You have to add al least two facts',
                type: 'error',
            });
            return;
        }
        if (form.imagelinks.length < 2) {
            setAlert({
                visible: true,
                message: 'You have to upload at least two images',
                type: 'error',
            });
            return;
        }
        if (
            form.city === '' ||
            form.full_discription === '' ||
            form.latitude === '' ||
            form.longitude === '' ||
            form.name === '' ||
            form.state === '' ||
            form.type === ''
        ) {
            setAlert({
                visible: true,
                message: 'Please fill all the details',
                type: 'info',
            });
            return;
        }
        if (page === 'admin') {
            // TODO: update .. after places id change
            // setForm({ ...form, placeVerified: 'true' });
        } else {
            set(DBREF(db, 'places/' + uuid()), form)
                .then(() => {
                    setAlert({
                        visible: true,
                        message: 'Your request has been sent to admin panel',
                        type: 'success',
                    });
                    setForm(placeData);
                })
                .catch(error =>
                    setAlert({
                        visible: true,
                        message: error,
                        type: 'error',
                    })
                );
        }
    };

    const addAdminUpdateData = () => {
        update(DBREF(db, 'places/' + placeId), {
            no: form.no,
            id: form.id,
        })
            .then(() =>
                setAlert({
                    visible: true,
                    message: 'Updated',
                    type: 'success',
                })
            )
            .catch(err =>
                setAlert({
                    visible: true,
                    message: err,
                    type: 'error',
                })
            );
    };

    const onUpdatePlaceDetailsByAdmin = () => {
        if (page === 'admin') {
            if (prev === form) {
                setAlert({
                    visible: true,
                    message: 'You have to add/update any data to submit',
                    type: 'info',
                });
                return;
            }
        }
        update(DBREF(db, 'places/' + placeId), form)
            .then(() =>
                setAlert({
                    visible: true,
                    message: 'Updated !',
                    type: 'success',
                })
            )
            .catch(err =>
                setAlert({
                    visible: true,
                    message: err,
                    type: 'error',
                })
            );
    };

    return (
        <BaseContainer w="lg">
            <SnackBarBox alert={alert} setAlert={setAlert} />
            <Stack spacing={3} sx={{ marginY: '30px' }}>
                <Typography fontWeight={'bold'} fontSize={'25px'}>
                    Basic Details about the place
                </Typography>
                <Input
                    name={'City Name'}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <Input
                    multiline
                    maxRows={4}
                    name={'City Description'}
                    value={form.full_discription}
                    onChange={e => setForm({ ...form, full_discription: e.target.value })}
                />
                <Input
                    name={'City Place'}
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                />
                <Input
                    name={'Latitude'}
                    value={form.latitude}
                    onChange={e => setForm({ ...form, latitude: e.target.value })}
                />
                <Input
                    name={'Longitude'}
                    value={form.longitude}
                    onChange={e => setForm({ ...form, longitude: e.target.value })}
                />
                <Input name={'State'} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                <Input
                    name={'Zipcode'}
                    value={form.zipcode}
                    onChange={e => setForm({ ...form, zipcode: e.target.value })}
                />
                <InputChild name={'Type'}>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={capitalize(form.type)}
                        onChange={e => setForm({ ...form, type: e.target.value })}
                    >
                        <MenuItem value={'Mountain'}>Mountain</MenuItem>
                        <MenuItem value={'Sea'}>Beach</MenuItem>
                        <MenuItem value={'Desert'}>Desert</MenuItem>
                        <MenuItem value={'Heritage'}>Heritage</MenuItem>
                    </Select>
                </InputChild>
                {/* facts */}
                <Typography fontWeight={'bold'} fontSize={'25px'}>
                    Facts about the place
                    <Typography fontSize={'12px'} fontStyle={'italic'} color={'gray'}>
                        At least add four facts about the place
                    </Typography>
                </Typography>

                {form.facts.length > 0 && (
                    <Paper variant="outlined" sx={{ padding: '10px' }}>
                        {form.facts.map((f, k) => (
                            <>
                                {k >= 1 && <Divider sx={{ marginY: '10px' }} />}
                                <FactsCard text={f} id={k} key={k} />
                            </>
                        ))}
                    </Paper>
                )}
                <Stack
                    direction={{ md: 'row', xs: 'column' }}
                    alignItems={'center'}
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Input name="Facts" value={fact.data} onChange={e => setFact({ ...fact, data: e.target.value })} />
                    {fact.id === '' ? (
                        <Button onClick={onAddFacts}>Add</Button>
                    ) : (
                        <Button onClick={onUpdateFacts}>Update</Button>
                    )}
                </Stack>
                {/* image upload */}
                <Typography fontWeight={'bold'} fontSize={'25px'}>
                    Upload Picture
                    <Typography fontSize={'12px'} fontStyle={'italic'} color={'gray'}>
                        You have to upload al least two images (max five)
                    </Typography>
                </Typography>

                {uploadLoading && <LinearProgress />}
                {!uploadLoading && (
                    <Grid container width={'100%'} spacing={4}>
                        {form.imagelinks.map((ig, k) => {
                            return (
                                <>
                                    {ig === '' && (
                                        <Grid item xs={12} md={4}>
                                            <Button
                                                component="label"
                                                sx={{
                                                    width: '100%',
                                                    height: '200px',
                                                    border: '1px dashed blue ',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <Stack>
                                                    <Typography>+</Typography>
                                                    <Typography>click here to add picture</Typography>
                                                </Stack>
                                                <input
                                                    hidden
                                                    type="file"
                                                    onChange={e => uploadImage(e.target.files[0], k)}
                                                />
                                            </Button>
                                        </Grid>
                                    )}
                                    {ig !== '' && (
                                        <Grid item md={4} xs={12}>
                                            <Paper
                                                sx={{
                                                    width: '100%',
                                                    height: '200px',
                                                    border: '1px dashed blue ',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <img
                                                    onClick={() => deleteImage(k)}
                                                    style={{ height: '100%', width: '100%' }}
                                                    src={ig}
                                                    alt=""
                                                />
                                            </Paper>
                                        </Grid>
                                    )}
                                </>
                            );
                        })}
                    </Grid>
                )}
                {page === 'admin' && ['false', false, 'true', true].includes(form.placeVerified) && (
                    <Paper variant="outlined" sx={{ padding: '20px' }}>
                        <Typography>For Admin Only</Typography>
                        <Stack spacing={3}>
                            <Input
                                name={'No.'}
                                value={form.no}
                                onChange={e => setForm({ ...form, no: e.target.value })}
                            />
                            <Input
                                name={'ID'}
                                value={form.id}
                                onChange={e => setForm({ ...form, id: e.target.value })}
                            />
                            <Button onClick={addAdminUpdateData} variant="contained" color="success">
                                Update
                            </Button>
                        </Stack>
                    </Paper>
                )}
                {page === 'holder' && (
                    <Button onClick={onSubmit} variant="contained">
                        Submit
                    </Button>
                )}
                {page === 'admin' && form.placeVerified === 'rej' && (
                    <Button onClick={onDeletePlaceFromDatabase} fullWidth variant="contained" color="error">
                        Delete place from database
                    </Button>
                )}
                {page === 'admin' && (form.placeVerified === 'true' || form.placeVerified === true) && (
                    <Button onClick={onUpdatePlaceDetailsByAdmin} fullWidth variant="contained" color="error">
                        upate place details (by admin)
                    </Button>
                )}
                {page === 'admin' && (form.placeVerified === 'false' || form.placeVerified === false) && (
                    <Stack direction={'row'} spacing={4}>
                        <Button onClick={() => onPermit('g')} fullWidth variant="contained" color="success">
                            Grant Request
                        </Button>
                        <Button onClick={() => onPermit('r')} fullWidth variant="contained" color="error">
                            Revoke Request
                        </Button>
                    </Stack>
                )}
            </Stack>
        </BaseContainer>
    );
};

export default PlaceViewAndUpdateForm;

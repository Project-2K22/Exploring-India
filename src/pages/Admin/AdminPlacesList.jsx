import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, Typography, Box, Grid, Paper, Stack, Divider, Button } from '@mui/material';
import BaseContainer from '../../components/BaseContainer';
import AdminNavbar from '../../components/AdminNavbar';
import { db } from '../../firebase/config';
import { ref, onValue } from 'firebase/database';
import useAuthState from '../../hooks/useAuthState';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import LinkTo from '../../components/LinkTo';

const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = index => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const colorArray = ['blue', 'green', 'red'];

const PlaceCard = ({ name, city, state, id }) => {
    return (
        // <Grid container>
        //     <Grid></Grid>
        // </Grid>
        <Paper variant="outlined" sx={{ padding: '10px' }}>
            <Stack
                direction={{ md: 'row', xs: 'column' }}
                alignItems={{ md: 'center', xs: 'flex-start' }}
                justifyContent={'space-between'}
            >
                <Stack>
                    <Typography fontWeight={'bold'} fontSize={{ md: '2em', xs: '1em' }}>
                        {name}
                    </Typography>
                    <Typography
                        color={'gray'}
                        fontStyle={'italic'}
                        fontSize={{ md: '1em', xs: '0.8em' }}
                    >{`${city}, ${state}`}</Typography>
                </Stack>
                <Divider />
                <LinkTo to={`/admin/all/places/${id}`}>
                    <Button size={'small'} onClick={() => console.log(id)}>
                        View
                    </Button>
                </LinkTo>
            </Stack>
        </Paper>
    );
};

const AdminPlacesList = () => {
    const [value, setValue] = useState(0);
    const { uid, user, error, loading } = useAuthState();
    const [allPlaces, setAllPlaces] = useState({});
    const [placeLoading, setPlaceLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const placesRef = ref(db, 'places/');
        onValue(placesRef, snapshot => {
            const data = snapshot.val();
            setAllPlaces(data);
            setPlaceLoading(false);
        });
    }, []);

    useEffect(() => {
        if (localStorage.getItem('admin_sign_in_status') === null) navigate('/admin/signin');
    }, []);

    const count = (type, _type) => {
        return Object.keys(allPlaces).filter(
            p => allPlaces[p].placeVerified === type || allPlaces[p].placeVerified === _type
        ).length;
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <BaseContainer w="lg">
            {loading || placeLoading ? (
                <Loader />
            ) : (
                <>
                    <AdminNavbar heading={'Places'} user={user} />
                    <Box sx={{ width: '100%' }} p={{ md: 4, xs: 0 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                textColor={colorArray[value]}
                                TabIndicatorProps={{ style: { background: colorArray[value] } }}
                                value={value}
                                onChange={handleChange}
                                aria-label="basic tabs example"
                            >
                                <Tab
                                    sx={{ color: 'blue', fontSize: { md: '1vw', xs: '2vw' } }}
                                    label={`Queue (${count(false, 'false')})`}
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    sx={{ color: 'green', fontSize: { md: '1vw', xs: '2vw' } }}
                                    label={`Granted (${count(true, 'true')})`}
                                    {...a11yProps(1)}
                                />
                                <Tab
                                    sx={{ color: 'red', fontSize: { md: '1vw', xs: '2vw' } }}
                                    label={`Rejected (${count('rej', 'rej')})`}
                                    {...a11yProps(2)}
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Grid width={'100%'} container spacing={4}>
                                {Object.keys(allPlaces)
                                    .filter(
                                        p =>
                                            allPlaces[p].placeVerified === false ||
                                            allPlaces[p].placeVerified === 'false'
                                    )
                                    .map((p, id) => (
                                        <Grid item xs={12} md={6}>
                                            <PlaceCard
                                                name={allPlaces[p].name}
                                                city={allPlaces[p].city}
                                                state={allPlaces[p].state}
                                                id={p}
                                                key={id}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Grid width={'100%'} container spacing={4}>
                                {Object.keys(allPlaces)
                                    .filter(
                                        p =>
                                            allPlaces[p].placeVerified === true || allPlaces[p].placeVerified === 'true'
                                    )
                                    .map((p, id) => (
                                        <Grid item xs={12} md={6}>
                                            <PlaceCard
                                                name={allPlaces[p].name}
                                                city={allPlaces[p].city}
                                                state={allPlaces[p].state}
                                                id={p}
                                                key={id}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Grid width={'100%'} container spacing={4}>
                                {Object.keys(allPlaces)
                                    .filter(p => allPlaces[p].placeVerified === 'rej')
                                    .map((p, id) => (
                                        <Grid item xs={12} md={6}>
                                            <PlaceCard
                                                name={allPlaces[p].name}
                                                city={allPlaces[p].city}
                                                state={allPlaces[p].state}
                                                id={p}
                                                key={id}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </TabPanel>
                    </Box>
                </>
            )}
        </BaseContainer>
    );
};

export default AdminPlacesList;

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
            <Stack direction={'row'} alignItems="center" justifyContent={'space-between'}>
                <Stack>
                    <Typography fontWeight={'bold'} fontSize="2rem">
                        {name}
                    </Typography>
                    <Typography color={'gray'}>{`${city}, ${state}`}</Typography>
                </Stack>
                <Divider />
                <LinkTo to={`/admin/all/places/${id}`}>
                    <Button onClick={() => console.log(id)}>View</Button>
                </LinkTo>
            </Stack>
        </Paper>
    );
};

const AdminPlacesList = () => {
    const [value, setValue] = useState(0);
    const { uid, user, error, loading } = useAuthState();
    const [allPlaces, setAllPlaces] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const placesRef = ref(db, 'places/');
        onValue(placesRef, snapshot => {
            const data = snapshot.val();
            console.log(data);
            setAllPlaces(data);
        });
    }, []);

    useEffect(() => {
        if (localStorage.getItem('admin_sign_in_status') === null) navigate('/admin/signin');
    }, []);

    const count = type => {
        return allPlaces.filter(p => p.placeVerified === type).length;
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <BaseContainer w="lg">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <AdminNavbar heading={'Places'} user={user} />
                    <Box sx={{ width: '100%' }} p={4}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                textColor={colorArray[value]}
                                TabIndicatorProps={{ style: { background: colorArray[value] } }}
                                value={value}
                                onChange={handleChange}
                                aria-label="basic tabs example"
                            >
                                <Tab sx={{ color: 'blue' }} label={`Queue (${count(false)})`} {...a11yProps(0)} />
                                <Tab sx={{ color: 'green' }} label={`Granted (${count(true)})`} {...a11yProps(1)} />
                                <Tab sx={{ color: 'red' }} label={`Rejected (${count('rej')})`} {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Grid width={'100%'} container spacing={4}>
                                {allPlaces
                                    .filter(p => p.placeVerified === 'false')
                                    .map((p, id) => (
                                        <Grid item xs={6}>
                                            <PlaceCard name={p.name} city={p.city} state={p.state} id={id} key={id} />
                                        </Grid>
                                    ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Grid width={'100%'} container spacing={4}>
                                {allPlaces
                                    .filter(p => p.placeVerified === 'true')
                                    .map((p, id) => (
                                        <Grid item xs={6}>
                                            <PlaceCard name={p.name} city={p.city} state={p.state} id={id} key={id} />
                                        </Grid>
                                    ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Grid width={'100%'} container spacing={4}>
                                {allPlaces
                                    .filter(p => p.placeVerified === 'rej')
                                    .map((p, id) => (
                                        <Grid item xs={6}>
                                            <PlaceCard name={p.name} city={p.city} state={p.state} id={id} key={id} />
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

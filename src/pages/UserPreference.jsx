import React, { useState } from 'react';
import { Paper, Box, Stepper, Step, StepLabel, Button, Typography, Stack, Chip, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import BaseContainer from '../components/BaseContainer';
import SnackBarBox from '../components/SnackBarBox';

import { auth, db } from '../firebase/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { update, ref } from 'firebase/database';
import ImageButtonContainer from '../components/ImageButtonContainer';

const steps = [
    'Places you like',
    'Length of trip',
    'Places you like to visit',
    'Favourite weather',
    'Turn on location',
];

const questions = [
    'Which type of places you like to visit?',
    'What kind of trip you want to do?',
    'Do you like to visit place outside your state?',
    'Which weather is favourite to you for trip?',
    'Please click the button to turn on location.',
];

const options = [
    ['Mountain', 'Beach', 'Desert', 'Heritage'],
    ['Long', 'Short', 'Depends on you'],
    ['Yes', 'No'],
    ['Summer', 'Winter', 'Spring', 'Autumn', 'Rain'],
];

const optionsImageUrls = [
    [
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/placeimages%2Fmountain%2FSandakphu%2Fs1.jpg?alt=media&token=2c785ba5-1c6b-471a-87e9-b39da877d4dd',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/placeimages%2Fsea%2Fgolden%20beach%2Fgolden%20beach%201.jpg?alt=media&token=f58ccc32-4bea-4765-ae09-505c200c5f29',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2FDesert%2Fpexels-%E5%85%89%E6%9B%A6-%E5%88%98-8982040.jpg?alt=media&token=b425f469-bef5-4f39-b8cd-db0f2792c3da',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/placeimages%2Fheritage%2Fsun_temple%2Fvenkat-rajalbandi-ipE-A1FoUwc-unsplash.jpg?alt=media&token=bdb50ac2-fe6e-4264-968d-4801d4618025',
    ],
    [
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Ftype_of_trip%2Fpexels-pixabay-47044.jpg?alt=media&token=66f5fe9c-2641-4fa2-9b53-747c20ea8207',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Ftype_of_trip%2Fpexels-philipp-m-100582.jpg?alt=media&token=0af95cc7-6f82-48bb-b5d4-8c52427f6e93',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Ftype_of_trip%2Fpexels-monstera-7412085.jpg?alt=media&token=9e6b625b-d734-44d1-8367-4cdb226fd52b',
    ],
    [
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Fyes_no%2Fpexels-daniel-absi-952670.jpg?alt=media&token=fdba03e1-017b-4ef0-a91c-338acf4b4434',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Fyes_no%2Fpexels-daniel-absi-952670.jpg?alt=media&token=fdba03e1-017b-4ef0-a91c-338acf4b4434',
    ],
    [
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Fseasons%2Fpexels-pixabay-33044.jpg?alt=media&token=6fe9ab9d-00a1-4406-8a81-360a0dab0d0c',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Fseasons%2Fpexels-egor-kamelev-813872.jpg?alt=media&token=ab3c8bd2-5c8a-4c07-a2b5-7e5d269db98f',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Fseasons%2Fpexels-magda-ehlers-985266.jpg?alt=media&token=6c72f523-2387-49c3-a8a1-fe1d2dc96cde',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Fseasons%2Fpexels-pixabay-33109.jpg?alt=media&token=3b6b3dc5-35ef-4596-a132-7d8a3f6a7149',
        'https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/user_preference_options_images%2Fseasons%2Fpexels-sitthan-kutty-913807.jpg?alt=media&token=fe4addb5-ff0f-4155-b84c-7319e409f0e9',
    ],
];

const UserPreference = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [currentOptionIndex, setCurrentOptionIndex] = useState(-1);
    const [answerIndex, setAnswerIndex] = useState([]);
    const [userLocation, setUserLocation] = useState({ lat: '', lng: '' });
    const [alert, setAlert] = useState({ visible: false, message: '', type: '' });

    const checkUserLocationHasCoordinates = () => {
        const { lat, lng } = userLocation;
        return lat !== '' && lng !== '' && activeStep === 4;
    };

    const handleNext = () => {
        if (currentOptionIndex === -1 && answerIndex[activeStep] === undefined) {
            if (activeStep === 4) setAlert({ visible: true, message: 'Your location is off', type: 'error' });
            else setAlert({ visible: true, message: 'You have to select at least one option', type: 'info' });
        } else if (activeStep === 4 && !checkUserLocationHasCoordinates()) {
            setAlert({ visible: true, message: 'Please, turn on your location', type: 'error' });
        } else {
            setCurrentOptionIndex(-1);
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setCurrentOptionIndex(-1);
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleOptionsSelect = key => {
        setCurrentOptionIndex(key);
        setAnswerIndex(prevAnswerIndex => [
            ...prevAnswerIndex.slice(0, activeStep),
            key,
            ...prevAnswerIndex.slice(activeStep + 1),
        ]);
    };

    const handleGeoLocationPermission = () => {
        window.navigator.geolocation.getCurrentPosition(position =>
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        );
    };

    const handleFinish = () => {
        if (answerIndex.length === 4 && userLocation.lat !== '' && userLocation.lng !== '') {
            const userPreferenceData = {
                placesUserLike: options[0][answerIndex[0]],
                lengthOfTrip: options[1][answerIndex[1]],
                wantToVisitPlacesOtherStates: options[2][answerIndex[2]],
                favouriteSeason: options[3][answerIndex[3]],
                latitude: userLocation.lat,
                longitude: userLocation.lng,
            };
            // update user db
            update(ref(db, 'users/' + location.state.uid), userPreferenceData)
                .then(() => navigate('/home'))
                .catch(() => console.log('Database update problem'));
        } else {
            setAlert({
                visible: true,
                message: 'Please answer all the question. It is very imporatnt for us to configure the site for you',
                type: 'info',
            });
        }
    };

    // TODO: in "turn on" question ... have to redesign UI for better user exp.

    return (
        <BaseContainer w="lg">
            <SnackBarBox alert={alert} setAlert={setAlert} />
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} sx={{ marginY: '30px' }}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                <React.Fragment>
                    <Paper sx={{ paddingX: '20px', paddingY: '30px' }} variant="outlined">
                        <Stack spacing={5}>
                            <Typography variant="h4" fontWeight="bold">
                                {questions[activeStep]}
                            </Typography>
                            <Grid width={'100%'} container spacing={5}>
                                {activeStep < 4 ? (
                                    options[activeStep].map((option, key) => {
                                        return (
                                            <Grid Item xs={4}>
                                                <ImageButtonContainer
                                                    image={{
                                                        title: option,
                                                        url: optionsImageUrls[activeStep][key],
                                                    }}
                                                    isBorder={
                                                        [currentOptionIndex, answerIndex[activeStep]].includes(key)
                                                            ? 'yes'
                                                            : 'no'
                                                    }
                                                    key={key}
                                                    onPress={() => handleOptionsSelect(key)}
                                                />
                                            </Grid>
                                        );
                                    })
                                ) : checkUserLocationHasCoordinates() ? (
                                    <Chip
                                        icon={<CheckCircleRoundedIcon />}
                                        color="success"
                                        label="Your Location is ON"
                                    />
                                ) : (
                                    <Chip
                                        icon={<CancelIcon />}
                                        color="error"
                                        label="Please, click here to turn on your location"
                                        onClick={handleGeoLocationPermission}
                                    />
                                )}
                            </Grid>
                        </Stack>
                    </Paper>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={activeStep === 4 ? () => handleFinish() : () => handleNext()}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            </Box>
        </BaseContainer>
    );
};

export default UserPreference;

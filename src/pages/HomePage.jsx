import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Stack, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { getDatabase, ref, child, get, update } from 'firebase/database';
import NavBar from '../components/NavBar';
import IndexCard from '../components/IndexCard';
import SlideingCards from '../components/SlideingCards';
import ImageCard from '../components/ImageCard';

import Carousel from 'react-simply-carousel';
import haversine from 'haversine';
import Loader from '../components/Loader';

const HomePage = () => {
    const [uid, setUid] = useState(null);
    const [userData, setUserData] = useState(null);
    const [pageReady, setPageReady] = useState(false);
    const [placeData, setPlaceData] = useState(null);
    const [userStateName, setUserStateName] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const navigate = useNavigate();

    const placeAllData = [];
    function goTOPage(e) {
        navigate('/' + e);
    }
    const [navBarProps, setNavBarProps] = useState({
        leftFirstLinkAbout: {
            name: 'About',
            onClickFun: () => {
                console.log('From leftFirstLinkAbout');
            },
            visible: true,
        },
        leftSecondLinkContact: {
            name: 'Contact',
            onClickFun: () => {
                console.log('From leftSecondLinkContact');
            },
            visible: true,
        },
        rightFirstLinkLogin: {
            name: 'Login',
            onClickFun: () => {
                goTOPage('login');
            },
            visible: true,
        },
        rightSecondLinkSignup: {
            name: 'Signup',
            onClickFun: () => {
                goTOPage('signup');
            },
            visible: true,
        },
        rightthirdLinkLogout: {
            name: 'Logout',
            onClickFun: () => {
                console.log('From rightthirdLinkLogout');
            },
            visible: false,
        },
        SearchIcon: { onClickFun: () => console.log('From SearchIcon'), visible: true },
        ProfileIcon: {
            onClickFun: () => {
                console.log('H');
            },
            visible: false,
        },
        UserLogin: false,
    });

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user === null) {
                const dbf = ref(getDatabase());

                var countForPlaceAddData = 0;
                get(child(dbf, `places`))
                    .then(snapshot => {
                        snapshot.forEach(function (childSnapshot) {
                            var childData = childSnapshot.val();
                            if (childData.placeVerified) {
                                placeAllData.push(childData);
                            }
                            countForPlaceAddData = countForPlaceAddData + 1;
                            if (snapshot.size === countForPlaceAddData) {
                                setPageReady(true);
                                setPlaceData(placeAllData);
                            }
                        });
                    })
                    .catch(error => {
                        const errorMessage = error.message;
                    });
            } else {
                setUid(user.uid);
                setNavBarProps({
                    leftFirstLinkAbout: {
                        name: 'About',
                        onClickFun: () => {
                            console.log('OK');
                        },
                        visible: true,
                    },
                    leftSecondLinkContact: {
                        name: 'Contact',
                        onClickFun: () => {
                            console.log('From leftSecondLinkContact');
                        },
                        visible: true,
                    },
                    rightFirstLinkLogin: {
                        name: 'Login',
                        onClickFun: () => {
                            console.log('From rightFirstLinkLogin');
                        },
                        visible: false,
                    },
                    rightSecondLinkSignup: {
                        name: 'Signup',
                        onClickFun: () => {
                            console.log('From rightSecondLinkSignup');
                        },
                        visible: false,
                    },
                    rightthirdLinkLogout: {
                        name: 'Logout',
                        onClickFun: () => {
                            handleLogOut();
                        },
                        visible: true,
                    },
                    SearchIcon: { onClickFun: () => console.log('From SearchIcon'), visible: true },
                    ProfileIcon: {
                        onClickFun: () => {
                            goTOPage('user-profile');
                        },
                        visible: true,
                    },
                    UserLogin: true,
                });

                const dbf = ref(getDatabase());
                get(child(dbf, `users/${user.uid}`))
                    .then(snapshot => {
                        setUserData(snapshot.val());
                        fetchLocationName(snapshot.val().latitude, snapshot.val().longitude);
                    })
                    .catch(error => {
                        const errorMessage = error.message;
                    });
                countForPlaceAddData = 0;
                get(child(dbf, `places`))
                    .then(snapshot => {
                        snapshot.forEach(function (childSnapshot) {
                            var childData = childSnapshot.val();
                            if (childData.placeVerified) {
                                placeAllData.push(childData);
                            }
                            countForPlaceAddData = countForPlaceAddData + 1;
                            if (snapshot.size === countForPlaceAddData) {
                                setPageReady(true);
                                setPlaceData(placeAllData);
                            }
                        });
                    })
                    .catch(error => {
                        const errorMessage = error.message;
                    });
            }
        });
    }, []);

    const goToPageForCarousel = (e, userId) => {
        if (userId === undefined || userId === null) navigate('/login');
        var t = userData.placeVisited;
        t.push(e);
        update(ref(db, `users/${uid}`), {
            placeVisited: t,
        })
            .then(function () {})
            .catch(function (error) {
                const errorMessage = error.message;
            });
        navigate('/place-view/' + e);
    };

    //ALL THE FUNCTIONS START
    const fetchLocationName = async (lat, lng) => {
        await fetch(
            'https://www.mapquestapi.com/geocoding/v1/reverse?key=J242Ym8kpbiBA8SmTXOBUisdbsZ79OBc&location=' +
                lat +
                '%2C' +
                lng +
                '&outFormat=json&thumbMaps=false'
        )
            .then(response => response.json())
            .then(responseJson => {
                var t = responseJson;
                setUserStateName(t.results[0].locations[0].adminArea3);
            });
    };
    const handleLogOut = () => {
        signOut(auth)
            .then(() => {
                navigate('/login');
            })
            .catch(error => {
                // An error happened.
                navigate('/home');
            });
    };

    function calculateDistance(lattitude1, longittude1, lattitude2, longittude2) {
        //CALCULATE DISTANCE BETWEEN TWO POINTS
        const start = {
            latitude: lattitude1,
            longitude: longittude1,
        };

        const end = {
            latitude: lattitude2,
            longitude: longittude2,
        };

        var d = haversine(start, end);
        d = Math.floor(d);
        return d;
    }

    function filterTypeOfData(type) {
        //FILTER THE PLACE DATA BY THE TYPE OF LIKE HERITAGE SEC ETC
        return function (element) {
            return element.type.toLowerCase() === type.toLowerCase();
        };
    }

    function filterPlaceDataByDistance(uptoKM) {
        // FILTER THE DATA BY DISTANCE UNDER WHAT KM
        var user_lat = userData.latitude;
        var user_long = userData.longitude;
        return function (element) {
            var place_lat = element.latitude;
            var place_long = element.longitude;
            var distance = calculateDistance(user_lat, user_long, place_lat, place_long);
            if (distance < uptoKM) {
                return element.latitude === place_lat;
            }
        };
    }

    function sortDataByDistanceInUP(forwhichdata, iord) {
        //SORT THE PROVIDED ARRAY DATA IN DISTANCE
        var user_lat = userData.latitude;
        var user_long = userData.longitude;
        var distanceArr = [];
        var returnArr = [];
        for (let i = 0; i < forwhichdata.length; i++) {
            var element = forwhichdata[i];
            var place_lat = element.latitude;
            var place_long = element.longitude;
            var distance = calculateDistance(user_lat, user_long, place_lat, place_long);
            var b = [];
            b.push(element.id);
            b.push(distance);
            distanceArr.push(b);
        }
        distanceArr.sort(function compareSecondColumn(a, b) {
            if (a[1] === b[1]) {
                return 0;
            } else {
                return a[1] < b[1] ? -1 : 1;
            }
        });
        for (let i = 0; i < distanceArr.length; i++) {
            var id = distanceArr[i][0];
            var ind = isArrayItemExists(forwhichdata, id);
            if (ind !== -1) {
                returnArr.push(forwhichdata[ind]);
            }
        }
        if (iord.toLowerCase() === 'd') {
            returnArr.reverse();
            return returnArr;
        }
        return returnArr;
    }

    function isArrayItemExists(array, item) {
        // CHECK THE DATA PRESENT OR NOT AND RETURN THE INDEX
        for (var i = 0; i < array.length; i++) {
            var s = JSON.stringify(array[i]);
            if (s.includes(item)) {
                return i;
            }
        }
        return -1;
    }

    function GetPlaceDataByVisitors(noOfPlaceToShow) {
        //SORT THE PLACEDATA DATA BY NO OF VISITORS
        var localPlaceData = placeData;
        localPlaceData.sort(function (a, b) {
            var keyA = a.visitors,
                keyB = b.visitors;
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
        localPlaceData = localPlaceData.slice(0, noOfPlaceToShow);
        return localPlaceData;
    }

    function FilterDataByVisitorsForUP(UPdata, noOfPlaceToShow) {
        //SORT THE PROVIDED ARRAY DATA BY NO OF VISITORS USED IN USER PREFERENCE
        var localPlaceData = UPdata;
        localPlaceData.sort(function (a, b) {
            var keyA = a.visitors,
                keyB = b.visitors;
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
        localPlaceData = localPlaceData.slice(0, noOfPlaceToShow);
        return localPlaceData;
    }

    function filterPlaceData(filedname, fieldvalue) {
        //FILTER THE DATA BY FIELDNAME AND FIELD VALUE USED IN USED PREFERENECE
        if (filedname.toLowerCase() === 'state') {
            return function (element) {
                return element.state.toLowerCase() === fieldvalue.toLowerCase();
            };
        }
    }

    function giveMeARandomNumber(includeZero, upto) {
        //GIVES A RANDOM NUMBER IN GIVEN RANGE PASS TRUE IF WANT 0 ALSO
        //UPTO DATA IS ALSO INCLUDE
        if (includeZero) {
            return Math.floor(Math.random() * (upto + 1));
        } else {
            return Math.floor(Math.random() * (upto + 1)) + 1;
        }
    }

    function doNotIncludeThisDataFilter(id) {
        //RETURN ALL THE VALUE EXPECT THE ID PASSED
        return function (element) {
            return element.id.toLowerCase() !== id.toLowerCase();
        };
    }

    function recentPlaceVisitedUP() {
        //CHECK THE RECENT VISIT PLACE ANS SUGGEST THAT TYPE PLACE
        var lastVisitedplaceID = userData.placeVisited[userData.placeVisited.length - 1];
        var forType = lastVisitedplaceID.slice(0, 1).toLowerCase();
        var typeIs;
        if (forType === 'm') {
            typeIs = 'mountain';
        } else if (forType === 'h') {
            typeIs = 'heritage';
        } else if (forType === 's') {
            typeIs = 'sea';
        } else {
            typeIs = 'desert';
        }
        var filterArrData = placeData.filter(filterTypeOfData(typeIs));
        filterArrData = filterArrData.filter(doNotIncludeThisDataFilter(lastVisitedplaceID));
        var r = giveMeARandomNumber(true, filterArrData.length - 1);
        return filterArrData[r];
    }

    function countTheDataAndReturnMaxTypeForUP(array) {
        //COUNT THE ALL DATA PASSED ON ARRAY USED ONLY ON mostVisitedPlacesUP
        let d = 0;
        let h = 0;
        let m = 0;
        let s = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].slice(0, 1) === 'h') {
                h = h + 1;
            } else if (array[i].slice(0, 1) === 'd') {
                d = d + 1;
            } else if (array[i].slice(0, 1) === 's') {
                s = s + 1;
            } else if (array[i].slice(0, 1) === 'm') {
                m = m + 1;
            }
        }
        var tr = [
            [h, 'heritage'],
            [m, 'mountain'],
            [s, 'sea'],
            [d, 'desert'],
        ];
        tr.sort();
        tr.reverse();
        return tr[0][1];
    }

    function doNotIncludeThisDataArrFilter(array1, array2) {
        //RETURN ALL THE VALUE OF ARRAY2 EXPECT THE VALUE OF ARRAY1 PASSED
        var resD = [];
        for (let i = 0; i < array2.length; i++) {
            if (array1.indexOf(array2[i].id) === -1) {
                resD.push(array2[i]);
            }
        }
        return resD;
    }

    function mostVisitedPlacesUP() {
        // CHECK WHICH TYPE OF PLACE USER MOST VISIT AND GIVE A RANDOM PLACE ON THAT TYPE
        var maxVisitType = countTheDataAndReturnMaxTypeForUP(userData.placeVisited);
        var filterArrData = placeData.filter(filterTypeOfData(maxVisitType));
        var t = doNotIncludeThisDataArrFilter(userData.placeVisited, filterArrData);
        return t[giveMeARandomNumber(true, t.length - 1)];
    }

    function userPreferenceData() {
        // THIS IS THE MAIN FUNCTION FOR ANALYSING THE USER PREFERENCE DATA AND RETURN PERFACT THE VALUE
        var uLikeOtherState = userData.wantToVisitPlacesOtherStates.toLowerCase();
        var uLikeShortLong = userData.lengthOfTrip.toLowerCase();
        var uLike = userData.placesUserLike.toLowerCase();
        var mainUserPData = [];
        mostVisitedPlacesUP();
        if (uLikeOtherState === 'no') {
            // USER DON'T LIKE OTHERS STATE
            var stateResult = placeData.filter(filterPlaceData('state', userStateName));
            if (stateResult.length != 0) {
                // WE HAVE SOME PLPACES IN stateResult IN STATE
                if (uLikeShortLong === 'short') {
                    //USER LIKE SHORT TRIP
                    var userLikeShort = sortDataByDistanceInUP(stateResult, 'i');
                    var userLike = userLikeShort.filter(filterTypeOfData(uLike));
                    if (userLike !== 0) {
                        // userLike HAVE SOME VALUE
                        //console.log(userLike) ## THIS IS THE FINAL DATA WHEN USER NOT LIKE OTHER STATE , SHORT TRIP , HIS OWN TYPE
                        mainUserPData = userLike;
                    } else {
                        // WE DONT GET ANY VALUE USER TYPE
                        //SHOW DATA BY SORT BY VISITORS
                        var resultFor1 = FilterDataByVisitorsForUP(userLikeShort, 3);
                        //console.log(resultFor1)  ## THIS IS FINAL RESULT FOR USER NOT LIKE OTHER STATE, SHORT TRIP , NOT HIS OWN TYPE
                        mainUserPData = resultFor1;
                    }
                } else {
                    //USER LIKE LONG TRIP
                    var resultForLongTrip = sortDataByDistanceInUP(stateResult, 'd');
                    var userLike = resultForLongTrip.filter(filterTypeOfData(uLike));
                    if (userLike === 0) {
                        // userLike HAVE SOME VALUE
                        //console.log(userLike) ## THIS IS THE FINAL DATA WHEN USER NOT LIKE OTHER STATE , LONG TRIP , HIS OWN TYPE
                        mainUserPData = userLike;
                    } else {
                        // WE DONT GET ANY VALUE USER TYPE
                        //SHOW DATA BY SORT BY VISITORS
                        var resultFor2 = FilterDataByVisitorsForUP(resultForLongTrip, 3);
                        //console.log(resultFor2) ## THIS IS THE FINAL DATA WHEN USER NOT LIKE OTHER STATE , LONG TRIP , NOT HIS OWN TYPE
                        mainUserPData = resultFor2;
                    }
                }
            }
        } else {
            //USER LIKE OTHER STATE
            if (uLikeShortLong === 'short') {
                //USER LIKE SHORT TRIP
                var userLikeShort = sortDataByDistanceInUP(placeData, 'i');
                var userLike = userLikeShort.filter(filterTypeOfData(uLike));
                userLike = userLike.slice(0, 3);
                //console.log(userLike) ## THIS IS THE FINAL DATA WHEN USER LIKE OTHER STATE , SHORT TRIP ,HIS OWN TYPE
                mainUserPData = userLike;
            } else {
                //USER LIKE LONG TRIP
                var userLikeShort = sortDataByDistanceInUP(placeData, 'd');
                var userLike = userLikeShort.filter(filterTypeOfData(uLike));
                var resultFor2 = FilterDataByVisitorsForUP(userLikeShort, 3);
                //console.log(resultFor2) ## THIS IS THE FINAL DATA WHEN USER LIKE OTHER STATE , LONG TRIP ,HIS OWN TYPE
                mainUserPData = resultFor2;
            }
        }

        mainUserPData.unshift(recentPlaceVisitedUP());
        mainUserPData.unshift(mostVisitedPlacesUP());

        return mainUserPData;
    }

    function getThePlaceDataOfTheIndex(array) {
        //FILTER THE PLACE DATA BY THE no OF LIKE HERITAGE SEC ETC
        var temp = [];
        for (let i = 0; i < array.length; i++) {
            temp.push(placeData[array[i]]);
        }
        return temp;
    }

    function placesSuggestedByUs(howmany) {
        var p = [];
        for (let i = 0; i < howmany; i++) {
            var t = giveMeARandomNumber(true, placeData.length - 1);
            p.push(t);
        }
        return getThePlaceDataOfTheIndex(p);
    }

    //ALL THE FUNCTIONS END
    return (
        <Box
            width="100%"
            height="100%"
            sx={{
                overflow: 'hidden',
                background:
                    'linear-gradient(rgb(0, 0, 0,0.2),rgb(0, 0, 255,0.1)), url(https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/test_images%2Frt.jpg?alt=media&token=3d4c03d6-967f-4025-906d-6a272ee80010)',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
            }}
        >
            <CssBaseline />

            <NavBar {...navBarProps} />

            {pageReady === true && placeData !== null ? (
                uid !== null && userData !== null && userStateName !== null ? (
                    <Box>
                        <Stack spacing={2} direction="column" height="100vh">
                            <Stack ml={17.5} mt={20} direction="column" spacing={2}>
                                <Stack direction="row" spacing={10} width="auto">
                                    <Box>
                                        <Stack spacing={2}>
                                            <Typography variant="h1" style={{ color: 'white', fontWeight: '500' }}>
                                                Beautiful places of India
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                style={{ color: 'white', fontWeight: '400', fontSize: '1.4rem' }}
                                            >
                                                Plan your vacation on the most beautiful places of india
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ overflowY: 'hidden', width: '65%' }}>
                                        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                                            <Carousel
                                                updateOnItemClick
                                                containerProps={{}}
                                                activeSlideIndex={activeSlide}
                                                activeSlideProps={{}}
                                                onRequestChange={setActiveSlide}
                                                forwardBtnProps={{
                                                    children: <NavigateNextIcon />,
                                                    style: {
                                                        width: 60,
                                                        height: 30,
                                                        minWidth: 60,
                                                        alignSelf: 'center',
                                                        outline: 'none',
                                                        margin: '5px',
                                                        border: 'none',
                                                        background: 'transparent',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        padding: '20px',
                                                    },
                                                }}
                                                backwardBtnProps={{ children: '<', style: { display: 'none' } }}
                                                itemsToShow={1}
                                                itemsToScroll={1}
                                                speed={1000}
                                                infinite={true}
                                                easing="linear"
                                            >
                                                {placesSuggestedByUs(3).map(val => {
                                                    return (
                                                        <ImageCard
                                                            key={val.id}
                                                            value={{
                                                                onClickFun: () => {
                                                                    goToPageForCarousel(val.id, uid);
                                                                },
                                                                placeName: val.name,
                                                                city: val.city,
                                                                buttonName: 'view',
                                                                imageLink: val.imagelinks[0],
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Carousel>
                                        </div>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Places near by you can visit',
                                data: placeData.filter(filterPlaceDataByDistance(10)),
                            }}
                        />
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Most visited places you can visit',
                                data: GetPlaceDataByVisitors(3),
                            }}
                        />
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Place recommended based on your preference and uses',
                                data: userPreferenceData(),
                            }}
                        />
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Place recommended by us',
                                data: placesSuggestedByUs(4),
                            }}
                        />
                        {/*FOR HERITAGE SITE START*/}
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Heritage places you can visit',
                                data: placeData.filter(filterTypeOfData('heritage')),
                            }}
                        />
                        {/*FOR HERITAGE SITE END*/}
                        {/*FOR MOUNTAIN SITE START*/}
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Mountains you can visit',
                                data: placeData.filter(filterTypeOfData('mountain')),
                            }}
                        />
                        {/*FOR MOUNTAIN SITE END*/}
                        {/*FOR SEA SITE START*/}
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Sea you can visit',
                                data: placeData.filter(filterTypeOfData('sea')),
                            }}
                        />
                        {/*FOR SEA SITE END*/}
                        {/*FOR Desert SITE START*/}
                        <SlideingCards
                            value={{
                                uid: uid,
                                placeData: userData.placeVisited,
                                topHeading: 'Desert you can visit',
                                data: placeData.filter(filterTypeOfData('desert')),
                            }}
                        />
                        {/*FOR Desert SITE END*/}
                    </Box>
                ) : (
                    //FOR USER NOT LOGED IN START FOR ALL THIS WILL SHOW
                    <Box>
                        <Stack spacing={2} direction="column" height="100vh">
                            <Stack ml={17.5} mt={20} direction="column" spacing={2}>
                                <Stack direction={{ md: 'row', xs: 'column' }} spacing={10} width="auto">
                                    <Box>
                                        <Stack spacing={2}>
                                            <Typography variant="h1" style={{ color: 'white', fontWeight: '500' }}>
                                                Beautiful places of India
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                style={{ color: 'white', fontWeight: '400', fontSize: '1.4rem' }}
                                            >
                                                Plan your vacation on the most beautiful places of india
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ overflowY: 'hidden', width: '65%' }}>
                                        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                                            <Carousel
                                                updateOnItemClick
                                                containerProps={{}}
                                                activeSlideIndex={activeSlide}
                                                activeSlideProps={{}}
                                                onRequestChange={setActiveSlide}
                                                forwardBtnProps={{
                                                    children: <NavigateNextIcon />,
                                                    style: {
                                                        width: 60,
                                                        height: 30,
                                                        minWidth: 60,
                                                        alignSelf: 'center',
                                                        outline: 'none',
                                                        margin: '5px',
                                                        border: 'none',
                                                        background: 'transparent',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        padding: '20px',
                                                    },
                                                }}
                                                backwardBtnProps={{ children: '<', style: { display: 'none' } }}
                                                itemsToShow={1}
                                                itemsToScroll={1}
                                                speed={1000}
                                                infinite={true}
                                                easing="linear"
                                            >
                                                {placesSuggestedByUs(3).map(val => {
                                                    return (
                                                        <ImageCard
                                                            key={val.id}
                                                            value={{
                                                                onClickFun: () => {
                                                                    goToPageForCarousel(val.id);
                                                                },
                                                                placeName: val.name,
                                                                city: val.city,
                                                                buttonName: 'view',
                                                                imageLink: val.imagelinks[0],
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Carousel>
                                        </div>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>
                        <SlideingCards
                            value={{
                                // uid: uid,
                                // placeData: userData.placeVisited,
                                topHeading: 'Most visited places you can visit',
                                data: GetPlaceDataByVisitors(3),
                            }}
                        />
                        <SlideingCards
                            value={{
                                // uid: uid,
                                // placeData: userData.placeVisited,
                                topHeading: 'Place recommended by us',
                                data: placesSuggestedByUs(4),
                            }}
                        />

                        {/*FOR HERITAGE SITE START*/}
                        <SlideingCards
                            value={{
                                topHeading: 'Heritage places you can visit',
                                data: placeData.filter(filterTypeOfData('heritage')),
                            }}
                        />
                        {/*FOR HERITAGE SITE END*/}
                        {/*FOR MOUNTAIN SITE START*/}
                        <SlideingCards
                            value={{
                                topHeading: 'Mountains you can visit',
                                data: placeData.filter(filterTypeOfData('mountain')),
                            }}
                        />
                        {/*FOR MOUNTAIN SITE END*/}
                        {/*FOR SEA SITE START*/}
                        <SlideingCards value={{ topHeading: 'Sea you can visit', data: placeData.filter(filterTypeOfData('sea')) }} />
                        {/*FOR SEA SITE END*/}
                        {/*FOR Desert SITE START*/}
                        <SlideingCards
                            value={{
                                topHeading: 'Desert you can visit',
                                data: placeData.filter(filterTypeOfData('desert')),
                            }}
                        />
                        {/*FOR Desert SITE END*/}
                    </Box>
                )
            ) : (
                //FOR USER NOT LOGED IN END
                <Loader />
            )}
        </Box>
    );
};

export default HomePage;

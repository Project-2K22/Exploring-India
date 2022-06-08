import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, Divider, Alert, AlertTitle } from '@mui/material';
import PlaceViewTop from '../components/PlaceViewTop';
import IndexCard from '../components/IndexCard';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import axios from 'axios';
import BaseContainer from '../components/BaseContainer';
import LinkTo from '../components/LinkTo';
import SlideingCards from '../components/SlideingCards';
import Footer from '../components/Footer';
// firebase+
import { auth,db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, child, get,update } from 'firebase/database';
//FOR MAP
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loader from '../components/Loader';
import WeatherCard from '../components/WeatherCard';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
mapboxgl.accessToken = process.env.REACT_APP_MAP_MAPBOX_ACCESS_TOKEN;
//FOR MAP

const markarStyle = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'blue',
    fontWeight: 'bold',
    fontSize: '1rem',
    textTransform: 'capitalize',
    padding: '0px',
    cursor: 'pointer',
};
const markarStyleForHot = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'red',
    fontWeight: 'bold',
    fontSize: '1rem',
    textTransform: 'capitalize',
    padding: '0px',
    cursor: 'pointer',
};
const markarStyleForRes = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'gray',
    fontWeight: 'bold',
    fontSize: '9px',
    textTransform: 'capitalize',
    padding: '0px',
    cursor: 'pointer',
};


const PlaceView = () => {
    const { id } = useParams();

    //FOR MAP START
    const [centerLat, setCenterLat] = useState(22.5851);
    const [centerLong, setCenterLong] = useState(88.3468);
    const [viewport, setViewport] = useState({
        latitude: centerLat,
        longitude: centerLong,
        width: '100vw',
        height: '100vh',
        zoom: 5,
    });
    const [selectedPark, setSelectedPark] = useState(null);
    const [selectHotelandRes, setSelectHotelandRes] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [resturents, setResturents] = useState([]);
    //FOR MAP END

    //IMP STRT
    const [placeId, setPlaceId] = useState(id);
    const [pageReady, setPageReady] = useState(false);
    const [placeData, setPlaceData] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [placeAllDataUS, setplaceAllDataUS] = useState(null);
    const placeAllData = [];

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            const dbf = ref(getDatabase());
            var countForPlaceAddData = 0;
            get(child(dbf, `places`))
                .then(snapshot => {
                    snapshot.forEach(function (childSnapshot) {
                        var childData = childSnapshot.val();
                        placeAllData.push(childData);
                        countForPlaceAddData = countForPlaceAddData + 1;
                        if (snapshot.size === countForPlaceAddData) {
                            setplaceAllDataUS(placeAllData);
                            setPageReady(true);
                            setPlaceData(placeAllData);
                        }
                        if (childData.id === placeId) {
                            //UPDATE THE VISITORS START
                            var cvi=childData.visitors+1
                            update(ref(db, `places/${childSnapshot.key}`), {
                                    visitors: cvi,
                                })
                            //UPDATE THE VISITORS END
                            const getPlacesData = async type => {
                                //FOR RETURENT AND HOTEL
                                try {
                                    const {
                                        data: { data },
                                    } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-by-latlng`, {
                                        params: {
                                            latitude: childData.latitude, // soth west
                                            longitude: childData.longitude, // south west
                                        },
                                        //
                                        headers: {
                                            // 'content-type': 'application/json',
                                            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
                                            'X-RapidAPI-Key': 'e43e1adb8emshe6936e91d35fc2ap13d372jsn1c6b9d903fec',
                                        },
                                    });

                                    return data;
                                } catch (error) {
                                    console.log(error);
                                }
                            };

                            getPlacesData('hotels').then(data => {
                                setHotels(data.filter((d, k) => d.name && d.ranking_geo && d.photo?.images?.original?.url));
                            });
                            getPlacesData('restaurants').then(data => {
                                setResturents(data.filter((d, k) => d.name && d.ranking_geo && d.photo?.images?.original?.url));
                            });

                            //FOR RETURENT AND HOTEL

                            setCenterLat(childData.latitude);
                            setCenterLong(childData.longitude);
                            setPlaceDetails(childData);
                            setViewport({
                                latitude: childData.latitude,
                                longitude: childData.longitude,
                                width: '100vw',
                                height: '100vh',
                                zoom: 15,
                            });
                        }
                    });
                })
                .catch(error => {
                    const errorMessage = error.message;
                    console.log(errorMessage);
                });
        });
    }, []);

    function returnData(placeDetails) {
        var returnArr = [];
        var lenOfImageLinks = placeDetails.imagelinks.length;
        var t = {
            feature: '',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, unde.',
            imageUrl: 'https://picsum.photos/200',
        };
        var facts = placeDetails.facts;
        var inI = -1;
        for (let i = 0; i < facts.length; i++) {
            if (inI === lenOfImageLinks - 1) {
                inI = -1;
                inI = inI + 1;
            } else {
                inI = inI + 1;
            }
            t = {
                description: facts[i],
                imageUrl: placeDetails.imagelinks[inI],
            };
            returnArr.push(t);
        }
        return returnArr;
    }
    //IMP END
    return (
        <>
            <BaseContainer w="xl">
                {placeDetails !== null && pageReady === true && placeData !== null ? (
                    <Box>
                        <PlaceViewTop {...placeDetails} />
                        <WeatherCard lat={placeDetails.latitude} lon={placeDetails.longitude} />
                        <Box p={10} ml={8} pt={0}>
                            <Typography variant="h6" marginTop="5%" sx={{ fontWeight: 'bold', fontSize: '2rem', opacity: '0.8' }}>
                                Know more about {placeDetails.name}
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black', opacity: '0.6', fontSize: '1.1rem' }}>
                                <ReactReadMoreReadLess
                                    charLimit={400}
                                    readMoreText={'Read more ▼'}
                                    readLessText={'Read less ▲'}
                                    readMoreClassName="read-more-less--more"
                                    readLessClassName="read-more-less--less"
                                >
                                    {placeDetails.full_discription}
                                </ReactReadMoreReadLess>
                            </Typography>
                        </Box>
                        <Stack divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                            {returnData(placeDetails).map((props, idx) => (
                                <IndexCard value={{ ...props, idx: idx }} key={idx} />
                            ))}
                        </Stack>

                        {/* resturents */}

                        {resturents.length === 0 ? (
                            <Alert severity="error" sx={{ width: '80%', margin: '0 auto 20px auto' }}>
                                <AlertTitle>Error</AlertTitle>
                                OOPS !!!!. Our database does'nt have enough data about nearby restaurants
                            </Alert>
                        ) : (
                            <SlideingCards type="reshol" value={{ topHeading: 'Near by restaurants', data: resturents }} />
                        )}

                        {/* hotels */}
                        {hotels.length === 0 ? (
                            <Alert severity="error" sx={{ width: '80%', margin: '0 auto 20px auto' }}>
                                <AlertTitle>Error</AlertTitle>
                                OOPS !!!!. Our database does'nt have enough data about nearby hotels
                            </Alert>
                        ) : (
                            <SlideingCards type="reshol" value={{ topHeading: 'Near by hotels', data: hotels }} />
                        )}

                        <section id="map">
                            <div
                                style={{
                                    margin: '40px auto',
                                    height: '50vh',
                                    width: '70%',
                                    borderRadius: '20px',
                                    border: '2px solid black',
                                    padding: '10px',
                                }}
                            >
                                <ReactMapGL
                                    {...viewport}
                                    mapStyle="mapbox://styles/mapbox/streets-v11"
                                    onMove={viewport => {
                                        setViewport(viewport);
                                    }}
                                >
                                    {placeAllDataUS.map(park => (
                                        <Marker latitude={park.latitude} longitude={park.longitude} anchor="bottom" key={park.id}>
                                            <button
                                                className="marker-btn"
                                                style={markarStyle}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setSelectedPark(park);
                                                }}
                                            >
                                                <LocationOnIcon />
                                                <br />
                                                {park.name}
                                            </button>
                                        </Marker>
                                    ))}
                                    {hotels.map(park => (
                                        <Marker latitude={park.latitude} longitude={park.longitude} anchor="bottom" key={park.location_id}>
                                            <button
                                                className="marker-btn"
                                                style={markarStyleForHot}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setSelectHotelandRes(park);
                                                }}
                                            >
                                                <HotelIcon />
                                            </button>
                                        </Marker>
                                    ))}
                                    {resturents.map(park => (
                                        <Marker latitude={park.latitude} longitude={park.longitude} anchor="bottom" key={park.location_id}>
                                            <button
                                                className="marker-btn"
                                                style={markarStyleForRes}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setSelectHotelandRes(park);
                                                }}
                                            >
                                                <RestaurantIcon />
                                            </button>
                                        </Marker>
                                    ))}

                                    {selectedPark ? (
                                        <Popup
                                            latitude={selectedPark.latitude}
                                            longitude={selectedPark.longitude}
                                            onClose={() => {
                                                setSelectedPark(null);
                                            }}
                                        >
                                            <div>
                                                <LinkTo to={`/place-view/${selectedPark.id}`} newWindow>
                                                    <h2>{selectedPark.name}</h2>
                                                </LinkTo>
                                                <p>{selectedPark.short_discription}</p>
                                            </div>
                                        </Popup>
                                    ) : null}

                                    {selectHotelandRes ? (
                                        <Popup
                                            latitude={selectHotelandRes.latitude}
                                            longitude={selectHotelandRes.longitude}
                                            onClose={() => {
                                                setSelectHotelandRes(null);
                                            }}
                                        >
                                            <div>
                                                <h2 style={{ cursor: 'pointer' }}>
                                                    <a
                                                        href
                                                        onClick={() => {
                                                            window.open(
                                                                `https://www.google.com/maps/?q=${selectHotelandRes.latitude},${selectHotelandRes.longitude}`
                                                            );
                                                        }}
                                                        target="_blank"
                                                    >
                                                        {selectHotelandRes.name}
                                                    </a>
                                                </h2>

                                                <p>{selectHotelandRes.location_string}</p>
                                                <p>{selectHotelandRes.ranking}</p>
                                                <p>Rating: {selectHotelandRes.rating}</p>
                                                <p>Approx Distance: {selectHotelandRes.distance.slice(0, 4)} KM</p>
                                                <p>{selectHotelandRes.hotel_class}</p>
                                                <p>{selectHotelandRes.price}</p>
                                            </div>
                                        </Popup>
                                    ) : null}
                                </ReactMapGL>
                            </div>
                        </section>
                    </Box>
                ) : (
                    <Loader />
                )}
            </BaseContainer>
            <Footer />
        </>
    );
};

export default PlaceView;

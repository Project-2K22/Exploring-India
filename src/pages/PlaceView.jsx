import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box,Stack,Typography,Divider } from '@mui/material';
import PlaceViewTop from '../components/PlaceViewTop';
import IndexCard from '../components/IndexCard';
import ReactReadMoreReadLess from "react-read-more-read-less";
import axios from "axios";
// firebase
import {db,auth} from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {getDatabase, ref, child, get, update  } from "firebase/database";
//FOR MAP
  import ReactMapGL, { Marker, Popup } from "react-map-gl";
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import LocationOnIcon from '@mui/icons-material/LocationOn';
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGV5YXRhbnUiLCJhIjoiY2t2dHhzaGx0MjhjMzJvcWhid2xmaHN5OCJ9.NBHK-tlVNvbNlg7nh5n5mQ';
//FOR MAP

const markarStyle={
    background:"transparent",
    border:"none",
    outline:"none",
    color:"blue",
    fontWeight:"bold",
    fontSize:"1rem",
    textTransform:"capitalize",
    padding:"0px",
    cursor:"pointer"
}

const PlaceView = () => {
    const {id}= useParams();
    const [hotelData, setHotelData] = useState(null);

//FOR MAP START
    const [centerLat, setCenterLat] = useState(22.5851);
    const [centerLong, setCenterLong] = useState(88.3468);
    const [viewport, setViewport] = useState({
    latitude: centerLat,
    longitude: centerLong,
    width: "100vw",
    height: "100vh",
    zoom: 15
  });
 const [selectedPark, setSelectedPark] = useState(null);
//FOR MAP END


//FOR RES
// const getPlacesData = async (type) => {
//     try {
//         const {
//             data: { data },
//         } = await axios.get(
//             `https://travel-advisor.p.rapidapi.com/${type}/list-by-latlng`,
//             {
//                 params: {
//                     latitude: 22.5448, // soth west
//                     longitude: 88.3426, // south west
//                 },
//                 //
//                 headers: {
//                     "content-type": "application/json",
//                     "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
//                     "X-RapidAPI-Key":
//                         "25f69b02d4msh193794ffbfcae71p15c7b5jsnc52651e511c2",
//                 },
//             }
//         );

//         return data;
//     } catch (error) {
//         console.log(error);
//     }
// };

// getPlacesData("hotels").then((data) => {
//     data=data.slice(0,10)
//     console.log(data);
// });
//FOR RES END




//IMP STRT
    const [placeId, setPlaceId] = useState(id);
    const [pageReady, setPageReady] = useState(false);
    const [placeData, setPlaceData] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [placeAllDataUS, setplaceAllDataUS] = useState(null);
    const [forLocal, setForLocal] = useState(null);
    const placeAllData=[];

        useEffect(() => {
        onAuthStateChanged(auth, user => {
                const dbf = ref(getDatabase());
                var countForPlaceAddData=0;
                get(child(dbf, `places`)).then((snapshot) => {
                        snapshot.forEach(function(childSnapshot) {
                          var childData = childSnapshot.val();
                          placeAllData.push(childData);
                          countForPlaceAddData=countForPlaceAddData+1;
                          if(snapshot.size===countForPlaceAddData){setplaceAllDataUS(placeAllData);setPageReady(true);setPlaceData(placeAllData);}
                          if(childData.id===placeId){setPlaceDetails(childData);
                            setViewport({
                                latitude: childData.latitude,
                                longitude: childData.longitude,
                                width: "100vw",
                                height: "100vh",
                                zoom: 15
                              })
                          }
                        
                        });
    
                }).catch((error) => {
                    const errorMessage = error.message;
                }); 
        });
    }, []);

    function returnData(placeDetails){
        var returnArr=[];
        var lenOfImageLinks=(placeDetails.imagelinks).length
        var t={
            feature: '',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, unde.',
            imageUrl:'https://picsum.photos/200',
            }
        var facts=placeDetails.facts;
        var inI=-1;
        for (let i=0;i<facts.length;i++){
            if(inI===(lenOfImageLinks-1)){inI=-1;inI=inI+1}else{inI=inI+1}
            t={
            description: facts[i],
            imageUrl:placeDetails.imagelinks[inI],
            }      
            returnArr.push(t)
        }
        return(returnArr)

    }
//IMP END
    return (
        <Box>
        {placeDetails!==null && pageReady===true && placeData!==null ?
            <Box >
                <PlaceViewTop {...placeDetails}/>
                <Box p={10} ml={8}pt={0}>
                <Typography variant="h6"marginTop="5%" sx={{ fontWeight: 'bold',fontSize:'2rem' ,opacity:"0.8"}}>
                                Khow more about {placeDetails.name}
                            </Typography>
                    <Typography variant="h6"  sx={{color:'black',opacity:'0.6',fontSize:'1.1rem'}}>
                        <ReactReadMoreReadLess charLimit={400} readMoreText={"Read more ▼"} readLessText={"Read less ▲"}readMoreClassName="read-more-less--more"readLessClassName="read-more-less--less">
                            {placeDetails.full_discription}
                        </ReactReadMoreReadLess>
                    </Typography>
                </Box>
                <Stack divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                            {returnData(placeDetails).map((props, idx) => (
                                <IndexCard value={{ ...props, idx: idx }} key={idx} />
                            ))}
                </Stack>
                <div style={{height:"50vh",width:"100%"}}>
                  <ReactMapGL
                  {...viewport}
                   mapStyle="mapbox://styles/mapbox/streets-v11"
                   onMove={viewport => {
                      setViewport(viewport);
                    }}
                  >
                  {placeAllDataUS.map((park)=>(
                    <Marker
                        latitude={park.latitude}
                        longitude={park.longitude}
                        anchor="bottom"
                        key={park.id}
                        >
                        <button
                          className="marker-btn"
                          style={markarStyle}
                          onClick={e => {
                            e.preventDefault();
                            setSelectedPark(park);
                          }}
                        >
                          <LocationOnIcon /><br/>{park.name}
                        </button>
                    </Marker>
                  ))}
                {placeAllDataUS.map((park)=>(
                    <Marker
                        latitude={park.latitude}
                        longitude={park.longitude}
                        anchor="bottom"
                        key={park.id}
                        >
                        <button
                          className="marker-btn"
                          style={markarStyle}
                          onClick={e => {
                            e.preventDefault();
                            setSelectedPark(park);
                          }}
                        >
                          <LocationOnIcon /><br/>{park.name}
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
                          <h2>{selectedPark.latitude}</h2>
                          <p>{selectedPark.longitude}</p>
                        </div>
                      </Popup>
                    ) : null}
                  </ReactMapGL>
                </div>
            </Box>
        :"LOADING"}
        </Box>
    );
};

export default PlaceView;
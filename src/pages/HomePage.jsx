import React, { useEffect } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ImageCard from '../components/ImageCard';
import IndexCard from '../components/IndexCard';

const sampleData = [{
    "no": 7,
    "id": "h-7",
    "name": "Victoria Memorial",
    "type": "heritage",
    "city": "Kolkata",
    "zipcode": 700071,
    "state": "West Bengal",
    "short_discription": "Dedicated to Queen Victoria of England, it was constructed between 1906 and 1921 by the then Prince of Wales (who went on to become King George V). Today, the memorial has been turned into a museum that has 25 galleries. It also houses paintings from the British Raj, along with memorabilia and manuscripts.",
    "full_discription": "Another relic of the British Raj in India, the Victoria Memorial is located in the heart of Kolkata, in West Bengal. This white marbled opulent structure was built in memory of Queen Victoria to celebrate her 25 years of rule over India and is almost a replica of the Victoria Memorial in London. Victoria Memorial is an iconic structure that is synonymous with the city of joy! The memorial is surrounded by a lush green and well-maintained garden, which spreads over 64 acres and has numerous statues and sculptures in it. A sixteen-foot tall bronze statue of victory, mounted on ball bearings at the top of the memorial, serves to heighten the overall appeal and grandeur of the entire complex. Victoria Memorial is breathtaking and marvellous, especially at night, when it is illuminated. The Sound and Light shows that take place in the evening are an added delight, and a must watch. All in all, the place is a must visit for people to wish to relive the essence of the Victorian era in the modern day world.",
    "longitude": 88.3426,
    "latitude ": 22.5448,
    "facts": [
    "The structure is built using a blend of both British and Mughal architecture which is known as Indo-Saracenic Revival architecture, which is an architectural style which was followed in British India during the late 19th century.",
    "The foundation stone of Victoria Memorial was laid by Prince of Wales in 1906.",
    "The figure of 'Angel of Victory' is erected on the central dome of Victoria Memorial. Mounted on large ball bearings, the figure rotates with the wind."
    ],
    "imagelinks": [
    "https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/placeimages%2Fheritage%2FVictoria%20Memorial%2Fprado-vQC37vxyZHA-unsplash.jpg?alt=media&token=7f73452d-40af-49bb-b3f1-9ca726115f08",
    "https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/placeimages%2Fheritage%2FVictoria%20Memorial%2Fshahbaz-khan-OvuT3KFa8eQ-unsplash.jpg?alt=media&token=7ac0f1bd-a47e-4ae8-8b27-21e588c45172",
    "https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/placeimages%2Fheritage%2FVictoria%20Memorial%2Fvishal-rohatgi-yYvi5cMpBA0-unsplash.jpg?alt=media&token=9b30b610-dac6-46ef-b62a-79b03e566f2e",
    "https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/placeimages%2Fheritage%2FVictoria%20Memorial%2Fvishal-rohatgi-Sr9gz16WGlk-unsplash.jpg?alt=media&token=fe109eff-5479-4942-b627-8502022e7aea"
    ],
    "others": [
    ""
    ],
    "placeVerified": true,
    "visitors": 0,
    "likes": 0,
    "uploaddate": "15/05/2022"
    }]
const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user === null) navigate('/login');
        });
    }, []);

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

    return (
        <div style={{backgroundImage:"url(https://picsum.photos/seed/picsum/200/300)"}}>
            HomePage
            {/* Logout just for testing purpose */}
            <div>
                <Button onClick={handleLogOut}>Log out</Button>
            </div>
            {/* TODO:  create user profile page ... do not change anything in this page */}
            <div>
                <Button onClick={() => navigate('/user-profile')}>User Profile</Button>
            </div>
            <div className="cards">
                {/* for small card example */}
                <Stack direction="row"  spacing={0}>
                    {sampleData.map((item,idx) =>  {
                        item.buttonName = "View"
                    return (<ImageCard value={item} key={idx}/>)})}
                   
                    {/* <ImageCard value={{placeName:"Victoria Memorial",city:"Kolkata",buttonName:"view"}}/> */}
                </Stack>
                {/* big card example */}
                {/* <Stack divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                    {[
                        {
                            feature: 'Interactive Map',
                            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, unde.',
                        },
                        {
                            feature: 'Weather Forecast',
                            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, unde.',
                        },
                    ].map((props, idx) => (
                        <IndexCard value={{ ...props, idx: idx }} key={idx} />
                    ))}
                </Stack> */}
            </div>
        </div>
    );
};

export default HomePage;

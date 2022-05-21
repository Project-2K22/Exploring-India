import React, { useEffect } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ImageCard from '../components/ImageCard';
import IndexCard from '../components/IndexCard';
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
                    <ImageCard value={{placeName:"Victoria Memorial",city:"Kolkata",buttonName:"view"}}/>
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

import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PlaceViewTop from '../components/PlaceViewTop';
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
        <div>
            <PlaceViewTop />
            HomePage
            {/* Logout just for testing purpose */}
            <div>
                <Button onClick={handleLogOut}>Log out</Button>
            </div>
            {/* TODO:  create user profile page ... do not change anything in this page */}
            <div>
                <Button onClick={() => navigate('/user-profile')}>User Profile</Button>
            </div>
        </div>
    );
};

export default HomePage;

import React from 'react';
import { HashRouter as Router, Routes as RS, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import UserPreference from './pages/UserPreference';
import UserProfile from './pages/UserProfile';

const Routes = () => {
    return (
        <div>
            <Router>
                <RS>
                    <Route path="signup" element={<Signup />} />
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="user-preference" element={<UserPreference />} />
                    <Route path="user-profile" element={<UserProfile />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </RS>
            </Router>
        </div>
    );
};

export default Routes;

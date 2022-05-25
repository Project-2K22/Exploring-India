import React from 'react';
import { HashRouter as Router, Routes as RS, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import UserPreference from './pages/UserPreference';
import UserProfile from './pages/UserProfile';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminRegister from './pages/Admin/AdminRegister';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminShowAllUser from './pages/Admin/AdminShowAllUser';
import AdminPlacesList from './pages/Admin/AdminPlacesList';
import AdminAllAdminList from './pages/Admin/AdminAllAdminList';
import PlaceDetailsBasedOnId from './pages/Admin/PlaceDetailsBasedOnId';
import Stackholder from './pages/Stackholder';

const Routes = () => {
    return (
        <div>
            <Router>
                <RS>
                    {/* users */}
                    <Route path="signup" element={<Signup />} />
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="user-preference" element={<UserPreference />} />
                    <Route path="user-profile" element={<UserProfile />} />
                    {/* admins */}
                    <Route path="admin/register" element={<AdminRegister />} />
                    <Route path="admin/signin" element={<AdminLogin />} />
                    <Route path="admin/dashboard" element={<AdminDashboard />} />
                    <Route path="admin/all/user" element={<AdminShowAllUser />} />
                    <Route path="admin/all/user/permissions" element={<AdminAllAdminList />} />
                    <Route path="admin/all/places" element={<AdminPlacesList />} />
                    <Route path="admin/all/places/:id" element={<PlaceDetailsBasedOnId />} />

                    {/* stackholder */}
                    <Route path="stackholder" element={<Stackholder />} />

                    {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
                </RS>
            </Router>
        </div>
    );
};

export default Routes;

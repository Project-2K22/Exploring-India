import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminNavbar from '../../components/AdminNavbar';

import BaseContainer from '../../components/BaseContainer';
import Loader from '../../components/Loader';
import useAuthState from '../../hooks/useAuthState';

const AdminDashboard = () => {
    const { uid, user, error, loading } = useAuthState();

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('admin_sign_in_status') === null) navigate('/admin/signin');
    }, []);

    return (
        <>
            <BaseContainer w="lg">
                {loading ? <Loader /> : <AdminNavbar heading={'Dashboard'} user={user} />}
            </BaseContainer>
        </>
    );
};

export default AdminDashboard;

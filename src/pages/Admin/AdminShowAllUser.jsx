import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { ref, onValue } from 'firebase/database';
import AdminNavbar from '../../components/AdminNavbar';
import BaseContainer from '../../components/BaseContainer';
import Loader from '../../components/Loader';
import { Stack } from '@mui/material';
import DataGrid from '../../components/DataGrid';
import useAuthState from '../../hooks/useAuthState';
import { useNavigate } from 'react-router-dom';

const AdminShowAllUser = () => {
    const [allUsers, setAllUsers] = useState({});
    const { uid, user, error, loading } = useAuthState();

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('admin_sign_in_status') === null) navigate('/admin/signin');
    }, []);

    useEffect(() => {
        const usersRef = ref(db, 'users/');
        onValue(usersRef, snapshot => {
            const data = snapshot.val();
            setAllUsers(data);
        });
    }, []);

    return (
        <BaseContainer w="lg">
            {Object.keys(allUsers).length === 0 || loading ? (
                <Loader />
            ) : (
                <>
                    <AdminNavbar heading={'Users'} user={user} />
                    <Stack p={'20px'} direction={'column'} spacing={2}>
                        {Object.keys(allUsers).map((key, idx) => (
                            <DataGrid user={allUsers[key]} id={key} key={key} page={'user'} />
                        ))}
                    </Stack>
                </>
            )}
        </BaseContainer>
    );
};

export default AdminShowAllUser;

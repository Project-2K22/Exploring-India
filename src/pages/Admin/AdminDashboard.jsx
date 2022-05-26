import {
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
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
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <AdminNavbar heading={'Dashboard'} user={user} />
                        <Stack spacing={3} mt={'20px'} height="100%">
                            <Typography fontWeight={'bold'}>Stats</Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {/* <TableCell></TableCell> */}
                                            <TableCell align="right">Total User(s)</TableCell>
                                            <TableCell align="right">Total Admin(s)</TableCell>
                                            <TableCell align="right">Total Place(s)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            {/* <TableCell component="th" scope="row"></TableCell> */}
                                            <TableCell align="right">5</TableCell>
                                            <TableCell align="right">1(You)</TableCell>
                                            <TableCell align="right">37</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography fontWeight={'bold'} color={'gray'}>
                                More features are coming soon ....
                            </Typography>
                        </Stack>
                    </>
                )}
            </BaseContainer>
        </>
    );
};

export default AdminDashboard;

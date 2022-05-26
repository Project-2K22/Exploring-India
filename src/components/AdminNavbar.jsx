import React, { useState, useEffect } from 'react';

import {
    Box,
    Button,
    Drawer,
    Stack,
    Avatar,
    Paper,
    Typography,
    Divider,
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@mui/material';

import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkTo from './LinkTo';
import BaseContainer from './BaseContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminNavbar = ({ heading, user }) => {
    const { pathname } = useLocation();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigate('/admin/signin');
                localStorage.removeItem('admin_sign_in_status');
            })
            .catch(error => console.log(error));
    };

    return (
        <BaseContainer w="lg">
            <Box height={'15vh'}>
                <Stack height={'100%'} direction={'row'} alignItems={'center'} justifyContent={'flex-start'}>
                    <Button onClick={openDrawer}>
                        <MenuOpenIcon />
                    </Button>
                    <Typography variant="h2">{heading}</Typography>
                </Stack>
            </Box>
            <Divider />

            <Drawer open={drawerOpen} onClose={closeDrawer}>
                <Stack
                    width={{ md: '30vw', xs: '70vw' }}
                    height="100%"
                    sx={{ paddingX: '50px', paddingY: '30px' }}
                    justifyContent="space-between"
                >
                    <Box width={'100%'}>
                        <Stack alignItems={'center'} spacing={5}>
                            <Avatar alt={user.name} src={user.dplink} sx={{ width: 100, height: 100 }} />
                            <Accordion sx={{ width: '100%', border: 'none' }} variant="outlined">
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="user-details-content"
                                    id="user-details-header"
                                >
                                    User Details
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Paper variant="outlined" sx={{ width: '100%', padding: '10px' }}>
                                        <Stack width={'100%'} spacing={2}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <Typography fontWeight={'bold'}>Name</Typography>
                                                <Typography>{user.name}</Typography>
                                            </Stack>
                                            <Divider />
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <Typography fontWeight={'bold'}>Email</Typography>
                                                <Typography>{user.email}</Typography>
                                            </Stack>
                                            <Divider />
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <Typography fontWeight={'bold'}>Phone</Typography>
                                                <Typography>{user.phoneno}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', border: 'none' }} variant="outlined">
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="user-links-content"
                                    id="user-links-header"
                                >
                                    Links
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack width={'100%'} spacing={3}>
                                        <LinkTo to="/admin/dashboard">
                                            <Button
                                                variant={pathname === '/admin/dashboard' ? 'outlined' : ''}
                                                color="info"
                                                fullWidth
                                                style={{ justifyContent: 'flex-start' }}
                                            >
                                                Dashboard
                                            </Button>
                                        </LinkTo>
                                        <LinkTo to="/admin/all/user">
                                            <Button
                                                variant={pathname === '/admin/all/user' ? 'outlined' : ''}
                                                color="info"
                                                fullWidth
                                                style={{ justifyContent: 'flex-start' }}
                                            >
                                                Users List
                                            </Button>
                                        </LinkTo>
                                        <LinkTo to="/admin/all/user/permissions">
                                            <Button
                                                variant={pathname === '/admin/all/user/permissions' ? 'outlined' : ''}
                                                color="info"
                                                fullWidth
                                                style={{ justifyContent: 'flex-start' }}
                                            >
                                                Admin List
                                            </Button>
                                        </LinkTo>
                                        <LinkTo to="/admin/all/places">
                                            <Button
                                                variant={pathname === '/admin/all/places' ? 'outlined' : ''}
                                                color="info"
                                                fullWidth
                                                style={{ justifyContent: 'flex-start' }}
                                            >
                                                Places List
                                            </Button>
                                        </LinkTo>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Stack>
                    </Box>
                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={3}>
                        <Button fullWidth variant="contained" color="warning" onClick={handleSignOut}>
                            Log Out
                        </Button>
                        <Button fullWidth variant="contained" color="error">
                            Delete your admin account
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
        </BaseContainer>
    );
};

export default AdminNavbar;

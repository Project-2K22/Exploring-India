import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, Typography, Box, Stack } from '@mui/material';
import BaseContainer from '../../components/BaseContainer';
import AdminNavbar from '../../components/AdminNavbar';
import { db } from '../../firebase/config';
import { ref, onValue, update, remove } from 'firebase/database';
import DataGrid from '../../components/DataGrid';
import useAuthState from '../../hooks/useAuthState';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = index => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const colorArray = ['blue', 'green', 'red'];

const grantAdmin = uid => {
    update(ref(db, 'admins/' + uid), {
        granted: 'true',
    });
};

const rejectAdmin = uid => {
    update(ref(db, 'admins/' + uid), {
        granted: 'rej',
    });
};

const deleteAdminAccount = uid => {
    remove(ref(db, 'admins/' + uid));
};

const AdminCard = ({ allAdmins, type, uid, state }) => {
    return (
        <Stack p={'20px'} direction={'column'} spacing={2}>
            {Object.keys(allAdmins)
                .filter(k => allAdmins[k].granted === type)
                .filter(k => k !== uid)
                .map((k, id) => (
                    <DataGrid
                        key={id}
                        user={allAdmins[k]}
                        page={'admin'}
                        id={k}
                        state={state}
                        methods={{
                            onGrant: () => grantAdmin(k),
                            onReject: () => rejectAdmin(k),
                            onDeleteAdminAccount: () => deleteAdminAccount(k),
                        }}
                    />
                ))}
        </Stack>
    );
};

const AdminAllAdminList = () => {
    const [value, setValue] = useState(0);
    const [allAdmins, setAllAdmins] = useState({});
    const { uid, user, error, loading } = useAuthState();
    const [adminLoading, setAdminLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('admin_sign_in_status') === null) navigate('/admin/signin');
    }, []);

    useEffect(() => {
        const adminsRef = ref(db, 'admins/');
        onValue(adminsRef, snapshot => {
            const data = snapshot.val();
            console.log(data);
            setAllAdmins(data);
            setAdminLoading(false);
        });
    }, []);

    const count = type => {
        return Object.keys(allAdmins)
            .filter(k => allAdmins[k].granted === type)
            .filter(k => k !== uid).length;
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <BaseContainer w="lg">
            {loading || adminLoading ? (
                <Loader />
            ) : (
                <>
                    <AdminNavbar heading={'Admins'} user={user} />
                    <Box sx={{ width: '100%' }} p={4}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                textColor={colorArray[value]}
                                TabIndicatorProps={{ style: { background: colorArray[value] } }}
                                value={value}
                                onChange={handleChange}
                                aria-label="basic tabs example"
                            >
                                <Tab sx={{ color: 'blue' }} label={`Queue (${count('false')})`} {...a11yProps(0)} />
                                <Tab sx={{ color: 'green' }} label={`Granted (${count('true')})`} {...a11yProps(1)} />
                                <Tab sx={{ color: 'red' }} label={`Rejected (${count('rej')})`} {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <AdminCard allAdmins={allAdmins} type={'false'} uid={uid} state={'queue'} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <AdminCard allAdmins={allAdmins} type={'true'} uid={uid} state={'granted'} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <AdminCard allAdmins={allAdmins} type={'rej'} uid={uid} state={'rejected'} />
                        </TabPanel>
                    </Box>{' '}
                </>
            )}
        </BaseContainer>
    );
};

export default AdminAllAdminList;

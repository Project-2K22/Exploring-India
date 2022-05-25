import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Avatar,
    Typography,
    Divider,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    Paper,
    TableRow,
    TableBody,
    Button,
    Chip,
} from '@mui/material';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';

const DataGrid = ({ user, id, page, methods, state }) => {
    return (
        <Accordion variant="outlined" key={id}>
            <AccordionSummary
                expandIcon={
                    <Button>
                        <OpenInFullRoundedIcon />
                    </Button>
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Stack direction={'row'} alignItems="center" spacing={5}>
                    <Stack direction={'row'} alignItems="center" spacing={3}>
                        <Avatar alt={user.name} src={user.dplink} sx={{ width: 56, height: 56 }} />
                        <Typography fontWeight={'bold'} fontSize="20px" textTransform={'uppercase'}>
                            {user.name}
                        </Typography>
                    </Stack>
                    <Chip label={user.email} />
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Divider />
                <Stack spacing={2} mt="10px">
                    <Typography fontWeight={'bold'}>Personal</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell align="right">Phone Number</TableCell>
                                    <TableCell align="right">Age</TableCell>
                                    <TableCell align="right">Gender</TableCell>
                                    <TableCell align="right">Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {id}
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.phoneno === -1 ? 'Not updated' : user.phoneno}
                                    </TableCell>
                                    <TableCell align="right">{user.age === -1 ? 'Not updated' : user.age}</TableCell>
                                    <TableCell align="right">
                                        {user.gender === -1 ? 'Not updated' : user.gender}
                                    </TableCell>
                                    <TableCell align="right">{`${user.latitude}, ${user.longitude}`}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
                {page === 'user' && (
                    <Stack spacing={2} mt="10px">
                        <Typography fontWeight={'bold'}>Preference</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell align="right">Places User Like</TableCell>
                                        <TableCell align="right">Length of trip</TableCell>
                                        <TableCell align="right">Places other than state</TableCell>
                                        <TableCell align="right">Favourite Season</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {id}
                                        </TableCell>
                                        <TableCell align="right">{user.placesUserLike}</TableCell>
                                        <TableCell align="right">{user.lengthOfTrip}</TableCell>
                                        <TableCell align="right">{user.wantToVisitPlacesOtherStates}</TableCell>
                                        <TableCell align="right">{user.favouriteSeason}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                )}
                {page === 'admin' && (
                    <Stack spacing={2} mt="10px">
                        <Typography fontWeight={'bold'}>Verification Status</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell align="right">Email Verification Status</TableCell>
                                        <TableCell align="right">Phone Verification Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {id}
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.emailVerified === 'false' ? 'Not verified' : 'verified'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.phoneVerified === 'false' ? 'Not verified' : 'verified'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                )}
                {/* TODO: give these functionality */}
                {page === 'user' && (
                    <Stack direction={'row'} justifyContent={'space-between'} spacing="5" mt={'20px'}>
                        <Button color="error">Ban user account</Button>
                        <Button color="warning">Sent user an warning</Button>
                    </Stack>
                )}
                {page === 'admin' && state === 'queue' && (
                    <Stack direction={'row'} justifyContent={'space-between'} spacing={3} mt={'20px'}>
                        <Button variant="outlined" color="info">
                            Sent admin email verfication mail
                        </Button>
                        <Button variant="outlined" color="info">
                            Sent admin phone number verification sms
                        </Button>
                        <Button onClick={methods.onGrant} variant="outlined" color="info">
                            Grant admin access
                        </Button>
                        <Button onClick={methods.onReject} variant="outlined" color="info">
                            Reject admin access
                        </Button>
                    </Stack>
                )}
                {page === 'admin' && state === 'granted' && (
                    <Stack direction={'row'} justifyContent={'space-between'} spacing="5" mt={'20px'}>
                        <Button color="error">Ban user account</Button>
                        <Button color="warning">Sent user an warning</Button>
                    </Stack>
                )}
                {page === 'admin' && state === 'rejected' && (
                    <Stack direction={'row'} justifyContent={'space-between'} spacing="5" mt={'20px'}>
                        <Button color="error" onClick={methods.onDeleteAdminAccount}>
                            Delete admin account
                        </Button>
                        {/* <Button color="warning"> user an warning</Button> */}
                    </Stack>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default DataGrid;

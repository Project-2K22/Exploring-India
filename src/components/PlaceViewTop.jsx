import React from 'react';
import { Stack, Box, Typography, Button, CssBaseline } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';

const PlaceViewTop = props => {
    // const { id } = useParams();
    const navigate = useNavigate();

    return (
        // npm install react-photo-album
        <Box>
            <CssBaseline />
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0} width="100%">
                <Stack
                    width="80%"
                    sx={{
                        background: `linear-gradient(rgb(0, 0, 0,0.2),rgb(0, 0, 0,0.9)), url(${props.imagelinks[0]})`,
                        backgroundSize: 'cover',
                        boxShadow: 3,
                        borderBottomRightRadius: '13px',
                        borderBottomLeftRadius: '13px',
                        backgroundPosition: 'center',
                    }}
                    p={4.5}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                >
                    <Stack
                        sx={{ color: 'white' }}
                        direction="column"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={10}
                        width="100%"
                    >
                        <Box>
                            <Button
                                onClick={() => navigate('/home')}
                                variant="text"
                                startIcon={<KeyboardBackspaceIcon />}
                                sx={{ color: 'white' }}
                            >
                                back
                            </Button>
                        </Box>
                        <Stack spacing={2} width="100%">
                            <Box>
                                <Typography variant="h4" fontWeight={'500'}>
                                    {props.name}, {props.city}
                                </Typography>
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                                    <Box width="57%">
                                        <Typography variant="subtitle2" fontWeight={'400'}>
                                            {props.short_discription}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            endIcon={<RemoveRedEyeIcon />}
                                            sx={{
                                                borderColor: 'white',
                                                color: 'white',
                                                padding: '10px',
                                                paddingLeft: '30px',
                                                paddingRight: '30px',
                                            }}
                                        >
                                            Open in Map
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default PlaceViewTop;

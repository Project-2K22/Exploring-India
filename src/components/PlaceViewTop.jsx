import React from 'react';
import {Stack,Box,Typography,Button,CssBaseline} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
const PlaceViewTop = props => {
    return (
// npm install react-photo-album
        <Box>
        <CssBaseline />
            <Stack direction="row"justifyContent="center"alignItems="center"spacing={0} width="100%">
                <Stack width="80%" sx={{backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/test_images%2FTest.jpg?alt=media&token=15f22587-aceb-483e-9502-22e0cede3841)',backgroundSize: 'cover',boxShadow: 3,borderBottomRightRadius: '13px',borderBottomLeftRadius: '13px'}} p={4.5}  direction="row"justifyContent="center"alignItems="center"spacing={0} >
                    <Stack sx={{color:"white"}} direction="column"justifyContent="space-between"alignItems="flex-start"spacing={10} width="100%">
                        <Box>
                            <Button variant="text" startIcon={<KeyboardBackspaceIcon />} sx={{color:"white"}}>
                              back
                            </Button>
                        </Box>
                        <Stack spacing={2} width="100%">
                          <Box>
                            <Typography  variant="h4" fontWeight={'500'}>
                                Backwaters, Kelara
                            </Typography>
                          </Box>
                          <Box>
                              <Stack direction="row"justifyContent="space-between"alignItems="center" width="100%">
                                <Box width="57%">
                                    <Typography  variant="subtitle2" fontWeight={'400'}>
                                        I got this to work for material-ui, where the padding on my parent element was 24px so I added 48px to the width of the background image to make it work
                                    </Typography>
                                </Box>
                                <Box >
                                    <Button variant="outlined" endIcon={<RemoveRedEyeIcon />} sx={{borderColor:"white",color:"white",padding:'10px',paddingLeft:'30px',paddingRight:'30px'}} >
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

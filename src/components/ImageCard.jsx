import { Button, CardActions,  Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';

const ImageCard = (props) => {
    return (
        <Stack
            direction="row"
            spacing={12}
            mr={5}
            sx={{
                width: '460px',
                height: '325px',
                backdropFilter: 'blur(13px)',
                boxShadow: 'inset 0 0 0 200px rgba(255,255,255,0.08)',
                borderRadius: '0.5rem',
                backgroundColor: 'rgb(228 228 228 / 15%)',
                cursor:'grab', 
                userSelect: 'none',

            }}
        >
            <Box mt={6.5} ml={3} sx={{ padding: '10px' }}>
                {props.value.placeName.split(' ').map((words, idx) => {
                    return (
                        <Typography
                            variant="body2"
                            key={idx}
                            color="text.secondary"
                            sx={{ color: '#fff', fontSize: '1.6rem' ,fontWeight:'500' }}
                        >
                            {words}
                            {idx === 1 ? ',' : ''}
                        </Typography>
                    );
                })}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: '#fff', fontSize: '1.4rem', marginTop: '5%' }}
                >
                    {props.value.city}
                </Typography>

                <CardActions sx={{ marginTop: '10%' }}>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={props.value.onClickFun}
                        sx={{ borderRadius:'10px',textTransform:"capitalize",paddingLeft:'30px',paddingRight:'30px',backgroundColor: '#5F0C0C', '&:hover': { color: '#5F0C0C', backgroundColor: 'white' } }}
                    >
                        {props.value.buttonName}
                    </Button>
                </CardActions>
            </Box>

            <Box sx={{width:"100%"}}>
                <img src={props.value.imageLink} alt={props.value.placeName} style={{ width: '100%', height: '100%',objectFit:"cover" ,borderTopRightRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}} />
            </Box>
        </Stack>
    );
};

export default ImageCard;

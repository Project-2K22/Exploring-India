import { Button, CardActions,  Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';

const ImageCard = props => {
    console.log(props);
    return (
        <Stack
            direction="row"
            spacing={13}
            sx={{
                width: '400px',
                height: '270px',
                backdropFilter: 'blur(9px) saturate(180%)',
                backgroundColor: 'rgba(17, 25, 40, 0.46)',
                borderRadius: '0.5rem',
                
            }}
        >
            <Box sx={{ padding: '0.5rem' }}>
                {props.value.placeName.split(' ').map((words, idx) => {
                    return (
                        <Typography
                            variant="body2"
                            key={idx}
                            color="text.secondary"
                            sx={{ color: '#fff', fontSize: '1.2rem', marginTop: '10%' }}
                        >
                            {words}
                            {idx === 1 ? ',' : ''}
                        </Typography>
                    );
                })}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: '#fff', fontSize: '1.2rem', marginTop: '10%' }}
                >
                    {props.value.city}
                </Typography>

                <CardActions sx={{ marginTop: '60%' }}>
                    <Button
                        size="small"
                        variant="contained"
                        sx={{ backgroundColor: '#5F0C0C', '&:hover': { color: '#5F0C0C', backgroundColor: 'white' } }}
                    >
                        {props.value.buttonName}
                    </Button>
                </CardActions>
            </Box>

            <Box sx={{width:"100%"}}>
                <img src="https://picsum.photos/id/270/400/400" alt="" style={{ width: '100%', height: '100%',objectFit:"cover" ,borderTopRightRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}} />
            </Box>
        </Stack>
    );
};

export default ImageCard;

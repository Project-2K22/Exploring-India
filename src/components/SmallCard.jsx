import { Button, Card, CardActions, CardContent, CardMedia, Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';

const SmallCards = props => {
    console.log(props);
    return (
        <Stack
            sx={{
                maxWidth: '300px',
                maxHeight: '250px',
                backdropFilter: 'blur(9px) saturate(180%)',
                backgroundColor: 'rgba(17, 25, 40, 0.46)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.125)',
            }}
        >
            <Stack direction="row"  spacing={1}>
                <Box sx={{padding:"0.5rem"}}>
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
                        <Button size="small" variant="contained" sx={{ backgroundColor: '#5F0C0C' }}>
                            {props.value.buttonName}
                        </Button>
                    </CardActions>
                </Box>

                <Box >
                    <img src="https://picsum.photos/id/270/400/400" alt="" style={{ width: '100%', height: '100%', objectFit:"cover",borderRadius:"0.5rem"}} />
                </Box>
            </Stack>
        </Stack>
    );
};

export default SmallCards;

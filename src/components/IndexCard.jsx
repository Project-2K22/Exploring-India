import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';

const IndexCard = props => {
    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                sx={{
                    flex: '1',
                    maxHeight: '300px',
                    maxWidth: '60%',
                    margin: '0 auto',
                    flexFlow: props.value.idx % 2 !== 0 ? 'row-reverse' : '',
                }}
            >
                <div style={{ width: '50%', padding: '2rem' }}>
                    <div
                        style={{
                            fontSize: '8rem',
                            fontWeight: '550',
                            color: 'gray',
                            opacity: '0.65',
                            position: 'absolute',
                            zIndex: '-1',
                            top: '-25%',
                            left: props.value.idx % 2 === 0 ? '17%' : '',
                            right: props.value.idx % 2 !== 0 ? '17%' : '',
                        }}
                    >
                        0{props.value.idx + 1}
                    </div>
                    <img
                        src={props.value.imageUrl}
                        alt=""
                        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                    />
                </div>
                <Stack sx={{ width: '50%', padding: '2rem' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                        {props.value.feature}
                    </Typography>

                    <Typography variant="h6" marginTop="10%" sx={{ color: 'black', opacity: '0.6' }}>
                        {props.value.description.slice(0, 200)}
                    </Typography>
                </Stack>
            </Stack>
        </div>
    );
};

export default IndexCard;

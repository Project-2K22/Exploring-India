import { Typography } from '@mui/material';
import { Box } from '@mui/system';

const BigCard = props => {
    
    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
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
                            color: 'gray',
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
                        src="https://picsum.photos/id/400/400/400"
                        alt=""
                        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                    />
                </div>
                <div style={{ width: '50%', padding: '2rem' }}>
                    {props.value.feature.split(' ').map((words, idx) => {
                        return (
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {words}
                            </Typography>
                        );
                    })}

                    <Typography variant="h6" marginTop="10%">
                        {props.value.description}
                    </Typography>
                </div>
            </Box>
        </div>
    );
};

export default BigCard;



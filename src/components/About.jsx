import React from 'react';
import { Box } from '@mui/system';

const AboutUs = () => {
    // useEffect(() => {
    //     axios
    //         .get('https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete', {
    //             params: { query: 'eiffel tower', lang: 'en_US', units: 'km' },
    //             headers: {
    //                 'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
    //                 'X-RapidAPI-Key': '753b1bed66mshe30f518502b96f6p174fdfjsn2621e6ff20a1',
    //             },
    //         })
    //         .then(res => console.log(res.data));
    // }, []);

    return (
        <Box
            sx={{
                height: '97vh',
                margin: '30px 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'white',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 1rem',
                    // backgroundColor: 'red',
                }}
            >
                <div className="left" style={{ flex: '1' }}>
                    <h1
                        style={{
                            fontSize: '3rem',
                            marginLeft: '1rem',
                            width: 'fit-content',
                            borderBottom: '5px solid black',
                        }}
                    >
                        About us
                    </h1>
                    <p
                        style={{
                            fontSize: '1.3rem',
                            lineHeight: '1.8rem',
                            padding: '0.5rem 1.5rem',
                            textAlign: 'justify',
                        }}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, cupiditate sapiente. Voluptatibus vero, nihil
                        laboriosam nemo consectetur quam dignissimos numquam quae quo, quia architecto aliquid placeat nam ducimus
                        blanditiis dolore quidem. Voluptatibus iusto earum autem doloremque, maxime laboriosam at. Voluptatum earum nihil
                        vitae veniam, adipisci architecto esse autem atque non quidem natus praesentium fugit voluptas. Velit qui vel
                        delectus sapiente magni ab ratione odio fugiat omnis, nihil sunt magnam laudantium!
                    </p>
                </div>
                <div className="right" style={{ flex: '1' }}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/exploring-india.appspot.com/o/test_images%2FaboutUs.png?alt=media&token=6b0bbf6c-0e10-4566-9a55-2979ab4845a4"
                        alt=""
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '2rem' }}>We'd Love to Hear From You</p>
                <p style={{ fontSize: '2rem', marginTop: '-1.3rem' }}>Contact Us,</p>
                <p style={{ marginTop: '-1.3rem', color: 'gray' }}>email: sample@email.com | phone no: +914581252123</p>
                <div style={{ width: '12rem', height: '2px', backgroundColor: 'grey', marginTop: '-0.5rem' }}></div>
            </Box>
        </Box>
    );
};

export default AboutUs;

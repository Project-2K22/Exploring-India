import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AirIcon from '@mui/icons-material/Air';
import InvertColorsRoundedIcon from '@mui/icons-material/InvertColorsRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

const WeatherCard = ({ lat, lon }) => {
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState({});

    const fetchWeatherData = async () => {
        console.log(lat, lon);
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_W_WEATHER_API_ID}&units=metric`
            );
            setWeatherData(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const timestampToTime = unix_timestamp => {
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = '0' + date.getMinutes();
        var seconds = '0' + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
    };

    return (
        <Paper sx={{ width: '80%', margin: '60px auto 0 auto', padding: '20px' }} variant="outlined">
            {loading ? (
                'Loading ... '
            ) : (
                <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                    <Stack direction={'column'} justifyContent={'space-between'}>
                        <Stack direction={'row'} alignItems="center">
                            <Typography fontWeight={'bold'} fontSize="2vw">
                                {weatherData.main.temp}
                                <span> &#8451;</span>
                            </Typography>
                            <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="" />
                        </Stack>
                        <Typography>
                            {`Feels like ${weatherData.main.feels_like}`}
                            <span> &#8451;</span>
                        </Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack justifyContent={'space-between'} direction="column" spacing={2}>
                        <Stack direction="row" spacing={1}>
                            <VisibilityIcon />
                            <Typography>{`Visibility ${weatherData.visibility}`}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <AirIcon />
                            <Typography>{`Wind Speed ${weatherData.wind.speed}`}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <InvertColorsRoundedIcon />
                            <Typography>{`Humidity ${weatherData.main.humidity}`}</Typography>
                        </Stack>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack justifyContent={'space-between'} direction="column" spacing={2}>
                        <Stack direction="row" spacing={1}>
                            <WbSunnyRoundedIcon />
                            <Typography>{`Sunrise ${timestampToTime(weatherData.sys.sunrise)}`}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <DarkModeRoundedIcon />
                            <Typography>{`Sunset ${timestampToTime(weatherData.sys.sunset)}`}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )}
        </Paper>
    );
};

export default WeatherCard;

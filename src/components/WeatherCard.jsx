import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherCard = ({ lat, lon }) => {
    const [weatherData, setWeatherData] = useState({});

    const fetchWeatherData = async () => {
        try {
            const data = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_W_WEATHER_API_ID}`
            );
            setWeatherData(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    return <div>WeatherCard</div>;
};

export default WeatherCard;

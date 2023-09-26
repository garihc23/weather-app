import React ,{ useState, useTransition }from 'react'
import '../assets/css/WeatherData.css'
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faCloudShowersHeavy, 
    faSun, 
    faCloud, 
    faCloudRain,
    faTemperatureHigh, 
    faCity 
} from '@fortawesome/free-solid-svg-icons';
import GeolocationButton from './GeolocatonButton';
const WeatherData = () => {

    const apiKey= "961f1ac472543e227063e8d1ccdb64dc"
    const [weatherData, setWeatherData] = useState([{}])
    const [city, setCity] = useState("")
    const [tempUnit, setTempUnit] = useState('imperial')
    const [fetchMethod, setFetchMethod ] = useState('manual')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getWeather=(e) =>{
        setFetchMethod('manual');
        setLoading(true);
        setError(null);

        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${tempUnit}&AppID=${apiKey}`)
        .then(
            response => response.json()
        ).then(
            data => {
                setWeatherData(data)
            }
        )
        .catch((error) => {
            setError('Error fetching weather data');
            console.error('Error fetching weather data', error);
        })
        .finally(() => setLoading(false));
    }
    const getGeoLocation = () =>{
        setFetchMethod('geolocation');
        setLoading(true);
        setError(null);
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetch(
                        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${tempUnit}&appid=${apiKey}`
                    )
                    .then((response) => response.json())
                    .then((data) => {
                        setWeatherData(data);
                    })
                    .catch((error) =>{
                        console.error('Error fetching weather data',error)
                    })
                    .finally(() => setLoading(false))
                }, 
                (error) =>{
                    console.error('Error getting geoLocation', error)
                }
            )
        }else{
            setLoading(false);
            setError('Geolocation is not supported by this browser.');
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          getWeather(e);
        }
      };
    
    const handleSearchButtonClick = () => {
    getWeather(null);
    };
    const handleUnitToggle = () =>{/* 
        setTempUnit(tempUnit ==='imperial' ? 'metric' : 'impertial'); */
        setTempUnit((prevUnit) => (
            prevUnit === 'imperial' ? 'metric' : 'imperial'
            ));
    };
    
    let weatherCondition;
    let weatherIcon, weatherDescription;
    if (fetchMethod === 'manual' && weatherData.list && weatherData.list[0]) {
        weatherCondition = weatherData.list[0].weather[0].main;
    }else if(fetchMethod === 'geolocation' && weatherData.weather){
        weatherCondition = weatherData.weather.main;
    }
    /* console.log("WEATHERCONDITION---", weatherCondition) */
    if (weatherCondition) {
        switch (weatherCondition) {
            case 'Clear':
                weatherIcon = <FontAwesomeIcon icon={faSun} />;
                weatherDescription = 'Sunny';
            break;
            case 'Clouds':
                weatherIcon = <FontAwesomeIcon icon={faCloud} />;
                weatherDescription = 'Cloudy';
            break;
            case 'Rain':
                weatherIcon = <FontAwesomeIcon icon={faCloudRain} />;
                weatherDescription = 'Rainy';
            break;
            // Add more cases for other weather conditions as needed
            default:
                weatherIcon = null;
                weatherDescription = 'Unknown';
        }
    }
    
    console.log("GeoWeatherData---", weatherData) 
  return (
    <div className='container'>
        <InputGroup className='mb-3 input'>
            <FormControl
                placeholder='Type City Here..'
                onChange={e => setCity(e.target.value)}
                value={city}
                onKeyPress={handleKeyPress}
            />
            <GeolocationButton onGetGeoLocation={getGeoLocation} />
            <Button variant='primary' onClick={handleSearchButtonClick}>
                <FontAwesomeIcon icon={faSearch} /> Search
            </Button>
        </InputGroup>
        {loading && <p>Loading...</p>}
        {error && <p className='error-message'>{error}</p>}
        <div className='unit-toggle'>
            <label className='switch'>
                <input 
                    type = 'checkbox' 
                    onChange={() => setTempUnit(tempUnit === 'metric' ? 'imperial' : 'metric')}
                    onClick = {handleUnitToggle} />
                <span className='slider round'></span>
            </label>
            <span className='unit-label'>{tempUnit === 'imperial' ? '°F' : '°C'}</span>
        </div>
    { fetchMethod ==='geolocation'
    ? (
    weatherData && weatherData.name ? (
    <div className='weather-data'>
        <p className='city'>
            <FontAwesomeIcon icon={faCity} /> {weatherData.name}
        </p>
        <p className='temp'>
            <FontAwesomeIcon icon={faTemperatureHigh} /> 
            {tempUnit === 'imperial'
                ? `${Math.round(weatherData.main.temp)} °F`
                : `${Math.round((weatherData.main.temp - 32) * 5/9)} °C`
            }
        </p>
        <p className='weather'>
        {weatherIcon && 
            <div className='weather-icon'>
                {weatherIcon}
                <p className='weather-description'>
                    {weatherDescription}
                </p>
            </div>}
        
        </p>
    </div>
        ) :  (
            <div>
                <p>Welcome to weather app!</p>
            </div>
        )
    
    )
    :(
    weatherData && weatherData.list && weatherData.list[0] ? (
        <div className='weather-data'>
            <p className='city'>
                <FontAwesomeIcon icon={faCity} /> {weatherData.city.name}
            </p>
            <p className='temp'>
                <FontAwesomeIcon icon={faTemperatureHigh} /> 
                {tempUnit === 'imperial'
                    ? `${Math.round(weatherData.list[0].main.temp)} °F`
                    : `${Math.round((weatherData.list[0].main.temp - 32) * 5/9)} °C`
                }
            </p>
            <p className='weather'>
            {weatherIcon && 
                <div className='weather-icon'>
                    {weatherIcon}
                    <p className='weather-description'>
                        {weatherDescription}
                    </p>
                </div>}
            
            </p>
        </div>
        ) : (
            <div> 
                <p>Welcome to weather app!</p>
            </div>
        )
    
    )
    }
    {weatherData.cod ==='404'?(
            <p className='error-message'>City not found.</p>
        ) : (
            <></>
        )
    }
    </div>
  )
}

export default WeatherData
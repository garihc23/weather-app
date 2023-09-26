import React ,{ useState, useTransition }from 'react'
import '../assets/css/WeatherData.css'
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faCloudShowersHeavy, 
    faCloud, 
    faTemperatureHigh, 
    faCity 
} from '@fortawesome/free-solid-svg-icons';
const WeatherData = () => {

    const apiKey= "961f1ac472543e227063e8d1ccdb64dc"
    const [weatherData, setWeatherData] = useState([{}])
    const [city, setCity] = useState("")
    const [tempUnit, setTempUnit] = useState('imperial')

    const getWeather=(e) =>{
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${tempUnit}&AppID=${apiKey}`)
        .then(
            response => response.json()
        ).then(
            data => {
                setWeatherData(data)
            }
        )
        .catch((error) => {
            console.error('Error fetching weather data', error)
        })
    }
    
    /* console.log("WeatherData---", weatherData) */

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
  return (
    <div className='container'>
        <InputGroup className='mb-3 input'>
            <FormControl
                placeholder='Type City Here..'
                onChange={e => setCity(e.target.value)}
                value={city}
                onKeyPress={handleKeyPress}
            />
            <Button variant='primary' onClick={handleSearchButtonClick}>
                <FontAwesomeIcon icon={faSearch} /> Search
            </Button>
        </InputGroup>
       

        {weatherData && weatherData.list && weatherData.list[0] ? (
            <div>
                <div className='unit-toggle'>
                    <label className='switch'>
                        <input type = 'checkbox' onClick = {handleUnitToggle} />
                        <span className='slider round'></span>
                    </label>
                    <span className='unit-label'>{tempUnit === 'imperial' ? '°F' : '°C'}</span>
                </div>
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
                        {weatherData.list[0].weather[0].main === 'Rain' ? (
                        <FontAwesomeIcon icon={faCloudShowersHeavy} />
                        ) : (
                        <FontAwesomeIcon icon={faCloud} />
                        )}{' '}
                        {weatherData.list[0].weather[0].main}
                    </p>
                </div>
            </div>
        ) : (
            <div> 
                <p>Welcome to weather app!</p>
            </div>
        )}
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
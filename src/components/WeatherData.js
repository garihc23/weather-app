import React ,{ useState }from 'react'
const WeatherData = () => {

    const apiKey= "961f1ac472543e227063e8d1ccdb64dc"
    const [weatherData, setWeatherData] = useState([{}])
    const [city, setCity] = useState("")

    const getWeather=(e) =>{
        if(e.key=== 'Enter'){
            fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&AppID=${apiKey}`)
            .then(
                response => response.json()
            ).then(
                data => {
                    setWeatherData(data)
                }
            )
        }
    }
    /* console.log("WeatherData---", weatherData) */
  return (
    <div className='container'>
        <input 
            className='input' 
            placeholder='Type City Here..'
            onChange={e => setCity(e.target.value)}
            value={city}
            onKeyPress={getWeather}
        />
        <button
            onClick={getWeather}
        >
            Search
        </button>

        {weatherData && weatherData.list && weatherData.list[0] ? (
            <div className='weather-data'>
                <p className='city'>{weatherData.city.name}</p>
                <p className='temp'>{Math.round(weatherData.list[0].main.temp)} F</p>
                <p className='weather'>{weatherData.list[0].weather[0].main}</p>
            </div>
        ) : (
            <div> 
                <p>Welcome to weather app!</p>
            </div>
        )}
         {weatherData.cod ==='404'?(
                <p>City not found.</p>
            ) : (
                <></>
            )
        }
    </div>
  )
}

export default WeatherData
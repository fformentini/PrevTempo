import './WeatherInfo.css'

function WeatherInfo({ weather }) {
  if (!weather || !weather.location || !weather.current) return null;

  return (
    <div className='weather-container'>
      <h1>{weather?.location?.name}
  {weather?.location?.region ? ` - ${weather.location.region}` : ""}</h1>
      <p>{weather.location?.localtime.split(" ")[1]}</p>

      <div className="weather-icon">
          
           <span>{Math.round(weather.current.temp_c)}°C</span>

          {weather.current.condition.icon && (
            <img src={`https:${weather.current.condition.icon}`} alt={weather.current.condition.text} />
          )}
         
          
      </div>

        <p> {weather.current.condition.text}</p>
        
      <div className="weather-infos">
          
          <p>Sensação térmica: <span>{Math.round(weather.current?.feelslike_c)}°C</span></p>
          <p>Índice UV: <span>{weather.current?.uv}</span></p>
          <p> Umidade: <span>{weather.current.humidity}%</span></p>
      </div>

    </div>
  );
}

export default WeatherInfo;

import './Forecast.css'

function Forecast({ forecast }) {
  return (
    <div className="forecast-container">
      <h2>Previsão para os próximos dias</h2>

      <div className="forecast-days">
        {forecast.forecastday.slice(2).map((day) => {
          const date = new Date(day.date)
          const formattedDate = date.toLocaleDateString('pt-BR', {
            weekday: 'long' , 
            day: '2-digit',
            month: '2-digit',
          })

          // Define a cor do card com base na temperatura
          const cardStyle = {
            backgroundColor: day.day.maxtemp_c >= 25 ? 'yellow' : 'rgba(173, 216, 230, 0.7)'
          }

          return (
            <div className="forecast-card" key={day.date} style={cardStyle}>
              <h3>{formattedDate}</h3>
              <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} />
              <p> Máx: {Math.round(day.day.maxtemp_c)}°C</p>
              <p> Mín: {Math.round(day.day.mintemp_c)}°C</p>
              <p> Chance de chuva: {day.day.daily_chance_of_rain}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Forecast

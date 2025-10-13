import { useState, useRef } from 'react'
import axios from 'axios'
import './App.css'
import WeatherInfo from './components/weatherInfo/weatherInfo'
import Forecast from './components/foreCast/ForeCast'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [weather, setWeather] = useState()
  const [forecast, setForecast] = useState(null)
  const inputRef = useRef()

  async function searchCity() {
    const city = inputRef.current.value
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=pt`
    const urlForecast = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&lang=pt`

    if (!city) {
      toast.warn("Digite o nome da cidade!")
      return
    }

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(url),
        axios.get(urlForecast)
      ])

      setWeather(currentResponse.data)
      setForecast(forecastResponse.data.forecast)

      toast.success("Cidade encontrada!")

    } catch (err) {
      // Cidade inválida → limpa dados
      setWeather(null)
      setForecast(null)

      toast.error("Cidade não encontrada!")
      console.error("Erro ao buscar cidade:", err)
    }
    
  }


  return (
    <div className='container-weather'>
      <h1>Previsão do tempo</h1>
      <input ref={inputRef} type="text" placeholder='Digite o nome da cidade' />
      <button onClick={searchCity}>Buscar</button>

      {weather && <WeatherInfo weather={weather} />}
      {forecast && <Forecast forecast={forecast} />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

    </div>
  )
}

export default App

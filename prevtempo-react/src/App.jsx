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
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  async function fetchWeather(q) {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${q}&lang=pt`
    const urlForecast = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=5&lang=pt`

    try {
      setLoading(true)

      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(url),
        axios.get(urlForecast)
      ])

      setWeather(currentResponse.data)
      setForecast(forecastResponse.data.forecast)

      return currentResponse.data
    } catch (err) {
      setWeather(null)
      setForecast(null)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function searchCity() {
    const city = inputRef.current.value?.trim()

    if (!city) {
      toast.warn("Digite o nome da cidade!")
      return
    }

    try {
      await fetchWeather(city)
      toast.success("Cidade encontrada!")
    } catch (err) {
      toast.error("Cidade não encontrada!")
      console.error("Erro ao buscar cidade:", err)
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      toast.error("Seu navegador não suporta geolocalização.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const q = `${latitude},${longitude}`

        try {
          const data = await fetchWeather(q)
          if (inputRef.current) inputRef.current.value = data.location.name
          toast.success("Localização encontrada!")
        } catch (err) {
          toast.error("Não consegui buscar sua localização.")
          console.error("Erro ao buscar localização:", err)
        }
      },
      (err) => {
        if (err.code === 1) toast.warn("Permissão de localização negada.")
        else if (err.code === 2) toast.warn("Não foi possível obter sua localização.")
        else toast.warn("Tempo esgotado ao obter localização.")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className='container-weather'>
      <h1>Previsão do tempo</h1>

      <input
  ref={inputRef}
  type="text"
  placeholder='Digite o nome da cidade'
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      searchCity()
    }
  }}
/>
      <button onClick={searchCity} disabled={loading}>Buscar</button>
      <div className="actions">
      <button onClick={useMyLocation} disabled={loading}>Usar minha localização</button>
      </div>

      {/* exibição de loading */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      )}

      {!loading && weather && <WeatherInfo weather={weather} />}
      {!loading && forecast && <Forecast forecast={forecast} />}

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

import react, {useEffect, useState} from 'react';
import './WeatherForecastContainer.css';

export default function WeatherForecastContainer(){

  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState]= useState('');
  const [periods, setPeriods] = useState([]);

  const resetFields = function(){
    setLat(null);
    setLon(null);
    setCity('');
    setState('');
    setPeriods([]);
  }

  const getWeather = async function(){
    resetFields();
    const forecast_link_info = await fetch(`http://localhost:4000/weather/latitude/${lat}/longitude/${lon}`).then(res=>res.json());
    if(forecast_link_info.error){
      alert(forecast_link_info.error);
    }
    else{
      setCity(forecast_link_info.properties.relativeLocation.properties.city);
      setState(forecast_link_info.properties.relativeLocation.properties.state);
      const forecast_daily= await fetch(`http://localhost:4000/regiondata/gridId/${forecast_link_info.properties.gridId}/gridx/${forecast_link_info.properties.gridX}/gridy/${forecast_link_info.properties.gridY}`).then(res=>res.json());
      if(forecast_daily.error){
        alert(forecast_daily.error)
      }
      else{
        setPeriods(forecast_daily.properties.periods);
      }

    }
  }


  return(
    <div style={{'paddingTop':'30px'}}>
      <div className="user-inputs">
          <div className="form-pair">
            <label htmlFor='lat'>Lat: </label>
            <input id="lat" type='text' onChange={(e)=>setLat(e.target.value)}/>
          </div>
          <div className="form-pair">
            <label htmlFor='lon' >Lon: </label>
            <input id="lon" type='text' onChange={(e)=>setLon(e.target.value)}/>
          </div>
          <button onClick={getWeather}>Get Forecast</button>
      </div>

      <div className={city===""|| state==="" ? 'hidden' : ''}>
        <h2>Weather For {city}, {state}</h2>
        <ul>
          {
            periods.map(period=>{
              return(
                <li key={period.name}>
                  <h3>{period.name}</h3>
                  <div className="weather-content-entry">
                    <div className="weather-content-text">
                      <div>
                        <span>Temp: {period.temperature} {period.temperatureUnit}</span>
                      </div>
                      <div>
                        <span>{period.detailedForecast}</span>
                      </div>
                    </div>
                    <img alt="weather forecast day" src={period.icon}/>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>

  )
}

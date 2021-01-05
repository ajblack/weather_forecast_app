import react, {useEffect, useState} from 'react';
import './WeatherForecastContainer.css';

export default function WeatherForecastContainer(){

  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState]= useState('');
  const [periods, setPeriods] = useState([]);

  useEffect(()=>{
    console.log(`lat is: ${lat} and lon is ${lon}`)
  },[lat,lon])

  useEffect(()=>{
    console.log(`city is: ${city} and state is ${state}`)
  },[city,state])

  useEffect(()=>{
    console.log('periods set:');
    console.log(periods);
  },[periods]);

  const resetFields = function(){
    setLat(null);
    setLon(null);
    setCity('');
    setState('');
    setPeriods([]);
  }

  const getWeather = async function(){
    resetFields();
    //const forecast_link_info = await fetch(`https://api.weather.gov/points/${lat},${lon}`).then(res=>res.json());
    const forecast_link_info = await fetch("https://api.weather.gov/points/42.3611,-71.057").then(res=>res.json());
    if(forecast_link_info.status === 404){
      alert('please enter valid coordinates');
    }
    else{
      setCity(forecast_link_info.properties.relativeLocation.properties.city);
      setState(forecast_link_info.properties.relativeLocation.properties.state);
      const forecast_link = forecast_link_info.properties.forecast;
      const forecast_json = await fetch(forecast_link).then(res=>res.json());
      setPeriods(forecast_json.properties.periods);

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

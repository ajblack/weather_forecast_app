const express = require('express')
const axios = require('axios');
const app = express()
const port = 4000

let url = '';

app.get('/', (req, res) => {
  res.send("hello world")
})

app.get('/weather/latitude/:lat/longitude/:lon',async (req,res)=>{
  console.log(req.params);
  url = `https://api.weather.gov/points/${req.params.lat},${req.params.lon}`;
  const {data} = await axios.get(url)
  .catch(e=>{
    console.log("ERROR - BAD RESULT FOR PROVIDED COORDINATES")
    res.send({'error':'Coordinates outside of United States.'})
  })
  res.send(data);
});

app.get('/regiondata/gridId/:gridId/gridx/:gridx/gridy/:gridy', async (req, res)=>{
  url = `https://api.weather.gov/gridpoints/${req.params.gridId}/${req.params.gridx},${req.params.gridy}/forecast`;
  const {data} = await axios.get(url)

  .catch(e=>{
    console.log("ERROR - THIS TYPE OF FORECAST IS NOT SUPPORTED");
    const err = e.response.data.title ? e.response.data.title : "No forecast provided for this area.";
    res.send({'error':err});
    //res.send({'error':''})
  })
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

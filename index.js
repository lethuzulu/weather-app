const express = require("express");
const fetch = require("node-fetch");

const app = express();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`LISTENING AT PORT ${port}`);
});

app.use(express.static("public"));

app.get("/current/:latlong", async (request, response) => {
  const latlong = request.params.latlong.split(",");

  const latitude = latlong[0];
  const longitude = latlong[1];

  //const api_url_afrigis = `https://saas.afrigis.co.za/rest/2/weather.measurements.getByCoord/b13b0a9dda/trial/?location=${latitude},${longitude}&station_count=2`;
  const api_url_afrigis = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=c7ca51e984b2bebc5584debe0491d7a3`;
  const afrigisResponse = await fetch(api_url_afrigis);
  const afrigisJson = await afrigisResponse.json();

  response.json(afrigisJson);
});

app.get("/forecast/:latlong", async (request, response) => {
  const latlong = request.params.latlong.split(",");

  const latitude = latlong[0];
  const longitude = latlong[1];

  //7Day forecast from AfriGIS
  //const api_url_future = `https://saas.afrigis.co.za/rest/2/weather.forecast.daily.getByCoord/b13b0a9dda/trial/?location=${latitude},${longitude}&groups=basic&day_count=7`;
  const api_url_future = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,hourly,alerts,minutely&units=metric&appid=c7ca51e984b2bebc5584debe0491d7a3`;

  const futureResponse = await fetch(api_url_future);
  const futureData = await futureResponse.json();
  response.json(futureData);
});

app.get("/air_quality/:latlong", async (request, response) => {
  //Air Quality from weatherbit.io
  const latlong = request.params.latlong.split(",");

  const latitude = latlong[0];
  const longitude = latlong[1];

  const api_url_weatherbit = `https://api.weatherbit.io/v2.0/current/airquality?lat=${latitude}&lon=${longitude}&key=8333346536044c53ad554084a3d231fb`;
  const weatherbitResponse = await fetch(api_url_weatherbit);
  const weatherBitJson = await weatherbitResponse.json();

  response.json(weatherBitJson);
});

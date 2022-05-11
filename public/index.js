const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");

const air_quality = document.getElementById("air_quality");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind_direction = document.getElementById("wind_direction");
const wind_speed = document.getElementById("wind_speed");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function retrieveWeather() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    //Current Weather Conditions
    api_url_current = `current/${latitude},${longitude}`;
    const current_response = await fetch(api_url_current);
    const current_json = await current_response.json();

    document.getElementById("city").innerHTML = current_json.name;
    document.getElementById("country").innerHTML = current_json.sys.country;

    temperature.innerHTML = `${Math.floor(
      current_json.main.temp
    )} <span>&#8451;</span>`;
    pressure.innerHTML = current_json.main.pressure + ` kPA`;
    humidity.innerHTML = current_json.main.humidity + " %";
    wind_speed.innerHTML = current_json.wind.speed;

    //Forecast OR Future Weather Conditions
    api_url_forecast = `forecast/${latitude},${longitude}`;
    const forecast_response = await fetch(api_url_forecast);
    const forecast_json = await forecast_response.json();

    for (let i = 0; i < 7; i++) {
      let date = new Date();
      let day = date.getDay();

      document.getElementById(`day-${i}`).innerHTML = days[(day + i) % 7];

      document.getElementById(`high-${i}`).innerHTML = `${Math.floor(
        forecast_json.daily[i].temp.max
      )}<span>&#8451;</span>`;
      document.getElementById(`low-${i}`).innerHTML = `${Math.floor(
        forecast_json.daily[i].temp.min
      )}<span>&#8451;</span>`;

      document.getElementById(
        `icon-${i}`
      ).src = `http://openweathermap.org/img/wn/${forecast_json.daily[i].weather[0].icon}@2x.png`;
    }

    //Air Quality Request
    api_url_aq = `air_quality/${latitude},${longitude}`;
    const air_quality_response = await fetch(api_url_aq);
    const air_quality_json = await air_quality_response.json();
    air_quality.innerHTML = air_quality_json.data[0].aqi;
  });
}

retrieveWeather();

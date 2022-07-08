const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const currentWeatherItemsEl = document.querySelector("#current-weather-items");
const timezone = document.querySelector(".time-zone");
const countryEl = document.querySelector(".country");
const weatherForecastEl = document.querySelector(".weather-forecast");
const currentTempEl = document.querySelector("#current-temp");

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

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

// const API_KEY = "aaa74cb61c515b9509baf2c7bef24143";
const API_KEY = "ec7c14c16683b0200d42479c5300bc9b";

// Button to show form
const bbtnn2 = document.getElementById("bbtnn2");
weatherForm.style.display = "none";

bbtnn2.addEventListener("click", () => {
  weatherForm.style.display = "block";
  setDisplayStyleNone()
});

// Button for current location
const bbtnn1 = document.getElementById("bbtnn1");
bbtnn1.addEventListener("click", () => {
  weatherForm.style.display = "none";
  setDisplayStyle()
  getWeatherData1();
});

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
    `<span class="am-pm">${ampm}</span>`;
  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function getWeatherData1() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    currentWeatherItemsEl.innerHTML = `<h2>Loading...</h2>`;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const address = search.value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}`
    )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod == "404") {
        alert("Please enter a valid city name.")
        setDisplayStyleNone()
      }
      setDisplayStyle()
      getWeatherData2(data);
    });
});

function getWeatherData2(data) {
  console.log(data);
  let { lon, lat } = data.coord;
  currentWeatherItemsEl.innerHTML = `<h2>Loading...</h2>`
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showWeatherData(data);
    });
}

function setDisplayStyleNone(){
  timezone.style.display = "none";
  countryEl.style.display = "none";
  currentWeatherItemsEl.style.display = "none";
  currentTempEl.style.display = "none";
  weatherForecastEl.style.display = "none";
  search.value = "";
}

function setDisplayStyle() {
  currentWeatherItemsEl.style.display = "block";
  timezone.style.display = "block";
  countryEl.style.display = "block";
  currentTempEl.style.display = "flex";
  weatherForecastEl.style.display = "flex";
}
function showWeatherData(data) {
  let { weather, humidity, pressure, temp, wind_speed } = data.current;

  var new_wind_speed = Math.round(3.6 * wind_speed * 100) / 100;
  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `
  <div class="others">
  <div class="container">
    <div class="row  weather-items">
      <div class="col-6 weather-name">
      <i class="bi bi-cloud-sun"></i>&nbsp;&nbsp;Weather
      </div>
      <div class="col-6 weather-num">
        ${weather[0].description.toUpperCase()}
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row  weather-items">
      <div class="col-6 weather-name">
      <i class="bi bi-thermometer-half"></i>&nbsp;&nbsp;Temperature
      </div>
      <div class="col-6 weather-num">
        ${temp} &#176;C
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row  weather-items">
      <div class="col-6 weather-name">
      <i class="bi bi-moisture"></i>&nbsp;&nbsp;Humidity
      </div>
      <div class="col-6 weather-num">
        ${humidity} %
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row weather-items">
      <div class="col-6 weather-name">
      <i class="bi bi-speedometer2"></i>&nbsp;&nbsp;Pressure
      </div>
      <div class="col-6 weather-num">
        ${pressure} mb
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row weather-items">
      <div class="col-7 weather-name">
      <i class="bi bi-wind"></i>&nbsp;&nbsp;Wind-Speed
      </div>
      <div class="col-5 weather-num">
        ${new_wind_speed} km/h
      </div>
    </div>
  </div>
  </div>
    `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
          <div class="today">
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon" style="width:150px; padding:-10px; margin:0px;">
            <div class="other">
                <div class="day">Today</div>
                <div class="temp"><i class="bi bi-cloud-moon"></i>&nbsp;Night - ${day.temp.night}&#176;C</div>
                <div class="temp"><i class="bi bi-cloud-sun"></i>&nbsp;Day - ${day.temp.day}&#176;C</div>
            </div>
          </div>
            `;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp"><i class="bi bi-cloud-moon"></i>&nbsp;Night - ${
                  day.temp.night
                }&#176;C</div>
                <div class="temp"><i class="bi bi-cloud-sun"></i>&nbsp;Day - ${
                  day.temp.day
                }&#176;C</div>
            </div>
            `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}

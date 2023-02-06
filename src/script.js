function changeBackground() {
  let now = new Date();
  let hours = now.getHours();
  if (hours >= 21 || hours < 7) {
    document.body.className = "body-night";
  } else {
    document.body.className = "body-day";
  }
}
changeBackground();
setInterval(changeBackground, 1000 * 60 * 1);

function formatDate() {
  let today = new Date();
  let dayIndex = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = dayIndex[today.getDay()];
  let monthIndex = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  let month = monthIndex[today.getMonth()];
  let hour = today.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let date = today.getDate();
  let year = today.getFullYear();
  let currentDateTime = `${day} at ${hour}:${minutes}, ${month} ${date}, ${year}`;

  return currentDateTime;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class= "row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
              <div class="forecast-days">${formatDay(forecastDay.dt)}</div>
              <img 
              src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon
        }@2x.png"
              alt="${forecastDay.weather[0].description}"
              width="42" class="icon"
              />
              <div class="forecast-temp-range">
                <span class="forecast-temp-range-max">
                ${Math.round(forecastDay.temp.max)}°</span>|<span
                  class="forecast-temp-range-min"
                  >${Math.round(forecastDay.temp.min)}°</span>
              </div>
            </div>`;
    }
  });
  forecastHTML = forecastHTML + `<div>`;
  forecastElement.innerHTML = forecastHTML;
}

function retrieveForecast(coordinates) {
  let apiKey = "57821c3b75b60c68ecd1a8d0dd1aa8d3";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  let unit = `°C`;
  let unitElement = document.querySelector("#unit");
  let currentTemperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity-level");
  let windElement = document.querySelector("#wind-level");
  let iconElement = document.querySelector("#current-weather-icon");

  unitElement.innerHTML = `${unit}`;
  currentTemperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  retrieveForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "502dc8f7ae36e57af1974e18d16a86f8";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#enter-city").value;
  searchCity(city);
}

function retrievePosition(position) {
  navigator.geolocation.getCurrentPosition(retrievePosition);
  let apiKey = "e1c2feea6507de5a3f0b333f87c2c649";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

let todayDate = document.querySelector("#today");
todayDate.innerHTML = formatDate(new Date());

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#btn-current");
currentButton.addEventListener("click", retrievePosition);

searchCity("London");

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

function displayWeather(response) {
  let currentTemperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let currentTempRangeElement = document.querySelector("#current-temp-range");
  let maxTemp = Math.round(response.data.main.temp_max);
  let minTemp = Math.round(response.data.main.temp_min);
  let humidityElement = document.querySelector("#humidity-level");
  let windElement = document.querySelector("#wind-level");
  let iconElement = document.querySelector("#icon");

  currentTemperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  currentTempRangeElement.innerHTML = `${minTemp}°|${maxTemp}°`;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
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
searchForm.addEventListener("click", handleSubmit);

let currentButton = document.querySelector("#btn-current");
currentButton.addEventListener("click", retrievePosition);

searchCity("London");

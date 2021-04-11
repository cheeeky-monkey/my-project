// Handles 'Updated at' section

let currentTime = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wedneday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[currentTime.getDay()];

let time = currentTime.getHours();

let updatedOn = document.querySelector("#current-time");
updatedOn.innerHTML = `Updated on ${day} ${time}:00`;

// Handles temperature

function showWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let description = response.data.weather[0].description;
  let icon = response.data.weather[0].icon;

  document.querySelector("#current-temp").innerHTML = `${temperature}°C`;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;
  document.querySelector("#wind").innerHTML = `${wind}km/h`;
  document.querySelector("#description").innerHTML = `${description}`;
  document
    .querySelector("#icon-now")
    .setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
}

// Handles search

function handleSearch(thisCity) {
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let apiKey = "fcb92fde799e36113733f7774e4cedb1";
  let cityTemperatureUrl = `${apiEndpoint}q=${thisCity}&units=metric&appid=${apiKey}`;
  document.querySelector("#city").innerHTML = `${thisCity}`;
  axios.get(cityTemperatureUrl).then(showWeather);
}

function searchCity() {
  let searchInput = document.querySelector("#search-field");
  let city = `${searchInput.value}`;
  return city;
}

function showCityTemperature(event) {
  event.preventDefault();
  let thisCity = searchCity();
  handleSearch(thisCity);
}

// Handles current location

function showCurrentCity(response) {
  document.querySelector("#city").innerHTML = response.data.name;
}

function handleLocation(position) {
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let apiKey = "fcb92fde799e36113733f7774e4cedb1";
  let positionTemperatureUrl = `${apiEndpoint}lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appId=${apiKey}`;

  axios.get(positionTemperatureUrl).then(showWeather);
  axios.get(positionTemperatureUrl).then(showCurrentCity);
}

// Handles current location temperature
function showCurrentLocationTemperature(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleLocation);
}

let searchField = document.querySelector("#search");
searchField.addEventListener("submit", showCityTemperature);

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", showCurrentLocationTemperature);

handleSearch("London");

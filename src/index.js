// Handles 'Updated at' section

function formatTime(timestamp) {
  let time = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wedneday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[time.getDay()];

  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `Last update: ${day} ${hours}:${minutes}`;
}
//Handles forecast display
function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row forecast">`;
  let days = ["Tue", "Wed", "Thu", "Fri"];
  function callback(day) {
    forecastHTML =
      forecastHTML +
      `
<div class="col-3 next-day">
            <h4>${day}</h4>
            <img
                  src="http://openweathermap.org/img/wn/10d@2x.png"
                  id="icon"
                />
            <p>9°C</p>
          </div>`;
  }
  days.forEach(callback);

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Handles forecast data
function getForecast(coordinates) {
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/onecall?`;
  let apiKey = "fcb92fde799e36113733f7774e4cedb1";
  let forecastUrl = `${apiEndpoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
}

// Handles weather display
function showWeather(response) {
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let description = response.data.weather[0].description;
  let icon = response.data.weather[0].icon;
  let updatedAt = response.data.dt;

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#current-temp").innerHTML = `${Math.round(
    celsiusTemperature
  )}°C`;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;
  document.querySelector("#wind").innerHTML = `${wind}m/s`;
  document.querySelector("#description").innerHTML = `${description}`;
  document
    .querySelector("#icon-now")
    .setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
  document.querySelector("#updated-at").innerHTML = formatTime(
    updatedAt * 1000
  );

  getForecast(response.data.coord);
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

// Handles current location weather
function showCurrentLocationTemperature(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleLocation);
}

// Handles temperature conversion to Celsius
function showCelsiusTemperature(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°C`;

  fahrenheit.classList.remove("inactive-link");
  celsius.classList.add("inactive-link");
}

// Handles temperature conversion to Fahrenheit
function showFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  let temperatureInFahrenheit = (Math.round(celsiusTemperature) * 9) / 5 + 32;
  temperatureElement.innerHTML = `${Math.round(temperatureInFahrenheit)}°F`;

  celsius.classList.remove("inactive-link");
  fahrenheit.classList.add("inactive-link");
}

let celsiusTemperature = null;

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let searchField = document.querySelector("#search");
searchField.addEventListener("submit", showCityTemperature);

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", showCurrentLocationTemperature);

handleSearch("London");

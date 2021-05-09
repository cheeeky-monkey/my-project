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

//Formats days in forecast
function formatDay(timestamp) {
  let day = new Date(timestamp * 1000);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day.getDay()];
}

//Handles forecast display
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let celsiusTemperature = forecast[1].temp.day;
  let description = forecast[1].weather[0].description;
  let icon = forecast[1].weather[0].icon;
  document.querySelector("#tomorrow-temp").innerHTML = `${Math.round(
    celsiusTemperature
  )}°C`;
  document.querySelector("#description-tomorrow").innerHTML = `${description}`;
  document
    .querySelector("#icon-tomorrow")
    .setAttribute("src", `assets/${icon}.gif`);

  let forecastHTML = `<div class="row forecast">`;

  function sixDaysCallback(dayForecast, index) {
    if (index > 1 && index < 8)
      forecastHTML =
        forecastHTML +
        `
  <div class="col-2 next-day">
              <h4>${formatDay(dayForecast.dt)}</h4>
              <img
                    src="assets/${dayForecast.weather[0].icon}.gif"
                    id="icon"
                  />
              <p id="max-temp">${Math.round(dayForecast.temp.max)}°</p>
              <p id="min-temp">${Math.round(dayForecast.temp.min)}°</p>
            </div>`;
  }
  forecast.forEach(sixDaysCallback);

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
  let pressure = response.data.main.pressure;
  let description = response.data.weather[0].description;
  let icon = response.data.weather[0].icon;
  let updatedAt = response.data.dt;

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#current-temp").innerHTML = `${Math.round(
    celsiusTemperature
  )}°C`;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;
  document.querySelector("#wind").innerHTML = `${wind}m/s`;
  document.querySelector("#pressure").innerHTML = `${pressure}hPa`;
  document.querySelector("#description-now").innerHTML = `${description}`;
  document.querySelector("#icon-now").setAttribute("src", `assets/${icon}.gif`);
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

let celsiusTemperature = null;

let searchField = document.querySelector("#search");
searchField.addEventListener("submit", showCityTemperature);

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", showCurrentLocationTemperature);

handleSearch("London");

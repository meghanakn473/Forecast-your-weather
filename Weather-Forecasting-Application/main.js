// MAIN WEATHER FUNCTIONALITY

// Navigation
var city = document.getElementById("city");
var country = document.getElementById("country");
var searchCity = document.getElementById("search");
var languageSelector = document.getElementById("language");

// box-1
var cityTemp = document.getElementById("temp");
var weatherIcon = document.getElementById("weather-icon");
var weatherDescription = document.getElementById("description");
var weatherPressure = document.getElementById("pressure");
var weatherVisibilty = document.getElementById("visibility");
var weatherHumidity = document.getElementById("humidity");

// box-2
var sunriseTime = document.getElementById("sunrise-time");
var sunsetTime = document.getElementById("sunset-time");
var uviRays = document.getElementById("uvi-rays");
var uviConcernLevel = document.querySelector(".uvi-level");
var uviConcernLevel2 = document.querySelector(".uvi-level2");

// Hours report
var hoursIcon = document.querySelectorAll(".hourly-icon");
var hoursTemp = document.querySelectorAll(".hours-temp");

// Days temperature
var daysIcon = document.querySelectorAll(".days-icon");
var nextDay = document.querySelectorAll(".prediction-day");
var predictionDesc = document.querySelectorAll(".prediction-desc");
var daysTemp = document.querySelectorAll(".days-temp");

// Time and dates
var currentTime = document.querySelector(".time");
var currentDate = document.querySelector(".date");
var aqi = document.querySelector(".aqi");

// Recommendations
var recommendations = document.getElementById("recommendations");

// GLOBAL VARIABLES
var weatherApi;
var responseData;
var monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// FUNCTION FOR GET WEATHER REPORT
async function weatherReport(searchCity, lang = 'en') {
  try {
    weatherApi = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=da2103b2c4ce4f95af051626232503&q=${searchCity}&days=7&aqi=yes&alerts=yes&lang=${lang}`
    );
    responseData = await weatherApi.json();
    todayWeatherReport();
    hoursWeatherReport();
    forecastdayReport();
    provideRecommendations();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function todayWeatherReport() {
  city.innerHTML = responseData.location.name;
  country.innerHTML =
    ' <i class="fa-sharp fa-solid fa-location-dot"></i>' +
    responseData.location.country;

  // Box-1
  cityTemp.innerHTML = responseData.current.temp_c;
  weatherDescription.innerHTML = responseData.current.condition.text;
  weatherIcon.setAttribute("src", responseData.current.condition.icon);
  weatherPressure.innerHTML = responseData.current.pressure_mb + " mb";
  weatherVisibilty.innerHTML = responseData.current.vis_km + " km";
  weatherHumidity.innerHTML = responseData.current.humidity + "%";

  // Box-2
  sunriseTime.innerHTML = responseData.forecast.forecastday[0].astro.sunrise;
  sunsetTime.innerHTML = responseData.forecast.forecastday[0].astro.sunset;
  uviRays.innerHTML = responseData.current.uv + " UVI";
  //aqi.innerHTML = Math.round(responseData.current.air_quality.pm2_5);

  checkUVraysIndex();
  time();
}

function checkUVraysIndex() {
  let uviLevel = Number.parseInt(uviRays.textContent);
  if (uviLevel <= 2) {
    checkUviValue("Good", "#6ae17c");
  } else if (uviLevel <= 5) {
    checkUviValue("Moderate", "#CCE16A");
  } else if (uviLevel <= 7) {
    checkUviValue("High", "#d4b814");
  } else if (uviLevel <= 10) {
    checkUviValue("Very high", "#d43114");
  } else {
    checkUviValue("Extreme high", "#dc15cf");
  }
}

function checkUviValue(level, color) {
  uviConcernLevel.innerHTML = level;
  uviConcernLevel.style.backgroundColor = color;
  uviConcernLevel2.innerHTML = level;
}

function hoursWeatherReport() {
  hoursTemp.forEach((t, i) => {
    t.innerHTML = responseData.forecast.forecastday[0].hour[i].temp_c + "°C";
  });

  hoursIcon.forEach((t, i) => {
    t.src = responseData.forecast.forecastday[0].hour[i].condition.icon;
  });
}

function forecastdayReport() {
  daysIcon.forEach((icon, index) => {
    icon.src = responseData.forecast.forecastday[index].day.condition.icon;
  });

  daysTemp.forEach((temp, index) => {
    temp.innerHTML =
      Math.round(responseData.forecast.forecastday[index].day.maxtemp_c) +
      "°C" +
      `<span> / </span>` +
      Math.round(responseData.forecast.forecastday[index].day.mintemp_c) +
      "°C";
  });

  predictionDesc.forEach((d, index) => {
    d.innerHTML = responseData.forecast.forecastday[index].day.condition.text;
  });

  nextDay.forEach((day, index) => {
    let weekdate = new Date(
      responseData.forecast.forecastday[index].date
    ).getDate();
    let weekday =
      weekDays[
      new Date(responseData.forecast.forecastday[index].date).getDay()
      ];

    day.innerHTML = `${weekday} ${weekdate}`;
  });
}

function time() {
  var timezone = responseData.location?.tz_id;
  var now = new Date().toLocaleTimeString("en-US", { timeZone: timezone });
  currentTime.innerHTML = now;

  var today = new Date(responseData.forecast.forecastday[0].date);
  currentDate.innerHTML = `${today.getDate()} ${monthName[today.getMonth()]
    } ${today.getFullYear()}, ${weekDays[today.getDay()]}`;
}

function provideRecommendations() {
  let temp = responseData.current.temp_c;
  let condition = responseData.current.condition.text.toLowerCase();
  let humidity = responseData.current.humidity;
  let uvi = responseData.current.uv;

  let recommendationsText = "";

  if (temp > 30) {
    recommendationsText += "It's hot outside. Wear light clothes and stay hydrated. ";
  } else if (temp < 10) {
    recommendationsText += "It's cold outside. Wear warm clothes. ";
  }

  if (condition.includes("rain")) {
    recommendationsText += "Carry an umbrella or raincoat. ";
  } else if (condition.includes("snow")) {
    recommendationsText += "Wear snow boots and a heavy coat. ";
  }

  if (humidity > 80) {
    recommendationsText += "The humidity is high. You might feel sticky. ";
  }

  if (uvi > 7) {
    recommendationsText += "The UV index is high. Wear sunscreen and a hat. ";
  }

  // Suggest activities based on weather
  if (condition.includes("clear") || condition.includes("sunny")) {
    recommendationsText += "Perfect day for outdoor activities like hiking or a picnic.";
  } else if (condition.includes("cloudy")) {
    recommendationsText += "Good day for indoor activities or a relaxed walk outside.";
  } else if (condition.includes("rain") || condition.includes("snow")) {
    recommendationsText += "Consider indoor activities like visiting a museum or watching a movie.";
  }

  recommendations.innerHTML = recommendationsText;
}

setInterval(() => {
  time();
}, 1000);

document
  .querySelector(".search-area button")
  .addEventListener("click", function () {
    weatherReport(searchCity.value, languageSelector.value);
  });

searchCity.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    weatherReport(searchCity.value, languageSelector.value);
  }
});

// Added JS Code for toggling between dark and light mode 
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');

  document.querySelector('.container').classList.toggle('dark-mode');
  document.querySelector('.slidebar').classList.toggle('dark-mode');
}

document.addEventListener('DOMContentLoaded', function () {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeText = document.getElementById('darkModeText');

  darkModeToggle.addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      darkModeText.textContent = 'Light Mode';
    } else {
      darkModeText.textContent = 'Dark Mode';
    }
  });

  if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
    darkModeText.textContent = 'Light Mode';
  }
});

// Saving to local storage
document.addEventListener('DOMContentLoaded', function () {
  const darkModeToggle = document.getElementById('darkModeToggle');

  darkModeToggle.addEventListener('change', function () {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('dark-mode', null);
    }
  });
});

// By default city
weatherReport("New Delhi", languageSelector.value);

// Re-fetch weather data when language changes
languageSelector.addEventListener('change', function () {
  weatherReport(searchCity.value || "New Delhi", languageSelector.value);
});

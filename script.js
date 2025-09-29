const searchInput = document.querySelector("#search");
const suggestions = document.querySelector("#suggestions");
const weatherIcon = document.querySelector(".weather-icon");
const weatherEl = document.querySelector(".weather");

let debounceTimeout;

// helper za animirani update teksta
function animateText(el, newValue) {
  if (!el) return;
  el.classList.add("update");
  setTimeout(() => {
    el.innerHTML = newValue;
    el.classList.remove("update");
  }, 150);
}

// AUTOCOMPLETE (prijedlozi)
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  const query = searchInput.value.trim();

  if (!query) {
    suggestions.innerHTML = "";
    return;
  }

  debounceTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`http://localhost:3000/geocode?q=${query}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        suggestions.innerHTML = data
          .map(
            (city) => `
              <li data-lat="${city.lat}" data-lon="${city.lon}">
                ${city.name}, ${city.country}
              </li>`
          )
          .join("");
      } else {
        console.error("❌ Geocode API nije vratio array:", data);
        suggestions.innerHTML = "";
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju prijedloga:", error);
    }
  }, 300);
});

// klik na prijedlog
suggestions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const cityName = e.target.textContent;
    const lat = e.target.getAttribute("data-lat");
    const lon = e.target.getAttribute("data-lon");

    searchInput.value = cityName;
    suggestions.innerHTML = "";

    checkWeatherByCoords(lat, lon);
  }
});

// GLAVNA FUNKCIJA: vrijeme po imenu grada
async function checkWeather(city) {
  try {
    const response = await fetch(
      `http://localhost:3000/weather?city=${city}`
    );
    const data = await response.json();

    if (data.cod === "404") {
      document.querySelector(".error").style.display = "block";
      return;
    }

    // lokalno vrijeme
    const localDate = new Date((data.dt + data.timezone) * 1000);
    const hours = localDate.getUTCHours().toString().padStart(2, "0");
    const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");

    // animirani upisi
    animateText(document.querySelector(".city"), `${data.name}, ${data.sys.country}`);
    animateText(document.querySelector(".local-time"), `${hours}:${minutes}`);
    animateText(document.querySelector(".temp"), Math.round(data.main.temp) + " °C");
    animateText(document.querySelector(".humidity"), data.main.humidity + " %");
    animateText(document.querySelector(".wind"), Math.round(data.wind.speed) + " km/h");

    // ikona
    const icons = {
      Clouds: "images/clouds.png",
      Clear: "images/clear.png",
      Rain: "images/rain.png",
      Drizzle: "images/drizzle.png",
      Mist: "images/mist.png",
      Snow: "images/snow.png",
    };
    weatherIcon.src = icons[data.weather[0].main] || "images/default.png";

    // pozadinski gradijent
    const gradient = getGradient(data.weather[0].main, data.dt, data.timezone);
    document.querySelector(".card").style.background = gradient;

    document.querySelector(".error").style.display = "none";
    weatherEl.classList.add("show");
  } catch (error) {
    console.log("Greška pri dohvatu podataka: ", error);
  }
}

// FUNKCIJA: vrijeme po koordinatama
async function checkWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `http://localhost:3000/weatherByCoords?lat=${lat}&lon=${lon}`
    );
    const data = await response.json();

    if (data.cod === "404") {
      document.querySelector(".error").style.display = "block";
      return;
    }

    // lokalno vrijeme
    const localDate = new Date((data.dt + data.timezone) * 1000);
    const hours = localDate.getUTCHours().toString().padStart(2, "0");
    const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");

    // animirani upisi
    animateText(document.querySelector(".city"), `${data.name}, ${data.sys.country}`);
    animateText(document.querySelector(".local-time"), `Local time: ${hours}:${minutes}`);
    animateText(document.querySelector(".temp"), Math.round(data.main.temp) + " °C");
    animateText(document.querySelector(".humidity"), data.main.humidity + " %");
    animateText(document.querySelector(".wind"), Math.round(data.wind.speed) + " km/h");

    // ikona
    const icons = {
      Clouds: "images/clouds.png",
      Clear: "images/clear.png",
      Rain: "images/rain.png",
      Drizzle: "images/drizzle.png",
      Mist: "images/mist.png",
      Snow: "images/snow.png",
    };
    weatherIcon.src = icons[data.weather[0].main] || "images/default.png";

    // pozadinski gradijent
    const gradient = getGradient(data.weather[0].main, data.dt, data.timezone);
    document.querySelector(".card").style.background = gradient;

    document.querySelector(".error").style.display = "none";
    weatherEl.classList.add("show");
  } catch (error) {
    console.log("Greška pri dohvatu podataka: ", error);
  }
}

// helper za gradijent
function getGradient(weather, dt, timezone) {
  const localDate = new Date((dt + timezone) * 1000);
  const hours = localDate.getUTCHours();

  let period;
  if (hours >= 5 && hours < 12) {
    period = "morning";
  } else if (hours >= 12 && hours < 18) {
    period = "day";
  } else if (hours >= 18 && hours < 22) {
    period = "evening";
  } else {
    period = "night";
  }

  switch (weather.toLowerCase()) {
    case "clear":
      if (period === "morning") return "linear-gradient(to top, #fceabb, #f8b500)";
      if (period === "day") return "linear-gradient(to top, #2980b9, #6dd5fa, #ffffff)";
      if (period === "evening") return "linear-gradient(to top, #e96443, #904e95)";
      return "linear-gradient(to top, #141e30, #243b55)";
    case "clouds":
      if (period === "morning") return "linear-gradient(to top, #bdc3c7, #2c3e50)";
      if (period === "day") return "linear-gradient(to top, #757f9a, #d7dde8)";
      if (period === "evening") return "linear-gradient(to top, #485563, #29323c)";
      return "linear-gradient(to top, #232526, #414345)";
    case "rain":
    case "drizzle":
      return "linear-gradient(to top, #2c3e50, #3498db)";
    case "thunderstorm":
      return "linear-gradient(to top, #373b44, #4286f4)";
    case "snow":
      return "linear-gradient(to top, #83a4d4, #b6fbff)";
    default:
      return "linear-gradient(to top, #bdc3c7, #2c3e50)";
  }
}

// event listeneri
document.querySelector(".search button").addEventListener("click", () => {
  checkWeather(searchInput.value);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchInput.value);
  }
});

// default prikaz na otvaranju
checkWeather("Busovača");

const apiUrl = "http://localhost:3000/weather"

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// helper za gradijente ovisno o vremenu i dobu dana
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

async function checkWeather(city) {
  try {
    const response = await fetch(`${apiUrl}?city=${city}`);
    const data = await response.json();

    if (data.cod === "404") {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
      return;
    }

    // 🔹 Ispis podataka
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + " °C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";

    const icons = {
      Clouds: "images/clouds.png",
      Clear: "images/clear.png",
      Rain: "images/rain.png",
      Drizzle: "images/drizzle.png",
      Mist: "images/mist.png",
      Snow: "images/snow.png"
    };

    weatherIcon.src = icons[data.weather[0].main] || "images/default.png";

    // 🔹 Promjena pozadine
    const gradient = getGradient(data.weather[0].main, data.dt, data.timezone);
    document.querySelector(".card").style.background = gradient;

    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather").style.display = "block";

  } catch (error) {
    console.log("Greška pri dohvatu podataka: ", error);
  }
}

document.querySelector(".error").style.display = "none";

// Sakrij error kad kreneš tipkat
searchBox.addEventListener("input", () => {
  document.querySelector(".error").style.display = "none";
});

// Klik na search dugme
searchBtn.addEventListener("click", () => {
  document.querySelector(".error").style.display = "none";
  checkWeather(searchBox.value);
});

// Enter za pretragu
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.querySelector(".error").style.display = "none";
    checkWeather(searchBox.value);
  }
});

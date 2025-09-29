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

function getLocalTime(dt, timezone) {
  // dt je UTC timestamp
  const utcDate = new Date(dt * 1000);

  // dodaj offset samo jednom
  const localDate = new Date(utcDate.getTime() + timezone * 1000);

  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");

  return { hours, minutes };
}



let vantaEffect = null;



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

const canvas = document.getElementById("weather-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let particles = [];

function setCloudsEffect() {
  const cloudsContainer = document.getElementById("clouds");
  cloudsContainer.innerHTML = ""; // očisti stare oblake

  const cloudCount = 8; // broj oblaka
  const centerX = 50; // postotak (sredina kartice)
  const centerY = 50;
  const radius = 30; // radijus kruga u %

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";

    // kut u krugu (jednako raspoređeni)
    const angle = (i / cloudCount) * 2 * Math.PI;

    // pozicija oblaka pomoću sin/cos
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    cloud.style.top = y + "%";
    cloud.style.left = x + "%";

    // varijacija u veličini
    const scale = 0.7 + Math.random() * 1.2;
    cloud.style.transform = `scale(${scale})`;

    // različita brzina animacije
    cloud.style.animationDuration = 15 + Math.random() * 15 + "s";

    cloudsContainer.appendChild(cloud);
  }
}


function setFogEffect() {
  const fogContainer = document.getElementById("fog");
  fogContainer.innerHTML = ""; // očisti staro

  for (let i = 0; i < 3; i++) {
    const fog = document.createElement("div");
    fog.className = "fog-layer";
    fog.style.animationDuration = 40 + i * 20 + "s"; // različite brzine
    fogContainer.appendChild(fog);
  }
}


let rainDrops = [];

function setRainEffect() {
  const canvas = document.getElementById("weather-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  rainDrops = [];
  for (let i = 0; i < 100; i++) {
    rainDrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 4 + 4
    });
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(174,194,224,0.6)";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < rainDrops.length; i++) {
      let d = rainDrops[i];
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.length);
      ctx.stroke();

      d.y += d.speed;
      if (d.y > canvas.height) {
        d.y = -d.length;
        d.x = Math.random() * canvas.width;
      }
    }

    requestAnimationFrame(drawRain);
  }

  drawRain();
}


let snowFlakes = [];

function setSnowEffect() {
  const canvas = document.getElementById("weather-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  snowFlakes = [];
  for (let i = 0; i < 80; i++) {
    snowFlakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 2,
      speed: Math.random() * 1 + 0.5,
      drift: Math.random() * 2 - 1 // horizontalno ljuljanje
    });
  }

  function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.9)";

    for (let i = 0; i < snowFlakes.length; i++) {
      let f = snowFlakes[i];
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();

      f.y += f.speed;
      f.x += f.drift * 0.3; // lagano ljuljanje

      if (f.y > canvas.height) {
        f.y = -f.radius;
        f.x = Math.random() * canvas.width;
      }
      if (f.x > canvas.width) f.x = 0;
      if (f.x < 0) f.x = canvas.width;
    }

    requestAnimationFrame(drawSnow);
  }

  drawSnow();
}

let stars = [];

function setStarsEffect() {
  const canvas = document.getElementById("weather-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      opacity: Math.random(),
      flickerSpeed: Math.random() * 0.02 + 0.005
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
      let s = stars[i];
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
      ctx.fill();

      // animacija treperenja
      s.opacity += s.flickerSpeed;
      if (s.opacity > 1 || s.opacity < 0) {
        s.flickerSpeed *= -1;
      }
    }

    requestAnimationFrame(drawStars);
  }

  drawStars();
}


function setWeatherEffectCanvas(condition, period) {
  particles = []; // reset
  rainDrops = [];
  snowFlakes = [];
  stars = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (condition.toLowerCase() === "rain") {
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 4 + 2
      });
    }
  }

  if (condition.toLowerCase() === "clouds") {
    setCloudsEffect();
  } else {
    document.getElementById("clouds").innerHTML = ""; // očisti oblake ako nije oblačno
  }

  if (condition.toLowerCase() === "mist" || condition.toLowerCase() === "fog") {
    setFogEffect();
  } else {
    document.getElementById("fog").innerHTML = "";
  }

  if (condition.toLowerCase() === "rain" || condition.toLowerCase() === "drizzle") {
    setRainEffect();
  } else {
    const ctx = document.getElementById("weather-canvas").getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (condition.toLowerCase() === "snow") {
    setSnowEffect();
  }

  if (condition.toLowerCase() === "clear" && period === "night") {
    setStarsEffect();
  }




  if (condition.toLowerCase() === "snow") {
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        speed: Math.random() * 1 + 0.5
      });
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    if (p.length) {
      // rain
      ctx.beginPath();
      ctx.strokeStyle = "rgba(174,194,224,0.8)";
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.length);
      ctx.stroke();

      p.y += p.speed;
      if (p.y > canvas.height) {
        p.y = -p.length;
        p.x = Math.random() * canvas.width;
      }
    } else {
      // snow
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      p.y += p.speed;
      if (p.y > canvas.height) {
        p.y = -p.radius;
        p.x = Math.random() * canvas.width;
      }
    }
  });

  requestAnimationFrame(animateCanvas);
}

animateCanvas();


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
    const { hours, minutes } = getLocalTime(data.dt, data.timezone);
    animateText(document.querySelector(".local-time"), `${hours}:${minutes}`);


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

    const { gradient, period } = getGradient(data.weather[0].main, data.dt, data.timezone);
    document.querySelector(".card").style.background = gradient;

    setWeatherEffectCanvas(data.weather[0].main, period);


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

    const { hours, minutes } = getLocalTime(data.dt, data.timezone);
    animateText(document.querySelector(".local-time"), `${hours}:${minutes}`);


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
    const { gradient, period } = getGradient(data.weather[0].main, data.dt, data.timezone);
    document.querySelector(".card").style.background = gradient;

    setWeatherEffectCanvas(data.weather[0].main, period);




    document.querySelector(".error").style.display = "none";
    weatherEl.classList.add("show");
  } catch (error) {
    console.log("Greška pri dohvatu podataka: ", error);
  }
}

// helper za gradijent
function getGradient(weather, dt, timezone) {

  const { hours } = getLocalTime(dt, timezone);



  let period;
  if (hours >= 4 && hours < 6) period = "dawn";
  else if (hours >= 6 && hours < 10) period = "morning";
  else if (hours >= 10 && hours < 14) period = "noon";
  else if (hours >= 14 && hours < 18) period = "afternoon";
  else if (hours >= 18 && hours < 21) period = "dusk";
  else period = "night";


  let gradient;
  switch (weather.toLowerCase()) {
    case "clear":
      if (period === "dawn") gradient = "linear-gradient(to top, #f3904f, #3b4371)";
      if (period === "morning") gradient = "linear-gradient(to top, #fceabb, #f8b500)";
      if (period === "noon") gradient = "linear-gradient(to top, #2980b9, #6dd5fa, #ffffff)";
      if (period === "afternoon") gradient = "linear-gradient(to top, #f12711, #f5af19)";
      if (period === "dusk") gradient = "linear-gradient(to top, #614385, #516395)";
      if (period === "night") gradient = "linear-gradient(to top, #0f2027, #203a43, #2c5364)";
      break;

    case "clouds":
      if (period === "morning") gradient = "linear-gradient(to top, #d7d2cc, #304352)";
      if (period === "noon") gradient = "linear-gradient(to top, #757f9a, #d7dde8)";
      if (period === "afternoon") gradient = "linear-gradient(to top, #485563, #29323c)";
      if (period === "night") gradient = "linear-gradient(to top, #232526, #414345)";
      break;
    case "rain":
    case "drizzle":
      gradient = "linear-gradient(to top, #2c3e50, #3498db)";
      break;
    case "thunderstorm":
      gradient = "linear-gradient(to top, #373b44, #4286f4)";
      break;
    case "snow":
      gradient = "linear-gradient(to top, #83a4d4, #b6fbff)";
      break;
    default:
      gradient = "linear-gradient(to top, #bdc3c7, #2c3e50)";
  }

  return { gradient, period };
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
checkWeather("Osijek");



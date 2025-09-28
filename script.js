
const apiUrl = "http://localhost:3000/weather"

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) { //asinkrona funkcija - radi stvari koje mogu trajati duze, npr cekanje odgovora sa servera - bez blokiranja ostatka programa
  try {
    const response = await fetch(`${apiUrl}?city=${city}`); //u asnyc funkciji se moze koristiti samo kljucna rijec await
    const data = await response.json();

    console.log("DEBUG", data);



    if (data.cod === "404") {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "block";
      return;
    }



    //fetch - ugradjena funkcija koja sluzi za slanje HTTP zahtjeva - GET, POST..., ovdje saljem zahtjev na apiUrl tj OpenWeatherMap API i dodajem API kljuc
    //sto je potrebno da bi API pustio podatke, await - ceka da se fetch izvrsi tj dok server odgovori
    //bez await, response bi bio samo obecanje tj promise, a sa await response sadrzi stvarni odgovor

    //data - unutar varijablr response.json() pretvara odgovor sa servera u JSON objekt, citljiv za JS, i opet await jer traje neko vrijeme

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
    };

    weatherIcon.src = icons[data.weather[0].main] || "images/default.png";

    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather").style.display = "block";

  } catch (error) {
    console.log("Greška pri dohvatu podataka: ", error)
  }
}


document.querySelector(".error").style.display = "none";


// Sakrij error kad kreneš tipkat
searchBox.addEventListener("input", () => {
  document.querySelector(".error").style.display = "none";
});

// Klik na search dugme
searchBtn.addEventListener("click", () => {
  document.querySelector(".error").style.display = "none"; // reset error
  checkWeather(searchBox.value);
});


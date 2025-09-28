import dotenv from "dotenv";
dotenv.config();


const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=busovaca";

async function checkWeather() { //asinkrona funkcija - radi stvari koje mogu trajati duze, npr cekanje odgovora sa servera - bez blokiranja ostatka programa
  const response = await fetch(apiUrl + `&appid=${apiKey}`); //u asnyc funkciji se moze koristiti samo kljucna rijec await
  var data = await response.json(); //fetch - ugradjena funkcija koja sluzi za slanje HTTP zahtjeva - GET, POST..., ovdje saljem zahtjev na apiUrl tj OpenWeatherMap API i dodajem API kljuc
  //sto je potrebno da bi API pustio podatke, await - ceka da se fetch izvrsi tj dok server odgovori
  //bez await, response bi bio samo obecanje tj promise, a sa await response sadrzi stvarni odgovor

  //data - unutar varijablr response.json() pretvara odgovor sa servera u JSON objekt, citljiv za JS, i opet await jer traje neko vrijeme

  console.log(data);
}

checkWeather(); 
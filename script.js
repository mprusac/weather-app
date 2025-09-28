const apiKey = "f7e00450928530080775a463a4dbfd92";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=busovaca";

async function checkWeather() {
  const response = await fetch(apiUrl + `&appid=${apiKey}`);
  var data = await response.json();

  console.log(data);
}

checkWeather(); 
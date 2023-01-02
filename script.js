const ipinfoToken = "56f1f42ff8ba0c";
const openweatherToken = "dbd366fd33ff92b94f9fe098865253c8";

appendWeatherOnPageLoad();
document.querySelector("input").onkeyup = (e) => {
	if (e.key === "Enter") {
		let city = e.target.value;
		getWeatherByCity(city).then(showResult);
	}
};

async function appendWeatherOnPageLoad() {
	let city = "";
	let response = {};
	try {
		city = await getCityByAPI();
		response = await getWeatherByCity(city);
	} catch {
		let position = await getGeoLocation();
		response = await getWeatherByGeoLocation(position);
	}
	showResult(response);
}

async function getCityByAPI() {
	let response = await fetch(`https://ipinfo.io/?token=${ipinfoToken}`);
	let city = (await response.json()).city;
	return city;
}

async function getGeoLocation() {
	let position = await new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition((position) => resolve(position));
	});
	return position.coords;
}

async function getWeatherByCity(city) {
	let url = "https://api.openweathermap.org/data/2.5/weather";
	let response = fetch(`${url}?q=${city}&units=metric&appid=${openweatherToken}`);
	return (await response).json();
}

async function getWeatherByGeoLocation(position) {
	let url = "https://api.openweathermap.org/data/2.5/weather";
	let response = fetch(
		`${url}?lat=${position.latitude}&lon=${position.longitude}&units=metric&appid=${openweatherToken}`
	);
	return (await response).json();
}

async function showResult(response) {
	let iconUrl = `https://openweathermap.org/img/wn/${response.weather[0].icon}@4x.png`;
	document.getElementById("weather-icon").setAttribute("src", iconUrl);
	document.getElementById("location").textContent = `${response.name}, ${response.sys.country}`;
	document.getElementById("temp").textContent = response.main.temp;
	document.getElementById("wind-speed").textContent = response.wind.speed;
	document.getElementById("humidity").textContent = response.main.humidity;
	document.getElementById("weather-description").textContent = response.weather[0].description;
}

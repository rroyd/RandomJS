const [ currLocation, currHumidity, currCloud, currCondition ] = document.querySelectorAll("h2");
const currDeg = document.querySelector("h1");
const [intro, timeEl] = document.querySelectorAll("h3")
const feelsLike = document.querySelector("h5");
const currentIcon = document.querySelector("img");
const metrics = document.querySelector("#metric");
const speedMetric = document.querySelector("#speed");
const [prep_mili, prep_inch, gustSpeed, pressureMilibars, pressureInches, windSpeed, windDegree, windDirection] = document.querySelectorAll(".item h3");
// "2024-09-10 17:51".split(" ")[1].split(":")
//VARIABLES
let lat, long, key = '3fbdc993ccb34433b5173233241009', c,feelsLikeC, f,feelsLikeF, condition, humidity, nextHours, nextDays,
currentLocation, currentForecast;
;
let windKPH, windMPH;
let allLocations = [], allForecasts = [];
let currentHour;
let currentDay;

//GET CURRENT USER COORDINATES
navigator.geolocation.getCurrentPosition(async (pos) => {
    lat = pos.coords.latitude;
    long = pos.coords.longitude;

    await fetchWeatherData();
    console.log(currentLocation,currentForecast)
    updateCurrentState();
})

//FETCH WEATHER DATA
async function fetchWeatherData(cityName) {
    let res,json;
    try {
        if(!cityName) {
            res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${lat},${long}`)
            json = await res.json();
        }
        else {
            res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${cityName}`)
            json = await res.json();
        }
        
        ({location: currentLocation, current: currentForecast} = json);
        allLocations.push(currentLocation);
        allForecasts.push(currentForecast);
        return;
    } catch (e) {
        throw "Error, city not found.";
    }
}

async function fetchDays(cityName) {
    let res,json;
    try {
        if(!cityName) {
            res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${long}`)
            json = await res.json();
        }
        else {
            res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${cityName}&hour=${currentHour}`)
            json = await res.json();
        }
        
        ({location: currentLocation, current: currentForecast} = json);
        return;
    } catch (e) {
        throw "Error, city not found.";
    }
}

//UPDATE CURRENT DISPLAY
function updateCurrentState(metric) {
    let {name: city, region, country} = currentLocation;
    ({lat, long} = currentLocation);
    let {localtime: time} = currentLocation;
    //Extract hour
    let clock = time.split(" ")[1];
    currentHour = clock.split(":")[0];
    
    let {condition: {text: conditionText, icon}} = currentForecast;
    ({temp_c: c, temp_f: f, feelslike_c: feelsLikeC,feelslike_f: feelsLikeF, humidity} = currentForecast);
    ({wind_kph: windKPH, wind_mph: windMPH} = currentForecast);

    let {precip_in, precip_mm, pressure_in, pressure_mb,gust_kph, gust_mph, wind_dir, wind_degree, uv, wind_kph} = currentForecast;

    // prep_mili.textContent = `Milimeters: ${}`

    currLocation.textContent = `${city}, ${region}, ${country}`

    if(currentHour >= 5 && currentHour <= 12) {
        intro.textContent = "Good morning";
    }
    else if (currentHour>12 && currentHour <= 16) {
        intro.textContent = "Good day";
    }
    else if (currentHour > 16 && currentHour <= 20) {
        intro.textContent =  "Good afternoon";
    }
    else intro.textContent = "Good evening";

    prep_inch.textContent = `Inches: ${precip_in}`;
    prep_mili.textContent = `Milibars: ${precip_mm}`;
    pressureInches.textContent = `Inches: ${pressure_in}`;
    pressureMilibars.textContent = `Milibars: ${pressure_mb}`;
    gustSpeed.textContent = `Speed: ${gust_kph} kph`;
    windDegree.textContent = `Degree: ${wind_degree}`;
    windSpeed.textContent = `Speed: ${wind_kph}`;
    windDirection.textContent = `Direction: ${wind_dir}`;

    feelsLike.textContent = (metric === "f") ? `Feels like ${feelsLikeF}°` : `Feels like ${feelsLikeC}°`
    currDeg.textContent = (metric === "f") ? `${f}°` : `${c}°`
    currentIcon.src = icon;
    currHumidity.textContent = `Humidity: ${humidity}%`
    currCondition.textContent = conditionText;
    timeEl.textContent = clock;
}

//SWITCH TO FAHRENHEIT
speedMetric.addEventListener('input', function (e) {
    updateCurrentState(this.value);
})
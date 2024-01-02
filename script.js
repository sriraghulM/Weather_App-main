/*
*author Siva M
*Script for weather app
*leaflet.js for map
*openweathermap.org for free weather api
*/
let lat;
let lon;
let locationName =document.getElementById("locationName");
let setIcon =document.getElementById("icon");
let desc =document.getElementById("discription");
let temperature =document.getElementById("temp");
let minTemp =document.getElementById("minTemp");
let maxTemp =document.getElementById("maxTemp");
let windSpeed =document.getElementById("windSpeed");

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async position => {
        lat =position.coords.latitude;
        lon =position.coords.longitude;
        // console.log(lat , lon)
        let data = await getWeather(lat , lon);

        // console.log(data)
        /*
        * Include the files from leaflet.js for the map
        * marker is the small location icon in the map
        * bindPopup pops up when ever a location is clicked or for the default location
        */
        var map = L.map('map').setView([lat, lon], 5);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        var marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`<b>${data.name} 
        <br>Climate :${data.weather[0].main}
            <br><img src=${setIconFunction(data.weather[0].icon)} width=40px height=40px>
            <br>Temp :${data.main.temp}<sup>oc</sup>
            <br>MinTemp :${data.main.temp_min}<sup>oc</sup>
            <br>MaxTemp :${data.main.temp_max}<sup>oc</sup>
            <br>WindSpeed :${data.wind.speed} km/hr
            </b>`).openPopup();


        map.on('click', async function(e){
            console.log(e.latlng.lat , e.latlng.lng )
            const data = await getWeather(e.latlng.lat ,e.latlng.lng);
            marker.setLatLng([e.latlng.lat ,e.latlng.lng]);
            marker.bindPopup(`<b>${data.name}
            <br>Climate :${data.weather[0].main}
            <br><img src=${setIconFunction(data.weather[0].icon)} width=40px height=40px>
            <br>Temp :${data.main.temp}<sup>oc</sup>
            <br>MinTemp :${data.main.temp_min}<sup>oc</sup>
            <br>MaxTemp :${data.main.temp_max}<sup>oc</sup>
            <br>WindSpeed :${data.wind.speed} km/hr
            </b>`).openPopup();
        });

        return data;
    })
};

/**
 * 
 * @param {*} lat  denotes the Latitude
 * @param {*} lon  denotes Longitude
 * @returns json from opemweather map
 */
async function getWeather(lat,lon)
{
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=04d376f993caa77ed76504b25691b2cc`;
    let response =await fetch(api);
    let data = await response.json();
    dataHandler(data);
    return data;
}

/**
 * function for fetching and displaying data 
 */

function dataHandler(data){
    const{description}=data.weather[0]
    const{name}=data.name
    const{temp,temp_min,temp_max}=data.main
    const{speed}=data.wind
    const{icon}=data.weather[0];

    locationName.innerHTML=data.name
    desc.innerHTML=description
    temperature.innerHTML=temp
    minTemp.innerHTML="Min_Temp:"+temp_min
    maxTemp.innerHTML="Max_Temp:"+temp_max
    windSpeed.innerHTML="windspeed:"+speed
    setIcon.style["background"] = `url(${setIconFunction(icon)})`
}
/**
 * Function to choose icon based on fetched data
 * 
 */

function setIconFunction(icon) {
 
    const icons = {
        "01d": "./animated/day.svg",
        "02d": "./animated/cloudy-day-1.svg",
        "03d": "./animated/cloudy-day-2.svg",
        "04d": "./animated/cloudy-day-3.svg",
        "09d": "./animated/rainy-1.svg",
        "10d": "./animated/rainy-2.svg",
        "11d": "./animated/rainy-3.svg",
        "13d": "./animated/snowy-6.svg",
        "50d": "./animated/mist.svg",
        "01n": "./animated/night.svg",
        "02n": "./animated/cloudy-night-1.svg",
        "03n": "./animated/cloudy-night-2.svg",
        "04n": "./animated/cloudy-night-3.svg",
        "09n": "./animated/rainy-1.svg",
        "10n": "./animated/rainy-2.svg",
        "11n": "./animated/rainy-3.svg",
        "13n": "./animated/snowy-6.svg",
        "50n": "./animated/mist.svg"
    };
 
    return icons[icon];
}

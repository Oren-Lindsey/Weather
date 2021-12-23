function getWeather(units, display) {
  globalThis.u = units;
  globalThis.displayU = display;
  getCurrentLocation();
}
function getCurrentLocation(units) {
  var locationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
}
function locationSuccess(pos) {
  var crd = pos.coords;
  fetchWeather(crd);
}

function locationError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function fetchWeather(crds) {
  var lat = crds.latitude;
  var lon = crds.longitude;
  var acc = crds.accuracy;
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${u}&appid=23d1bf78ef3af08c8f855019c194cc37`)
    .then(response => response.json())
    .then(data => populatePage(data))
}

function populatePage(data) {
  console.log(data);
  console.log('u');
  weatherData = data.weather[0];
  console.log(weatherData)
  hideLoader();
  var temp = Math.round(data.main.temp);
  var feelsLike = Math.round(data.main.feels_like);
  var windSpeed = Math.round(data.wind.speed);
  var windDeg = data.wind.deg;
  var windGusts = Math.round(data.wind.gust);
  if (u == 'imperial') {
    var windU = 'miles/hour';
  } else {
    var windU = 'meters/second'
  }
  var windDir = getWindDir(windDeg);
  addElement('h2', 'weather-conditions-p', 'weather', `${temp}${displayU} ${weatherData.main}`)
  addElement('p', 'weather-feels_like-p', 'weather', `Feels like: ${feelsLike}${displayU}`)
  addElement('p', 'weather-wind-speed-p', 'weather', `Wind speed: ${windSpeed} ${windU}, ${windDeg}° ${windDir}; Gusts up to ${windGusts} ${windU}`)
  var time = timeConverter(data.dt);
  addElement('p', 'time-p', 'weather', `Last updated: ${time}`)
}
//add to "weather" for main weather block or "page" for full page

function addElement(type, name, where, content) {
  console.log(where);
  if (where == "document") {
    var element = document.createElement(type);
    element.id = `${name}-${type}`;
    element.innerHTML = content;
    document.body.appendChild(element);
  } else {
    var addTo = document.getElementById(where);
    var element = document.createElement(type);
    element.id = `${name}-${type}`;
    element.innerHTML = content;
    addTo.appendChild(element);
  }
}
/*type = type of element
name = id of element to add
where = location to append element
content = innerHTML of element
*/

function hideLoader() {
  loader = document.getElementById('loader');
  loader.style.display = 'none'
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function getWindDir(windDeg) {
  if (windDeg < 180) {
    if (windDeg < 90) {
      if (windDeg < 45) {
        var compassWind = 'N';
      } else {
        var compassWind = 'NE';
      }
    } else {
      if (windDeg < 135) {
        var compassWind = 'E';
      } else {
        var compassWind = 'SE';
      }
    }
  } else {
    if (windDeg < 270) {
      if (windDeg < 225) {
        var compassWind = 'S';
      } else {
        var compassWind = 'SW';
      }
    } else {
      if (windDeg < 315) {
        var compassWind = 'W';
      } else {
        var compassWind = 'NW';
      }
    }
  }
  return compassWind;
}

window.onscroll = function() {stickyHeader()};

var header = document.getElementById("myHeader");

var sticky = header.offsetTop;

function stickyHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
/* Todo: 
make sure each item exists before adding it
Give it charts and graphics to visualize temp, wind, cloudiness
*/
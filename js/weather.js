let form = document.querySelector('#weatherForm');
let input = document.querySelector('#city');
let btn = document.querySelector('#getWeather');
let appWrapper = document.querySelector('.appWrapper');
let infoWrapper = document.querySelector('#weather_List');
let bodyClass = document.body.classList;
let temperatureBg = document.querySelector('.infoBox').classList;

// API Key
let apiKey = '';

// Create Event Listener to submit the user input 
form.addEventListener('submit', getWeatherStatus);

// The Listener
function getWeatherStatus(e) {

    e.preventDefault();
    let userInputValue = input.value;
    let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${userInputValue}&units=metric&appid=${apiKey}`;
    let message = document.querySelector(".errMessage");
    message.innerHTML = '';

    //Select weather info wrapper
    let infoWrapperChildern = infoWrapper.children;

    fetch(weatherUrl)
        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                if (userInputValue == '') {
                    throw 'The input can not be empty';
                } else {
                    throw 'Please enter a valid city'
                };
            }
        }).then(data => {
            //Add list elements
            if (!infoWrapper.hasChildNodes()) {
                for (let i = 0; i < 6; i++) {
                    let list = document.createElement('li');
                    infoWrapper.appendChild(list);
                }
            }

            //Add weather icon to the list
            let imgIcon = document.createElement('img');
            infoWrapperChildern[1].appendChild(imgIcon);
            let icon = data.weather[0].icon;
            let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            infoWrapperChildern[1].firstChild.src = iconUrl;

            switch (icon) {
                case '03d':
                case '03n':
                case '04d':
                case '04n':
                    document.body.classList.replace(bodyClass[1], 'cloudy');
                    break;
                case '09d':
                case '09n':
                case '10n':
                case '10d':
                    document.body.classList.replace(bodyClass[1], 'rainy');
                    break;
                case '50d':
                case '50n':
                    document.body.classList.replace(bodyClass[1], 'mist');
                    break;
                case '01d':
                case '01n':
                    document.body.classList.replace(bodyClass[1], 'clear');
                    break;
                case '13d':
                case '13n':
                    document.body.classList.replace(bodyClass[1], 'snow');
                    break;
                case '02d':
                case '02n':
                    document.body.classList.replace(bodyClass[1], 'fewCloud');
                    break;
                case '11d':
                case '11n':
                    document.body.classList.replace(bodyClass[1], 'thunderstorm');
                    break;
                default:
                    document.body.style.background = 'rgb(183, 190, 196)';
            }

            //Add weather temperature to the list
            let temperature = Math.round(data.main.temp);
            infoWrapperChildern[0].innerHTML = `${temperature}° C`;
            if (temperature <= 5) {
                temperatureBg.replace(temperatureBg[2], 'freeze');
            } else if (temperature > 5 && temperature <= 12) {
                temperatureBg.replace(temperatureBg[2], 'cold');
            } else if (temperature > 12 && temperature <= 18) {
                temperatureBg.replace(temperatureBg[2], 'moderate');
            } else if (temperature > 18 && temperature <= 27) {
                temperatureBg.replace(temperatureBg[2], 'hot');
            } else {
                temperatureBg.replace(temperatureBg[2], 'veryHot');
            }


            //Add wind speed and weather humidity to the list
            let humidity = data.main.humidity;
            let windSpeed = data.wind.speed;
            infoWrapperChildern[3].innerText = `Humidity: ${humidity} % \n\n Wind: ${windSpeed} m/s`;

            //Add weather description and the country to the list
            infoWrapperChildern[2].innerText = `${(data.weather[0].description).charAt(0).toUpperCase()+(data.weather[0].description).slice(1)} \n\n ${(data.name).charAt(0).toUpperCase()+(data.name).slice(1)} - ${(data.sys.country).toUpperCase()}`;



            // Formating date and time and adding them to the list 
            let d = new Date(data.dt * 1000 + (data.timezone * 1000));
            let currTime = d.toUTCString();
            let formatedcurrTime = currTime.substring(0, currTime.length - 7);
            infoWrapperChildern[4].innerText = formatedcurrTime;

            // Changing light or dark bg based on day and night time
            let currentHour = d.getUTCHours(formatedcurrTime);
            if (currentHour >= 7 && currentHour < 18) {
                appWrapper.classList.remove('appWrapperNight');
                appWrapper.classList.add('appWrapperDay');
            } else {
                appWrapper.classList.remove('appWrapperDay');
                appWrapper.classList.add('appWrapperNight');
            }


        }).catch(err => {
            message.innerHTML = err;
            infoWrapper.innerHTML = '';
        });

//End
}

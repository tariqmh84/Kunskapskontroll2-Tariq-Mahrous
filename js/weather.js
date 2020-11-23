// define variable of the used Dom Element
let form = document.querySelector('#weatherForm');
let input = document.querySelector('#city');
let btn = document.querySelector('#getWeather');
let appWrapper = document.querySelector('.appWrapper');
let infoWrapper = document.querySelector('#weather_List');
let bodyClass = document.body.classList;
let temperatureBg = document.querySelector('.infoBox').classList;
let message = document.querySelector(".errMessage");

// Add submit Event listener 
form.addEventListener('submit', getWeatherStatus);

// Listener function
function getWeatherStatus(e) {

    e.preventDefault();
    let userInputValue = input.value;
    let apiKey = '1515797dfce7afde18a51bb57569cd2d';
    let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${userInputValue}&units=metric&appid=${apiKey}`;

    //empty the the error message
    message.innerHTML = '';

    //Select weather info wrapper childern elements
    let infoWrapperChildern = infoWrapper.children;


    // fetching the the data from API URL
    fetch(weatherUrl)
        .then(response => {
            // Handling the errors: empty input or unvalid city
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
            //Add list elements to the Dom to put the fetched data in
            if (!infoWrapper.hasChildNodes()) {
                for (let i = 0; i < 6; i++) {
                    let list = document.createElement('li');
                    infoWrapper.appendChild(list);
                }
            }

            //Get weather status icon and add it to the list
            let imgIcon = document.createElement('img');
            infoWrapperChildern[1].appendChild(imgIcon);
            let icon = data.weather[0].icon;
            let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            infoWrapperChildern[1].firstChild.src = iconUrl;

            // Change the background according to the wrather status by changing the class attribute
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

            //Get weather temperature and add it to the list
            let temperature = Math.round(data.main.temp);
            infoWrapperChildern[0].innerHTML = `${temperature}° C`;

            // change the background of the result info according to the temperature: higher temperature => more red color, less blue
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


            //Get wind speed and weather humidity and add them to the list
            let humidity = data.main.humidity;
            let windSpeed = data.wind.speed;
            infoWrapperChildern[3].innerText = `Humidity: ${humidity} % \n\n Wind: ${windSpeed} m/s`;

            //Get weather description and the country and add them to the list
            infoWrapperChildern[2].innerText = `${(data.weather[0].description).charAt(0).toUpperCase()+(data.weather[0].description).slice(1)} \n\n ${(data.name).charAt(0).toUpperCase()+(data.name).slice(1)} - ${(data.sys.country).toUpperCase()}`;

            //Catching errors and printed to the user 
        }).catch(err => {
            message.innerHTML = err;
            infoWrapper.innerHTML = '';
        });


}
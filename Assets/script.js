var formEl = document.querySelector('.locationInputForm')
var inputEl = document.getElementById('inputBlock')
var buttonListEl = document.querySelector('.historyCityList')
var cityBtnEl = document.getElementById('cityBtn')
var currentWeatherEl = document.querySelector('.currentWeather')
var forecastListEl = document.querySelector('.forecastData')

localStorage.setItem('locationArray', JSON.stringify([]))
var updatedLocationArray = JSON.parse(localStorage.getItem('locationArray'))
var locationDisplay = updatedLocationArray[updatedLocationArray.length - 1]||'Chicago'

const btnAmount = 7
const apiKey = 'ed8cabd609d17e042c27c27da1308d59'
var coordUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationDisplay}&appid=${apiKey}`
const today = moment().format("Do MMM YYYY")

function submitNewLoc(event){
    event.preventDefault();
    
    var newLocation = inputEl.value.trim();

    if (newLocation){
        // update current location list
        updateStorage(newLocation)

        // render cities in the list
        renderCityButton()

        // render the data
        render()

        // reset my input area
        inputEl.value = ''
    }
    else{
        window.alert('Please insert a location');
    }

}

function renderCityButton () {
    
    // reset the button list
    buttonListEl.innerHTML = ''

    // get the location array from local storage
    var arrayToRender = JSON.parse(localStorage.getItem('locationArray'))

    // only take first 7 items
    if (arrayToRender.length >= btnAmount){
        arrayToRender.reverse().splice(btnAmount, (arrayToRender.length-7+1))
    }

    arrayToRender.forEach(singleCity => {
        // make single button
        var thisCityBtn = document.createElement('button');
        thisCityBtn.innerHTML = singleCity
        thisCityBtn.setAttribute('id','cityBtn');
        thisCityBtn.setAttribute('data-location',singleCity);
        thisCityBtn.addEventListener('click', updateLocationDisplay);
        buttonListEl.appendChild(thisCityBtn)
    });
}

function updateStorage(newLocation){
    // this newLocation is in the storage
    newInArrayId = updatedLocationArray.indexOf(newLocation)

    // history already contains this new input
    if (newInArrayId === -1) {
        updatedLocationArray.push(newLocation)
    }
    else{
        updatedLocationArray.splice(newInArrayId,1)
        updatedLocationArray.push(newLocation)
    }

    localStorage.setItem('locationArray', JSON.stringify(updatedLocationArray))
}

function updateLocationDisplay (event){

    event.preventDefault()
    locationDisplay = event.target.getAttribute('data-location')
}

async function getCoord(){

    var coord

    var temp = await fetch(coordUrl)

        .then(function (fetchedResponse){
            return fetchedResponse.json()
        })

        .then(function(data){
            coord = [data.coord.lat,data.coord.lon]
        })

        .catch(function(error){
            alert('Location error')
        })

    return coord
}

async function getWeather(coord){

    var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord[0]}&lon=${coord[1]}&exclude=minutely,hourly&appid=${apiKey}`
    var returnData

    var weather = await fetch(oneCallUrl)

        .then(function (fetchedResponse){
            return fetchedResponse.json()
        })

        .then(function(data){
            returnData = [data.current, ... data.daily].slice(0,6)
        })

        .catch(function(error){
            alert('Weather data error')
        })
    

    return returnData

}

function renderPage(weather){

    currentWeatherEl.innerHTML =''
    forecastListEl.innerHTML =''

    weather.forEach(function (singleDay,id){

        var uviColor
        var todayUVI = singleDay.uvi
        switch (uviColor){
            case (todayUVI<=2):
                uviColor = 'green'
                break
            case (todayUVI<=5):
                uviColor = 'yellow'
                break
            case (todayUVI<=7):
                uviColor = 'amber'
                break
            case (todayUVI<=10):
                uviColor = 'red'
                break
            case (todayUVI>10):
                uviColor = 'purple'
                break
        }

        if (id === 0){
            // current day
            currentWeatherEl.innerHTML = `
            <p class = 'todayTitle'> ${locationDisplay} ${today} ${singleDay.weather[0].icon}</p>
            <p class = 'todayTemp'>Temperature: ${singleDay.temp} F</p>
            <p class = 'todayWind'>Wind Speed: ${singleDay.wind_speed} MPH</p>
            <p class = 'todayHumi'>Humidity: ${singleDay.humidity} %</p>
            <div class = 'todayUV ${uviColor}'>UV Index: 
                <p class = 'todayUV'>${singleDay.uvi}</p>
            </div>
            `
        }
        else{
            var thisDate = moment().add(id, 'days').format("Do MMM YYYY")
            var listItem = document.createElement('li')
            listItem.innerHTML = `
            <p class = 'forcastText bolder'> ${thisDate} ${singleDay.weather[0].icon}</p>
            <p class = 'forcastText'>${singleDay.weather[0].icon}</p>
            <p class = 'forcastText'>Temp: ${singleDay.temp} F</p>
            <p class = 'forcastText'>Wind: ${singleDay.wind_speed} MPH</p>
            <p class = 'forcastText'>Humidity: ${singleDay.humidity} %</p>
            `
            listItem.setAttribute('class','forcast')
            forecastListEl.appendChild(listItem)
        }
    })
}

async function render(){
    
    var coord = await getCoord()
    var weather = await getWeather(coord)
    renderPage(weather)
}

formEl.addEventListener('submit', submitNewLoc);
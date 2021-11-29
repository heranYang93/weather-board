// DOM elements
var formEl = document.querySelector('.locationInputForm') // form and its input
var inputEl = document.getElementById('inputBlock') // form and its input
var buttonListEl = document.querySelector('.historyCityList') // list to append history button
var currentWeatherEl = document.querySelector('.currentWeather') // current weather section
var forecastListEl = document.querySelector('.forecastData') // weather forecast section

//data
localStorage.setItem('locationArray', JSON.stringify([])) //Initiate the storage with a blank list of city history

//functional input
var locationHistory = JSON.parse(localStorage.getItem('locationArray')) //What is in the history list?
var locationDisplay = 'Chicago' //Use Chicago as a default city
const btnAmount = 7 //only display 7 items in the search history
const apiKey = 'ed8cabd609d17e042c27c27da1308d59' //API key for open weather map
var coordUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationDisplay}&appid=${apiKey}` //URL to fetch the coordinate of a city
const today = moment().format("Do MMM YYYY") //today's date

//functions 
function submitNewLoc(event){
    //When the button is pressed to submit!
    event.preventDefault();//prevent default
    
    var newLocation = inputEl.value.trim();//fix the input (currently only taking single-word cities)

    if ((newLocation)&&(newLocation!== locationDisplay)){ //When an input is given and is different from the city that is currently showing
        
        // update the location to display
        locationDisplay = newLocation

        // put this city into the location history list
        updateStorage(newLocation)

        // make history buttons
        renderCityButton()

        // render the data
        render()

        // reset my input area
        inputEl.value = ''
    }
    else{
        window.alert('Please insert a new location');
    }

}

function renderCityButton () {
    
    // reset the button list
    buttonListEl.innerHTML = ''

    // get the location array from local storage
    var arrayToRender = JSON.parse(localStorage.getItem('locationArray'))

    // only take first 7 histories
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
    newInArrayId = locationHistory.indexOf(newLocation)

    // history already contains this new input
    if (newInArrayId === -1) {
        locationHistory.push(newLocation)
    }
    else{
        locationHistory.splice(newInArrayId,1)
        locationHistory.push(newLocation)
    }

    localStorage.setItem('locationArray', JSON.stringify(locationHistory))
}

function updateLocationDisplay (event){

    event.preventDefault()
    locationDisplay = event.target.getAttribute('data-location')
    render()
}

async function getCoord(_coordUrl){

    var coord

    var temp = await fetch(_coordUrl)

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

async function getWeather(_coord){

    var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${_coord[0]}&lon=${_coord[1]}&exclude=minutely,hourly&appid=${apiKey}`
    var returnWeatherData

    var weather = await fetch(oneCallUrl)

        .then(function (fetchedResponse){
            return fetchedResponse.json()
        })

        .then(function(data){
            returnWeatherData = [data.current, data.daily.slice(0,5)]
        })

        .catch(function(error){
            alert('Weather data error')
        })
    
    return returnWeatherData
}

function renderPage(_weather){

    currentWeatherEl.innerHTML =''
    forecastListEl.innerHTML =''

    console.log(_weather)

    curWeather = _weather[0]
    // current day
    var uviColor
    var todayUVI = curWeather.uvi
    iconData = curWeather.weather[0].icon
    iconURL = `http://openweathermap.org/img/wn/${iconData}@2x.png`

    if (todayUVI <= 2){
        uviColor = 'green'
    }
    else if (todayUVI <= 5){
        uviColor = 'yellow'
    }
    else if (todayUVI <= 7){
        uviColor = 'amber'
    }
    else if (todayUVI <= 10){
        uviColor = 'red'
    }
    else {
        uviColor = 'purple'
    }

    currentWeatherEl.innerHTML = `
        <p class = 'today taller bolder'> ${locationDisplay} ${today}<img src = ${iconURL}> </p>
        <p class = 'today'>Temperature: ${curWeather.temp} F</p>
        <p class = 'today'>Wind Speed: ${curWeather.wind_speed} MPH</p>
        <p class = 'today'>Humidity: ${curWeather.humidity} %</p>
        <p class = 'today'>UV Index:<span id='uvBlock'> ${todayUVI} </span></p>
    `
    document.getElementById('uvBlock').style.backgroundColor = uviColor

    _weather[1].forEach(function (singleDay,id){
        var thisDate = moment().add(id, 'days').format("Do MMM YYYY")
        var listItem = document.createElement('li')
        listItem.innerHTML = `
            <p class = 'forcastText bolder'> ${thisDate} <img src = ${iconURL}></p>
            <p class = 'forcastText'>Temp: ${singleDay.temp.day} F</p>
            <p class = 'forcastText'>Wind: ${singleDay.wind_speed} MPH</p>
            <p class = 'forcastText'>Humidity: ${singleDay.humidity} %</p>
            `
        listItem.setAttribute('class','forcast')
        forecastListEl.appendChild(listItem)
    })
}

async function render(){
    
    var coordUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationDisplay}&appid=${apiKey}` //URL to fetch the coordinate of a city
    var currentCoord = await getCoord(coordUrl)
    var currentWeather = await getWeather(currentCoord)
    renderPage(currentWeather)
}

// main program
render()
formEl.addEventListener('submit', submitNewLoc);
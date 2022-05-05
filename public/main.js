// Foursquare API Info
const foursquareKey = 'insert Key here';
const url = 'https://api.foursquare.com/v3/places/search?near=';

// OpenWeather Info
const openWeatherKey = 'insert Key here';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
//The OpenWeather API endpoint can take input of the form: city, state, like Baltimore, Maryland.

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $placeDivs = [$("#place1"), $("#place2"), $("#place3"), $("#place4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//This object provides additional information to the Foursquare API about the request being made.
const options = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        Authorization: foursquareKey
    }
};

// AJAX functions:
//Get Data from Foursquare
const getPlaces = async () => {
    const city = $input.val();
    const urlToFetch = `${url}${city}&limit=10`;
    try {
        const response = await fetch(urlToFetch, options);
        if(response.ok) {
            const jsonResponse = await response.json(); 
            const places = jsonResponse.results;
            return places;
        }
    } catch (error) {
        console.log(error);
    }
};


//Get Data from OpenWeather
const getForecast = async () => {
    const urlToFetch = `${weatherUrl}?q=${$input.val()}&APPID=${openWeatherKey}`;
    try {
        const response = await fetch(urlToFetch); 
        if(response.ok) {
            const jsonResponse = await response.json();//To get the requested data, convert the response object to a JSON object. await the resolution of this method 
            return jsonResponse;
        }
    } catch(error) {
        console.log(error);
    }
};


// Render functions

//Will render the information returned in the response from the Foursquare API to $placeDivs
const renderPlaces = (places) => {
    $placeDivs.forEach(($place, index) => {
        const place = places[index];
        const placeIcon = place.categories[0].icon; 
        const placeImgSrc = `${placeIcon.prefix}bg_64${placeIcon.suffix}`;
        const placeContent = createPlaceHTML(place.name, place.location, placeImgSrc);
        $place.append(placeContent);
    });
    $destination.append(`<h2>${places[0].location.locality}</h2>`);
};


//Will render the information returned from the OpenWeather API to $weatherDiv
const renderForecast = (forecast) => {
  const weatherContent = createWeatherHTML(forecast);
  $weatherDiv.append(weatherContent);
};

const executeSearch = () => {
  $placeDivs.forEach(place => place.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getPlaces().then(places => renderPlaces(places)); 
  getForecast().then(forecast => renderForecast(forecast)); 
  return false;
}

$submit.click(executeSearch);

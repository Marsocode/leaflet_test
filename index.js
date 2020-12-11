
const mapOptions = {
    center: [43.706, -37.7051],
    zoom: 3,
    layers: [
        new  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        })
    ]
}
const myMap = L.map('mapid', mapOptions);


// const iconOptions = {
//     iconUrl: 'logo.png',
//     iconSize: [30, 30]
//  }

const markerOptions = {
    title: "MyLocation",
    clickable: true,
    // draggable: true,
    // icon: customIcon
}

const urls = [
  'https://corona.lmao.ninja/v2/all',
  'https://corona.lmao.ninja/v2/countries',
];

Promise.all(urls.map(url => 
  fetch(url)
    .then(checkResponse)
    .then(parseJSON)
    .catch((err) => {
      console.log('OOps', err.stack);
    })
  ))
  .then(data => {
    const globalData = data[0];
    const countryData = data[1];
    console.log(globalData, countryData);

    countryData.map(country => {
      const {lat: lat, long: long} = country.countryInfo;

      // const marker = L.marker([lat, long], markerOptions).addTo(myMap);

      // cases = for all monitor time
      const circle = L.circle([lat, long], {
        color: 'red',
        fillColor: '#990000',
        fillOpacity: 0.8,
        radius: country.cases / 100,
      }).addTo(myMap);

      const today = (new Date()).toUTCString();
      const covidInfo = `<b>${today}</b><br><b>Country: ${country.country}</b><br><b>Cases: ${country.cases}</b><br><b>Deaths: ${country.deaths}</и><br><b>Today cases: ${country.todayCases}</b><br><b>Today Deaths: ${country.todayDeaths}</b>`;
      circle.on('click', () => {
        markerClick(circle, covidInfo)
      });
    });

  })


function parseJSON(response) {
  return response.json();
}


function checkResponse(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}


function markerClick(obj, info) {
  obj.bindPopup(info).openPopup();
}


// const popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent(`${e.latlng}`)
//         .openOn(myMap);

//     console.log("You clicked the map at " + e.latlng);
// }

// myMap.on('click', onMapClick);
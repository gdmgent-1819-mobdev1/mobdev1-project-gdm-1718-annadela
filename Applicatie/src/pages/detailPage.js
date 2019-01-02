// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/detailPage.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  let keyvalue = sessionStorage.getItem('key');

  // OPSLAAN CLASS
  function showAccount(post) {
    let postvalue = post.key;
    if ((postvalue == keyvalue) == true) {
      let postAccount = post.val();
      let kot = document.getElementById('kotgeg');
      kot.innerHTML = `<h1>${postAccount.type}</h1><p>huurprijs: ${postAccount.huurprijs}</p><p>Waarborg: ${postAccount.waarborg}</p><p>Op verdiep: ${postAccount.verdieping} van de ${postAccount.van}</p><p>ruimte: ${postAccount.oppervlakte}m²</p><p>aantal personen in 1 kamer: ${postAccount.aantalP}</p><ul><li>Douche: ${postAccount.douche}</li><li>Bad: ${postAccount.bad}</li><li>Toillet: ${postAccount.toillet}</li><li>Keuken: ${postAccount.keuken}</li></ul><p>bemeubeld: ${postAccount.bemeubeld}</p><p>omschrijving: ${postAccount.omschrijving}</p><div><h3>Adres</h3><p>${postAccount.straat} ${postAccount.huisnr}</br>${postAccount.gemeente}</p></div> <p>Opmerkingen: ${postAccount.opmerkingen}</p><div><h3>Kotbaas</h3><p>${postAccount.kotbaasNaam} ${postAccount.kotbaasVoornaam}</p><p>${postAccount.kotbaasEmail}</p></div>`;    

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${postAccount.gemeente}%20${postAccount.nr}%20${postAccount.straat}.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1545662179740&autocomplete=true.json`)
        .then((response) => {
          return response.json();
        }).then((myJson) => {
          let data = myJson;
          let long = data.features[0].geometry.coordinates[0];
          let lat = data.features[0].geometry.coordinates[1];

          mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uYWRlbGFuZ2hlIiwiYSI6ImNqbjdpb2F1MzBnMGQzdm1za3FwNDh6YW4ifQ.Ner4lSL8BC_Iy8rTdQOznw';
          let map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/outdoors-v10', // stylesheet location
            center: [long, lat], // starting position [lng, lat]
            zoom: 17, // starting zoom
          });
          map.on('load', (e) => {
            map.addLayer({
              'id': 'radius',
              'type': 'circle',
              'source': {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [long, lat],
                  },
                },
              },
              'paint': {
                'circle-radius': 50,
                'circle-color': 'red',
                'circle-opacity': 0.5,
              },
            });
          });
        });
    };
  };

  // DATA OPHALEN
  function getAccount() {
    let dataPerson = firebase.database().ref(`koten`);
    dataPerson.on('value', (snapshot) => {
      snapshot.forEach((post) => {
        showAccount(post);
      });
    });
  }

  // FUNCTIE OPROEPEN
  getAccount();
};

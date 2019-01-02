// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/kaart.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uYWRlbGFuZ2hlIiwiYSI6ImNqbjdpbGc4OTE3ZGwzd29jYmVtMG1henYifQ.UrSPHqrjlXKwTP2JjZwS7g';
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v9',
    center: [3.717424299999948, 51.0543422],
    zoom: 9,
  });
  function showAccount(post) {
    let postvalue = post.key;
    let postAccount = post.val();
    map.on("load", () => {
      map.addSource(`${post.key}`, {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [postAccount.longitude, postAccount.latitude]
              }
            }]
        }
      });
      map.addLayer({
        "id": `${post.key}` ,
        "type": "circle",
        "source": `${post.key}`,
        "paint": {
            "circle-radius": 6,
            "circle-color": "#B42222"
        },
        "filter": ["==", "$type", "Point"],
        });
    });
  }
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

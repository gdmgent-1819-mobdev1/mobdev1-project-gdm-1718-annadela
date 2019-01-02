// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/favo.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  let keyPerson = localStorage.getItem('key');

  function getFavo(post) {
    let favokot = firebase.database().ref(`favoriet/${keyPerson}`);
    favokot.on('value', (snapshot) => {
      snapshot.forEach((data) => {
        let cardKot = post.val();
        if (data.key == post.key) {
          document.getElementById('favo').innerHTML += `<div class="unordedlist"><h1>${cardKot.type}</h1><p id="prijs">huurprijs ${cardKot.huurprijs}euro</p><br><p id="prijs">oppervlakte ${cardKot.opervlakte}m²</p><br><p id="prijs">toillet: ${cardKot.toillet}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">bad: ${cardKot.bad}</p><br><p id="prijs">keuken: ${cardKot.keuken}</p><br><p id="prijs">Adress: ${cardKot.straat} ${cardKot.huisnr} ${cardKot.gemeente}</p><button class="littlebtn top" id="${post.key}">Verwijder uit favorieten</button>`;
          document.getElementById('favo').addEventListener('click', (e) => {
            if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'Verwijder uit favorieten') {
              firebase.database().ref(`favoriet/${keyPerson}/${e.target.innerHTML}`).remove();
              window.location.reload();
              favokot.child(e.target.id).remove();
            }
          });
        }
      });
    });
  }
  function getAccount() {
    let dataPerson = firebase.database().ref('koten');
    dataPerson.on('value', (snapshot) => {
      snapshot.forEach((post) => {
        getFavo(post);
      });
    });
  }
  
  // FUNCTIE OPROEPEN
  getAccount();
};

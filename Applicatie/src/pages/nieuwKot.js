// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/nieuwKot.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  let getId = (getId) => {
    let waarde = document.getElementById(getId).value;
    return waarde;
  }

  if (sessionStorage.getItem('edit')) {
    let data = firebase.database().ref(`koten`);
    data.on('value', (snapshot) => {
      snapshot.forEach((post) => {
        if (sessionStorage.getItem('edit') == post.key) {
          document.getElementById('huurprijs').value = post.val().huurprijs;
          document.getElementById('waarborg').value = post.val().waarborg;
          document.getElementById('type').options[document.getElementById('type').selectedIndex].value = post.val().type;
          document.getElementById('verdieping').value = post.val().verdieping;
          document.getElementById('van').value = post.val().van;
          document.getElementById('opervlakte').value = post.val().oppervlakte;
          document.getElementById('aantalP').value = post.val().aantalP;
          document.getElementById('Douche').options[document.getElementById('Douche').selectedIndex].value = post.val().douche;
          document.getElementById('Bad').options[document.getElementById('Bad').selectedIndex].value = post.val().bad;
          document.getElementById('Toillet').options[document.getElementById('Toillet').selectedIndex].value = post.val().toillet;
          document.getElementById('Keuken').options[document.getElementById('Keuken').selectedIndex].value = post.val().keuken;
          document.getElementById('bemeubeld').options[document.getElementById('bemeubeld').selectedIndex].value = post.val().bemeubeld;
          document.getElementById('Omschrijving').value = post.val().omschrijving;
          document.getElementById('straat').value = post.val().straat;
          document.getElementById('huisnr').value = post.val().huisnr;
          document.getElementById('gemeente').value = post.val().gemeente;
          document.getElementById('Opmerking').value = post.val().opmerkingen;
        }
      });
    });
  }

  let user = JSON.parse(localStorage.getItem('User'));
  document.getElementById('nameKotbaas').value = user.classnaam;
  document.getElementById('firstnameKotbaas').value = user.classvoornaam;
  document.getElementById('emailKotbaas').value = user.classmail;

  document.getElementById('post').addEventListener('click', (e) => {
    let addhuurprijs = getId('huurprijs');
    let addwaarborg = getId('waarborg');
    let type = document.getElementById('type');
    let addtype = type.options[type.selectedIndex].value;
    let addverdieping = getId('verdieping');
    let addvan = getId('van');
    let addoppervlakte = getId('opervlakte');
    let addaantalp = getId('aantalP');
    let douche = document.getElementById('Douche');
    let adddouche = douche.options[douche.selectedIndex].value;
    let bad = document.getElementById('Bad');
    let addbad = bad.options[bad.selectedIndex].value;
    let toillet = document.getElementById('Toillet');
    let addtoillet = toillet.options[toillet.selectedIndex].value;
    let keuken = document.getElementById('Keuken');
    let addkeuken = keuken.options[keuken.selectedIndex].value;
    let bemeubeld = document.getElementById('bemeubeld');
    let addbemeubeld = bemeubeld.options[bemeubeld.selectedIndex].value;
    let addomschrijving = getId('Omschrijving');
    let addstraat = getId('straat');
    let addnr = getId('huisnr');
    let addgemeente = getId('gemeente');
    let addopmerkingen = getId('Opmerking');
    let addkotbaasNaam = getId('nameKotbaas');
    let addkotbaasVoornaam = getId('firstnameKotbaas');
    let addkotbaasEmail = getId('emailKotbaas'); 

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${addgemeente}%20${addnr}%20${addstraat}.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1545662179740&autocomplete=true.json`)
      .then((response) => {
        return response.json();
      }).then((myJson) => {
        let data = myJson;
        if (sessionStorage.getItem('edit')) {      
          firebase.database().ref(`koten/${sessionStorage.getItem('edit')}`).set({
            afstand: '',
            huurprijs: addhuurprijs,
            waarborg: addwaarborg,
            type: addtype,
            verdieping: addverdieping,
            van: addvan,
            oppervlakte: addoppervlakte,
            aantalP: addaantalp,
            douche: adddouche,
            bad: addbad,
            toillet: addtoillet,
            keuken: addkeuken,
            bemeubeld: addbemeubeld,
            omschrijving: addomschrijving,
            straat: addstraat,
            huisnr: addnr,
            gemeente: addgemeente,
            opmerkingen: addopmerkingen,
            longitude: data.features[0].geometry.coordinates[0],
            latitude: data.features[0].geometry.coordinates[1],
            kotbaasNaam: addkotbaasNaam,
            kotbaasVoornaam: addkotbaasVoornaam,
            kotbaasEmail: addkotbaasEmail,
          });
          sessionStorage.setItem('key', sessionStorage.getItem('edit'));
          sessionStorage.removeItem('edit');
        } else {
          firebase.database().ref('koten').push({
            afstand: '',
            huurprijs: addhuurprijs,
            waarborg: addwaarborg,
            type: addtype,
            verdieping: addverdieping,
            van: addvan,
            oppervlakte: addoppervlakte,
            aantalP: addaantalp,
            douche: adddouche,
            bad: addbad,
            toillet: addtoillet,
            keuken: addkeuken,
            bemeubeld: addbemeubeld,
            omschrijving: addomschrijving,
            straat: addstraat,
            huisnr: addnr,
            gemeente: addgemeente,
            opmerkingen: addopmerkingen,
            longitude: data.features[0].geometry.coordinates[0],
            latitude: data.features[0].geometry.coordinates[1],
            kotbaasNaam: addkotbaasNaam,
            kotbaasVoornaam: addkotbaasVoornaam,
            kotbaasEmail: addkotbaasEmail,
          }).then((snap) => {
            sessionStorage.setItem('key', snap.key);
          });
        }
        window.location.replace('/?#/detailPage');
      });
  })
}
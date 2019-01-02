// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/tinderspel.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  let card = document.getElementById('kotid');
  let personKey = localStorage.getItem('key');
  let loadCounter = 0;
  let clickCounter = 0;

  class Kot {
    constructor(kotkey, huurprijs, waarborg, type, opervlakte, verdieping, aantalp, toilet, douche, bad, keuken, bemeubeld, omschrijving, straat, nr, gemeente, opmerking, naam, voornaam, email) {
      this.kotkey = kotkey;
      this.huurprijs = huurprijs;
      this.waarborg = waarborg;
      this.type = type;
      this.opervlakte = opervlakte;
      this.verdieping = verdieping;
      this.aantalp = aantalp;
      this.toilet = toilet;
      this.douche = douche;
      this.bad = bad;
      this.keuken = keuken;
      this.bemeubeld = bemeubeld;
      this.omschrijving = omschrijving;
      this.straat = straat;
      this.nr = nr;
      this.gemeente = gemeente;
      this.opmerking = opmerking;
      this.naam = naam;
      this.voornaam = voornaam;
      this.email = email;
    };
  }
  let getCard = () => {
    let cardKot = JSON.parse(localStorage.getItem(clickCounter));
    card.innerHTML = `<h1>${cardKot.type}</h1><p id="prijs">huurprijs ${cardKot.huurprijs}euro</p><br><p id="prijs">oppervlakte ${cardKot.opervlakte}m²</p><br><p id="prijs">toillet: ${cardKot.toillet}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">bad: ${cardKot.bad}</p><br><p id="prijs">keuken: ${cardKot.keuken}</p><br><p id="prijs">Adress: ${cardKot.straat} ${cardKot.nr} ${cardKot.gemeente}</p><button class="detailpaginabtn" id="${cardKot.kotkey}">detailpagina</button><br>`;
    card.addEventListener('click', (e) => {
      if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'detailpagina') {
        sessionStorage.setItem('key', e.target.id);
        window.location.replace('/#/detailPage');
      }
    })
  };


  let chooseFunction = (like) => {
    if (localStorage.getItem(clickCounter)) {
      if (like == 'liked') {
        let keykot = JSON.parse(localStorage.getItem(clickCounter)).kotkey;
        firebase.database().ref(`favoriet/${personKey}/${keykot}`).set(keykot);
        localStorage.removeItem(clickCounter);
        clickCounter += 1;
        getCard();
      } else {
        localStorage.removeItem(clickCounter);
        clickCounter += 1;
        getCard();
      }
    } else {
      card.innerHTML = 'geen kaarten meer<br><a href="/#/start" data-path>Go to home</a>';
    }
  };

  let getKoten = (post) => {
    let kotgeg = post.val();
    let kot = new Kot(post.key, kotgeg.huurprijs, kotgeg.waarborg, kotgeg.type, kotgeg.opervlakte, kotgeg.verdieping, kotgeg.aantalP, kotgeg.toilet, kotgeg.douche, kotgeg.bad, kotgeg.keuken, kotgeg.bemeubeld, kotgeg.omschrijving, kotgeg.straat, kotgeg.huisnr, kotgeg.gemeente, kotgeg.tot, kotgeg.opmerking, kotgeg.kotbaasNaam, kotgeg.kotbaasVoornaam, kotgeg.kotbaasEmail);
    localStorage.setItem(loadCounter, JSON.stringify(kot));
    loadCounter += 1;
    card.innerHTML = '<button class="startbtn" id="start">Start game</button>';
    document.getElementById('start').addEventListener('click', (e) => {
      document.getElementById('button').innerHTML = '<button id="like"><i class="fas fa-heart"></i></button><button id="dislike"><i class="fas fa-thumbs-down"></i></button>';
      document.getElementById('like').addEventListener('click', () => {
        chooseFunction('liked');
      });
      document.getElementById('dislike').addEventListener('click', () => {
        chooseFunction('dislike');
      });
      getCard();
    });
  };

  // DATA OPHALEN
  function getAccount() {
    let gradenToRadialen = (graden) => {
      return graden * (Math.PI / 180);
    };

    let dataPerson = firebase.database().ref(`koten`);
    dataPerson.on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let postvalue = childSnapshot.key;
        let postAccount = childSnapshot.val();

        let lokaalKot = firebase.database().ref(`koten/${childSnapshot.key}`);
        let long1 = sessionStorage.getItem('long');
        let lat1 = sessionStorage.getItem('lat');
        let long2 = postAccount.longitude;
        let lat2 = postAccount.latitude;

        let radius = 6371;
        let waarde1 = gradenToRadialen(lat1);
        let waarde2 = gradenToRadialen(lat2);
        let verschil1 = gradenToRadialen(lat2 - lat1);
        let verschil2 = gradenToRadialen(long2 - long1);

        let x = Math.sin(verschil1 / 2) * Math.sin(verschil1 / 2) + Math.cos(waarde1) * Math.sin(waarde2) * Math.sin(verschil2 / 2) * Math.sin(verschil2 / 2);
        let y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
        let resultaat = Math.round(radius * y);

        lokaalKot.child('afstand').set(resultaat);
        
        let dataPerson = firebase.database().ref(`koten`).orderByChild('afstand');
        dataPerson.on('value', (snapshot) => {
          snapshot.forEach((post) => {
            getKoten(post);
          });
        });
      });
    });
  };

  document.getElementById('getAdress').addEventListener('click', (e)=> {
    let straat = document.getElementById('straat').value;
    let nr = document.getElementById('nr').value;
    let gemeente = document.getElementById('gemeente').value;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${gemeente}%20${nr}%20${straat}.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1545662179740&autocomplete=true.json`)
      .then((response) => {
        return response.json();
      }).then((myJson) => {
        let data = myJson;
        let long = data.features[0].geometry.coordinates[0];
        let lat = data.features[0].geometry.coordinates[1];
        sessionStorage.setItem('long', long);
        sessionStorage.setItem('lat', lat);
        getAccount();
      });
  });
};

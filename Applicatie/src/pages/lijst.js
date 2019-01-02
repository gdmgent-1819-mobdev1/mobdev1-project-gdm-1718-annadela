// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/lijst.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));
  
  let addList = (data) => {
    let postvalue = data.key;
    let cardKot = data.val();
    document.getElementById('lijstkoten').innerHTML += `<div class="unordedlist"><h1>${cardKot.type}</h1><p id="prijs">huurprijs ${cardKot.huurprijs}euro</p><br><p id="prijs">oppervlakte ${cardKot.opervlakte}m²</p><br><p id="prijs">toillet: ${cardKot.toillet}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">bad: ${cardKot.bad}</p><br><p id="prijs">keuken: ${cardKot.keuken}</p><br><p id="prijs">Adress: ${cardKot.straat} ${cardKot.huisnr} ${cardKot.gemeente}</p><button class="littlebtn top" id="${postvalue}">bekijk detail</button><button class="littlebtn top" id="${postvalue}">favoriet</button>`;
    document.getElementById('lijstkoten').addEventListener('click', (e) => {
      if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'favoriet') {
        let personKey = localStorage.getItem('key');
        let targetId = e.target.id;
        firebase.database().ref(`favoriet/${personKey}/${targetId}`).set(targetId);
      }
      if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'bekijk detail') {
        sessionStorage.setItem('key', e.target.id);
        window.location.replace('/#/detailPage');
      }
    });
  };

  // DATA TONEN
  function showList(choseselect) {
    let dataPerson = firebase.database().ref('koten').orderByChild(choseselect);
    dataPerson.on('value', (snapshot) => {
      snapshot.forEach((data) => {
        addList(data);
      });
    });
  }

  // DATA OPHALEN
  function getAccount(choseselect) {
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
      });
      showList(choseselect);
    });
  }

  let kotbaasListFunction = () => {
    document.getElementById('filter').innerHTML = '';
    let dataPerson = firebase.database().ref(`koten`);
    dataPerson.on('value', (snapshot) => {
      snapshot.forEach((post) => {
        if ((post.val().kotbaasEmail) == localStorage.getItem('emailPerson')) {
          let cardKot = post.val();
          document.getElementById('campuslijst').innerHTML += `<div class="unordedlist"><h1>${cardKot.type}</h1><p id="prijs">huurprijs ${cardKot.huurprijs}euro</p><br><p id="prijs">oppervlakte ${cardKot.opervlakte}m²</p><br><p id="prijs">toillet: ${cardKot.toillet}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">douche: ${cardKot.douche}</p><br><p id="prijs">bad: ${cardKot.bad}</p><br><p id="prijs">keuken: ${cardKot.keuken}</p><br><p id="prijs">Adress: ${cardKot.straat} ${cardKot.huisnr} ${cardKot.gemeente}</p><br><button class="littlebtn" id="${post.key}">bewerken</button><button class="littlebtn" id="${post.key}">verwijderen</button>`;
          document.getElementById('campuslijst').addEventListener('click', (e)=> {
            if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'verwijderen') {
              window.location.reload();
              dataPerson.child(e.target.id).remove();
            }
            if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'bewerken') {
              sessionStorage.setItem('edit', e.target.id);
              window.location.replace('/#/nieuwKot');
            }
          })
        }
      });
    });
  }

  let typeFunction = () => {
    let type = document.getElementById('type');
    let chosetype = type.options[type.selectedIndex].value;
    let dataKot = firebase.database().ref('koten');
    dataKot.on('value', (snapshot) => {
      snapshot.forEach((data) => {
        if (chosetype == 'Kamer' && data.val().type == 'kamer') {
          addList(data);
        }
        if (chosetype == 'studio' && data.val().type == 'studio') {
          addList(data);
        }
      });
    });
  }

  let huurprijsFunction = () => {
    let min = document.getElementById('min').value;
    let max = document.getElementById('max').value;
    let dataKot = firebase.database().ref('koten');
    dataKot.on('value', (snapshot) => {
      snapshot.forEach((data) => {
        if (data.val().huurprijs > min && data.val().huurprijs < max) {
          addList(data);
        }
      });
    });
  }

  let formFunction = () => {
    document.getElementById('select').addEventListener('click', (e) => {
      let filterselect = document.getElementById('filterselect');
      let choseselect = filterselect.options[filterselect.selectedIndex].value;
      sessionStorage.setItem('select', choseselect);
      if (choseselect == 'type') {
        document.getElementById('student').innerHTML = '<label class="doe" >type</label><select id="type"><option id="kamer">Kamer</option><option id="studio">studio</option></select><button class="littlebtn" id="selecttype">select</button>';
        document.getElementById('selecttype').addEventListener('click', ()=> {
          document.getElementById('campuslijst').innerHTML = '<div id="lijstkoten"></div>';
          typeFunction();
        });
      } else if (choseselect == 'huurprijs') {
        document.getElementById('student').innerHTML = '<label class="doe" >Mijn huurprijs mag liggen tussen </label><input id="min" type="number"><label class="doe">en</label><input id="max" type="number"><button class="littlebtn" id="selecthuurprijs">zoek</button>';
        document.getElementById('selecthuurprijs').addEventListener('click', () => {
          document.getElementById('campuslijst').innerHTML = '<div id="lijstkoten"></div>';
          huurprijsFunction();
        });
      } else if (choseselect == 'oppervlakte') {
        document.getElementById('campuslijst').innerHTML = '<div id="lijstkoten"></div>';
        document.getElementById('student').innerHTML = '<p>koten worden gesorteerd van klein naar grote opervlaktes</p>'
        showList(choseselect);
      } else {
        document.getElementById('student').innerHTML = '<form><label class="doe">Geef adress in van uw campus</label><br><input  class="inputfield" type="text" id="straatCampus" placeholder="straat" value="industrieweg"><input class="inputfield" type="number" id="nrCampus" placeholder="nr" value="120"><br> <input  class="inputfield" type="text" id="gemeenteCampus" placeholder="gemeente" value="mariakerke"><button class="littlebtn" type="submit" id="afstandselect">Zoek dichtst bijzijnde koten</button></form>';
        document.getElementById('afstandselect').addEventListener('click', ()=>{
          document.getElementById('campuslijst').innerHTML = '<div id="lijstkoten"></div>';
          let straatCamp = document.getElementById('straatCampus').value;
          let nrCamp = document.getElementById('nrCampus').value;
          let gemeenteCamp = document.getElementById('gemeenteCampus').value;
      
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${gemeenteCamp}%20${nrCamp}%20${straatCamp}.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1545662179740&autocomplete=true.json`)
            .then((response) => {
              return response.json();
            }).then((myJson) => {
              let data = myJson;
              let long = data.features[0].geometry.coordinates[0];
              let lat = data.features[0].geometry.coordinates[1];
              sessionStorage.setItem('long', long);
              sessionStorage.setItem('lat', lat);
              getAccount(choseselect);
            });
        });
      }
    });
  };

 
  if (localStorage.getItem('eigenschap') =='student') {
    formFunction();
  } else {
    kotbaasListFunction();
  }
};

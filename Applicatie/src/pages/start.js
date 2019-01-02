// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/start.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  // CLASS
  class Kotbaas {
    constructor(naam, voornaam, mail, straat, huisnr, gemeente, tel) {
      this.classnaam = naam;
      this.classvoornaam = voornaam;
      this.classmail = mail;
      this.classstraat = straat;
      this.classhuisnr = huisnr;
      this.classgemeente = gemeente;
      this.classtel = tel;
    }
  }

  class Student {
    constructor(naam, voornaam, mail, straat, huisnr, gemeente, tel, hs) {
      this.classnaam = naam;
      this.classvoornaam = voornaam;
      this.classmail = mail;
      this.classstraat = straat;
      this.classhuisnr = huisnr;
      this.classgemeente = gemeente;
      this.classtel = tel;
      this.classhs = hs;
    }
  }

  // OPSLAAN CLASS
  function showAccount(data) {
    let postvalue = data.key;
    let postAccount = data.val();
    localStorage.setItem('eigenschap', postAccount.eigenschap);
    let elem = document.getElementById('welcome');
    elem.className = 'name';
    elem.innerHTML += `${postAccount.voornaam} ${postAccount.naam}`;
    let koten = document.getElementById('koten');
    if (postAccount.eigenschap === 'kotbaas') {
      let person = new Kotbaas(postAccount.naam, postAccount.voornaam, postAccount.mail, postAccount.straat, postAccount.huisnr, postAccount.gemeente, postAccount.tel);
      localStorage.setItem('User', (JSON.stringify(person)));
    } else {
      let person = new Student(postAccount.naam, postAccount.voornaam, postAccount.mail, postAccount.straat, postAccount.huisnr, postAccount.gemeente, postAccount.tel, postAccount.hs);
      localStorage.setItem('User', person);
      localStorage.setItem('User', (JSON.stringify(person)));
    }
  }

  // DATA OPHALEN
  function getAccount() {
    let keyPerson = localStorage.getItem('key');
    let dataPerson = firebase.database().ref(`gegevens/${keyPerson}`);
    dataPerson.on('value', (snapshot) => {
      snapshot.forEach((data) => {
        showAccount(data);
      });
    });
  }

  // FUNCTIE OPROEPEN
  getAccount();
};

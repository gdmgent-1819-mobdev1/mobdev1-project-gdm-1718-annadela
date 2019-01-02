// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/form.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  let userId = localStorage.getItem('key');
  let placeProperty = document.getElementById('property');
  let property = localStorage.getItem('eigenschap');
  if (property === 'student') {
    placeProperty.innerHTML += 'Student';
    document.getElementById('student').innerHTML = '<label>Universiteit/hogeschool</label><br><input name="student_school" id="student_school" type="input" placeholder="school">';
  } else {
    placeProperty.innerHTML += 'Kotbaas';
  }

  function publishAccount(e) {
    e.preventDefault();

    let name = document.getElementById('naam').value;
    let firstname = document.getElementById('vn').value;
    let email = localStorage.getItem('emailPerson');
    let street = document.getElementById('straat').value;
    let number = document.getElementById('nr').value;
    let town = document.getElementById('gemeente').value;
    let phone = document.getElementById('tel').value;

    if (property === 'kotbaas') {
      firebase.database().ref(`gegevens/${userId}`).push({
        eigenschap: property,
        naam: name,
        voornaam: firstname,
        mail: email,
        straat: street,
        huisnr: number,
        gemeente: town,
        tel: phone,
      });
    } else {
      let school = document.getElementById('student_school').value;
      firebase.database().ref(`gegevens/${userId}`).push({
        eigenschap: property,
        naam: name,
        voornaam: firstname,
        mail: email,
        straat: street,
        huisnr: number,
        gemeente: town,
        tel: phone,
        hs: school,
      });
    }
    window.location.replace('#/login');
  }

  function CreateAccount() {
    document.getElementById('btn_account').addEventListener('click', publishAccount, false);
    let blogpostRef = firebase.database().ref(`accounts/${userId}`);
  }

  CreateAccount();
};

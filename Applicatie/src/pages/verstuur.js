// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/verstuur.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));
  
  let personKey = localStorage.getItem('key');
  let chat = document.getElementById('chat');
  let berichten = document.getElementById('berichten');
  let user = JSON.parse(localStorage.getItem('User'));
  let nameUser = user.classvoornaam + user.classnaam;
  let datum = new Date;
  let time = `${datum.getHours()}u ${datum.getMinutes()}min ${datum.getSeconds()} / ${datum.getDate()}-${1 + datum.getMonth()}-${datum.getFullYear()}sec`;

  let StudentMessage = () => {
    chat.innerHTML = '<form><label class="label" >Titel</label><br><input class="inputfield" type="text" id="onderwerp" placeholder="onderwerp"><br><label class="label">contact email</label><br></input><input class="inputfield" id="email" type="email" placeholder="email kotbaas"></input><br><label class="label">type bericht</label><br><textarea class="inputfield" id="bericht"></textarea><br><button id="verstuur" type="submit">Verzend</button></form>';
    document.getElementById('verstuur').addEventListener('click', (e) => {
      let onderwerp = document.getElementById('onderwerp').value;
      let email = document.getElementById('email').value;
      let bericht = document.getElementById('bericht').value;
      berichten.innerHTML = '<p>bericht verzonden</p>';

      firebase.database().ref(`berichten/${nameUser}/`).push({
        sender: localStorage.getItem('eigenschap'),
        title: onderwerp,
        studentmail: localStorage.getItem('emailPerson'),
        kotbaasmail: email,
        message: bericht,
        date: time,
      });
      window.location.replace('/#/bekijk');
    });
  };

  let KotbaasMessage = () => {
    let personMessage = sessionStorage.getItem('messageTo');
    let data = firebase.database().ref(`berichten/${personMessage}`);
    data.on('value', (snapshot) => {
      snapshot.forEach((post) => {
        chat.innerHTML = `<form><label class="label">Titel</label><br><input class="inputfield" type="text" id="onderwerp" placeholder="onderwerp" value="${post.val().title}"><br><labelclass="label" >contact email</label><br></input><input class="inputfield" id="email" type="email" placeholder="email student"  value="${post.val().studentmail}"></input><br><labelclass="label">type bericht</label><br><textarea class="inputfield" id="bericht"></textarea><br><button id="verstuur" type="submit">Verzend</button></form>`;
        document.getElementById('verstuur').addEventListener('click', (e) => {
          let onderwerp = document.getElementById('onderwerp').value;
          let email = document.getElementById('email').value;
          let bericht = document.getElementById('bericht').value;
          berichten.innerHTML = '<p>bericht verzonden</p>';
          window.location.replace('/#/bekijk');
    
          firebase.database().ref(`berichten/${data.key}`).push({
            sender: localStorage.getItem('eigenschap'),
            title: onderwerp,
            studentmail: email,
            kotbaasmail: localStorage.getItem('emailPerson'),
            message: bericht,
            date: time,
          });
        });
      });
    });
  };

  if(localStorage.getItem('eigenschap') == 'kotbaas') {
    KotbaasMessage();
  } else {
    StudentMessage();
  }
};

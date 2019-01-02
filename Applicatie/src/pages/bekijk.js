// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/bekijk.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  let kotbaasemail = localStorage.getItem('emailPerson');
  let kotbaasMail = (data, post) => {
    let berichtinfo = post.val();
    if (berichtinfo.kotbaasmail == kotbaasemail) {
      document.getElementById('messages').innerHTML += `<div class="message dark" id="${post.key}"><h2>${berichtinfo.title}</h2><p>${berichtinfo.message}</p><blockquote>${berichtinfo.studentmail}</blockquote></div>`;
      if (!(berichtinfo.sender == 'kotbaas')) {
        document.getElementById(post.key).innerHTML += `<button id="${data.key}">antwoorden</button>`;
        document.getElementById('messages').addEventListener('click', (e)=> {
          if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'antwoorden') {
            sessionStorage.setItem('messageTo', e.target.id);
            window.location.replace('/#/verstuur');
          }
        });
      }
    }
  }

  let studentMail = (data, post) => {
    let berichtinfo = post.val();
    if (berichtinfo.studentmail == kotbaasemail) {
      document.getElementById('messages').innerHTML += `<div  class="message bright" id="${post.key}"><h2>${berichtinfo.title}</h2><p>${berichtinfo.message}</p><blockquote>${berichtinfo.kotbaasmail}</blockquote></div>`;
      if (berichtinfo.sender !== 'student') {
        document.getElementById(post.key).innerHTML += `<button id="${data.key}">antwoorden</button>`;
        document.getElementById('messages').addEventListener('click', (e)=> {
          if (e.target && e.target.nodeName == 'BUTTON' && e.target.innerHTML == 'antwoorden') {
            sessionStorage.setItem('messageTo', e.target.id);
            window.location.replace('/#/verstuur');
          }
        });
      }
    }
  }

  let mail = () => {
    let dataPerson = firebase.database().ref('berichten');
    dataPerson.on('value', (snapshot) => {
      snapshot.forEach((data) => {
        let postvalue = data.key;
        let dataMessage = firebase.database().ref(`berichten/${postvalue}`).orderByChild('kotbaasmail');
        dataMessage.on('value', (snapshot) => {
          snapshot.forEach((post)=> {
            if(localStorage.getItem('eigenschap') == 'kotbaas') {
              kotbaasMail(data, post);
            } else {
              studentMail(data, post);
            }
            
          });
        });
      });
    });
  };

  mail();

}
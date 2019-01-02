// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/login.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  // Notificatie
  function requestNotificationPermission() {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission((permission) => {
        if (!('permission' in Notification)) {
          Notification.permission = permission;
        }
      });
    }
  }

  document.getElementById('btn_forgot').addEventListener('click', (e)=> {
    let emailAddress = document.getElementById('login_email').value;

    firebase.auth().sendPasswordResetEmail(emailAddress).then( () => {
    }).catch((error) => {
      document.getElementById('login_error').innerHTML = 'vul uw emailadress eerst in';
    });
  });

  // VERZEND NOTIFICATIE
  function sendNotification(msg) {
    let notif = new Notification(msg);
  }

  function showUserInfo(user) {
    document.getElementById('user_info').innerHTML = `<h1> Welcome ${user.email} ! </h1>`;
  }

  // LOG IN CLICK EVENT
  function login(e) {
    e.preventDefault();

    let email = document.getElementById('login_email').value;
    localStorage.setItem('emailPerson', email);
    let password = document.getElementById('login_password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((response) => {
        sendNotification('you are now logged in successfully');
        showUserInfo(response.user);
        localStorage.setItem('key', (firebase.auth().currentUser.uid));
        window.location.replace('#/start');
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('login_error').innerHTML = `${errorCode} - ${errorMessage}`;
      });
  }

  // CLICK EVENT
  function Call() {
    document.getElementById('btn_login').addEventListener('click', login, false);
    requestNotificationPermission();
  }

  Call();
};

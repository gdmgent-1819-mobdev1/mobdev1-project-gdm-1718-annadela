// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/list.handlebars');

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

  // VERIFICATIE EMAIL
  function sendVerificationEmail(user) {
    user.sendEmailVerification()
      .then(() => {
      // Email sent.
      }).catch((error) => {
      // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  }

  // VERZEND NOTIFICATIE
  function sendNotification(msg) {
    let notif = new Notification(msg);
  }

  // SIGN UP CLICK EVENT
  function signup(e) {
    e.preventDefault();

    let email = document.getElementById('signup_email').value;
    localStorage.setItem('emailPerson', email);
    let password = document.getElementById('signup_password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((response) => {
        sendNotification('Thanks for signing up to our website! Check your e-mail for account verification!');
        sendVerificationEmail(response.user);
        localStorage.setItem('key', (firebase.auth().currentUser.uid));
        if (document.getElementById('kotbaas').checked) {
          window.location.replace('#/form');
          localStorage.setItem('eigenschap', 'kotbaas');
        } else {
          window.location.replace('#/form');
          localStorage.setItem('eigenschap', 'student');
        }
      })
      .catch((error) => {
      // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log(errorCode, errorMessage);
        document.getElementById('signup_error').innerHTML = `${errorCode} - ${errorMessage}`;
      });
  }

  // CLICK EVENT
  function Call() {
    document.getElementById('btn_signup').addEventListener('click', signup, false);
    requestNotificationPermission();
  }

  Call();
};

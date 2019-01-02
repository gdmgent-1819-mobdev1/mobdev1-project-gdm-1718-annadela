const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: 'AIzaSyBLlEVzJuv0FnmN7ssHIc1U8sCnbiEG-Ag',
  authDomain: 'eindwerkmobdev.firebaseapp.com',
  databaseURL: 'https://eindwerkmobdev.firebaseio.com',
  projectId: 'eindwerkmobdev',
  storageBucket: 'eindwerkmobdev.appspot.com',
  messagingSenderId: '711890874543',
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};

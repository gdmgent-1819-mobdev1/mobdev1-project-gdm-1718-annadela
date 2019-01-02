// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/image.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  // let imagePlace = document.getElementById('renderImg');

  if (firebase) {
    const fileUpload = document.getElementById('image');

    fileUpload.addEventListener('change', (evt) => {
      if (fileUpload.value !== '') {
        evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
        const storageRef = firebase.storage().ref('images/profielfoto.jpg');
        let test = storageRef.put(evt.target.files[0]);

        storageRef.getDownloadURL().then((url) => {
          console.log(url);
          document.getElementById('renderImg').src = url;
        }).catch(() => {
          console.log('error');
        });
      }
    });

    const filesUpload = document.getElementById('')
  }
};

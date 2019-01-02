// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const aboutTemplate = require('../templates/profile.handlebars');

export default () => {
  // Data to be passed to the template
  const name = 'Test inc.';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ name }));

  let profile = JSON.parse(localStorage.getItem('User'));

  document.getElementById('profile_name').innerHTML = `${profile.classnaam} ${profile.classvoornaam}`;
  document.getElementById('profile_geg').innerHTML = `<p>${profile.classmail}</p><p>${profile.classtel}</p><div><p>${profile.classstraat} ${profile.classhuisnr}</p><p>${profile.classgemeente}</p></div><p>studeert aan ${profile.classhs}</p>`;
};

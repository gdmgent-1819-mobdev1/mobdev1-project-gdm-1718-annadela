// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const aboutTemplate = require('../templates/berichten.handlebars');

export default () => {
  // Data to be passed to the template
  const name = 'Test inc.';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ name }));
  
  let eigenschap = localStorage.getItem('eigenschap');
  let bericht = document.getElementById('berichten');
  if (eigenschap == 'kotbaas') {
    bericht.innerHTML = '<a class="ktn" href="/#/bekijk" data-path>Bekijk ontvangen berichten</a>';
  } else {
    bericht.innerHTML = '<a class="ktn" href="/#/verstuur" data-path>Verstuur bericht</a><br><a class="ktn" href="/#/bekijk" data-path>Bekijk berichten</a>';
  }
};
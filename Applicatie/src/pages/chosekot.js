// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/chosekot.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

  let keuze = document.getElementById('keuze');
  let eigenschap = localStorage.getItem('eigenschap');
  if (eigenschap == 'kotbaas') {
    keuze.innerHTML = '<div id="ktnkeuze" ><a class="ktn" href="/#/nieuwKot" data-path>Nieuw Kot Aanmaken</a><a class="ktn" href="/#/lijst" data-path>Bekijk lijst van eigen koten</a></div>';
  } else {
    keuze.innerHTML = '<div id="ktnkeuze"><a class="ktn" href="/#/tinderspel" data-path>Tinderspel</a><a class="ktn" href="/#/lijst" data-path>Lijst van Koten</a><a class="ktn" href="/#/kaart" data-path>Kaart overzicht van alle koten</a><a class="ktn" href="/#/favo" data-path>Jou gekozen favorieten</a></div>';
  }
}
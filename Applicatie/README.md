# 1819-mobdev1-code-template

## Included
* Handlebars (https://handlebarsjs.com/)
* Navigo (https://github.com/krasimir/navigo)
* Mapbox GL (https://www.mapbox.com/mapbox-gl-js/api/)
* Firebase (https://firebase.google.com/docs/web/setup)
* SASS (and SCSS)
* ESLint with AirBnB Style Guide (https://github.com/airbnb/javascript) 

## What you will need

* [Node (version lower than 10.x.x)](https://nodejs.org/en/download/releases/)
* Eslint extension for Visual Studio Code (https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Getting started
1. Install all the modules by executing
>  npm i

2. Add your firebase config to the `src/database/firebase.js` file

The Web API Key and Project ID can be found here:
> https://console.firebase.google.com/project/{your-project}/settings/general/

3. Run the app on a webserver instance
> npm run start

4. To run create a new build
> npm run build
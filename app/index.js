const angular = window.angular;

import Account from './account/index.js';
import Admin from './admin/index.js';
import Analytics from './analytics/index.js';
import Athlete from './athlete/index.js';
import Clips from './clips/index.js';
import Coach from './coach/index.js';
import Embed from './embed/index.js';
import FilmExchange from './film-exchange/index.js';
import FilmHome from './film-home/index.js';
import Games from './games/index.js';
import Header from './header/index.js';
import Indexer from './indexer/index.js';
import Indexing from './indexing/index.js';
import Login from './login/index.js';
import Logout from './logout/index.js';
import Reel from './reel/index.js';
import Root from './root/index.js';
import Styleguide from './styleguide/index.js';
import UpdatedTermsAndConditions from './updated-terms-and-conditions/index.js';

/**
 * App module.
 * @module App
 */
const App = angular.module('App', [
    'UpdatedTermsAndConditions',
    'root',
    'login',
    'logout',
    'header',
    'Account',
    'Admin',
    'Indexer',
    'Indexing',
    'filmExchange',
    'FilmHome',
    'Coach',
    'Athlete',
    'Games',
    'Clips',
    'Reel',
    'Analytics',
    'Embed',
    'Styleguide'
]);

export default App;

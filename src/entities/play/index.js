const pkg = require('../../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

import $KrossoverPlay from './entity';
import KrossoverPlayFactory from './factory';

IntelligenceWebClient.factory('$KrossoverPlay', $KrossoverPlay);
IntelligenceWebClient.factory('KrossoverPlayFactory', KrossoverPlayFactory);

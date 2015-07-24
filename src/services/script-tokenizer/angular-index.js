import ScriptTokenizer from './script-tokenizer';

const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ScriptTokenizer', () => ScriptTokenizer);

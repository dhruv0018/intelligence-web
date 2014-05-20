var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/* TODO: values below to be changed to IDs when the ENUM refactoring occurs */
var TAG_VARIABLE_TYPE = {

    PLAYER_DROPDOWN: 'PLAYER_DROPDOWN',
    TEAM_DROPDOWN: 'TEAM_DROPDOWN',
    TEXT: 'TEXT',
    DROPDOWN: 'DROPDOWN',
    ARENA: 'ARENA',
    PLAYER_TEAM_DROPDOWN: 'PLAYER_TEAM_DROPDOWN',

};

IntelligenceWebClient.constant('TAG_VARIABLE_TYPE', TAG_VARIABLE_TYPE);


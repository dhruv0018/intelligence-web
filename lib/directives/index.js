/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Directives module.
 * @module Directives
 */
var Directives = angular.module('Directives', [
    'role',
    'rolebar',
    'alertbar',
    'plan',
    'Item',
    'Event',
    'Events',
    'Play',
    'Plays',
    'team-info',
    'date',
    'no-results',
    'videoplayer',
    'sport-placeholder',
    'role-icon',
    'add-player',
    'mascot-placeholder',
    'profile-placeholder',
    'positionsDropdown'
]);

require('role');
require('rolebar');
require('alertbar');
require('plan');
require('item');
require('event');
require('events');
require('play');
require('plays');
require('team-info');
require('date');
require('no-results');
require('videoplayer');
require('sport-placeholder');
require('role-icon');
require('add-player');
require('roster');
require('athlete');
require('coach-info');
require('thumbnail');
require('film');
require('mascot-placeholder');
require('profile-placeholder');
require('positions-dropdown');


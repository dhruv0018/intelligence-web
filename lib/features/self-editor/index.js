/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SelfEditor module.
 * @module SelfEditor
 */
const SelfEditor = angular.module('SelfEditor', [
    'SelfEditingPlaylist'
]);

import SelfEditingPlaylist from './self-editing-playlist';

export default SelfEditor;

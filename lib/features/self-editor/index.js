const angular = window.angular;

import template from './template.html';
import directive from './directive';

import SelfEditingPlaylist from './self-editing-playlist';

/**
 * SelfEditor module.
 * @module SelfEditor
 */
const SelfEditor = angular.module('SelfEditor', [
    'SelfEditingPlaylist'
]);


SelfEditor.directive('selfEditor', directive);

export default SelfEditor;

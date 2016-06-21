const angular = window.angular;

import template from './template.html';
import directive from './directive';

// Directives
import SelfEditingPlaylist from './self-editing-playlist';
import SelfEditingControls from './self-editing-controls';
import SelfEditedPlay from './self-edited-play';
import SelfEditedPlayFooter from './self-edited-play-footer';
import SelfEditedPlaysFilters from './self-edited-plays-filters';

// Services
import SelfEditedPlayControlsModeNotifier from './services/self-edited-play-controls-mode-notifier';
import SelfEditedPlayStateNotifier from './services/self-edited-play-state-notifier';
import SelfEditedPlaysFilter from './services/self-edited-plays-filter';

/**
 * SelfEditor module.
 * @module SelfEditor
 */
const SelfEditor = angular.module('SelfEditor', [
    'SelfEditingPlaylist',
    'SelfEditingControls',
    'SelfEditedPlay',
    'SelfEditedPlayFooter',
    'SelfEditedPlayControlsModeNotifier',
    'SelfEditedPlaysFilter',
    'SelfEditedPlaysFilters',
    'SelfEditedPlayStateNotifier'
]);


SelfEditor.directive('selfEditor', directive);

export default SelfEditor;

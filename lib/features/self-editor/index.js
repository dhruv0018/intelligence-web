const angular = window.angular;

/**
 * SelfEditor module.
 * @module SelfEditor
 */
const SelfEditor = angular.module('SelfEditor', [
    'SelfEditorBreakdown',
    'SelfEditorIndexing',
    'SelfEditingPlaylist'
]);

import SelfEditingPlaylist from './self-editing-playlist';

export default SelfEditor;

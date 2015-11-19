const angular = window.angular;

import SelfEditingPlaylist from './self-editing-playlist';

/**
 * SelfEditor module.
 * @module SelfEditor
 */
const SelfEditor = angular.module('SelfEditor', [
    'SelfEditorBreakdown',
    'SelfEditorIndexing',
    'SelfEditingPlaylist'
]);

export default SelfEditor;

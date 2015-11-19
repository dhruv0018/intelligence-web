const angular = window.angular;

import SelfEditingPlaylist from './self-editing-playlist';
import SelfEditorBreakdown from './self-editor-breakdown';
import SelfEditorIndexing from './self-editor-indexing';

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

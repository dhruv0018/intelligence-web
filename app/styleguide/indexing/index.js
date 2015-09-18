import StyleguideIndexingState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Indexing
 * @module StyleguideIndexing
 */
const StyleguideIndexing = angular.module('Styleguide.Indexing', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideIndexing.config(StyleguideIndexingState);

export default StyleguideIndexing;

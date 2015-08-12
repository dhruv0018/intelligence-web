/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';
import SelectMediaSrcDirective from './directive';
import SelectMediaSrcController from './controller';

const templateUrl = 'video-player/select-media-src/template.html';

/**
 * SelectMediaSrc
 * @module SelectMediaSrc
 */
const SelectMediaSrc = angular.module('SelectMediaSrc', []);

/* Cache the template file */
SelectMediaSrc.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

SelectMediaSrc.directive('selectMediaSrc', SelectMediaSrcDirective);
SelectMediaSrc.controller('SelectMediaSrc.Controller', SelectMediaSrcController);

export default SelectMediaSrc;

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import SelectMediaSrcDirective from './directive';
import SelectMediaSrcController from './controller';

/**
 * SelectMediaSrc
 * @module SelectMediaSrc
 */
const SelectMediaSrc = angular.module('SelectMediaSrc', []);

SelectMediaSrc.directive('selectMediaSrc', SelectMediaSrcDirective);
SelectMediaSrc.controller('SelectMediaSrc.Controller', SelectMediaSrcController);

export default SelectMediaSrc;

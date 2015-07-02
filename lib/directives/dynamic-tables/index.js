/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';
import DynamicTablesDirective from './directive';
import DynamicTablesController from './controller';

const templateUrl = 'dynamic-tables/template.html';

/**
 * DynamicTables
 * @module DynamicTables
 */
const DynamicTables = angular.module('DynamicTables', []);

/* Cache the template file */
DynamicTables.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

DynamicTables.directive('dynamicTables', DynamicTablesDirective);
DynamicTables.controller('DynamicTables.Controller', DynamicTablesController);

export default DynamicTables;

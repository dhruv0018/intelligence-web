/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import controller from './controller';

const templateUrl = 'dynamic-tables/template.html';

/**
* DynamicTablesDirective dependencies
*/
DynamicTablesDirective.$inject = [];

/**
 * DynamicTables Directive
 * @module DynamicTables
 * @name DynamicTables
 * @type {directive}
 */
function DynamicTablesDirective (
) {

    const definition = {

        restrict: TO += ELEMENT,

        templateUrl,

        controller,

        scope: {

            tables: '=',
            sport: '=?',
            glossary: '=?',
            teams: '=?',
            game: '=?',
            showExportOptions: '=?'
        }
    };

    return definition;
}

export default DynamicTablesDirective;

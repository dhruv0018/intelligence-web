/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import SelectMediaSrcController from './controller';

const templateUrl = 'video-player/select-media-src/template.html';

/**
* SelectMediaSrcDirective dependencies
*/
SelectMediaSrcDirective.$inject = [];

/**
 * SelectMediaSrc Directive
 * @module SelectMediaSrc
 * @name SelectMediaSrc
 * @type {directive}
 */
function SelectMediaSrcDirective (
) {

    const definition = {

        restrict: TO += ELEMENT,

        templateUrl: templateUrl,

        controller: SelectMediaSrcController,
    };

    return definition;
}

export default SelectMediaSrcDirective;

/**
 * Field directive linking function
 * @module FieldDirective
 */
function link(scope, element, attrs) {

    const inputSelector = 'field-' + scope.field.index;

    // Publish scope methods
    scope.blurInput = blurInput;

    function blurInput () {

        /* Get element dynamically because ES6 template
         * isn't ready during postlink */
        const inputElement = document.getElementById(inputSelector);
        inputElement.blur();
    }
}

export default link;

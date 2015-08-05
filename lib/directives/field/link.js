/**
 * Field directive linking function
 * @module FieldDirective
 */
function link(scope, element, attrs) {

    const inputSelector = 'field-' + scope.field.index;

    // Publish scope methods
    scope.resizeInput = resizeInput;

    function resizeInput() {

        /* Get element dynamically because ES6 template
         * isn't ready during postlink */
        const inputElement = document.getElementById(inputSelector);
        inputElement.size = scope.field.value.name.length;
    }
}

export default link;

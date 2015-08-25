/**
 * Field directive controller class
 * @class FieldController
 */
class FieldController {

    /**
     * FieldController constructor
     * @constructor
     * @param {Object} scope
     * @returns {FieldController}
     */
    constructor(scope) {

        this.scope = scope;
        this.scope.displayValue = {
            name: this.scope.field.value.name
        };
        this.initialize();
    }

    /**
     * Binds event handlers to Angular scope methods
     * @method FieldController.initialize
     */
    initialize() {

        this.scope.onSelect = this.onSelect.bind(this);
        this.scope.onBlur = this.onBlur.bind(this);
        this.scope.onFocus = this.onFocus.bind(this);
    }

    /**
     * Angular typeahead on-select event handler
     * @method FieldController.onSelect
     * @param {Field.value} value
     */
    onSelect(value) {

        this.scope.field.value = value;
    }

    /**
     * Field ng-blur event handler
     * @method FieldController.onBlur
     * @param {UIEvent} $event
     */
    onBlur($event) {

        let currentValue = this.scope.field.value;

        this.scope.displayValue = {
            name : currentValue.name
        };
    }

    /**
     * Field ng-focus event handler
     * @method FieldController.onFocus
     */
    onFocus($event) {

        this.scope.displayValue = {
            name: ''
        };
    }
}

FieldController.$inject = [
    '$scope'
];

export default FieldController;

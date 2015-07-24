import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * TextField Field Model
 * @class TextField
 */
class TextField extends Field {

    /**
     * @constructs TextField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;

        super(field);

        this.availableValues = null;

        this.initialize();
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {integer} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        let initialText = {

            content: !this.isRequired? null      : undefined,
            name   : !this.isRequired? 'Optional': 'Select'
        };

        if (value) {

            initialText.content = value;
            initialText.name    = value;
        }

        this.currentValue = initialText;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value text-field">${this.currentValue.content}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};

        variableValue = {
            type: null,
            value: this.value.content
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default TextField;

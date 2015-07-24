import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * FormationField Field Model
 * @class FormationField
 */
class FormationField extends Field {

    /**
     * @constructs FormationField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;
        super(field);

        let initialFormation = {
            formationId: !field.isRequired ? null : undefined,
            numberOfPlayers: 0,
            name: !field.isRequired ? 'Optional' : 'Select'
        };
        this.keyedFormations = {};
        this.formations.forEach(formation => this.keyedFormations[formation.id] = formation);

        this.availableValues = [];
        this.availableValues = this.formations.map(formation => {
            let currentFormation = angular.copy(formation);
            return {
                formationId: currentFormation.id,
                numberOfPlayers: currentFormation.numberPlayers,
                name: currentFormation.name
            };
        });
        this.availableValues.unshift(initialFormation);

        this.initialize();
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {object} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        let formation = angular.copy(this.availableValues[0]);

        if (value) {

            let currentFormation = angular.copy(this.keyedFormations[value]);

            formation = {

                formationId    : currentFormation.id,
                numberOfPlayers: currentFormation.numberPlayers,
                name           : currentFormation.name
            };
        }

        this.currentValue = formation;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value formation-field">${this.currentValue.name}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value = this.value.formationId === null ? null : String(this.value.formationId);
        variableValue = {
            type: null,
            value
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default FormationField;

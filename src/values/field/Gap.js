import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class GapField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        this.GAPS = injector.get('GAPS');
        this.GAP_IDS = injector.get('GAP_IDS');

        let value = {
            gapId: !field.isRequired ? 'Optional' : undefined
        };

        if (field.value) {
            let gap = this.GAPS[this.GAP_IDS[field.value]];
            value.name = gap.name;
            value.gapId = gap.value;
        }

        this.value = value;
        this.availableValues = Object.keys(this.GAPS).map(key => this.GAPS[key]);
    }

    toJSON(){
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.gapId
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default GapField;

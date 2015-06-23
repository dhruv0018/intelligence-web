import Field from './Field.js';
import GapConstants from '../../constants/football/gaps.js';

class GapField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        this.GAPS =  GapConstants.GAPS;
        this.GAP_IDS = GapConstants.GAP_IDS;

        let gap = {
            gapId: !field.isRequired ? null : undefined,
            name: !field.isRequired ? 'Optional' : undefined,
            keyboardShortcut: undefined
        };

        if (field.value) {
            let currentGap = this.GAPS[this.GAP_IDS[field.value]];
            gap = {
                gapId: currentGap.id,
                name: currentGap.name,
                keyboardShortcut: currentGap.shortcut
            };
        }

        this.currentValue = gap;
        this.availableValues = Object.keys(this.GAPS).map(key => {
            let currentGap = this.GAPS[key];
            gap = {
                gapId: currentGap.id,
                name: currentGap.name,
                keyboardShortcut: currentGap.shortcut
            };
        });
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(gap) {
        this.value = gap;
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

// jshint ignore: start
import FormationField from '../../../../src/values/field/Formation.js';
import FormationFieldData from '../sample-data/Formation.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = FormationFieldData.Tag;
const eventVariable = FormationFieldData.Event;

describe('General Formation Field', () => {
    let tagField = new FormationField(tagVariable);
    it('The Formation Class should Exist', () => {
        expect(FormationField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('FORMATION');
    });

});

describe('Formation Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new FormationField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.formationId).to.be.undefined;
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new FormationField(localTagVariable);
        let value = tagField.currentValue;
        expect(value.formationId).to.be.null;
    });

});

// describe('Formation Tag Field', () => {
//     it('Should have properly set value if required', () => {
//         let localEventVariable = angular.copy(eventVariable);
//         console.log(localEventVariable);
//         localEventVariable.isRequired = true;
//         let eventField = new FormationField(localEventVariable);
//         //let value = eventField.currentValue;
//
//     });
// });

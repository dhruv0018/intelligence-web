// jshint ignore: start
import PlayerField from '../../../../src/values/field/Player.js';
import PlayerFieldData from '../sample-data/Player.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();
const rawField = PlayerFieldData;

describe('General Player Field', () => {
    it('The Player Class should Exist', () => {
        expect(PlayerField).to.exist;
    });
});

describe('Player Dropdown Field', () => {
    let srcField;
    let requiredField;
    let unrequiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new PlayerField(srcField);
        srcField.isRequired = false;
        unrequiredField = new PlayerField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;
        let value = field.value;

        expect(value.playerId).to.equal(1);
    });

    it('Should be able to set an optional value if the field is not required' , () => {
        let field = unrequiredField;
        field.value = field.availableValues[0];
        let value = field.value;
        expect(value.playerId).to.be.null;
        expect(value.name).to.equal('Player 1');
    });

    it('Should have properly set value if required', () => {
        let field = requiredField;
        field.isRequired = true;

        let value = field.value;
        expect(value.playerId).to.equal(1);
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let payload = requiredField.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":"Player","value":1}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let field = unrequiredField;
        field.value = field.availableValues[0];
        let payload = field.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":"Player","value":null}');
    });

    it('Should validate correctly', () => {
        let field = unrequiredField;
        field.availableValues.forEach(value => {
            field.value = value;
            expect(field.valid).to.be.true;
        });
    });
});

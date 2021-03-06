// jshint ignore: start
import TeamField from '../../../../src/values/field/Team.js';
import TeamFieldData from '../sample-data/Team.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawField = TeamFieldData;

beforeEach(angular.mock.module('intelligence-web-client'));


describe('General Team Field', () => {
    it('The Team Class should Exist', () => {
        expect(TeamField).to.exist;
    });
});

describe('Team Dropdown Field', () => {
    let srcField;
    let requiredField;
    let unrequiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new TeamField(srcField);
        srcField.isRequired = false;
        unrequiredField = new TeamField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;
        let value = field.value;

        expect(value.teamId).to.equal(1);
    });

    it('Should be able to set an optional value if the field is not required' , () => {
        let field = unrequiredField;
        field.value = field.availableValues[0];
        let value = field.value;
        expect(value.teamId).to.be.null;
        expect(value.name).to.equal('Team 1');
    });

    it('Should have properly set value if required', () => {
        let field = requiredField;
        field.isRequired = true;

        let value = field.value;
        expect(value.teamId).to.equal(1);
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let payload = requiredField.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":"Team","value":1}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let field = unrequiredField;
        field.value = field.availableValues[0];
        let payload = field.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":"Team","value":null}');
    });

    it('Should validate correctly', () => {
        let field = unrequiredField;
        field.availableValues.forEach(value => {
            field.value = value;
            expect(field.valid).to.be.true;
        });
    });
});

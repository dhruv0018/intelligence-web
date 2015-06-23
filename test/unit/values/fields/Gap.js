// jshint ignore: start
import GapField from '../../../../src/values/field/Gap.js';
import GapFieldData from '../sample-data/Gap.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = GapFieldData.Tag;
const eventVariable = GapFieldData.Event;

describe('Gap Tag Field', () => {
    beforeEach(angular.mock.module('intelligence-web-client'));

    it('The Gap Class should Exist', () => {
        expect(GapField).to.exist;
    });

    it('Should have correct input type', () => {
        let tagField = new GapField(tagVariable);
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('GAP');
    });

    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new GapField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.gapId).to.be.undefined;
        expect(value.name).to.be.undefined;
        expect(value.keyboardShortcut).to.be.undefined;
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new GapField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.gapId).to.be.null;
        expect(value.name).to.equal('Optional');
        expect(value.keyboardShortcut).to.be.undefined;
    });
});

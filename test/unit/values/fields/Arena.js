// jshint ignore: start
import ArenaFieldData from '../sample-data/Arena.js';
import ArenaField from '../../../../src/values/field/Arena.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = ArenaFieldData.Tag;
const eventVariable = ArenaFieldData.Event;

//todo add more later when I find out about arena stuff
describe('General Arena Field', () => {
    let tagField = new ArenaField(tagVariable);
    it('The ArenaField Class should Exist', () => {
        expect(ArenaField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('ARENA');
    });

});

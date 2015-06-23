// jshint ignore: start
import GapField from '../../../../src/values/field/Gap.js';
import GapFieldData from '../sample-data/Gap.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = GapFieldData.Tag;

describe('Gap Tag Field', () => {

    let tagField;
    let eventField;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(angular.mock.module($provide => {

        $provide.constant('GAPS', {
                D_LEFT: {
                    name: 'D Left',
                    value: '1',
                    shortcut: 'DL'
                }
        });

        $provide.constant('GAP_IDS', {
                '1': 'D_LEFT'
        });
    }));

    beforeEach( inject(() => {
        tagField = new GapField(tagVariable);
        eventField = new GapField(eventField);
    }));

    // it('should work', inject((GAP_IDS, GAPS) => {
    //     console.log(field);
    // }));

    // it('The Gap Class should Exist', () => {
    //     expect(GapField).to.exist;
    // });
    //
    // it('The Field Class has appropriate properties expected from the model', () => {
    //     assert.isDefined(field.id, 'The id property is defined');
    //     assert.isDefined(field.type, 'The type property is defined');
    //     assert.isDefined(field.isRequired, 'The isRequired property is defined');
    // });
});

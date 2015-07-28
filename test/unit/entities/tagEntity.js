import KrossoverTag from '../../../src/entities/tag';
import tagData from './sample-data/tag-22';
import tagTransformedData from './sample-data/tag-transformed';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const srcTag = tagData;

describe('Tag Entity', () => {

    let sampleTag;
    let tag;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(inject(TagsetsFactory => {

        sampleTag = angular.copy(srcTag);
        tag       = new KrossoverTag(sampleTag);
    }));

    it('should exist', () => {

        expect(KrossoverTag).to.exist;
    });

    it('should have public API', () => {

        expect(KrossoverTag).to.respondTo('mapScriptTypes');
        expect(KrossoverTag).to.respondTo('toJSON');
    });

    it('should have certain properties when instantiated', () => {

        expect(tag).to.contain.keys([
            'id',
            'name',
            'indexerScript',
            'userScript',
            'shortcutKey',
            'description',
            'isStart',
            'isEnd',
            'tagSetId',
            'children',
            'tagVariables',
            'pointsAssigned',
            'assignThisTeam',
            'isPeriodTag',
            'summaryPriority',
            'summaryScript',
            'buffer'
        ]);
    });

    it('should have a "keyboardShortcut" getter that works.', () => {

        assert.isDefined(tag.keyboardShortcut, '"keyboardShortcut" has been defined.');
        expect(tag.keyboardShortcut).to.be.a('string');
        expect(tag.keyboardShortcut).to.equal('K');
    });

    it('shouldn\'t allow writing to the shortcutKey property.', () => {

        expect(tag.keyboardShortcut).to.be.a('string');
        expect(tag.keyboardShortcut).to.equal('K');

        expect(() => tag.shortcutKey = 'T').to.throw(TypeError);
        expect(() => tag.keyboardShortcut = 'T').to.throw(TypeError);

        expect(tag.keyboardShortcut).to.be.a('string');
        expect(tag.keyboardShortcut).to.equal('K');
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        tag.toJSON = sinon.spy();

        JSON.stringify(tag);

        assert(tag.toJSON.should.have.been.called);
    });
});

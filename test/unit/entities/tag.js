import KrossoverTag from '../../../src/entities/tag';
import Static from '../../../src/values/field/Static';
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

    beforeEach(() => {

        sampleTag = angular.copy(srcTag);
        tag       = new KrossoverTag(sampleTag);
    });

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

    it('should have a property indexerScript', () => {

        expect(tag).to.contain.keys('indexerScript');
        expect(tag.indexerScript).to.be.an.array;

        tag.indexerScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have a property userScript', () => {

        expect(tag).to.contain.keys('userScript');
        expect(tag.userScript).to.be.an.array;

        tag.userScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have a property summaryScript', () => {

        expect(tag).to.contain.keys('summaryScript');
        expect(tag.summaryScript).to.be.an.array;

        tag.summaryScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        tag.toJSON = sinon.spy();

        JSON.stringify(tag);

        assert(tag.toJSON.should.have.been.called);
    });

    it('should throw an error on a JSON.stringify call', () => {

        expect(() => JSON.stringify(tag)).to.throw(Error);
    });
});

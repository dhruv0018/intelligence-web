import KrossoverTag from '../../../src/entities/tag';
import tagData from './sample-data/tag';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const srcTag = tagData;

describe('Tag Entity', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', () => {

        expect(KrossoverTag).to.exist;
    });

    it('should have public API', () => {

        expect(KrossoverTag).to.respondTo('indexTagVariables');
        expect(KrossoverTag).to.respondTo('mapScriptTypes');
        expect(KrossoverTag).to.respondTo('toJSON');
    });

    it('should have certain properties when instantiated', () => {

        let sampleTag = Object.assign({}, srcTag);
        let tag       = new KrossoverTag(sampleTag);

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

    it('should have called toJSON on a JSON.stringify call', () => {

        let sampleTag = Object.assign({}, srcTag);
        let tag       = new KrossoverTag(sampleTag);
        tag.toJSON    = sinon.spy();

        JSON.stringify(tag);

        assert(tag.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        let sampleTag = Object.assign({}, srcTag);
        let tag       = new KrossoverTag(sampleTag);

        tag = tag.toJSON();

        expect(tag.id).to.equal(srcTag.id);
        expect(tag.name).to.equal(srcTag.name);
        expect(tag.indexerScript).to.equal(srcTag.indexerScript);
        expect(tag.userScript).to.equal(srcTag.userScript);
        expect(tag.shortcutKey).to.equal(srcTag.shortcutKey);
        expect(tag.description).to.equal(srcTag.description);
        expect(tag.isStart).to.equal(srcTag.isStart);
        expect(tag.isEnd).to.equal(srcTag.isEnd);
        expect(tag.tagSetId).to.equal(srcTag.tagSetId);
        expect(tag.children).to.equal(srcTag.children);

        expect(tag.tagVariables).to.deep.equal(srcTag.tagVariables);

        expect(tag.pointsAssigned).to.equal(srcTag.pointsAssigned);
        expect(tag.assignThisTeam).to.equal(srcTag.assignThisTeam);
        expect(tag.isPeriodTag).to.equal(srcTag.isPeriodTag);
        expect(tag.summaryScript).to.equal(srcTag.summaryScript);
        expect(tag.summaryPriority).to.equal(srcTag.summaryPriority);
        expect(tag.buffer).to.equal(srcTag.buffer);
    });
});

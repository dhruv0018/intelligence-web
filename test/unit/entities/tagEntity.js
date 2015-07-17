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

        expect(KrossoverTag).to.respondTo('indexTagVariables');
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
            'fields',
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

    it('should have called toJSON on a JSON.stringify call', () => {

        tag.toJSON = sinon.spy();

        JSON.stringify(tag);

        assert(tag.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

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
        expect(tag.children).to.deep.equal(srcTag.children);

        tag.tagVariables.forEach((variable, index) => {

            expect(variable.id).to.equal(srcTag.tagVariables[index].id);
            expect(variable.name).to.equal(srcTag.tagVariables[index].name);
            expect(variable.type).to.equal(srcTag.tagVariables[index].type);
            expect(variable.isRequired).to.equal(srcTag.tagVariables[index].isRequired);
            expect(variable.options).to.deep.equal(srcTag.tagVariables[index].options);
            expect(variable.formations).to.deep.equal(srcTag.tagVariables[index].formations);
        });

        expect(tag.pointsAssigned).to.equal(srcTag.pointsAssigned);
        expect(tag.assignThisTeam).to.equal(srcTag.assignThisTeam);
        expect(tag.isPeriodTag).to.equal(srcTag.isPeriodTag);
        expect(tag.summaryScript).to.equal(srcTag.summaryScript);
        expect(tag.summaryPriority).to.equal(srcTag.summaryPriority);
        expect(tag.buffer).to.equal(srcTag.buffer);
    });
});

import KrossoverEvent from '../../../src/entities/event';
import playData from './sample-data/play';
import tagsData from './sample-data/tags';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const srcJSON = playData;
const srcTags = tagsData;

describe('Event Entity', () => {

    let sampleEvent;
    let srcEvent;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(angular.mock.module($provide => {

        $provide.service('TagsetsFactory', function () {

            this.getTag = (tagId) => {

                let tag = srcTags[tagId];

                if (!tag) throw new Error(`Tag ${tagId} not found`);

                return tag;
            }
        });
    }));

    beforeEach(inject(TagsetsFactory => {

        srcEvent    = srcJSON.events[0];
        let tag     = TagsetsFactory.getTag(srcEvent.tagId);
        sampleEvent = new KrossoverEvent(srcEvent, tag, srcEvent.time);
    }));

    it('should exist.', () => {

        expect(KrossoverEvent).to.exist;
    });

    it('should have a "hasVariables" getter that works.', () => {

        expect(sampleEvent.hasVariables).to.be.a('boolean');
        expect(sampleEvent.hasVariables).to.be.true;
    });

    it('should have a "isValid" getter that works.', () => {

        expect(sampleEvent.isValid).to.be.a('boolean');
        expect(sampleEvent.isValid).to.be.true;
    });

    it('should have a "isFloat" getter that works.', () => {

        expect(sampleEvent.isFloat).to.be.a('boolean');
        expect(sampleEvent.isFloat).to.be.false;
    });

    it('should have a "isEndAndStart" getter that works.', () => {

        expect(sampleEvent.isEndAndStart).to.be.a('boolean');
        expect(sampleEvent.isEndAndStart).to.be.false;
    });

    it('should have public API', () => {

        expect(KrossoverEvent).to.respondTo('toJSON');
    });

    it('should have certain properties when instantiated.', () => {

        expect(sampleEvent).to.contain.keys([
            'id',
            'time',
            'tagId',
            'playId',
            'variableValues'
        ]);
        assert.isDefined(sampleEvent.hasVariables, '"hasVariables" has been defined.');
        assert.isDefined(sampleEvent.isValid, '"isValid" has been defined.');
        assert.isDefined(sampleEvent.isFloat, '"isFloat" has been defined.');
        assert.isDefined(sampleEvent.isEndAndStart, '"isEndAndStart" has been defined.');
    });

    it('should have called toJSON on a JSON.stringify call.', () => {

        sampleEvent.toJSON = sinon.spy();

        JSON.stringify(sampleEvent);

        assert(sampleEvent.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        sampleEvent = sampleEvent.toJSON();

        expect(sampleEvent.id).to.equal(srcEvent.id);
        expect(sampleEvent.time).to.equal(srcEvent.time);
        expect(sampleEvent.tagId).to.equal(srcEvent.tagId);
        expect(sampleEvent.playId).to.equal(srcEvent.playId);
        expect(sampleEvent.variableValues).to.deep.equal(srcEvent.variableValues);
    });
});

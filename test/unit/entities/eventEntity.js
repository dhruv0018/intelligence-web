import KrossoverEvent from '../../../src/entities/event';
import KrossoverTag from '../../../src/entities/tag';
import Field from '../../../src/values/field/Field';
import Static from '../../../src/values/field/Static';
import playData from './sample-data/play';
import tagData from './sample-data/tag-22';

const util    = require('util');
const krog    = (obj, msg) => console.log(msg, util.inspect(obj));

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const srcJSON = playData;
const srcTag  = tagData;

describe('Event Entity', () => {

    let sampleEvent;
    let srcEvent;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(() => {

        srcEvent    = angular.copy(srcJSON.events[0]);
        let gameId  = srcJSON.gameId;
        let tag     = new KrossoverTag(angular.copy(srcTag));
        sampleEvent = new KrossoverEvent(angular.copy(srcEvent), tag, srcEvent.time, gameId);
    });

    it('should exist.', () => {

        expect(KrossoverEvent).to.exist;
    });

    it('should have public API', () => {

        expect(KrossoverEvent).to.respondTo('toJSON');
        expect(KrossoverEvent).to.respondTo('mapScript');
        expect(KrossoverEvent).to.respondTo('isFloat');
        expect(KrossoverEvent).to.respondTo('isEndAndStart');
    });

    it('should have certain properties when instantiated.', () => {

        expect(sampleEvent).to.contain.keys([
            'name',
            'description',
            'isStart',
            'isEnd',
            'tagSetId',
            'shortcutKey',
            'children',
            'pointsAssigned',
            'assignThisTeam',
            'isPeriodTag',
            'buffer',
            'fields',
            'tagId',
            'time',
            'indexerScript',
            'userScript',
            'summaryScript',
            'summaryPriority'
        ]);
    });

    it('should have certain properties whose values equal the source JSON when instantiated.', () => {

        /* Properties from Tag JSON */
        expect(sampleEvent.name).to.equal(srcTag.name);
        expect(sampleEvent.description).to.equal(srcTag.description);
        expect(sampleEvent.isStart).to.equal(srcTag.isStart);
        expect(sampleEvent.isEnd).to.equal(srcTag.isEnd);
        expect(sampleEvent.tagSetId).to.equal(srcTag.tagSetId);
        expect(sampleEvent.shortcutKey).to.equal(srcTag.shortcutKey);
        expect(sampleEvent.children).to.be.an.array;
        expect(sampleEvent.children).to.deep.equal(srcTag.children);
        expect(sampleEvent.pointsAssigned).to.equal(srcTag.pointsAssigned);
        expect(sampleEvent.assignThisTeam).to.equal(srcTag.assignThisTeam);
        expect(sampleEvent.isPeriodTag).to.equal(srcTag.isPeriodTag);
        expect(sampleEvent.buffer).to.equal(srcTag.buffer);
        expect(sampleEvent.tagId).to.equal(srcTag.id);
        expect(sampleEvent.summaryPriority).to.equal(srcTag.summaryPriority);

        /* Properties from Event JSON */
        expect(sampleEvent.time).to.equal(srcEvent.time);
    });

    it('should have an "indexerScript" property', () => {

        expect(sampleEvent.indexerScript).to.be.an.array;
        sampleEvent.indexerScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have an "userScript" property', () => {

        expect(sampleEvent.userScript).to.be.an.array;
        sampleEvent.userScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have an "summaryScript" property', () => {

        expect(sampleEvent.summaryScript).to.be.an.array;
        sampleEvent.summaryScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have the proper game ID on each field', () => {

        Object.keys(sampleEvent.fields).forEach(order => {

            expect(sampleEvent.fields[order].gameId).to.equal(srcJSON.gameId);
        });
    });

    it('should have a "keyboardShortcut" getter', () => {

        expect(sampleEvent.keyboardShortcut).to.be.a('string');
        expect(sampleEvent.keyboardShortcut).to.equal('K');
    });

    it('shouldn\'t allow writing to the shortcutKey property.', () => {

        expect(sampleEvent.keyboardShortcut).to.be.a('string');
        expect(sampleEvent.keyboardShortcut).to.equal('K');

        expect(() => sampleEvent.shortcutKey = 'T').to.throw(TypeError);
        expect(() => sampleEvent.keyboardShortcut = 'T').to.throw(TypeError);

        expect(sampleEvent.keyboardShortcut).to.be.a('string');
        expect(sampleEvent.keyboardShortcut).to.equal('K');
    });

    it('should have a "isFloat" method.', () => {

        expect(sampleEvent.isFloat()).to.be.a('boolean');
        expect(sampleEvent.isFloat()).to.be.false;
    });

    it('should return null if trying to map a script that doesn\'t exist.', () => {

        expect(sampleEvent.mapScript()).to.be.null;
    });

    it('should have a getter for "indexerFields"', () => {

        expect(sampleEvent.indexerFields).to.be.an.array;
    });

    it('should return an array of Fields when calling the "indexerFields" getter', () => {

        sampleEvent.indexerFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
        });
    });

    it('should have a getter for "userFields"', () => {

        expect(sampleEvent.userFields).to.be.an.array;
    });

    it('should return an array of Fields when calling the "userFields" getter', () => {

        sampleEvent.userFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
        });
    });

    it('should have a getter for "summaryFields"', () => {

        expect(sampleEvent.summaryFields).to.be.an.array;
    });

    it('should return an array of Fields when calling the "summaryFields" getter', () => {

        sampleEvent.summaryFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
        });
    });

    it('should have a "isEndAndStart" method', () => {

        expect(sampleEvent.isEndAndStart()).to.be.a('boolean');
        expect(sampleEvent.isEndAndStart()).to.be.false;
    });

    it('should have a "valid" getter that tests the validity of the fields', () => {

        expect(sampleEvent.valid).to.be.a.boolean;
        expect(sampleEvent.valid).to.be.true;
    });

    it('should have called toJSON on a JSON.stringify call', () => {

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

        Object.keys(sampleEvent.variableValues).forEach((tagId) => {

            expect(sampleEvent.variableValues[tagId]).to.deep.equal(srcEvent.variableValues[tagId]);
        });
    });
});

// TODO: Write unit tests for Events that are not passed in Event JSON

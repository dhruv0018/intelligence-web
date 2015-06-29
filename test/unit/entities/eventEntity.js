import KrossoverEvent from '../../../src/entities/event';
import KrossoverTag from '../../../src/entities/tag';
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
        let tag     = angular.copy(srcTag);
        sampleEvent = new KrossoverEvent(srcEvent, tag, srcEvent.time, gameId);
    });

    it('should exist.', () => {

        expect(KrossoverEvent).to.exist;
    });

    it('should have a "keyboardShortcut" getter that works.', () => {

        expect(sampleEvent.keyboardShortcut).to.be.a('string');
        expect(sampleEvent.keyboardShortcut).to.equal('K');
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
            'buffer',
            'fields',
            'tagId',
            'variableValues',
            'activeEventVariableIndex',
            'time'
        ]);
        assert.isDefined(sampleEvent.hasVariables, '"hasVariables" has been defined.');
        assert.isDefined(sampleEvent.isValid, '"isValid" has been defined.');
        assert.isDefined(sampleEvent.isFloat, '"isFloat" has been defined.');
        assert.isDefined(sampleEvent.isEndAndStart, '"isEndAndStart" has been defined.');
    });

    it('should have the proper game ID on each variable value', () => {

        Object.keys(sampleEvent.variableValues).forEach(key => {

            expect(sampleEvent.variableValues[key].gameId).to.equal(srcJSON.gameId);
        });
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

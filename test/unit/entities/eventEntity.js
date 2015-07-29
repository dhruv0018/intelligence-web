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
        let tag     = new KrossoverTag(angular.copy(srcTag));
        sampleEvent = new KrossoverEvent(angular.copy(srcEvent), tag, srcEvent.time, gameId);
    });

    it('should exist.', () => {

        expect(KrossoverEvent).to.exist;
    });

    it('should have public API', () => {

        expect(KrossoverEvent).to.respondTo('toJSON');
        expect(KrossoverEvent).to.respondTo('isValid');
        expect(KrossoverEvent).to.respondTo('isFloat');
        expect(KrossoverEvent).to.respondTo('isEndAndStart');
    });

    it('should have a "keyboardShortcut" getter that works.', () => {

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

    it('should have a "isFloat" method that works.', () => {

        expect(sampleEvent.isFloat()).to.be.a('boolean');
        expect(sampleEvent.isFloat()).to.be.false;
    });

    it('should have a "isEndAndStart" method that works.', () => {

        expect(sampleEvent.isEndAndStart()).to.be.a('boolean');
        expect(sampleEvent.isEndAndStart()).to.be.false;
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
            'pointsAssigned',
            'assignThisTeam',
            'isPeriodTag',
            'summaryPriority',
            'summaryScript',
            'buffer',
            'fields',
            'tagId',
            'activeEventVariableIndex',
            'time'
        ]);
    });

    it('should have the proper game ID on each variable value', () => {

        Object.keys(sampleEvent.fields).forEach(order => {

            expect(sampleEvent.fields[order].gameId).to.equal(srcJSON.gameId);
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

        Object.keys(sampleEvent.variableValues).forEach((tagId) => {

            expect(sampleEvent.variableValues[tagId]).to.deep.equal(srcEvent.variableValues[tagId]);
        });
    });
});

import KrossoverEvent from '../../../src/entities/event';
import KrossoverTag from '../../../src/entities/tag';
import Field from '../../../src/values/field/Field';
import Static from '../../../src/values/field/Static';
import playData from './sample-data/play';
import tagData from './sample-data/tag-22';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const srcJSON = playData;
const srcTag  = tagData;

describe('Event Entity', () => {

    let sampleEvent;
    let sampleEmptyEvent;
    let srcEvent;
    let gameId;
    let tag;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(() => {

        srcEvent = angular.copy(srcJSON.events[0]);
        gameId = srcJSON.gameId;
        tag = new KrossoverTag(angular.copy(srcTag));
        sampleEvent = new KrossoverEvent(angular.copy(srcEvent), tag, srcEvent.time, gameId);
        sampleEmptyEvent = new KrossoverEvent(null, tag, srcEvent.time, gameId);
    });

    it('should exist.', () => {

        expect(KrossoverEvent).to.exist;
    });

    it('should throw an error if no parameters are passed to the constructor', () => {

        expect(() => new KrossoverEvent()).to.throw(Error);
    });

    it('should have public API', () => {

        expect(KrossoverEvent).to.respondTo('toJSON');
        expect(KrossoverEvent).to.respondTo('mapScript');
    });

    it('should have certain properties when instantiated with event JSON', () => {

        expect(sampleEvent).to.contain.keys([
            'id',
            'playId',
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

    it('should have certain properties when instantiated without event JSON', () => {

        expect(sampleEmptyEvent).to.contain.keys([
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

    it('should have certain properties whose values equal the source JSON when instantiated', () => {

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

        expect(sampleEmptyEvent.name).to.equal(srcTag.name);
        expect(sampleEmptyEvent.description).to.equal(srcTag.description);
        expect(sampleEmptyEvent.isStart).to.equal(srcTag.isStart);
        expect(sampleEmptyEvent.isEnd).to.equal(srcTag.isEnd);
        expect(sampleEmptyEvent.tagSetId).to.equal(srcTag.tagSetId);
        expect(sampleEmptyEvent.shortcutKey).to.equal(srcTag.shortcutKey);
        expect(sampleEmptyEvent.children).to.be.an.array;
        expect(sampleEmptyEvent.children).to.deep.equal(srcTag.children);
        expect(sampleEmptyEvent.pointsAssigned).to.equal(srcTag.pointsAssigned);
        expect(sampleEmptyEvent.assignThisTeam).to.equal(srcTag.assignThisTeam);
        expect(sampleEmptyEvent.isPeriodTag).to.equal(srcTag.isPeriodTag);
        expect(sampleEmptyEvent.buffer).to.equal(srcTag.buffer);
        expect(sampleEmptyEvent.tagId).to.equal(srcTag.id);
        expect(sampleEmptyEvent.summaryPriority).to.equal(srcTag.summaryPriority);

        /* Properties from Event JSON */
        expect(sampleEvent.time).to.equal(srcEvent.time);
        expect(sampleEvent.id).to.equal(srcEvent.id);
        expect(sampleEvent.playId).to.equal(srcEvent.playId);

        expect(sampleEmptyEvent.time).to.equal(srcEvent.time);
    });

    it('should not have certain properties when instantiated without event JSON', () => {

        expect(sampleEmptyEvent.playId).to.be.undefined;
    });

    it('should have an "indexerScript" property', () => {

        expect(sampleEvent.indexerScript).to.be.an.array;
        expect(sampleEmptyEvent.indexerScript).to.be.an.array;

        /* Instantiated with event JSON */
        sampleEvent.indexerScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });

        /* Instantiated without event JSON */
        sampleEmptyEvent.indexerScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have an "userScript" property', () => {

        expect(sampleEvent.userScript).to.be.an.array;
        expect(sampleEmptyEvent.userScript).to.be.an.array;

        /* Instantiated with event JSON */
        sampleEvent.userScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });

        /* Instantiated without event JSON */
        sampleEmptyEvent.userScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have an "summaryScript" property', () => {

        expect(sampleEvent.summaryScript).to.be.an.array;
        expect(sampleEmptyEvent.summaryScript).to.be.an.array;

        /* Instantiated with event JSON */
        sampleEvent.summaryScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });

        /* Instantiated without event JSON */
        sampleEmptyEvent.summaryScript.forEach(field => {

            expect(typeof field === "string" || field instanceof Static).to.be.true;
        });
    });

    it('should have the proper game ID on each field', () => {

        /* Instantiated with event JSON */
        Object.keys(sampleEvent.fields).forEach(order => {

            expect(sampleEvent.fields[order].gameId).to.equal(srcJSON.gameId);
        });

        /* Instantiated without event JSON */
        Object.keys(sampleEmptyEvent.fields).forEach(order => {

            expect(sampleEmptyEvent.fields[order].gameId).to.equal(srcJSON.gameId);
        });
    });

    it('should have a "keyboardShortcut" getter', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.keyboardShortcut).to.be.a('string');
        expect(sampleEvent.keyboardShortcut).to.equal('K');

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.keyboardShortcut).to.be.a('string');
        expect(sampleEmptyEvent.keyboardShortcut).to.equal('K');
    });

    it('should have a "isFloat" getter.', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.isFloat).to.be.a('boolean');
        expect(sampleEvent.isFloat).to.be.false;

        /* Instantiated without event JSON */
        expect(sampleEvent.isFloat).to.be.a('boolean');
        expect(sampleEvent.isFloat).to.be.false;
    });

    it('should return null if trying to map a script that doesn\'t exist.', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.mapScript()).to.be.null;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.mapScript()).to.be.null;
    });

    it('should have a getter for "indexerFields"', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.indexerFields).to.be.an.array;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.indexerFields).to.be.an.array;
    });

    it('should return an array of Fields when calling the "indexerFields" getter', () => {

        /* Instantiated with event JSON */
        sampleEvent.indexerFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
            expect(field.isVariableValueValid(field)).to.be.true;

            if (!field instanceof Static) {

                expect(field.valid).to.be.true;
            }
        });

        /* Instantiated without event JSON */
        sampleEmptyEvent.indexerFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
            expect(field.isVariableValueValid(field)).to.be.true;

            if (!field instanceof Static) {

                expect(field.valid).to.be.true;
            }
        });
    });

    it('should have a getter for "indexerHTML"', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.indexerHTML).to.be.a.string;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.indexerHTML).to.be.a.string;
    });

    it('should have a getter for "userFields"', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.userFields).to.be.an.array;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.userFields).to.be.an.array;
    });

    it('should return an array of Fields when calling the "userFields" getter', () => {

        /* Instantiated with event JSON */
        sampleEvent.userFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
            expect(field.isVariableValueValid(field)).to.be.true;

            if (!field instanceof Static) {

                expect(field.valid).to.be.true;
            }
        });

        /* Instantiated without event JSON */
        sampleEmptyEvent.userFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
            expect(field.isVariableValueValid(field)).to.be.true;

            if (!field instanceof Static) {

                expect(field.valid).to.be.true;
            }
        });
    });

    it('should have a getter for "userHTML"', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.userHTML).to.be.a.string;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.userHTML).to.be.a.string;
    });

    it('should have a getter for "summaryFields"', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.summaryFields).to.be.an.array;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.summaryFields).to.be.an.array;
    });

    it('should return an array of Fields when calling the "summaryFields" getter', () => {

        /* Instantiated with event JSON */
        sampleEvent.summaryFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
            expect(field.isVariableValueValid(field)).to.be.true;

            if (!field instanceof Static) {

                expect(field.valid).to.be.true;
            }
        });

        /* Instantiated without event JSON */
        sampleEmptyEvent.summaryFields.forEach(field => {

            expect(field instanceof Field).to.be.true;
            expect(field.isVariableValueValid(field)).to.be.true;

            if (!field instanceof Static) {

                expect(field.valid).to.be.true;
            }
        });
    });

    it('should have a getter for "summaryHTML"', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.summaryHTML).to.be.a.string;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.summaryHTML).to.be.a.string;
    });

    it('should have a "isEndAndStart" getter', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.isEndAndStart).to.be.a('boolean');
        expect(sampleEvent.isEndAndStart).to.be.false;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.isEndAndStart).to.be.a('boolean');
        expect(sampleEmptyEvent.isEndAndStart).to.be.false;
    });

    it('should have a "valid" getter that tests the validity of the fields', () => {

        /* Instantiated with event JSON */
        expect(sampleEvent.isValid).to.be.a.boolean;
        expect(sampleEvent.isValid).to.be.true;

        /* Instantiated without event JSON */
        expect(sampleEmptyEvent.isValid).to.be.a.boolean;
        expect(sampleEmptyEvent.isValid).to.be.false;
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        /* Instantiated with event JSON */
        sampleEvent.toJSON = sinon.spy();

        JSON.stringify(sampleEvent);

        assert(sampleEvent.toJSON.should.have.been.called);

        /* Instantiated without event JSON */
        sampleEmptyEvent.toJSON = sinon.spy();

        JSON.stringify(sampleEmptyEvent);

        assert(sampleEmptyEvent.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        /* Instantiated with event JSON */
        sampleEvent = sampleEvent.toJSON();

        expect(sampleEvent.id).to.equal(srcEvent.id);
        expect(sampleEvent.time).to.equal(srcEvent.time);
        expect(sampleEvent.tagId).to.equal(srcEvent.tagId);
        expect(sampleEvent.playId).to.equal(srcEvent.playId);

        Object.keys(sampleEvent.variableValues).forEach((tagId) => {

            expect(sampleEvent.variableValues[tagId]).to.deep.equal(srcEvent.variableValues[tagId]);
        });

        /* Instantiated without event JSON */
        expect(() => sampleEvent.toJSON()).to.throw(Error);
    });

    it('should be able to accept a KrossoverEvent as a constructor parameter', () => {

        let eventFromEvent = new KrossoverEvent(sampleEvent, tag, srcEvent.time, gameId);

        expect(sampleEvent.toJSON()).to.deep.equal(eventFromEvent.toJSON());
    });
});

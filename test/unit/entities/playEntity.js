import KrossoverPlay from '../../../src/entities/play';
import KrossoverTag from '../../../src/entities/tag';
import playData from './sample-data/play';
import tagData22 from './sample-data/tag-22';
import tagData59 from './sample-data/tag-59';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const srcJSON = playData;
const srcTags = {

    '22': tagData22,
    '59': tagData59
};

describe('Play Entity', () => {

    let samplePlay;
    let play;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(angular.mock.module($provide => {

        $provide.service('TagsetsFactory', function () {

            this.getTag = (tagId) => {

                let tag = angular.copy(srcTags[tagId]);

                if (!tag) throw new Error(`Tag ${tagId} not found`);

                return new KrossoverTag(tag);
            };
        });
    }));

    beforeEach(inject(TagsetsFactory => {

        samplePlay = angular.copy(srcJSON);
        play       = new KrossoverPlay(samplePlay, TagsetsFactory);
    }));

    it('should exist', () => {

        expect(KrossoverPlay).to.exist;
    });

    it('should throw an Error if constructor is called without parameters.', () => {

        expect(() => new KrossoverPlay()).to.throw(Error);
    });

    it('should have public API', () => {

        expect(KrossoverPlay).to.respondTo('toJSON');
    });

    it('should have a property "id"', () => {

        expect(play).to.contain.keys('id');
        expect(play.id).to.equal(srcJSON.id);
    });

    it('should have a property "startTime"', () => {

        expect(play).to.contain.keys('startTime');
        expect(play.startTime).to.equal(srcJSON.startTime);
    });

    it('should have a property "endTime"', () => {

        expect(play).to.contain.keys('endTime');
        expect(play.endTime).to.equal(srcJSON.endTime);
    });

    it('should have a property "events"', () => {

        expect(play).to.contain.keys('events');
    });

    it('should have a property "gameId"', () => {

        expect(play).to.contain.keys('gameId');
        expect(play.gameId).to.equal(srcJSON.gameId);
    });

    it('should have a property "flags"', () => {

        expect(play).to.contain.keys('flags');
        expect(play.flags).to.deep.equal(srcJSON.flags);
    });

    it('should have a property "clip"', () => {

        expect(play).to.contain.keys('clip');
        expect(play.clip).to.deep.equal(srcJSON.clip);
    });

    it('should have a property "shares"', () => {

        expect(play).to.contain.keys('shares');
        expect(play.shares).to.deep.equal(srcJSON.shares);
    });

    it('should have a property "createdAt"', () => {

        expect(play).to.contain.keys('createdAt');
        expect(play.createdAt).to.equal(srcJSON.createdAt);
    });

    it('should have a property "updatedAt"', () => {

        expect(play).to.contain.keys('updatedAt');
        expect(play.updatedAt).to.equal(srcJSON.updatedAt);
    });

    it('should have a property "customTagIds"', () => {

        expect(play).to.contain.keys('customTagIds');
        expect(play.customTagIds).to.deep.equal(srcJSON.customTagIds);
    });

    it('should have a property "period"', () => {

        expect(play).to.contain.keys('period');
        expect(play.period).to.equal(0);
    });

    it('should have a property "indexedScore"', () => {

        expect(play).to.contain.keys('indexedScore');
        expect(play.indexedScore).to.equal(0);
    });

    it('should have a property "opposingIndexedScore"', () => {

        expect(play).to.contain.keys('opposingIndexedScore');
        expect(play.opposingIndexedScore).to.equal(0);
    });

    it('should have a property "hasVisibleEvents"', () => {

        expect(play).to.contain.keys('hasVisibleEvents');
        expect(play.hasVisibleEvents).to.be.false;
    });

    it('should have a property "possessionTeamId"', () => {

        expect(play).to.contain.keys('possessionTeamId');
        expect(play.possessionTeamId).to.be.null;
    });

    it('should have a "indexerScript" getter', () => {

        expect(play.indexerScript).to.be.an.array;
        play.indexerScript.forEach(event => {

            expect(event).to.be.a('string');
        })
    });

    it('should have a "userScript" getter', () => {

        expect(play.userScript).to.be.an.array;
        play.userScript.forEach(event => {

            expect(event).to.be.a('string');
        })
    });

    it('should have a "summaryScript" getter', () => {

        expect(play.summaryScript).to.be.an.array;
        play.summaryScript.forEach(event => {

            expect(event).to.be.a('string');
        })
    });

    it('should have called toJSON on a JSON.stringify call', inject(TagsetsFactory => {

        play.toJSON = sinon.spy();

        JSON.stringify(play);

        assert(play.toJSON.should.have.been.called);
    }));

    it('should restore the original JSON on JSON.stringify calls', inject(TagsetsFactory => {

        play = play.toJSON();

        expect(play.id).to.equal(srcJSON.id);
        expect(play.startTime).to.equal(srcJSON.startTime);
        expect(play.endTime).to.equal(srcJSON.endTime);

        expect(play.events).to.be.an('array');

        expect(play.gameId).to.equal(srcJSON.gameId);

        expect(play.flags).to.be.an('array');
        expect(play.flags).to.deep.equal(srcJSON.flags);

        expect(play.clip).to.deep.equal(srcJSON.clip);
        expect(play.shares).to.deep.equal(srcJSON.shares);
        expect(play.createdAt).to.equal(srcJSON.createdAt);
        expect(play.updatedAt).to.equal(srcJSON.updatedAt);
        expect(play.customTagIds).to.deep.equal(srcJSON.customTagIds);
    }));
});

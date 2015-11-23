import KrossoverTag from '../../../src/entities/tag';
import playJSON from './sample-data/play';
import tagData22 from './sample-data/tag-22';
import tagData59 from './sample-data/tag-59';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

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

    beforeEach(inject($KrossoverPlay => {

        samplePlay = angular.copy(playJSON);
        play = new $KrossoverPlay(samplePlay);
    }));

    it('should exist', inject($KrossoverPlay => {

        expect($KrossoverPlay).to.exist;
    }));

    it('should throw an Error if constructor is called without parameters.', inject($KrossoverPlay => {

        expect(() => new $KrossoverPlay()).to.throw(Error);
    }));

    it('should have public API', inject($KrossoverPlay => {

        expect($KrossoverPlay).to.respondTo('toJSON');
    }));

    it('should have a property "id"', () => {

        expect(play).to.contain.keys('id');
        expect(play.id).to.equal(playJSON.id);
    });

    it('should have a property "startTime"', () => {

        expect(play).to.contain.keys('startTime');
        expect(play.startTime).to.equal(playJSON.startTime);
    });

    it('should have a property "endTime"', () => {

        expect(play).to.contain.keys('endTime');
        expect(play.endTime).to.equal(playJSON.endTime);
    });

    it('should have a property "events"', () => {

        expect(play).to.contain.keys('events');
    });

    it('should have a property "gameId"', () => {

        expect(play).to.contain.keys('gameId');
        expect(play.gameId).to.equal(playJSON.gameId);
    });

    it('should have a property "flags"', () => {

        expect(play).to.contain.keys('flags');
        expect(play.flags).to.deep.equal(playJSON.flags);
    });

    it('should have a property "clip"', () => {

        expect(play).to.contain.keys('clip');
        expect(play.clip.toJSON()).to.deep.equal(playJSON.clip);
    });

    it('should have a property "shares"', () => {

        expect(play).to.contain.keys('shares');
        expect(play.shares).to.deep.equal(playJSON.shares);
    });

    it('should have a property "createdAt"', () => {

        expect(play).to.contain.keys('createdAt');
        expect(play.createdAt).to.equal(playJSON.createdAt);
    });

    it('should have a property "updatedAt"', () => {

        expect(play).to.contain.keys('updatedAt');
        expect(play.updatedAt).to.equal(playJSON.updatedAt);
    });

    it('should have a property "customTagIds"', () => {

        expect(play).to.contain.keys('customTagIds');
        expect(play.customTagIds).to.deep.equal(playJSON.customTagIds);
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

        expect(play.summaryScript).to.be.a.string;
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        play.toJSON = sinon.spy();

        JSON.stringify(play);

        assert(play.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        play = play.toJSON();

        expect(play.id).to.equal(playJSON.id);
        expect(play.startTime).to.equal(playJSON.startTime);
        expect(play.endTime).to.equal(playJSON.endTime);

        expect(play.events).to.be.an('array');

        expect(play.gameId).to.equal(playJSON.gameId);

        expect(play.flags).to.be.an('array');
        expect(play.flags).to.deep.equal(playJSON.flags);

        expect(play.clip).to.deep.equal(playJSON.clip);
        expect(play.shares).to.deep.equal(playJSON.shares);
        expect(play.createdAt).to.equal(playJSON.createdAt);
        expect(play.updatedAt).to.equal(playJSON.updatedAt);
        expect(play.customTagIds).to.deep.equal(playJSON.customTagIds);
    });

    it('should be able to accept a KrossoverPlay as a constructor parameter', inject($KrossoverPlay => {

        let playFromPlay = new $KrossoverPlay(play);

        expect(play.toJSON()).to.deep.equal(playFromPlay.toJSON());
    }));
});

describe('KrossoverPlayFactory', () => {

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

    it('should exist', inject(KrossoverPlayFactory => {

        expect(KrossoverPlayFactory).to.exist;
    }));

    it('should have public API', inject(KrossoverPlayFactory => {

        expect(KrossoverPlayFactory).to.respondTo('create');
    }));

    it('should return a KrossoverPlay when calling `create`', inject((KrossoverPlayFactory, $KrossoverPlay) => {

        let samplePlay = angular.copy(playJSON);
        let play = KrossoverPlayFactory.create(samplePlay);
        let KrossoverPlay = $KrossoverPlay;

        expect(play).to.be.instanceof(KrossoverPlay);
    }));
});

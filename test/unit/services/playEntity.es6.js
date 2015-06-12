import KrossoverPlay from '../../../src/entities/play';
import playData from './sample-data/play';
import tagsData from './sample-data/tags';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const srcJSON = playData;
const srcTags = tagsData;

describe('Play Entity', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(angular.mock.module($provide => {

        $provide.service('TagsetsFactory', function () {

            this.getTag = (tagId) => {

                let tag = srcTags[tagId];

                if (!tag) throw new Error('Tag ' + tagId + ' not found');

                return tag;
            }
        });
    }));

    it('should exist', () => {

        expect(KrossoverPlay).to.exist;
    });

    it('should have public API', () => {

        expect(KrossoverPlay).to.respondTo('toJSON');
    });

    it('should have certain properties when instantiated', inject(TagsetsFactory => {

        let samplePlay = Object.assign({}, srcJSON);
        let play       = new KrossoverPlay(samplePlay, TagsetsFactory);

        expect(play).to.contain.keys([
            'id',
            'startTime',
            'endTime',
            'events',
            'gameId',
            'flags',
            'clip',
            'shares',
            'createdAt',
            'updatedAt',
            'customTagIds',
            'period',
            'indexedScore',
            'opposingIndexedScore',
            'hasVisibleEvents',
            'possessionTeamId'
        ]);
    }));

    it('should have called toJSON on a JSON.stringify call', inject(TagsetsFactory => {

        let samplePlay = Object.assign({}, srcJSON);
        let play       = new KrossoverPlay(samplePlay, TagsetsFactory);
        play.toJSON    = sinon.spy();

        JSON.stringify(play);

        assert(play.toJSON.should.have.been.called);
    }));

    it('should restore the original JSON on JSON.stringify calls', inject(TagsetsFactory => {

        let samplePlay = Object.assign({}, srcJSON);
        let play = new KrossoverPlay(samplePlay, TagsetsFactory);

        play = play.toJSON();

        expect(play.id).to.equal(srcJSON.id);
        expect(play.startTime).to.equal(srcJSON.startTime);
        expect(play.endTime).to.equal(srcJSON.endTime);

        expect(play.events).to.be.an('array');

        srcJSON.events.forEach((event, index) => {

            expect(play.events[index].id).to.equal(srcJSON.events[index].id);
            expect(play.events[index].time).to.equal(srcJSON.events[index].time);
            expect(play.events[index].tagId).to.equal(srcJSON.events[index].tagId);
            expect(play.events[index].playId).to.equal(srcJSON.events[index].playId);
            expect(play.events[index].variableValues).to.deep.equal(srcJSON.events[index].variableValues);
        });

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

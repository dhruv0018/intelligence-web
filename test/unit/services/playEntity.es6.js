import KrossoverPlay from '../../../src/entities/play';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();
const srcJSON = {
    "id": 15999,
    "startTime": 326.98999023438,
    "endTime": 353.08999633789,
    "events": [
        {
            "id": 93561,
            "time": 326.98999023438,
            "tagId": 22,
            "playId": 15999,
            "variableValues": {
                "8": {
                    "type": "Team",
                    "value": 623
                },
                "25": {
                    "type": null,
                    "value": "Normal"
                }
            }
        },
        {
            "id": 93562,
            "time": 353.08999633789,
            "tagId": 59,
            "playId": 15999,
            "variableValues": {
                "1": {
                    "type": "Player",
                    "value": 9188
                },
                "24": {
                    "type": null,
                    "value": "82"
                }
            }
        }
    ],
    "gameId": 998,
    "flags": [],
    "clip": {
        "id": 22747,
        "guid": "clip-326.98999023438-353.08999633789-ec2-54-224-102-52.compute-1.amazonaws.com53ebd054317b8",
        "status": 4,
        "videoTranscodeProfiles": [
            {
                "id": 95289,
                "videoId": 22747,
                "transcodeProfile": {
                    "id": 1,
                    "targetBitrate": 600,
                    "maximumBitrate": 800,
                    "minimumBitrate": 0,
                    "description": "SD Low Resolution (360p)",
                    "targetDisplayWidth": 640,
                    "targetDisplayHeight": 360,
                    "aspectRatio": "16:9"
                },
                "status": 4,
                "videoUrl": "http://krossover-com-prod-content.cdn.krossover.com/videos/finished/clip-326.98999023438-353.08999633789-ec2-54-224-102-52.compute-1.amazonaws.com53ebd054317b8.mp4"
            }
        ],
        "duration": null,
        "thumbnail": null
    },
    "shares": [
        {
            "userId": 103,
            "gameId": null,
            "reelId": null,
            "playId": 15999,
            "sharedWithUserId": null,
            "sharedWithTeamId": null,
            "createdAt": "2015-02-03T17:36:59+00:00",
            "isBreakdownShared": false
        }
    ],
    "createdAt": "2014-08-14T21:42:28+00:00",
    "updatedAt": "2015-02-03T17:36:59+00:00",
    "customTagIds": [
        6,
        10
    ]
};

const srcTags = {

    "22": {
        "id": 22,
        "name": "Kickoff",
        "indexerScript": [
            "Kickoff by ",
            {
                "id": 8,
                "name": "Team 1",
                "type": "TEAM_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            " and is ",
            {
                "id": 25,
                "name": "Kickoff",
                "type": "DROPDOWN",
                "isRequired": true,
                "options": "[\"Normal\", \"Onside\"]",
                "formations": {},
                "index": 2
            }
        ],
        "userScript": [
            "(",
            {
                "id": 25,
                "name": "Kickoff",
                "type": "DROPDOWN",
                "isRequired": true,
                "options": "[\"Normal\", \"Onside\"]",
                "formations": {},
                "index": 2
            },
            ") Kickoff by ",
            {
                "id": 8,
                "name": "Team 1",
                "type": "TEAM_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            }
        ],
        "shortcutKey": "K",
        "description": "",
        "isStart": true,
        "isEnd": false,
        "tagSetId": 2,
        "children": [
            35,
            50,
            54,
            55,
            59,
            60
        ],
        "tagVariables": {
            "1": {
                "id": 8,
                "name": "Team 1",
                "type": "TEAM_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            "2": {
                "id": 25,
                "name": "Kickoff",
                "type": "DROPDOWN",
                "isRequired": true,
                "options": "[\"Normal\", \"Onside\"]",
                "formations": {},
                "index": 2
            }
        },
        "pointsAssigned": null,
        "assignThisTeam": null,
        "isPeriodTag": false,
        "summaryPriority": 2,
        "summaryScript": [
            "Kickoff"
        ],
        "buffer": -1
    },
    "59": {
        "id": 59,
        "name": "Tackle",
        "indexerScript": [
            "Tackle by ",
            {
                "id": 1,
                "name": "Player 1",
                "type": "PLAYER_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            " at ",
            {
                "id": 24,
                "name": "Yard Line",
                "type": "YARD",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 2
            },
            " yard line"
        ],
        "userScript": [
            "Tackle by ",
            {
                "id": 1,
                "name": "Player 1",
                "type": "PLAYER_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            " at ",
            {
                "id": 24,
                "name": "Yard Line",
                "type": "YARD",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 2
            },
            " yard line"
        ],
        "shortcutKey": "T",
        "description": "",
        "isStart": false,
        "isEnd": true,
        "tagSetId": 2,
        "children": [],
        "tagVariables": {
            "1": {
                "id": 1,
                "name": "Player 1",
                "type": "PLAYER_DROPDOWN",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 1
            },
            "2": {
                "id": 24,
                "name": "Yard Line",
                "type": "YARD",
                "isRequired": true,
                "options": [],
                "formations": {},
                "index": 2
            }
        },
        "pointsAssigned": null,
        "assignThisTeam": null,
        "isPeriodTag": false,
        "summaryPriority": null,
        "summaryScript": null,
        "buffer": 4
    }
};

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

        let samplePlay = angular.copy(srcJSON);
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

        let samplePlay = angular.copy(srcJSON);
        let play       = new KrossoverPlay(samplePlay, TagsetsFactory);
        play.toJSON    = sinon.spy();

        JSON.stringify(play);

        assert(play.toJSON.should.have.been.called);
    }));

    it('should restore the original JSON on JSON.stringify calls', inject(TagsetsFactory => {

        let samplePlay = angular.copy(srcJSON);
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
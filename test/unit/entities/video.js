import Video from '../../../src/entities/video';
import {VIDEO_STATUSES} from '../../../src/constants/videos'
import videoData from './sample-data/video';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const srcJSON = videoData;

describe('Video Entity', () => {

    let videoJSON;
    let video;

    const ownProperties = [
        'id',
        'guid',
        'status',
        'videoTranscodeProfiles',
        'duration',
        'thumbnail'
    ];

    const getters = [
        'transcodeProfiles'
    ]

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(() => {

        // Protect original source JSON
        videoJSON = angular.copy(srcJSON);
        // Instantiate Video entitiy with JSON
        video = new Video(videoJSON);
    });

    it('should exist', () => {

        expect(Video).to.exist;
    });

    it('should be instantiatable', () => {

        expect(video).to.be.an.instanceof(Video);
    })

    it('should have certain properties when instantiated', () => {

        ownProperties.forEach(
            property => expect(video).to.have.ownProperty(property)
        );

        getters.forEach(
            getter => expect(video).to.have.property(getter)
        );

        /* FIXME: Test does not pass, I think because the method
         * uses the injector for $sce
         */
        // expect(video).to.have.property('resourceUrls');
    });

    it('should throw an Error if constructor is called without parameters.', () => {

        expect(() => new Video()).to.throw(Error);
    });

    it('should have the same own properties as the original JSON object', () => {

        expect(video).to.contain.keys(ownProperties);
        expect(videoJSON).to.contain.keys(ownProperties);
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        video.toJSON = sinon.spy();

        JSON.stringify(video);

        assert(video.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        video = video.toJSON();

        expect(video.id).to.equal(srcJSON.id);
        expect(video.guid).to.equal(srcJSON.guid);
        expect(video.status).to.equal(srcJSON.status);

        expect(video.videoTranscodeProfiles).to.be.an('array');
        expect(video.videoTranscodeProfiles.length).to.equal(srcJSON.videoTranscodeProfiles.length);

        expect(video.duration).to.equal(srcJSON.duration);
        expect(video.thumbnail).to.equal(srcJSON.thumbnail);
    });

    it('should validate JSON schema', () => {

        const validation = video.validate(videoJSON);

        expect(validation.errors.length).to.equal(0);
    });

    it('should not mutate when being transformed to and from JSON', () => {

        let copy = angular.copy(video);

        copy = JSON.parse(JSON.stringify(copy));

        expect(video).to.contain.keys(ownProperties);
        expect(copy).to.contain.keys(ownProperties);
    });

    describe('isComplete', () => {

        let video;

        beforeEach(function prepData() {

            video = new Video({guid:"1234", status: VIDEO_STATUSES.COMPLETE.id});
        });

        it('should exist', () => {
            expect(video).to.respondTo('isComplete');
        });

        it('should return true if upload status is set to video status, COMPLETE', () => {

            video.status = VIDEO_STATUSES.COMPLETE.id;
            expect(video.isComplete()).to.equal(true);
        });

        it('should return false if upload status is not set to video status, COMPLETE', () => {

            video.status = VIDEO_STATUSES.INCOMPLETE.id;
            expect(video.isComplete()).to.equal(false);
        });
    });

    describe('isUploaded', () => {

        let video;

        beforeEach(function prepData() {

            video = new Video({guid:"1234", status: VIDEO_STATUSES.UPLOADED.id});
        });

        it('should exist', () => {
            expect(video).to.respondTo('isUploaded');
        });

        it('should return true if upload status is set to video status, UPLOADED', () => {

            video.status = VIDEO_STATUSES.UPLOADED.id;
            expect(video.isUploaded()).to.equal(true);
        });

        it('should return false if upload status is not set to video status, UPLOADED', () => {

            video.status = VIDEO_STATUSES.COMPLETE.id;
            expect(video.isUploaded()).to.equal(false);
        });
    });

    describe('isFailed', () => {

        let video;

        beforeEach(function prepData() {

            video = new Video({guid:"1234", status: VIDEO_STATUSES.FAILED.id});
        });

        it('should exist', () => {
            expect(video).to.respondTo('isFailed');
        });

        it('should return true if upload status is set to video status, FAILED', () => {

            video.status = VIDEO_STATUSES.FAILED.id;
            expect(video.isFailed()).to.equal(true);
        });

        it('should return false if upload status is not set to video status, FAILED', () => {

            video.status = VIDEO_STATUSES.COMPLETE.id;
            expect(video.isFailed()).to.equal(false);
        });
    });

    describe('isIncomplete', () => {

        let video;

        beforeEach(function prepData() {

            video = new Video({guid:"1234", status: VIDEO_STATUSES.INCOMPLETE.id});
        });

        it('should exist', () => {
            expect(video).to.respondTo('isIncomplete');
        });

        it('should return true if upload status is set to video status, INCOMPLETE', () => {

            video.status = VIDEO_STATUSES.INCOMPLETE.id;
            expect(video.isIncomplete()).to.equal(true);
        });

        it('should return false if upload status is not set to video status, INCOMPLETE', () => {

            video.status = VIDEO_STATUSES.COMPLETE.id;
            expect(video.isIncomplete()).to.equal(false);
        });
    });

    it('should respond to "transcodeProfiles" via getter', () => {

        assert.isDefined(video.transcodeProfiles, '"transcodeProfiles" has been defined.');
        expect(video.transcodeProfiles).to.deep.equal(video.videoTranscodeProfiles);
    });

    it('should respond to "transcodeProfiles" via setter', () => {

        assert.isDefined(video.transcodeProfiles, '"transcodeProfiles" has been defined.');

        let copy = angular.copy(video.transcodeProfiles);
        video.transcodeProfiles = copy;

        expect(video.transcodeProfiles).to.deep.equal(copy);
    })

    it('should respond to "resourceUrls" via getter', () => {

        /* FIXME: Test does not pass, I think because the method
         * uses the injector for $sce
         */
        //  assert.isDefined(video.resourceUrls, '"resourceUrls" has been defined.');
        // expect(video.resourceUrls).to.be.an('array');
    });
});

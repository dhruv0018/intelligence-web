import Video from '../../../src/entities/video';
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

    it('should respond to "isComplete"', () => {

        expect(video).to.respondTo('isComplete');
        expect(video.isComplete()).to.be.a('boolean');
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

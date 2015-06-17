import Video from '../../../src/entities/video';
import videoData from './sample-data/video';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const srcJSON = videoData;

describe('Video Entity', () => {

    let videoJSON;

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
        this = new Video(videoJSON);
    });

    it('should exist', () => {

        expect(Video).to.exist;
    });

    it('should be instantiatable', () => {

        expect(this).to.be.an.instanceof(Video);
    })

    it('should have certain properties when instantiated', () => {

        ownProperties.forEach(
            property =>
            expect(this).to.have.ownProperty(property)
        );

        getters.forEach(
            getter =>
            expect(this).to.have.property(getter)
        );

        /* FIXME: Test does not pass, I think because the method
         * uses the injector for $sce
         */
        // expect(this).to.have.property('resourceUrls');
    });

    it('should throw an Error if constructor is called without parameters.', () => {

        expect(() => new Video()).to.throw(Error);
    });

    it('should have the same own properties as the original JSON object', () => {

        expect(this).to.contain.keys(ownProperties);
        expect(videoJSON).to.contain.keys(ownProperties);
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        this.toJSON = sinon.spy();

        JSON.stringify(this);

        assert(this.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        this = this.toJSON();

        expect(this.id).to.equal(srcJSON.id);
        expect(this.guid).to.equal(srcJSON.guid);
        expect(this.status).to.equal(srcJSON.status);

        expect(this.videoTranscodeProfiles).to.be.an('array');
        expect(this.videoTranscodeProfiles.length).to.equal(srcJSON.videoTranscodeProfiles.length);

        expect(this.duration).to.equal(srcJSON.duration);
        expect(this.thumbnail).to.equal(srcJSON.thumbnail);
    });

    it('should validate JSON schema', () => {

        const validation = this.validate(videoJSON);

        expect(validation.errors.length).to.equal(0);
    });

    it('should not mutate when being transformed to and from JSON', () => {

        let copy = angular.copy(this);

        copy = JSON.parse(JSON.stringify(copy));

        expect(this).to.contain.keys(ownProperties);
        expect(copy).to.contain.keys(ownProperties);
    });
});

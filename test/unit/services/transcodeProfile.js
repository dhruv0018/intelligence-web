import TranscodeProfile from '../src/entities/transcodeProfile';
import transcodeProfileData from './sample-data/transcodeProfile';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('TranscodeProfile Entity', () => {

    const transcodeProfile;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(() => {

        sampleTranscodeProfile = angular.copy(srcJSON);
        transcodeProfile = new TranscodeProfile(sampleTranscodeProfile);
    });

    it('should exist', () => {

        expect(TranscodeProfile).to.exist;
    });

    it('should have a public API', () => {

        expect(TranscodeProfile).to.respondTo('id');
        expect(TranscodeProfile).to.respondTo('videoId');
        expect(TranscodeProfile).to.respondTo('targetBitrate');
        expect(TranscodeProfile).to.respondTo('maximumBitrate');
        expect(TranscodeProfile).to.respondTo('minimumBitrate');
        expect(TranscodeProfile).to.respondTo('targetDisplayWidth');
        expect(TranscodeProfile).to.respondTo('targetDisplayHeight');
        expect(TranscodeProfile).to.respondTo('aspectRatio');
        expect(TranscodeProfile).to.respondTo('title');
        expect(TranscodeProfile).to.respondTo('status');
        expect(TranscodeProfile).to.respondTo('url');
        expect(TranscodeProfile).to.respondTo('resourceUrl');
    });

    it('should throw an Error if constructor is called without parameters.', () => {

        expect(() => new TranscodeProfile()).to.throw(Error);
    });

    it('should have called super in the constructor', () => {

        transcodeProfile.super = sinon.spy();

        let instantiation = new TranscodeProfile(sampleTranscodeProfile);

        assert(transcodeProfile.super.should.have.been.called);
    });

    it('should have certain properties when instantiated', () => {

        expect(transcodeProfile).to.contain.keys([
            'id',
            'videoId',
            'url',
            'videoUrl',
            'profile',
            'transcodeProfileId'
            'targetBitrate',
            'maximumBitrate',
            'minimumBitrate',
            'description',
            'targetDisplayWidth',
            'targetDisplayHeight',
            'aspectRatio',
            'title',
            'resourceUrl'
        ]);
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        transcodeProfile.toJSON = sinon.spy();

        JSON.stringify(transcodeProfile);

        assert(transcodeProfile.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        transcodeProfile = transcodeProfile.toJSON();

        expect(transcodeProfile.id).to.equal(srcJSON.id);
        expect(transcodeProfile.videoId).to.equal(srcJSON.videoId);

        expect(transcodeProfile.transcodeProfile).to.be.an('object');
        expect(transcodeProfile.transcodeProfile).to.deep.equal(srcJSON.transcodeProfile);

        expect(transcodeProfile.status).to.equal(srcJSON.status);
        expect(transcodeProfile.videoUrl).to.equal(srcJSON.videoUrl);
    });
});

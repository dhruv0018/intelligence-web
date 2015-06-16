import Video from '../../../src/entities/video';
import videoData from './sample-data/video';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const srcJSON = videoData;

describe('Video Entity', () => {

    const video;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(() => {

        sampleVideo = angular.copy(srcJSON);
        video = new Video(sampleVideo);
    });

    it('should exist', () => {

        expect(Video).to.exist;
    });

    it('should have a public API', () => {

        expect(Video).to.respondTo('id');
        expect(Video).to.respondTo('guid');
        expect(Video).to.respondTo('status');
        expect(Video).to.respondTo('transcodeProfiles');
        expect(Video).to.respondTo('duration');
        expect(Video).to.respondTo('thumbnail');
        expect(Video).to.respondTo('resourceUrls');
    });

    it('should throw an Error if constructor is called without parameters.', () => {

        expect(() => new Video()).to.throw(Error);
    });

    it('should have called super in the constructor', () => {

        video.super = sinon.spy();

        let instantiation = new Video(sampleVideo);

        assert(video.super.should.have.been.called);
    });

    it('should have certain properties when instantiated', () => {

        expect(video).to.contain.keys([
            'id',
            'guid',
            'status',
            'transcodeProfiles',
            'videoTranscodeProfiles',
            'duration',
            'thumnbail',
            'resourceUrls'
        ]);
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
        expect(video.videoTranscodeProfiles).to.deep.equal(srcJSON.videoTranscodeProfiles);

        expect(video.duration).to.equal(srcJSON.duration);
        expect(video.thumbnail).to.equal(srcJSON.thumbnail);
    });
});

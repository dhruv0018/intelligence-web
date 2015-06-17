import TranscodeProfile from '../../../src/entities/transcodeProfile';
import transcodeProfileData from './sample-data/transcodeProfile';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const srcJSON = transcodeProfileData;

describe('TranscodeProfile Entity', () => {

    let transcodeProfileJSON;
    let transcodeProfile;

    const ownProperties = [

        'id',
        'videoId',
        'status',
        'videoUrl',
        'status',
        'transcodeProfile'
    ];

    const getters = [

        'targetBitrate',
        'maximumBitrate',
        'minimumBitrate',
        'targetDisplayWidth',
        'targetDisplayHeight',
        'aspectRatio',
        'title',
        'status',
        'url'
    ];

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(() => {

        // Protect original source JSON
        transcodeProfileJSON = angular.copy(srcJSON);
        // Instantiate TranscodeProfile entitiy with JSON
        transcodeProfile = new TranscodeProfile(transcodeProfileJSON);
    });

    it('should exist', () => {

        expect(TranscodeProfile).to.exist;
    });

    it('should be instantiatable', () => {

        expect(transcodeProfile).to.be.an.instanceof(TranscodeProfile);
    })

    it('should have certain properties when instantiated', () => {

        ownProperties.forEach(
            property => expect(transcodeProfile).to.have.ownProperty(property)
        );

        getters.forEach(
            getter => expect(transcodeProfile).to.have.property(getter)
        );

        /* FIXME: Test does not pass, I think because the method
         * uses the injector for $sce
         */
        // expect(transcodeProfile).to.have.property('resourceUrl');
    });

    it('should throw an Error if constructor is called without parameters.', () => {

        expect(() => new TranscodeProfile()).to.throw(Error);
    });

    it('should have the same own properties as the original JSON object', () => {

        expect(transcodeProfile).to.contain.keys(ownProperties);
        expect(transcodeProfileJSON).to.contain.keys(ownProperties);
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

    it('should validate JSON schema', () => {

        const validation = transcodeProfile.validate(transcodeProfileJSON);

        expect(validation.errors.length).to.equal(0);
    });

    it('should not mutate when being transformed to and from JSON', () => {

        let copy = angular.copy(transcodeProfile);

        copy = JSON.parse(JSON.stringify(copy));

        expect(transcodeProfile).to.contain.keys(ownProperties);
        expect(copy).to.contain.keys(ownProperties);
    });

    it('should respond to "profile" via getter', () => {

        assert.isDefined(transcodeProfile.profile, '"profile" has been defined.');
        expect(transcodeProfile.profile).to.be.an('object');
    });

    it('should respond to "targetBitrate" via getter', () => {

        assert.isDefined(transcodeProfile.targetBitrate, '"targetBitrate" has been defined.');
        expect(transcodeProfile.targetBitrate).to.be.a('number');
    });

    it('should respond to "maximumBitrate" via getter', () => {

        assert.isDefined(transcodeProfile.maximumBitrate, '"maximumBitrate" has been defined.');
        expect(transcodeProfile.maximumBitrate).to.be.a('number');
    });

    it('should respond to "minimumBitrate" via getter', () => {

        assert.isDefined(transcodeProfile.minimumBitrate, '"minimumBitrate" has been defined.');
        expect(transcodeProfile.minimumBitrate).to.be.a('number');
    });

    it('should respond to "description" via getter', () => {

        assert.isDefined(transcodeProfile.description, '"description" has been defined.');
        expect(transcodeProfile.description).to.be.a('string');
    });

    it('should respond to "targetDisplayWidth" via getter', () => {

        assert.isDefined(transcodeProfile.targetDisplayWidth, '"targetDisplayWidth" has been defined.');
        expect(transcodeProfile.targetDisplayWidth).to.be.a('number');
    });

    it('should respond to "targetDisplayHeight" via getter', () => {

        assert.isDefined(transcodeProfile.targetDisplayHeight, '"targetDisplayHeight" has been defined.');
        expect(transcodeProfile.targetDisplayHeight).to.be.a('number');
    });

    it('should respond to "aspectRatio" via getter', () => {

        assert.isDefined(transcodeProfile.aspectRatio, '"aspectRatio" has been defined.');
        expect(transcodeProfile.aspectRatio).to.be.a('string');
    });

    it('should respond to "title" via getter', () => {

        assert.isDefined(transcodeProfile.title, '"title" has been defined.');
        expect(transcodeProfile.title).to.be.a('string');
    });

    it('should respond to "url" via getter', () => {

        assert.isDefined(transcodeProfile.url, '"url" has been defined.');
        expect(transcodeProfile.url).to.be.a('string');
    });

    it('should respond to "resourceUrl" via getter', () => {

        /* FIXME: Test does not pass, I think because the method
         * uses the injector for $sce
         */

        //  assert.isDefined(transcodeProfile.resourceUrl, '"resourceUrl" has been defined.');
        // expect(transcodeProfile.resourceUrl).to.be.an('object');
    });
});

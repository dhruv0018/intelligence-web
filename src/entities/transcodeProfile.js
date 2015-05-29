import Entity from './entity';

/**
 * Transcode profiles & ids constants
 * @const {Object} TRANSCODE_PROFILE_IDS
 * @const {Object} TRANSCODE_PROFILES
 */
import { TRANSCODE_PROFILE_IDS, TRANSCODE_PROFILES } from '../constants/transcodeProfiles';

/**
 * tv4 3rd party JSON validation library
 * @const {Object} tv4
 */
const tv4 = require('tv4');

/**
 * TranscodeProfile object JSON schema
 * @const {Object} schema
 */
const schema = require('../../schemas/transcode-profile.json');

/**
 * How to use TranscodeProfile entity
 * @example
 * let TranscodeProfileJSONObject = {
 *     "id": 1544085,
 *     "videoId": 354704,
 *     "transcodeProfile": {
 *         "id": 1,
 *         "targetBitrate": 600,
 *         "maximumBitrate": 800,
 *         "minimumBitrate": 0,
 *         "description": "SD Low Resolution (360p)",
 *         "targetDisplayWidth": 640,
 *         "targetDisplayHeight": 360,
 *         "aspectRatio": "16:9"
 *     },
 *     "status": 4,
 *     "videoUrl": "http:\/\/krossover-com-prod-content.cdn.krossover.com\/videos\/finished\/ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998_600.mp4"
 * }
 * $scope.transcodeProfile = new TranscodeProfile(TranscodeProfileJSONObject);
 * // Use accessor methods
 * <video
 *     src="{{transcodeProfile.videoUrl}}"
 *     height="{{transcodeProfile.targetDisplayHeight}}"
 *     width="{{transcodeProfile.targetDisplayWidth}}"
 * ></video>
 */

/**
 * TranscodeProfile Entity Model
 * @class TranscodeProfile
 */
class TranscodeProfile extends Entity {

    /**
     * Instantiates new TranscodeProfile entity
     * @constructor
     * @param {Object} TranscodeProfileJSONObject (req)
     * @returns {TranscodeProfile} TranscodeProfile entity
     */
    constructor (transcodeProfile) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking TranscodeProfile.constructor without passing a JSON object');
        }

        let validation = this.validate(transcodeProfile);
        if (validation.errors.length) {

            throw new Error(validation.errors.shift());
        }

        // Simplify DB object to constant id for lookups
        transcodeProfile.transcodeProfileId = transcodeProfile.transcodeProfile.id;
        delete transcodeProfile.transcodeProfile;

        return this.extend(transcodeProfile);
    }

    /**
    * Checks a transcodeProfile JSON object for valid properties
    * @method TranscodeProfile.validate
    * @param {Object} TranscodeProfileJSONObject [req]
    * @returns {Boolean} validated [true] if valid object
    */
    validate (transcodeProfile) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking TranscodeProfile.validate without passing a JSON object');
        }

        let validation =  tv4.validateMultiple(transcodeProfile, schema);

        return validation;
    }

    /**
     * Getter for TranscodeProfile.id
     * @method TranscodeProfile.id
     * @readonly
     * @returns {Integer} id
     */
    get id() {

        return this.id;
    }

    /**
     * Getter for TranscodeProfile.videoId
     * @method TranscodeProfile.videoId
     * @readonly
     * @returns {Integer} videoId
     */
    get videoId() {

        return this.videoId;
    }

    /**
     * Getter for TranscodeProfile.profile
     * @method TrancodeProfile.profile
     * @readonly
     * @returns {TRANSCODE_PROFILE} constant
     */
    get profile() {

        return TRANSCODE_PROFILES[TRANSCODE_PROFILE_IDS[this.transcodeProfileId]];
    }

    /**
     * Getter for TranscodeProfile.targetBitrate
     * @method TranscodeProfile.targetBitrate
     * @readonly
     * @returns {Integer} targetBitrate
     */
    get targetBitrate() {

        return this.profile.targetBitrate;
    }

    /**
     * Getter for TranscodeProfile.maximumBitrate
     * @method TranscodeProfile.maximumBitrate
     * @readonly
     * @returns {Integer} maximumBitrate
     */
    get maximumBitrate() {

        return this.profile.maximumBitrate;
    }

    /**
     * Getter for TranscodeProfile.minimumBitrate
     * @method TranscodeProfile.minimumBitrate
     * @readonly
     * @returns {Integer} minimumBitrate
     */
    get minimumBitrate() {

        return this.profile.minimumBitrate;
    }

    /**
     * Getter for TranscodeProfile.description
     * @method TranscodeProfile.description
     * @readonly
     * @returns {String} description
     */
    get description() {

        return this.profile.description;
    }

    /**
     * Getter for TranscodeProfile.targetDisplayWidth
     * @method TranscodeProfile.targetDisplayWidth
     * @readonly
     * @returns {Integer} width
     */
    get targetDisplayWidth() {

        return this.profile.targetDisplayWidth;
    }

    /**
     * Getter for TranscodeProfile.targetDisplayHeight
     * @method TranscodeProfile.targetDisplayHeight
     * @readonly
     * @returns {Integer} height
     */
    get targetDisplayHeight() {

        return this.profile.targetDisplayHeight;
    }

    /**
     * Getter for TranscodeProfile.aspectRatio
     * @method TranscodeProfile.aspectRatio
     * @readonly
     * @returns {String} aspectRatio
     */
    get aspectRatio() {

        return this.profile.aspectRatio;
    }

    /**
     * Getter for TranscodeProfile.status
     * @method TranscodeProfile.status
     * @readonly
     * @returns {Integer} status
     */
    get status() {

        return this.status;
    }

    /**
     * Getter for TranscodeProfile.url
     * @method TranscodeProfile.url
     * @readonly
     * @returns {String} url
     */
    get url() {

        return this.videoUrl;
    }

    /**
     * Getter for TranscodeProfile.resourceUrl
     * @method TranscodeProfile.resourceUrl
     * @readonly
     * @returns {Object} resourceUrl Trusted Resource URL
     */
    get resourceUrl() {

        /**
         * Angular Dependency Injector
         * @const {Object} injector
         */
        const injector = window.angular.element(document).injector();

        /**
         * Angular Strict Contextual Escaping service
         * @const {Object} $sce
         */
        const $sce = injector.get('$sce');

        return {

            type: 'video/mp4',
            src: $sce.trustAsResourceUrl(this.url)
        };
    }
}

/**
 * @module TranscodeProfile
 * @exports entities/transcodeProfile
 */
export default TranscodeProfile;

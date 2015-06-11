import BaseEvent from './base';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

class CustomTagsEvent extends BaseEvent {

    /*
     * Custom Tags Event constructor
     * @param {Array} updatedPlayIds - plays that custom tags were updated on
     * @param {Integer} updatedTagCount - number of tags that have been updated
     * @param {Boolean} showConfirmation - whether or not confirmation should be shown to user
     */

    constructor (updatedPlayIds = [], updatedTagCount = 0, showConfirmation = false) {
        this.updatedPlayIds = updatedPlayIds;
        this.updatedTagCount = updatedTagCount;
        this.showConfirmation = showConfirmation;
    }
}

// TODO: export class directly
IntelligenceWebClient.factory('CustomTagsEvent', () => CustomTagsEvent);

export default CustomTagsEvent;

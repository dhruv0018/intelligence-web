import BaseEvent from './base';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

class CustomTagsEvent extends BaseEvent {

    /*
     *
     *
     */

    constructor (updatedPlayIds = [], updatedTagCount = 0, showConfirmation = false) {
        this.updatedPlayIds = updatedPlayIds;
        this.updatedTagCount = updatedTagCount;
        this.showConfirmation = showConfirmation;
    }
}

function CustomTagsEventFactory() {
    return CustomTagsEvent;
}

IntelligenceWebClient.factory('CustomTagsEvent', CustomTagsEventFactory);

export default CustomTagsEvent;

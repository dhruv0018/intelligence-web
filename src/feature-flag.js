const FLAGS = require('../config/feature-flags.json');
const pkg = require('../package.json');

let TO = '';
let ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.run(featureFlagRun);

featureFlagRun.$inject = [
    '$rootScope',
    'config'
];

/* Bind the flags to the rootscope */

function featureFlagRun(
    $rootScope,
    config
) {

    $rootScope.FLAGS = FLAGS[config.environment] || {};
}


/* Feature Flag Directive */

IntelligenceWebClient.directive('featureFlag', featureFlagDirective);

featureFlagDirective.$inject = [
    'config',
    'FEATURE_FLAG_TYPES'
];
/**
 * Feature Flag directive.
 * @module IntelligenceWebClient
 * @name Feature Flag
 * @type {Directive}
 */
function featureFlagDirective(
    config,
    FEATURE_FLAG_TYPES
) {

    const featureFlag = {

        restrict: TO += ATTRIBUTES,

        link: featureFlagLink,

        priority: 10
    };

    /*
     * IMPORTANT!!!
     * featureFlag can have 2 modes, 'SELF' and 'AUTO'. (SEE FEATURE_FLAG_TYPES constant for details)
     */
    function featureFlagLink($scope, $element, $attributes) {

        let featureFlagType = $attributes.featureFlag;

        if (featureFlagType === FEATURE_FLAG_TYPES.AUTO) {

            $element.attr('style', 'display: none !important;');
        }
    }

    return featureFlag;
}

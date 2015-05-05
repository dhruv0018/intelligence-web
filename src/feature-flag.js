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
    'config'
];
/**
 * Feature Flag directive.
 * @module IntelligenceWebClient
 * @name Feature Flag
 * @type {Directive}
 */
function featureFlagDirective(
    config
) {

    const featureFlag = {

        restrict: TO += ATTRIBUTES,

        link: featureFlagLink,

        priority: 10
    };

    /*
     * IMPORTANT!!!
     * featureFlag can have 2 modes, with the attribute as a boolean indicating
     * which mode is turned on.
     * If the featureFlag has a boolean of true, this indicates
     * that the $element should handle its own disablement (i.e. elements that transclude content).
     * If the featureFlag is set to false, then the $element will be hidden. Otherwise, there will
     * be no affect on the $element and/or its children.
     */
    function featureFlagLink($scope, $element, $attributes) {

        let featureFlagType = $attributes.featureFlag;

        if (featureFlagType === 'auto') {

            $element.css('display', 'none');
        }
    }

    return featureFlag;
}

const CLASSES = 'C';
const ELEMENTS = 'E';
const ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Feature module.
 * @module Feature
 */
const Feature = angular.module('Feature', []);

function link ($scope, element, attributes) {

    /* Get the injector. */
    const injector = angular.element(document).injector();

    /* Get dependencies. */
    const features = injector.get('Features');

    /* Determine the feature name by the attributes given. */
    let featureName = attributes.feature || attributes.name;

    /* Add the feature class to the element. */
    element[0].classList.add('feature');

    /* Consider all features disabled by default. */
    element[0].classList.add('disabled');

    let isFeatureEnabled = features.isEnabled(featureName);

    /* If the feature is enabled. */
    if (isFeatureEnabled) {

        element[0].classList.add('enabled');
        element[0].classList.remove('disabled');
    }
}

/**
 * Feature directive.
 *
 * === Usage ===
 *
 * As an attribute:
 * ```
 * <h1 feature="h1">H!</h1>
 * ```
 *
 * As a class:
 * ```
 * <div class="feature: h2"><h2>H2</h2></div>
 * ```
 *
 * @module Feature
 * @name feature
 * @type {directive}
 */
function feature () {

    const definition = {

        restrict: CLASSES + ATTRIBUTES,
        link
    };

    return definition;
}

/**
 * Krossover Feature directive.
 *
 * === Usage ===
 *
 * As an element:
 * ```
 * <krossover-feature name="h3"><h3>H3</h3></krossover-feature>
 * ```
 *
 * @module Feature
 * @name krossoverFeature
 * @type {directive}
 */
function krossoverFeature () {

    const definition = {

        restrict: ELEMENTS,
        transclude: true,
        link,
        template: '<ng-transclude></ng-transclude>'
    };

    return definition;
}

Feature.directive('feature', feature);
Feature.directive('krossoverFeature', krossoverFeature);

export default feature;

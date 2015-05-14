const CLASSES = 'C';
const ELEMENTS = 'E';
const ATTRIBUTES = 'A';

const WILDCARD = '*';

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
    const FEATURES = injector.get('FEATURES');
    const $location = injector.get('$location');
    const session = injector.get('SessionService');

    /* Determine the feature name by the attributes given. */
    let featureName = attributes.feature || attributes.name;

    /* Add the feature class to the element. */
    element[0].classList.add('feature');

    /* Consider all features disabled by default. */
    element[0].classList.add('disabled');

    /* Copy features constant to a local variable. */
    let features = Object.assign({}, FEATURES);

    /* Look for query string parameters that indicate feature toggles. */
    let enable = angular.fromJson($location.search().enable);
    let disable = angular.fromJson($location.search().disable);

    /* If either of the query string parameters are arrays,
     * treat each array item as a feature config. */
    if (Array.isArray(enable)) enable.forEach(enableFeature);
    if (Array.isArray(disable)) disable.forEach(disableFeature);

    /**
     * Enables the given feature.
     * @param featureName - name of the feature to enable.
     */
    function enableFeature (featureName) {

        features[featureName] = {};
        features[featureName][WILDCARD] = true;
    }

    /**
     * Disables the given feature.
     * @param featureName - name of the feature to disable.
     */
    function disableFeature (featureName) {

        delete features[featureName];
    }

    /* Lookup the feature by name in the feature table. */
    let feature = features[featureName];

    /* If the feature has been flagged. */
    if (feature) {

        /* Get the current users current role. */
        let roleName = session.getCurrentRoleName();

        /* Consider the feature enabled if it is enabled for everyone or for
            * the users current role. */
        let isFeatureEnabled = feature[WILDCARD] || feature[roleName];

        /* If the feature is enabled. */
        if (isFeatureEnabled) {

            element[0].classList.add('enabled');
            element[0].classList.remove('disabled');
        }
    }

    /* Warn if the feature has not been flagged. */
    else console.warn(`Feature "${featureName}" is unflagged!`);
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

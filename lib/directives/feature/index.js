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

/**
 * Feature dependencies
 */
feature.$inject = [
    'FEATURES',
    'SessionService'
];

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
function feature (
    FEATURES,
    session
) {

    const definition = {

        restrict: CLASSES + ATTRIBUTES,
        link
    };

    function link ($scope, element, attributes) {

        /* Add the feature class to the element. */
        element[0].classList.add('feature');

        /* Consider all features disabled by default. */
        element[0].classList.add('disabled');

        /* Determine the feature name by the attributes given. */
        let featureName = attributes.feature;

        /* Lookup the feature by name in the feature table. */
        let feature = FEATURES[featureName];

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
        else console.warn(`Feature "${featureName}" is not flagged!`);
    }

    return definition;
}

/**
 * Krossover Feature dependencies
 */
krossoverFeature.$inject = [
    'FEATURES',
    'SessionService'
];

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
function krossoverFeature (
    FEATURES,
    session
) {

    const definition = {

        restrict: ELEMENTS,
        transclude: true,
        link,
        template: '<ng-transclude></ng-transclude>'
    };

    function link ($scope, element, attributes) {

        /* Add the feature class to the element. */
        element[0].classList.add('feature');

        /* Consider all features disabled by default. */
        element[0].classList.add('disabled');

        /* Determine the feature name by the attributes given. */
        let featureName = attributes.name;

        /* Lookup the feature by name in the feature table. */
        let feature = FEATURES[featureName];

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
        else console.warn(`Feature "${featureName}" is not flagged!`);
    }

    return definition;
}

Feature.directive('feature', feature);
Feature.directive('krossoverFeature', krossoverFeature);

export default feature;

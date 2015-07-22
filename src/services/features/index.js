const WILDCARD = '*';

class Features {

    constructor (session, FEATURES, $location) {

        this.session = session;
        /* Copy features constant to a local variable. */
        this.features = Object.assign({}, FEATURES);
        this.$location = $location;

        /* Look for query string parameters that indicate feature toggles. */
        let enable = angular.fromJson($location.search().enable);
        let disable = angular.fromJson($location.search().disable);

        /* Bind functions to the thisObject */
        this.enableFeature = this.enableFeature.bind(this);
        this.disableFeature = this.disableFeature.bind(this);
        this.isEnabled = this.isEnabled.bind(this);

        /* If either of the query string parameters are arrays,
         * treat each array item as a feature config. */
        if (Array.isArray(enable)) enable.forEach(this.enableFeature);
        if (Array.isArray(disable)) disable.forEach(this.disableFeature);
    }

    /**
     * Enables the given feature.
     * @param {string} featureName - name of the feature to enable.
     */
    enableFeature (featureName) {

        this.features[featureName] = {};
        this.features[featureName][WILDCARD] = true;
    }

    /**
     * Disables the given feature.
     * @param featureName - name of the feature to disable.
     */
    disableFeature (featureName) {

        delete this.features[featureName];
    }

    /**
     * Checks if a given feature is enabled
     * @param {string} featureName - name of the feature to check
     * @returns {boolean}
     */
    isEnabled (featureName) {

        /* Lookup the feature by name in the feature table. */
        let feature = this.features[featureName];

        /* If the feature has been flagged. */
        if (feature) {

            /* Get the current users current role. */
            let roleName = this.session.getCurrentRoleName();

            /* Consider the feature enabled if it is enabled for everyone or for
                * the users current role. */
            let isFeatureEnabled = feature[WILDCARD] || feature[roleName];

            return isFeatureEnabled;
        }

        /* Warn if the feature has not been flagged. */
        else console.warn(`Feature "${featureName}" is unflagged!`);
    }
}

export default Features;

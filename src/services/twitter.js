const pkg = require('../../package.json');

/* Take a moment */
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to manage a users account state. It handles setting the users role
 * and broadcasting the change.
 * @module IntelligenceWebClient
 * @name TwitterService
 * @type {service}
 */
IntelligenceWebClient.service('TwitterService', TwitterService);

TwitterService.$inject = [
    'AnalyticsService'
];

function TwitterService (
    analytics
) {

    /* Bind Callback for Analytics on successful follow event */
    twttr.events.bind(
        'follow',
        function bindFollowEvent (event) {

            let context = event.target.parentElement.id;

            switch (context) {

                case 'new-terms-twitter-follow':

                analytics.track({
                    category  : 'Twitter',
                    action    : 'Followed',
                    label     : 'TermsAndConditonsAccept',
                    property1 : 'Returning User'
                });

                break;

                case 'new-user-twitter-follow':

                analytics.track({
                    category  : 'Twitter',
                    action    : 'Followed',
                    label     : 'NewUserPasswordSet',
                    property1 : 'New User'
                });

                break;
            }
        }
    );

    return {

        /**
         * Dynamically creates a Twitter Follow button.
         * @method createFollowButton
         * @return {Promise}
         */

        createFollowButton: function createFollowButton (element) {

            /* Dynamically create a Twitter Follow button to be placed in
             * the DOM element that is passed in. */
            element = angular.isString(element) ? document.getElementById(element) : element;
            let options = {

                showCount: false,
                size: 'large'
            };

            return twttr.widgets.createFollowButton('krossovr', element, options)
            .then(function rebindTwitterCallbacks () {

                console.log('What about this? Are you here???????');
                twttr.widgets.load(element);
            });
        }
    };
}

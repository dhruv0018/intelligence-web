/* Fetch angular from the browser scope */
const angular = window.angular;
const AthleteProfileHightlighsTemplateUrl = 'app/athlete/profile/highlights/template.html';

import AthleteHighlightsController from './controller';
/**
 * Highlights page module.
 * @module Highlights
 */
const Highlights = angular.module('Athlete.Profile.Highlights', [
    'ui.router',
    'ui.bootstrap',
    'no-results'
]);

/**
 * Profile.Highlights page state router.
 * @module Profile.Highlights
 * @type {UI-Router}
 */
Highlights.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.Highlights', {
            views: {
                'highlights@Athlete.Profile': {
                    templateUrl: AthleteProfileHightlighsTemplateUrl,
                    controller: AthleteHighlightsController
                }
            },
            onEnter: [
                '$stateParams',
                'SessionService',
                'ProfileOnboarding.Modal',
                function onboarding(
                    $stateParams,
                    session,
                    profileOnboardingModal
                ) {
                    let currentUser = session.getCurrentUser();
                    const userId = Number($stateParams.id);
                    if (currentUser.id === userId && !currentUser.profile.primarySportId) {
                        profileOnboardingModal.open();
                    }
                }
            ]
        });
    }
]);

var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.config([
    '$locationProvider',
    function config($locationProvider) {

        $locationProvider.html5Mode(true);
    }
]);

IntelligenceWebClient.value('$previousState', {});

IntelligenceWebClient.run([
    'ANONYMOUS_USER',
    '$rootScope',
    '$urlRouter',
    '$state',
    '$stateParams',
    '$previousState',
    '$q',
    'TokensService',
    'AuthenticationService',
    'AuthorizationService',
    'SessionService',
    'AlertsService',
    'AccountService',
    'TermsDialog.Service',
    'MobileAppDialog.Service',
    'DetectDeviceService',
    function run(
        ANONYMOUS_USER,
        $rootScope,
        $urlRouter,
        $state,
        $stateParams,
        $previousState,
        $q,
        tokens,
        auth,
        authz,
        session,
        alerts,
        account,
        TermsDialog,
        MobileAppDialog,
        detectDevice
    ) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            /* If the user is accessing a public state. */
            if (authz.isPublic(toState)) {

                /* If not logged in. */
                if (!auth.isLoggedIn) {

                    /* Store the user in the session. */
                    session.storeCurrentUser(ANONYMOUS_USER);

                    /* Retrieve the user from the session. */
                    var currentUser = session.retrieveCurrentUser();

                    /* Expose the current user on the root scope. */
                    $rootScope.currentUser = currentUser;
                }

                /* It there is no access token set. */
                if (!tokens.getAccessToken()) {

                    /* Prevent the state from loading. */
                    event.preventDefault();

                    /* Request client tokens. */
                    tokens.requestClientTokens()

                    /* If the tokens request is successful. */
                    .then(function(authTokens) {

                        /* Set the tokens. */
                        tokens.setTokens(authTokens);
                    })

                    /* In any case, finally. */
                    .finally(function() {

                        /* Go to state, but without starting state transition again. */
                        $state.go(toState.name, toParams, {notify: false}).then(function() {

                            /* Broadcast the success of the state transition. */
                            $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
                        });
                    });
                }
            }

            /* If not accessing a public state and not logged in, then
             * redirect the user to login. */
            else if (!auth.isLoggedIn) {

                /* Prevent the state from loading. */
                event.preventDefault();

                /* Redirect the user to the login page. */
                $state.go('login');
            }

            /* Ensure the current user has access to the route. */
            else if (!authz.isAuthorized(toState)) {

                /* Prevent the state from loading. */
                event.preventDefault();

                alerts.add({
                    type: 'info',
                    message: 'You do not have permission to go to ' + toState.name
                });
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            /* Clear any alerts. */
            alerts.clear();

            /* Store previous state */
            $previousState = fromState;

            /* Get previous user */
            let previousUser = session.retrievePreviousUser();

            /* Make sure we aren't an admin switching to another user as we
             * don't want to accidentially accept the terms on behalf of the
             * user. Also make sure we're logged in. Then check for terms. */
            if (previousUser || !auth.isLoggedIn) return;

            /* Check for Terms acceptance/prompt user to accept,
             * then, if mobile user, show links to download native apps. */
            $q(function checkTermsAcceptance (resolve, reject) {

                /* Get user */
                let user = session.retrieveCurrentUser();

                if (!user.lastAccessed) {

                    /* If first login, user has already accepted Terms and
                     * Conditions by setting password, so record that here. */
                    user.updateTermsAcceptedDate();
                } else if (!account.hasAcceptedTerms()) {

                    /* If the user has NOT accepted the Terms & Conditions,
                     * prompt them to accept, then record time of acceptance. */
                    $state.go('ReacceptTermsAndConditions');
                }

                resolve();
            }).then(function promoteMobileApps () {

                /* Is user using an iOS or Android device? */
                let isMobile = detectDevice.iOS() || detectDevice.Android();

                /* If a new user, then only show the mobile app dialog. */
                if (isMobile) return MobileAppDialog.show();
            });
        });

        $rootScope.$on('roleChangeSuccess', function(event, role) {

            /* Ensure the current user still has access to the current state. */
            if (!authz.isAuthorized($state.current)) {

                $state.go('Account.ContactInfo');
            }
        });
    }
]);

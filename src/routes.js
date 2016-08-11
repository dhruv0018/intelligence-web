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
    '$timeout',
    'DetectDeviceService',
    'MobileAppDialog.Service',
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
    'AnalyticsService',
    'AccountService',
    function run(
        $timeout,
        detectDevice,
        MobileAppDialog,
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
        analytics,
        account
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
            }else{
                if(localStorage.getItem('emailChanged')){
                    //check if email exist if not, clear session and delete localstorage item
                    if(localStorage.getItem('emailChanged') != session.getCurrentUserEmail()){
                        event.preventDefault();
                        localStorage.removeItem('emailChanged');
                        sessionStorage.clear();
                        location.reload();
                    }
                }
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            /* Clear any alerts. */
            alerts.clear();
            analytics.identify();

            for(var i=0; i<5; i++){
                startAppcues(i);
            }

            /* Store previous state */
            $previousState = fromState;

            /* Get previous user */
            let previousUser = session.retrievePreviousUser();

            /* Make sure we aren't an admin switching to another user as we
             * don't want to accidentially accept the terms on behalf of the
             * user. Also make sure we're logged in. Then check for terms. */
            if (previousUser || !auth.isLoggedIn) return;

            /* Check for latest Terms acceptance/prompt user to accept. */
            if (!account.hasAcceptedTerms()) {

                /* If the user has NOT accepted the Terms & Conditions,
                 * prompt them to accept. */
                $state.go('UpdatedTermsAndConditions');
            } else {

                /* Is user using an iOS or Android device? */
                let isMobile = detectDevice.iOS() || detectDevice.Android();

                /* If a new user, then only show the mobile app promo dialog. */
                if (isMobile) {

                    $timeout(MobileAppDialog.show);
                }
            }
        });

        $rootScope.$on('roleChangeSuccess', function(event, role) {

            /* Ensure the current user still has access to the current state. */
            if (!authz.isAuthorized($state.current)) {

                $state.go('Account.ContactInfo');
            }
        });

        // Calls the Appcues start function to show dialogs with an n-second delay
        // Used because some dialogs are linked to elements on the page which display 
        // after certain data is loaded by the controller.
        function startAppcues(delay){
            setTimeout(function(){
                Appcues.start();
            }, delay*1000);
        }
    }
]);

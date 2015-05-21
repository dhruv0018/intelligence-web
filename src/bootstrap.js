const pkg = require('../package.json');

/* Enable strict DI checking in development. */
const strictDi = process.env.NODE_ENV === 'development';

/* Fetch angular from the browser scope */
var angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

config.$inject = [
    '$provide',
    '$filterProvider',
    '$compileProvider',
    '$controllerProvider'
];

function config (
    $provide,
    $filterProvider,
    $compileProvider,
    $controllerProvider
) {

    angular.$provide = $provide;
    angular.$filterProvider = $filterProvider;
    angular.$compileProvider = $compileProvider;
    angular.$controllerProvider = $controllerProvider;
}

IntelligenceWebClient.config(config);

angular.bootstrap(document, [pkg.name], { strictDi });

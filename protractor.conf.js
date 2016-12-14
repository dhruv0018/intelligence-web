var environment = process.env.NODE_ENV;

var baseUrl = 'http://localhost:9999/intelligence/';

if (environment === 'development') {

    baseUrl = 'http://localhost:9999/intelligence/';
}

else if (environment === 'preprod') {

    baseUrl = 'https://v2-pre-prod.krossover.com/intelligence/';
}

else if (environment === 'uat') {

    baseUrl = 'https://v2-uat.krossover.com/intelligence/';
}

exports.config = {

    framework: 'custom',

    // path relative to the current config file
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    // specs: [
    //     'features/Coach/*.feature'
    // ],
    getPageTimeout: 100000,
    allScriptsTimeout: 100000,

    cucumberOpts: {
        format: 'pretty',
        require: 'test/acceptance/**/*.js',
        tags: ['~@manual', '~@ignore']
    },

    baseUrl: baseUrl,

    directConnect: true,

    rootElement: 'html',

    // suites:{
    //     general: 'features/Authentication/Authenticated.feature',
    //     features: 'features/Coach*.feature'
    // },

    capabilities: {
        browserName: 'chrome',
        version: '',
        platform: 'ANY',
        loggingPrefs: {
            "browser": "INFO"
        }
    }
}

var environment = process.env.NODE_ENV;

var baseUrl = 'http://localhost:8000/intelligence/';

if (environment === 'development') {

    baseUrl = 'http://localhost:8000/intelligence/';

}

else if (environment === 'qa') {

    baseUrl = 'http://v2-qa.krossover.com/intelligence/';

}

else if (environment === 'uat') {

    baseUrl = 'http://v2-uat.krossover.com/intelligence/';
}

exports.config = {

    framework: 'cucumber',

    specs: [
        'features/**/*.feature'
    ],

    cucumberOpts: {
        format: 'summary',
        require: 'test/integration/**/*.js'
    },

    baseUrl: baseUrl,

    capabilities: {
        browserName: 'chrome',
        version: '',
        platform: 'ANY',
        loggingPrefs: {
            "browser": "INFO"
        }
    },

    rootElement: 'html',

    allScriptsTimeout: 60000

}



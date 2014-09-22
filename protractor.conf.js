var environment = process.env.NODE_ENV;
var baseUrl;

if (environment === 'development' || environment === 'test') {
  
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
        require: 'test/spec/**/*.js'
    },

    baseUrl: baseUrl

}



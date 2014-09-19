exports.config = {

    framework: 'cucumber',

    specs: [
        'features/**/*.feature'
    ],

    cucumberOpts: {
        require: 'test/spec/**/*.js'
    },

    baseUrl: 'http://localhost:8000/intelligence'
}

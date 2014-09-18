exports.config = {

    framework: 'cucumber',

    specs: [
        'features/**/*.feature'
    ],

    cucumberOpts: {
        require: 'test/spec/**/*.js'
    }
}

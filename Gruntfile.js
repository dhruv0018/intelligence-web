/* jshint node:true */

'use strict';

var less = require('component-less');

var modRewrite = require('connect-modrewrite');

module.exports = function(grunt) {

    /* Load all grunt tasks. */
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                NODE_ENV: 'development',
            },
            qa: {
                NODE_ENV: 'qa',
            },
            prod: {
                NODE_ENV: 'production',
            }
        },

        files: {
            html: {
                src: [
                    'src/**/*.html',
                    'lib/**/*.html'
                ]
            },
            css: {
                src: [
                    'src/**/*.css',
                    'lib/**/*.css',
                    'build/theme.css'
                ]
            },
            less: {
                src: [
                    'lib/**/*.less',
                    'theme/**/*.less'
                ]
            },
            js: {
                src: [
                    'src/**/*.js',
                    'lib/**/*.js'
                ]
            }
        },

        clean: {
            build: ['build'],
            dev: ['dev'],
            prod: ['prod']
        },


        /* Linters */

        htmlhint: {
            options: {
                htmlhintrc: '.htmlhintrc'
            },
            files: '<%= files.html %>'
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            files: '<%= files.css %>'
        },

        lesslint: {
            files: '<%= files.less %>'
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: '<%= files.js %>'
        },


        /* Minifiers */


        htmlmin: {
            prod: {
                options: require('./.htmlminrc'),
                files: {
                    'prod/intelligence/index.html': 'src/index.html'
                }
            }
        },

        csso: {
            prod: {
                files: {
                    'prod/intelligence/styles.css': ['build/prefixed.css']
                }
            }
        },

        uglify: {
            options: require('./.uglifyrc'),
            prod: {
                files: {
                    'prod/intelligence/scripts.js': ['build/bundle.js']
                }
            }
        },


        /* Build process */


        /* Build process - CSS */

        concat: {
            theme: {
                src: ['build/build.css', 'build/theme.css'],
                dest: 'build/themed.css'
            }
        },

        less: {
            options: {
                paths: [
                    'node_modules/bootstrap/less',
                    'node_modules/font-awesome/Font-Awesome-3.2.1/less'
                ]
            },
            theme: {
                files: {
                    'build/theme.css': ['theme/**/*.less']
                }
            }
        },

        autoprefixer: {
            src: {
                src: 'build/themed.css',
                dest: 'build/prefixed.css'
            }
        },

        copy: {
            'theme-assets': {
                expand: true,
                cwd:    'theme',
                src:    'assets/*.png',
                dest:   'build'
            },
            'component-assets': {
                expand: true,
                cwd:    'lib',
                src:    '**/*.png',
                dest:   'build/assets'
            },
            dev: {
                files: {
                    'dev/intelligence/.htaccess': 'src/.htaccess',
                    'dev/intelligence/index.html': 'src/index.html',
                    'dev/intelligence/styles.css': 'build/prefixed.css',
                    'dev/intelligence/scripts.js': 'build/bundle.js'
                }
            },
            'dev-assets': {
                expand: true,
                cwd:    'build/assets',
                src:    '**',
                dest:   'dev/intelligence/assets'
            },
            prod: {
                files: {
                    'prod/intelligence/.htaccess': 'src/.htaccess',
                    'prod/intelligence/scripts.js': 'build/bundle.js'
                }
            },
            'prod-assets': {
                expand: true,
                cwd:    'build/assets',
                src:    '**',
                dest:   'prod/intelligence/assets'
            }
        },


        /* Build process - JS */

        componentbuild: {
            dev: {
                options: {
                    name: 'build',
                    dev: true,
                    sourceUrls: true,
                    prefix: 'assets',
                    copy: true,
                    configure: function(builder){

                        var lessc = function(builder) {

                            var options = {
                                env: {
                                    paths: [
                                        'theme',
                                        'node_modules/bootstrap/less',
                                        'node_modules/font-awesome/Font-Awesome-3.2.1/less'
                                    ]
                                }
                            };

                            return less(builder, options);
                        };

                        builder.use(lessc);
                    }
                },
                src: '.',
                dest: './build'
            },
            prod: {
                options: {
                    name: 'build',
                    prefix: 'assets',
                    copy: true,
                    configure: function(builder){

                        var lessc = function(builder) {

                            var options = {
                                env: {
                                    paths: [
                                        'theme',
                                        'node_modules/bootstrap/less',
                                        'node_modules/font-awesome/Font-Awesome-3.2.1/less'
                                    ]
                                }
                            };

                            return less(builder, options);
                        };

                        builder.use(lessc);
                    }
                },
                src: '.',
                dest: './build'
            }
        },

        browserify: {
            dev: {
                options: {
                    debug: true,
                    transform: ['decomponentify', 'envify'],
                    shim: {
                        flowjs: {
                            path: 'node_modules/flowjs/src/flow.js',
                            exports: 'flowjs'
                        },
                        Mousetrap: {
                            path: 'node_modules/Mousetrap/mousetrap.js',
                            exports: 'Mousetrap'
                        }
                    }
                },
                files: {
                    'build/bundle.js': ['src/main.js']
                }
            },
            prod: {
                options: {
                    transform: ['decomponentify', 'envify'],
                    shim: {
                        flowjs: {
                            path: 'node_modules/flowjs/src/flow.js',
                            exports: 'flowjs'
                        },
                        Mousetrap: {
                            path: 'node_modules/Mousetrap/mousetrap.js',
                            exports: 'Mousetrap'
                        }
                    }
                },
                files: {
                    'build/bundle.js': ['src/main.js']
                }
            }
        },


        /* Distribution/Deployment */


        ver: {
            prod: {
                forceVersion: '<%= pkg.version %>',
                phases: [{
                    files: [
                        'prod/intelligence/*.js',
                        'prod/intelligence/*.css'
                    ],
                    references: [
                        'prod/intelligence/index.html'
                    ]
                }]
            }
        },


        /* Testing */


        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },


        /* Documentation and reporting */


        dox: {
            docs: {
                src: ['src', 'lib'],
                dest: 'docs'
            }
        },

        plato: {
            report: {
                options : {
                    jshint: grunt.file.readJSON('.jshintrc')
                },
                files: {
                    'test/report': ['src/**/*.js', 'lib/**/*.js']
                }
            }
        },


        /* Development */


        connect: {
            dev: {
                options: {
                    hostname: '*',
                    port: 8000,
                    protocol: 'http',
                    base: 'dev',
                    livereload: true,
                    middleware: function (connect, options) {
                        return [

                            /* Redirect hash urls to index.html */
                            modRewrite([
                                '!\\.html|\\.js|\\.css|\\.png|\\.mp4$ /intelligence/index.html [L]'
                            ]),

                            /* Serve static files. */
                            connect.static(options.base),

                            /* Make empty directories browsable. */
                            connect.directory(options.base)

                        ];
                    }
                }
            },
            prod: {
                options: {
                    hostname: '*',
                    port: 8001,
                    protocol: 'https',
                    base: 'prod',
                    middleware: function (connect, options) {
                        return [

                            /* Redirect hash urls to index.html */
                            modRewrite([
                                '!\\.html|\\.js|\\.css|\\.png$ /intelligence/index.html [L]'
                            ]),

                            /* Serve static files. */
                            connect.static(options.base),

                            /* Make empty directories browsable. */
                            connect.directory(options.base)

                        ];
                    }
                }
            }
        },

        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            json: {
                files: ['*.json'],
                tasks: ['install', 'dev', 'notify']
            },
            config: {
                files: ['config/*.json', 'lib/**/*.json'],
                tasks: ['componentbuild:dev', 'browserify:dev', 'copy:dev', 'notify']
            },
            html: {
                files: ['src/**/*.html', 'lib/**/*.html'],
                tasks: ['htmlhint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'notify']
            },
            css: {
                files: ['src/**/*.css'],
                tasks: ['csslint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'notify']
            },
            theme: {
                files: ['theme/**/*.less'],
                tasks: ['newer:less:theme', 'concat:build', 'autoprefixer', 'rework', 'copy:dev', 'notify']
            },
            less: {
                files: ['lib/**/*.less'],
                tasks: ['componentbuild:dev', 'browserify:dev', 'concat:build', 'autoprefixer', 'rework', 'copy:dev', 'notify']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'browserify:dev', 'copy:dev', 'notify']
            },
            components: {
                files: ['lib/**/*.js'],
                tasks: ['jshint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'notify']
            },
            tests: {
                files: ['test/unit/**/*.js'],
                tasks: ['jshint', 'karma']
            }
        }
    });


    /* Tasks */


    grunt.registerTask('install', ['install-dependencies']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('lint', ['htmlhint', 'jshint']);
    grunt.registerTask('min', ['htmlmin', 'csso', 'uglify']);
    grunt.registerTask('doc', ['dox']);
    grunt.registerTask('report', ['plato']);
    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('default', ['install', 'dev', 'connect:dev', 'watch']);

    grunt.registerTask('dev', [
        'env:dev',
        'componentbuild:dev',
        'browserify:dev',
        'less',
        'concat:theme',
        'autoprefixer',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:dev-assets',
        'copy:dev']);

    grunt.registerTask('qa', [
        'clean',
        'lint',
        'env:qa',
        'componentbuild:prod',
        'browserify:prod',
        'test',
        'less',
        'concat:theme',
        'autoprefixer',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:prod-assets',
        'copy:prod',
        'htmlmin',
        'csso',
        'ver:prod']);

    grunt.registerTask('prod', [
        'clean',
        'lint',
        'env:prod',
        'componentbuild:prod',
        'browserify:prod',
        'test',
        'less',
        'concat:theme',
        'autoprefixer',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:prod-assets',
        'copy:prod',
        'htmlmin',
        'csso',
        'ver:prod']);
};

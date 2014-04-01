/* jshint node:true */

'use strict';

var less = require('component-less');

var modRewrite = require('connect-modrewrite');

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    /* Load all grunt tasks. */
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                NODE_ENV: 'development'
            },
            qa: {
                NODE_ENV: 'qa'
            },
            prod: {
                NODE_ENV: 'production'
            }
        },

        files: {
            html: {
                src: [
                    'app/**/*.html',
                    'lib/**/*.html',
                    'src/**/*.html'
                ]
            },
            css: {
                src: [
                    'app/**/*.css',
                    'lib/**/*.css',
                    'theme/**/*.css'
                ]
            },
            less: {
                src: [
                    'app/**/*.less',
                    'lib/**/*.less',
                    'theme/**/*.less'
                ]
            },
            js: {
                src: [
                    'app/**/*.js',
                    'lib/**/*.js',
                    'src/**/*.js'
                ]
            }
        },

        clean: {
            build: ['build'],
            public: ['public']
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
                    'build/index.html': 'src/index.html'
                }
            }
        },

        csso: {
            prod: {
                files: {
                    'build/styles.css': ['build/prefixed.css']
                }
            }
        },

        uglify: {
            options: require('./.uglifyrc'),
            prod: {
                files: {
                    'build/scripts.js': ['build/bundle.js']
                }
            }
        },


        /* Build process */


        /* Build process - CSS */

        less: {
            options: {
                paths: [
                    'node_modules/bootstrap/less',
                    'node_modules/font-awesome/less'
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


        /* Build process - Concatenations */


        concat: {
            mousetrap: {
                src: [
                    'node_modules/Mousetrap/mousetrap.js',
                    'node_modules/Mousetrap/plugins/global-bind/mousetrap-global-bind.js'
                ],
                dest: 'build/mousetrap.js'
            },
            theme: {
                src: ['build/build.css', 'build/theme.css'],
                dest: 'build/themed.css'
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
                                        'node_modules/font-awesome/less'
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
                                        'node_modules/font-awesome/less'
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
                            path: 'build/mousetrap.js',
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
                            path: 'build/mousetrap.js',
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
            assets: {
                expand: true,
                cwd:    'build/assets',
                src:    '**',
                dest:   'public/intelligence/assets'
            },
            dev: {
                files: {
                    'build/index.html': 'src/index.html',
                    'build/styles.css': 'build/prefixed.css',
                    'build/scripts.js': 'build/bundle.js'
                }
            },
            build: {
                files: {
                    'public/intelligence/.htaccess': 'src/.htaccess',
                    'public/intelligence/index.html': 'build/index.html',
                    'public/intelligence/styles.css': 'build/prefixed.css',
                    'public/intelligence/scripts.js': 'build/bundle.js'
                }
            }
        },

        ver: {
            prod: {
                baseDir: 'public/intelligence',
                versionFile: 'build/version.json',
                forceVersion: '<%= pkg.version %>',
                phases: [{
                    files: [
                        'public/intelligence/*.js',
                        'public/intelligence/*.css'
                    ],
                    references: [
                        'public/intelligence/index.html'
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
                    base: 'public',
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
                    base: 'public',
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
                tasks: ['install', 'dev', 'notify:build']
            },
            config: {
                files: ['config/*.json', 'app/**/*.json', 'lib/**/*.json'],
                tasks: ['componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            html: {
                files: ['lib/**/*.html'],
                tasks: ['htmlhint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            css: {
                files: ['app/**/*.css', 'lib/**/*.css'],
                tasks: ['csslint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            less: {
                files: ['app/**/*.less', 'lib/**/*.less'],
                tasks: ['componentbuild:dev', 'browserify:dev', 'concat:theme', 'autoprefixer', 'copy:dev', 'copy:build', 'notify:build']
            },
            theme: {
                files: ['theme/**/*.less'],
                tasks: ['newer:less:theme', 'concat:theme', 'autoprefixer', 'copy:dev', 'copy:build', 'notify:build']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            components: {
                files: ['app/**/*.js', 'lib/**/*.js'],
                tasks: ['jshint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            tests: {
                files: ['test/unit/**/*.js'],
                tasks: ['jshint', 'karma']
            }
        },

        notify: {
            build: {
                options: {
                    title: '<%= pkg.name %>',
                    message: 'Build Ready'
                }
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
    grunt.registerTask('default', ['install', 'dev', 'connect:dev', 'notify:build', 'watch']);

    grunt.registerTask('dev', [
        'env:dev',
        'componentbuild:dev',
        'concat:mousetrap',
        'browserify:dev',
        'less',
        'concat:theme',
        'autoprefixer',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:assets',
        'copy:dev',
        'copy:build']);

    grunt.registerTask('qa', [
        'clean',
        'lint',
        'env:qa',
        'componentbuild:prod',
        'concat:mousetrap',
        'browserify:prod',
        'test',
        'less',
        'concat:theme',
        'autoprefixer',
        'htmlmin',
        'csso',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:assets',
        'copy:build',
        'ver:prod']);

    grunt.registerTask('prod', [
        'clean',
        'lint',
        'env:prod',
        'componentbuild:prod',
        'concat:mousetrap',
        'browserify:prod',
        'test',
        'less',
        'concat:theme',
        'autoprefixer',
        'htmlmin',
        'csso',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:assets',
        'copy:build',
        'ver:prod']);
};

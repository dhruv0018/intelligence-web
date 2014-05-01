/* jshint node:true */

'use strict';

var less = require("component-builder-less");

var modRewrite = require('connect-modrewrite');

var htmlminifier = require('builder-html-minifier')

var htmlminifierOptions = {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true
}

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

        cssmin: {
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
            install: {
                options: {
                    install: true
                },
                src: '.',
                dest: './build'
            },
            files: {
                options: {
                    copy: true,
                    scripts: false,
                    styles: false,
                    files: true
                },
                src: '.',
                dest: './build/assets'
            },
            styles: {
                options: {
                    scripts: false,
                    styles: true,
                    files: false,
                    prefix: 'assets/',
                    stylePlugins: function(builder) {
                        builder.use('styles', less({
                            paths: [
                                'theme',
                                'node_modules/bootstrap/less',
                                'node_modules/font-awesome/less'
                            ]
                        }));
                    }
                },
                src: '.',
                dest: './build'
            },
            dev: {
                options: {
                    development: false,
                    standalone: true,
                    require: true,
                    verbose: true,
                    copy: false,
                    scripts: true,
                    styles: false,
                    files: false
                },
                src: '.',
                dest: './build'
            },
            prod: {
                options: {
                    development: false,
                    standalone: true,
                    require: true,
                    verbose: true,
                    copy: false,
                    scripts: true,
                    styles: false,
                    files: false,
                    scriptPlugins: function(builder) {
                        builder.use('templates', htmlminifier(htmlminifierOptions));
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
                    transform: ['envify'],
                    noParse: ['./build/build.js'],
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
                    transform: ['envify'],
                    noParse: ['./build/build.js'],
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
                src:    'assets/**',
                dest:   'build'
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
            prod: {
                files: {
                    'public/intelligence/.htaccess': 'src/.htaccess',
                    'public/intelligence/manifest.appcache': 'manifest.appcache'
                }
            },
            build: {
                files: {
                    'public/intelligence/index.html': 'build/index.html',
                    'public/intelligence/styles.css': 'build/styles.css',
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
                        'public/intelligence/index.html',
                        'public/intelligence/manifest.appcache'
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
                                '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.mp4$ /intelligence/index.html [L]'
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
                                '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.mp4$ /intelligence/index.html [L]'
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
            packagejson: {
                files: ['package.json'],
                tasks: ['install', 'dev', 'notify:build']
            },
            componentjson: {
                files: ['component.json'],
                tasks: ['componentbuild:install', 'dev', 'notify:build']
            },
            config: {
                files: ['config/*.json', 'app/**/*.json', 'lib/**/*.json'],
                tasks: ['componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            index: {
                files: ['src/index.html'],
                tasks: ['newer:htmlhint', 'copy:dev', 'copy:build', 'notify:build']
            },
            html: {
                files: ['app/**/*.html', 'lib/**/*.html'],
                tasks: ['newer:htmlhint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            css: {
                files: ['app/**/*.css', 'lib/**/*.css'],
                tasks: ['newer:csslint', 'componentbuild:styles', 'copy:dev', 'copy:build', 'notify:build']
            },
            less: {
                files: ['app/**/*.less', 'lib/**/*.less'],
                tasks: ['componentbuild:styles', 'concat:theme', 'autoprefixer', 'copy:dev', 'copy:build', 'notify:build']
            },
            theme: {
                files: ['theme/**/*.less'],
                tasks: ['newer:less:theme', 'concat:theme', 'autoprefixer', 'copy:dev', 'copy:build', 'notify:build']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:jshint', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            components: {
                files: ['app/**/*.js', 'lib/**/*.js'],
                tasks: ['newer:jshint', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            tests: {
                files: ['test/unit/**/*.js'],
                tasks: ['newer:jshint', 'karma']
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
    grunt.registerTask('min', ['htmlmin', 'cssmin', 'uglify']);
    grunt.registerTask('doc', ['dox']);
    grunt.registerTask('report', ['plato']);
    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('default', ['install', 'dev', 'connect:dev', 'notify:build', 'watch']);

    grunt.registerTask('build', [
        'env:prod',
        'componentbuild:prod',
        'concat:mousetrap',
        'browserify:prod']);

    grunt.registerTask('dev', [
        'env:dev',
        'componentbuild:dev',
        'concat:mousetrap',
        'browserify:dev',
        'componentbuild:styles',
        'less',
        'concat:theme',
        'autoprefixer',
        'componentbuild:files',
        'copy:theme-assets',
        'copy:assets',
        'copy:dev',
        'copy:build']);

    grunt.registerTask('qa', [
        'clean',
        'env:qa',
        'componentbuild:prod',
        'concat:mousetrap',
        'browserify:prod',
        'uglify',
        'less',
        'componentbuild:styles',
        'concat:theme',
        'autoprefixer',
        'cssmin',
        'htmlmin',
        'componentbuild:files',
        'copy:theme-assets',
        'copy:assets',
        'copy:build',
        'copy:prod',
        'ver:prod']);

    grunt.registerTask('prod', [
        'clean',
        'env:prod',
        'componentbuild:prod',
        'concat:mousetrap',
        'browserify:prod',
        'componentbuild:styles',
        'less',
        'concat:theme',
        'autoprefixer',
        'cssmin',
        'htmlmin',
        'componentbuild:files',
        'copy:theme-assets',
        'copy:assets',
        'copy:build',
        'copy:prod',
        'ver:prod']);
};


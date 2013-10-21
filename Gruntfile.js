/* jshint node:true */

'use strict';

var modRewrite = require('connect-modrewrite');

module.exports = function(grunt) {

    /* Load all grunt tasks. */
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

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


        'html-inspector': {
            files: '<%= files.html %>'
        },

        recess: {
            options: require('./.recessrc'),
            files: '<%= files.css %>'
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

        jsvalidate: {
            files: ['<%= files.js']
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
                    'prod/intelligence/styles.css': ['build/reworked.css']
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
                src: ['theme/**/*.css'],
                dest: 'build/theme.css'
            },
            build: {
                src: ['build/build.css', 'build/theme.css'],
                dest: 'build/themed.css'
            },
            angular: {
                src: ['vendor/angular/angular.js','vendor/angular-resource/angular-resource.js'],
                dest: 'build/angular.js'
            }
        },

        less: {
            options: {
                paths: [
                    'theme',
                    'vendor/bootstrap/less',
                    'vendor/font-awesome/less'
                ]
            },
            theme: {
                files: {
                    'build/theme.css': ['theme/**/*.less']
                }
            },
            components: {
                expand: true,
                cwd:    'lib',
                src:    '**/*.less',
                dest:   'lib',
                ext:    '.css'
            }
        },

        autoprefixer: {
            src: {
                src: 'build/themed.css',
                dest: 'build/prefixed.css'
            }
        },

        rework: {
            'build/reworked.css': 'build/prefixed.css',
        },

        copy: {
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
                    'dev/intelligence/styles.css': 'build/reworked.css',
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
                    'prod/intelligence/assets': 'build/assets/**/*'
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

        bower: {
            install: {
                options: {
                    targetDir: 'vendor'
                }
            }
        },

        component: {
            install: {
                options: {
                    action: 'install'
                }
            },
            build: {
                options: {
                    args: {
                        prefix: 'assets',
                        use: 'component-html,component-json'
                    }
                }
            }
        },

        browserify: {
            build: {
                options: {
                    transform: ['decomponentify'],
                    shim: {
                        angular: {
                            path: 'build/angular.js',
                            exports: 'angular'
                        },
                        angularui: {
                            path: 'vendor/angular-ui-router/release/angular-ui-router.js',
                            exports: 'angularui'
                        },
                        bootstrap: {
                            path: 'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
                            exports: 'bootstrap'
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
            },
            dist: {
                forceVersion: '<%= pkg.version %>',
                phases: [{
                    files: [
                        'dist/<%= pkg.name %>.zip'
                    ],
                }]
            }
        },

        compress: {
            dist: {
                options: {
                    archive: 'dist/<%= pkg.name %>.zip'
                },
                src: [
                    'prod/intelligence/index.html',
                    'prod/intelligence/*.css',
                    'prod/intelligence/*.js'
                ]
            }
        },


        /* Testing */


        cucumberjs: {
            features: 'test/acceptance/features',
            options: {
                steps: 'test/acceptance/step_definitions'
            }
        },

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

        complexity: {
            report: {
                options: {
                    cyclomatic: 5,
                    halstead: 25,
                    maintainability: 50
                },
                files: '<%= files.js %>'
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
                                '!\\.html|\\.js|\\.css|\\.png$ /intelligence/index.html [L]'
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

        shell: {
            dev: {
                command: 'scp -r dev/intelligence virtual@www.dev.krossover.com:/var/www',
            }
        },

        watch: {
            options: {
                livereload: true
            },
            json: {
                files: ['*.json', 'lib/**/*.json'],
                tasks: ['dev']
            },
            html: {
                files: ['src/**/*.html', 'lib/**/*.html'],
                tasks: ['dev']
            },
            css: {
                files: ['src/**/*.css'],
                tasks: ['csslint', 'recess', 'build-css', 'copy:dev']
            },
            less: {
                files: ['lib/**/*.less', 'theme/**/*.less'],
                tasks: ['lesslint', 'recess', 'build', 'copy:dev']
            },
            js: {
                files: ['src/**/*.js', 'lib/**/*.js', 'test/unit/**/*.js', 'test/acceptance/**/*.js'],
                tasks: ['jsvalidate', 'jshint', 'build-js', 'test', 'copy:dev']
            }
        }

    });


    /* Tasks */


    grunt.registerTask('install', ['install-dependencies']);
    grunt.registerTask('build-js', ['concat:angular', 'component:build', 'browserify']);
    grunt.registerTask('build-css', ['concat:build', 'autoprefixer', 'rework']);
    grunt.registerTask('build', ['less', 'build-js', 'build-css', 'copy:component-assets']);
    grunt.registerTask('test', ['cucumberjs', 'karma', 'plato', 'complexity']);
    grunt.registerTask('lint-html', ['html-inspector']);
    grunt.registerTask('lint', ['lesslint', 'csslint', 'recess', 'jshint']);
    grunt.registerTask('min', ['htmlmin', 'csso', 'uglify']);
    grunt.registerTask('doc', ['dox']);
    grunt.registerTask('dev', ['build', 'copy:dev', 'copy:dev-assets']);
    grunt.registerTask('prod', ['clean', 'install', 'build', 'copy:prod-assets', 'min', 'ver:prod']);
    grunt.registerTask('dist', ['prod', 'compress', 'ver:dist']);
    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('deploy', ['dev', 'shell:dev']);
    grunt.registerTask('default', ['install', 'dev', 'serve', 'watch']);

};

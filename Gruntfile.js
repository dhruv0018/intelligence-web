/* jshint node:true */

'use strict';

module.exports = function(grunt) {

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
                    'theme/**/*.css'
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
            dev: ['dev'],
            prod: ['prod'],
            build: ['build']
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
                    'prod/index.html': 'src/index.html'
                }
            }
        },

        csso: {
            prod: {
                files: {
                    'prod/styles.css': ['build/reworked.css']
                }
            }
        },

        uglify: {
            options: require('./.uglifyrc'),
            prod: {
                files: {
                    'prod/scripts.js': ['build/bundle.js']
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
            dev: {
                files: {
                    'dev/index.html': 'src/index.html',
                    'dev/styles.css': 'build/reworked.css',
                    'dev/scripts.js': 'build/bundle.js'
                }
            },
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
                            path: 'vendor/angular/angular.js',
                            exports: 'angular'
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
                        'prod/*.js',
                        'prod/*.css'
                    ],
                    references: [
                        'prod/index.html'
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
                    'prod/index.html',
                    'prod/*.css',
                    'prod/*.js'
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
            server: {
                options: {
                    base: 'dev',
                    port: 8000,
                    livereload: true
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            json: {
                files: ['*.json'],
                tasks: ['dev']
            },
            html: {
                files: ['src/**/*.html', 'lib/**/*.html'],
                tasks: ['dev']
            },
            css: {
                files: ['src/**/*.css', 'lib/**/*.css'],
                tasks: ['csslint', 'recess', 'dev']
            },
            theme: {
                files: ['theme/**/*.css'],
                tasks: ['csslint', 'recess', 'build-css', 'copy:dev']
            },
            js: {
                files: ['src/**/*.js', 'lib/**/*.js', 'test/unit/**/*.js', 'test/acceptance/**/*.js'],
                tasks: ['jsvalidate', 'jshint', 'build-js', 'test', 'copy:dev']
            }
        }

    });


    /* Create tasks */


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-install-dependencies');
    grunt.loadNpmTasks('grunt-html-inspector');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-cucumber');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-rework');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-component');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dox');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-ver');


    /* Tasks */


    grunt.registerTask('install', ['install-dependencies']);
    grunt.registerTask('build-js', ['component:build', 'browserify']);
    grunt.registerTask('build-css', ['concat', 'autoprefixer', 'rework']);
    grunt.registerTask('build', ['build-js', 'build-css']);
    grunt.registerTask('test', ['cucumberjs', 'karma', 'plato', 'complexity']);
    grunt.registerTask('lint-html', ['html-inspector']);
    grunt.registerTask('lint', ['csslint', 'recess', 'jshint']);
    grunt.registerTask('min', ['htmlmin', 'csso', 'uglify']);
    grunt.registerTask('doc', ['dox']);
    grunt.registerTask('dev', ['build', 'copy:dev']);
    grunt.registerTask('prod', ['clean', 'install', 'build', 'min', 'ver:prod']);
    grunt.registerTask('dist', ['prod', 'compress', 'ver:dist']);
    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('default', ['install', 'dev', 'serve', 'watch']);

};

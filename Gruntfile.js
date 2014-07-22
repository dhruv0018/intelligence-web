/* jshint node:true */

'use strict';

var less = require("component-builder-less");

var htmlminifier = require('builder-html-minifier')

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

        eslint: {
            options: {
                config: '.eslintrc'
            },
            target: '<%= files.js %>'
        },

        jscs: {
            options: {
                config: '.jscsrc'
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

        svgmin: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'svg',
                    src: ['*.svg'],
                    dest: 'build/',
                    ext: '.svg'
                }]
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


        /* Build process - SVG */

        grunticon: {
            icons: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['*.svg'],
                    dest: 'build'
                }]
            }
        },

        /* Build process - CSS */

        less: {
            options: {
                paths: [
                    'node_modules/bootstrap/less'
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
                src: 'build/unprefixed.css',
                dest: 'build/prefixed.css'
            }
        },


        /* Build process - Concatenations */


        concat: {
            unprefixed: {
                src: ['fonts.css', 'icons.css', 'build/icons.data.svg.css', 'build/build.css', 'build/theme.css'],
                dest: 'build/unprefixed.css'
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
                                'node_modules/bootstrap/less'
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
                    files: false
                },
                src: '.',
                dest: './build'
            }
        },

        browserify: {
            dev: {
                options: {
                    bundleOptions: {
                        debug: true,
                    },
                    browserifyOptions: {
                        noParse: ['./build/build.js']
                    }
                },
                files: {
                    'build/bundle.js': ['src/main.js']
                }
            },
            prod: {
                options: {
                    browserifyOptions: {
                        noParse: ['./build/build.js']
                    }
                },
                files: {
                    'build/bundle.js': ['src/main.js']
                }
            }
        },


        /* Distribution/Deployment */

        copy: {
            svg: {
                expand: true,
                cwd:    'svg',
                src:    '*.svg',
                dest:   'build'
            },
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
            htaccess: {
                files: {
                    'public/intelligence/.htaccess': 'src/.htaccess'
                }
            },
            manifests: {
                files: {
                    'public/intelligence/manifest.appcache': 'manifest.appcache'
                }
            },
            build: {
                files: {
                    'public/intelligence/index.html': 'build/index.html',
                    'public/intelligence/styles.css': 'build/styles.css',
                    'public/intelligence/scripts.js': 'build/scripts.js'
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
                src: ['app', 'lib', 'src'],
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


        browserSync: {
            dev: {
                bsFiles: [
                    'public/intelligence/index.html',
                    'public/intelligence/styles.css',
                    'public/intelligence/scripts.js',
                    'public/intelligence/assets/**/*.png'
                ],
                options: require('./bs-config.js')
            }
        },


        /* Git integration */


        githooks: {
            all: {
                'pre-commit': 'lint',
                'pre-push': 'test'
            }
        },


        /* Watches */


        watch: {
            options: {
                spawn: false,
                interupt: true
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
                tasks: ['componentbuild:styles', 'concat:unprefixed', 'autoprefixer', 'copy:dev', 'copy:build', 'notify:build']
            },
            theme: {
                files: ['theme/**/*.less'],
                tasks: ['newer:less:theme', 'concat:unprefixed', 'autoprefixer', 'copy:dev', 'copy:build', 'notify:build']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:jshint', 'newer:eslint', 'newer:jscs', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            components: {
                files: ['app/**/*.js', 'lib/**/*.js'],
                tasks: ['newer:jshint', 'newer:eslint', 'newer:jscs', 'componentbuild:dev', 'browserify:dev', 'copy:dev', 'copy:build', 'notify:build']
            },
            tests: {
                files: ['test/unit/**/*.js'],
                tasks: ['newer:jshint', 'newer:eslint', 'newer:jscs', 'karma']
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
    grunt.registerTask('lint', ['htmlhint', 'jshint', 'eslint', 'jscs']);
    grunt.registerTask('min', ['htmlmin', 'cssmin', 'uglify']);
    grunt.registerTask('doc', ['dox']);
    grunt.registerTask('report', ['plato']);
    grunt.registerTask('serve', ['browserSync']);
    grunt.registerTask('default', ['githooks', 'install', 'dev', 'notify:build', 'serve', 'watch']);

    grunt.registerTask('build', [
        'env:prod',
        'componentbuild:prod',
        'browserify:prod']);

    grunt.registerTask('dev', [
        'env:dev',
        'componentbuild:dev',
        'browserify:dev',
        'componentbuild:styles',
        'less',
        'copy:svg',
        'grunticon',
        'concat:unprefixed',
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
        'browserify:prod',
        'uglify',
        'componentbuild:styles',
        'less',
        'svgmin',
        'grunticon',
        'concat:unprefixed',
        'autoprefixer',
        'cssmin',
        'htmlmin',
        'componentbuild:files',
        'copy:theme-assets',
        'copy:assets',
        'copy:build',
        'copy:htaccess',
        'ver:prod']);

    grunt.registerTask('prod', [
        'clean',
        'env:prod',
        'componentbuild:prod',
        'browserify:prod',
        'uglify',
        'componentbuild:styles',
        'less',
        'svgmin',
        'grunticon',
        'concat:unprefixed',
        'autoprefixer',
        'cssmin',
        'htmlmin',
        'componentbuild:files',
        'copy:theme-assets',
        'copy:assets',
        'copy:build',
        'copy:htaccess',
        'copy:manifests',
        'ver:prod']);
};


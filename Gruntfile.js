'use strict';

var es6ify = require('es6ify').configure(/^(?!.*node_modules)+.+\.js$/);

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    /* Load all grunt tasks. */
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        env: {
            test: {
                NODE_ENV: 'test'
            },
            dev: {
                NODE_ENV: 'development'
            },
            qa: {
                NODE_ENV: 'qa'
            },
            uat: {
                NODE_ENV: 'uat'
            },
            prod: {
                NODE_ENV: 'production'
            },
            buildserver: {
                NODE_ENV: 'buildserver',
                BUILDSERVER: grunt.option('buildserver')
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
                    'theme/main.less'
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

        eslint: {
            options: {
                config: '.eslintrc'
            },
            target: '<%= files.js %>'
        },

        /* Pre-minification */

        trimtrailingspaces: {
            js: {
                src: [
                    'app/**/*.js',
                    'lib/**/*.js',
                    'src/**/*.js',
                    'test/unit/**/*/*.js'
                ]
            },
            less: {
                src: [
                    'app/**/*.less',
                    'lib/**/*.less',
                    'theme/**/*.less'
                ]
            },
            html: {
                src: [
                    'app/**/*.html',
                    'lib/**/*.html'
                ]
            }
        },

        lintspaces: {
            js: {
                src: [
                    'app/**/*.js',
                    'lib/**/*.js',
                    'src/**/*.js',
                    'test/unit/**/*/*.js'
                ],
                options: {
                    newline: true,
                    indentation: 'spaces',
                    trailingspaces: true,
                    ignores: ['js-comments']
                }
            },
            less: {
                src: [
                    'app/**/*.less',
                    'lib/**/*.less',
                    'theme/**/*.less'
                ],
                options: {
                    newline: true,
                    indentation: 'spaces',
                    trailingspaces: true,
                    ignores: ['js-comments']
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            prod: {
                files: {
                    'build/annotated.js': ['build/bundle.js']
                }
            }
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
                    'build/scripts.js': ['build/annotated.js']
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
                    'build/temp-less',
                    'node_modules/bootstrap/less'
                ]
            },
            theme: {
                files: {
                    'build/theme.css': ['theme/main.less']
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
                src: [
                    'fonts.css',
                    'icons.css',
                    'build/icons.data.svg.css',
                    'node_modules/angular-multi-select/angular-multi-select.css',
                    'node_modules/angular-material/angular-material.css',
                    'node_modules/angular-bootstrap-colorpicker/css/colorpicker.css',
                    'build/build.css',
                    'build/components.css',
                    'build/theme.css'
                ],
                dest: 'build/unprefixed.css'
            }
        },

        /* Template creation - JS */
        ngtemplates: {
          app: {
            options: {
              bootstrap: function(module, script){
                    return 'exports.templateCache = ["$templateCache", function($templateCache) {\n' + script +'}];'
              }
          },
          src: [
                'app/**/*.html',
                'lib/dialogs/**/*.html',
                'lib/directives/**/*.html',
                'lib/modals/**/*.html',
                'lib/features/**/*.html'
          ],
          dest: 'build/templates.js'
          }
        },

        browserify: {
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true,
                        paths: ['./node_modules', './components'],
                        transform: [es6ify],
                        noParse: ['./build/templates.js']
                    }
                },
                files: {
                    'build/bundle.js': ['src/main.js']
                }
            },
            prod: {
                options: {
                    transform: [es6ify],
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
            'theme-vendor': {
                files: {
                    'build/temp-less/animate.less': 'node_modules/animate.css/animate.css'
                }
            },
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
            qaassets: {
                expand: true,
                cwd:    'build/assets',
                src:    '**',
                dest:   'public/<%= gitinfo.local.branch.current.name %>/intelligence/assests'
            },
            dev: {
                files: {
                    'build/index.html': 'src/index.html',
                    'build/styles.css': 'build/prefixed.css',
                    'build/scripts.js': 'build/bundle.js'
                }
            },
            polyfills: {
                files: {
                    'public/intelligence/webcomponents.js': 'node_modules/webcomponents.js/webcomponents.min.js'
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
            qa: {
                files: {
                    'public/<%= gitinfo.local.branch.current.name %>/intelligence/.htaccess': 'src/.htaccess',
                    'public/<%= gitinfo.local.branch.current.name %>/intelligence/manifest.appcache': 'manifest.appcache',
                    'public/<%= gitinfo.local.branch.current.name %>/intelligence/index.html': 'build/index.html',
                    'public/<%= gitinfo.local.branch.current.name %>/intelligence/styles.css': 'build/styles.css',
                    'public/<%= gitinfo.local.branch.current.name %>/intelligence/scripts.js': 'build/scripts.js'
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
            polyfills: {
                baseDir: 'public/intelligence',
                versionFile: 'build/version.json',
                forceVersion: '<%= pkg.dependencies["webcomponents.js"] %>',
                phases: [{
                    files: [
                        'public/intelligence/webcomponents.js',
                    ],
                    references: [
                        'public/intelligence/index.html',
                        'public/intelligence/manifest.appcache'
                    ]
                }]
            },
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
                files: {
                    'test/report': ['src/**/*.js', 'lib/**/*.js']
                }
            }
        },


        /* Development */


        browserSync: {
            options: require('./bs-config.js'),
            dev: {
                options: {
                    watchTask: true
                },
                bsFiles: [
                    'public/intelligence/index.html',
                    'public/intelligence/styles.css',
                    'public/intelligence/scripts.js',
                    'public/intelligence/assets/**/*.png'
                ]
            },
            prod: {
                options: {
                    open: false,
                    watchTask: false
                },
                bsFiles: [
                    'public/intelligence/index.html',
                    'public/intelligence/styles.css',
                    'public/intelligence/scripts.js',
                    'public/intelligence/assets/**/*.png'
                ]
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
            config: {
                files: ['config/*.json', 'app/**/*.json', 'lib/**/*.json'],
                tasks: ['browserify:dev', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            index: {
                files: ['src/index.html'],
                tasks: ['newer:htmlhint', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            html: {
                files: ['app/**/*.html', 'lib/**/*.html'],
                tasks: ['newer:htmlhint', 'ngtemplates', 'browserify:dev', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            css: {
                files: ['app/**/*.css', 'lib/**/*.css'],
                tasks: ['csslint', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            less: {
                files: ['app/**/*.less', 'lib/**/*.less'],
                tasks: ['less:theme', 'concat:unprefixed', 'autoprefixer', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            theme: {
                files: ['theme/**/*.less'],
                tasks: ['less:theme', 'concat:unprefixed', 'autoprefixer', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:trimtrailingspaces', 'newer:lintspaces', 'newer:eslint', 'browserify:dev', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            components: {
                files: ['app/**/*.js', 'lib/**/*.js'],
                tasks: ['newer:trimtrailingspaces', 'newer:lintspaces', 'newer:eslint', 'browserify:dev', 'copy:dev', 'copy:build', 'manifests', 'notify:build']
            },
            unit: {
                files: ['test/unit/**/*.js', '!test/unit/helpers/**/*.js'],
                tasks: ['newer:trimtrailingspaces', 'newer:lintspaces', 'newer:eslint', 'karma']
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

    grunt.registerTask('date-manifests', 'Dates the cache manifest', function() {

        var fs = require('fs');

        var now = new Date();

        fs.appendFileSync('public/intelligence/manifest.appcache', '# ' + now);
    });

    var server;

    grunt.registerTask('close-server', 'Closes the background server process', function() {

        server.close();
    });

    grunt.registerTask('install', ['install-dependencies']);
    grunt.registerTask('test', ['build', 'karma']);
    grunt.registerTask('lint', ['trimtrailingspaces', 'lintspaces', 'htmlhint', 'eslint']);
    grunt.registerTask('min', ['htmlmin', 'cssmin', 'uglify']);
    grunt.registerTask('doc', ['dox']);
    grunt.registerTask('report', ['plato']);
    grunt.registerTask('serve', ['browserSync:dev']);
    grunt.registerTask('manifests', ['copy:manifests', 'date-manifests']);
    grunt.registerTask('default', ['githooks', 'dev', 'notify:build', 'serve', 'watch']);

    grunt.registerTask('build', [
        'env:test',
        'ngtemplates',
        'browserify:prod',
        'ngAnnotate',
        'uglify',
        'htmlmin',
        'copy:build',
        'copy:polyfills',
        'manifests'
    ]);

    grunt.registerTask('dev', [
        'env:dev',
        'ngtemplates',
        'browserify:dev',
        'copy:theme-vendor',
        'less',
        'copy:svg',
        'grunticon',
        'concat:unprefixed',
        'autoprefixer',
        'copy:theme-assets',
        'copy:assets',
        'copy:dev',
        'copy:build',
        'copy:polyfills',
        'manifests'
    ]);

    grunt.registerTask('qa', [
        'clean',
        'env:qa',
        'ngtemplates',
        'browserify:prod',
        'ngAnnotate',
        'copy:theme-vendor',
        'less',
        'svgmin',
        'grunticon',
        'concat:unprefixed',
        'autoprefixer',
        'copy:theme-assets',
        'copy:assets',
        'copy:dev',
        'copy:build',
        'copy:polyfills',
        'copy:htaccess',
        'manifests',
        'ver:polyfills',
        'ver:prod'
    ]);

    grunt.registerTask('uat', [
        'clean',
        'env:uat',
        'ngtemplates',
        'browserify:prod',
        'ngAnnotate',
        'copy:theme-vendor',
        'less',
        'svgmin',
        'grunticon',
        'concat:unprefixed',
        'autoprefixer',
        'copy:theme-assets',
        'copy:assets',
        'copy:dev',
        'copy:build',
        'copy:polyfills',
        'copy:htaccess',
        'manifests',
        'ver:polyfills',
        'ver:prod'
    ]);

    grunt.registerTask('buildserver', [
        'clean',
        'env:buildserver',
        'ngtemplates',
        'browserify:prod',
        'ngAnnotate',
        'copy:theme-vendor',
        'less',
        'svgmin',
        'grunticon',
        'concat:unprefixed',
        'autoprefixer',
        'copy:theme-assets',
        'copy:assets',
        'copy:dev',
        'copy:build',
        'copy:polyfills',
        'copy:htaccess',
        'manifests',
        'ver:polyfills',
        'ver:prod'
    ]);

    grunt.registerTask('master', ['prod']); // alias for prod
    grunt.registerTask('prod', [
        'clean',
        'env:prod',
        'ngtemplates',
        'browserify:prod',
        'ngAnnotate',
        'uglify',
        'copy:theme-vendor',
        'less',
        'svgmin',
        'grunticon',
        'concat:unprefixed',
        'autoprefixer',
        'cssmin',
        'htmlmin',
        'copy:theme-assets',
        'copy:assets',
        'copy:build',
        'copy:polyfills',
        'copy:htaccess',
        'manifests',
        'ver:polyfills',
        'ver:prod'
    ]);
};

/* jshint node:true */

'use strict';

var less = require('component-less');

var modRewrite = require('connect-modrewrite');

module.exports = function(grunt) {

    /* Load all grunt tasks. */
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        ngconstant: {
            dev: {
                dest: 'src/config.js',
                name: 'config',
                constants: {
                    pkg: grunt.file.readJSON('package.json'),
                    config: grunt.file.readJSON('config/dev.json')
                }
            },
            vm: {
                dest: 'src/config.js',
                name: 'config',
                constants: {
                    pkg: grunt.file.readJSON('package.json'),
                    config: grunt.file.readJSON('config/vm.json')
                }
            },
            qa: {
                dest: 'src/config.js',
                name: 'config',
                constants: {
                    pkg: grunt.file.readJSON('package.json'),
                    config: grunt.file.readJSON('config/qa.json')
                }
            },
            prod: {
                dest: 'src/config.js',
                name: 'config',
                constants: {
                    pkg: grunt.file.readJSON('package.json'),
                    config: grunt.file.readJSON('config/prod.json')
                }
            },
            dist: {
                dest: 'src/config.js',
                name: 'config',
                constants: {
                    pkg: grunt.file.readJSON('package.json'),
                    config: grunt.file.readJSON('config/dist.json')
                }
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

        jsbeautifier: {
            options: {
                config: '.jsbeautifyrc',
                mode: 'VERIFY_ONLY'
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

        rework: {
            'build/reworked.css': 'build/prefixed.css',
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
                    transform: ['decomponentify'],
                },
                files: {
                    'build/bundle.js': ['src/main.js']
                }
            },
            prod: {
                options: {
                    transform: ['decomponentify'],
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
                spawn: false,
                livereload: true
            },
            json: {
                files: ['*.json'],
                tasks: ['install', 'dev', 'notify']
            },
            config: {
                files: ['config/*.json', 'lib/**/*.json'],
                tasks: ['component:build', 'browserify:dev', 'copy:dev', 'notify']
            },
            html: {
                files: ['src/**/*.html', 'lib/**/*.html'],
                tasks: ['htmlhint', 'component:build', 'browserify:dev', 'copy:dev', 'notify']
            },
            css: {
                files: ['src/**/*.css'],
                tasks: ['csslint', 'component:build', 'browserify:dev', 'copy:dev', 'notify']
            },
            theme: {
                files: ['theme/**/*.less'],
                tasks: ['newer:less:theme', 'concat:build', 'autoprefixer', 'rework', 'copy:dev', 'notify']
            },
            less: {
                files: ['lib/**/*.less'],
                tasks: ['newer:less:components', 'component:build', 'browserify:dev', 'concat:build', 'autoprefixer', 'rework', 'copy:dev', 'notify']
            },
            js: {
                files: ['src/**/*.js', 'lib/**/*.js', 'test/unit/**/*.js', 'test/acceptance/**/*.js'],
                tasks: ['jshint', 'component:build', 'browserify:dev', 'copy:dev', 'notify']
            }
        }

    });


    /* Tasks */


    grunt.registerTask('install', ['install-dependencies']);
    grunt.registerTask('test', ['karma', 'plato']);
    grunt.registerTask('lint', ['htmlhint', 'csslint', 'recess', 'jshint']);
    grunt.registerTask('min', ['htmlmin', 'csso', 'uglify']);
    grunt.registerTask('doc', ['dox']);
    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('deploy', ['dev', 'shell:dev']);
    grunt.registerTask('default', ['install', 'dev', 'connect:dev', 'watch']);

    grunt.registerTask('dev', [
        'less',
        'ngconstant:dev',
        'componentbuild:dev',
        'browserify:dev',
        'concat:build',
        'autoprefixer',
        'rework',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:dev-assets',
        'copy:dev']);

    grunt.registerTask('vm', [
        'less',
        'ngconstant:vm',
        'componentbuild:dev',
        'browserify:dev',
        'concat:build',
        'autoprefixer',
        'rework',
        'copy:component-assets',
        'copy:dev-assets',
        'copy:dev']);

    grunt.registerTask('qa', [
        'clean:prod',
        'less',
        'ngconstant:qa',
        'componentbuild:prod',
        'browserify:prod',
        'concat:build',
        'autoprefixer',
        'rework',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:prod-assets',
        'copy:prod',
        'htmlmin',
        'csso',
        'ver:prod']);

    grunt.registerTask('prod', [
        'clean:prod',
        'install',
        'less',
        'ngconstant:prod',
        'componentbuild:prod',
        'browserify:prod',
        'concat:build',
        'autoprefixer',
        'rework',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:prod-assets',
        'copy:prod',
        'htmlmin',
        'csso',
        'ver:prod']);

    grunt.registerTask('dist', [
        'clean:dist',
        'clean:prod',
        'install',
        'less',
        'ngconstant:dist',
        'componentbuild:prod',
        'browserify:prod',
        'concat:build',
        'autoprefixer',
        'rework',
        'copy:theme-assets',
        'copy:component-assets',
        'copy:prod-assets',
        'copy:prod',
        'htmlmin',
        'csso',
        'compress',
        'ver:dist']);
};

// Copyright, 2013-2014, by Tomas Korcak. <korczis@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function (globals) {
    'use strict';

    var define = require('amdefine')(module);

    var requirejs = require('requirejs');
    requirejs.config(require('./require.js'));

    module.exports = function (grunt) {


        var path = require('path'),
            utils = require("./modules/utils");

        var config = utils.loadConfig(path.join(__dirname, "./config.js")),
            templatesDir = "./public/app/";

        grunt.loadNpmTasks('grunt-bower-task');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-ember-templates');
        grunt.loadNpmTasks('grunt-express');
        grunt.loadNpmTasks('grunt-forever');
        grunt.loadNpmTasks('grunt-jsdoc');
        grunt.loadNpmTasks('grunt-mocha-test');
        grunt.loadNpmTasks('grunt-npm-install');

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            meta: {
                banner: '/*! <%=pkg.name%> - v<%=pkg.version%> (build <%=pkg.build%>) - ' +
                '<%=grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT")%> */'
            },

            bower: {
                install: {
                    //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
                }
            },

            clean: [
                './public/assets/*.js'
            ],

            cssmin: {
                combine: {
                    keepSpecialComments: true,
                    files: {
                        'public/assets/bundle.css': [
                            'public/components/normalize-css/normalize.css',
                            'public/css/main.css',
                            'public/css/app.css'
                        ]
                    }
                }
            },

            emberTemplates: {
                compile: {
                    options: {
                        templateName: function (filename) {
                            var res = filename;

                            res = res.replace(templatesDir, '');
                            res = res.replace(/^routes\//, "");

                            return res;
                        }
                    },

                    files: {
                        "./public/assets/templates.js": [
                            templatesDir + "**/*.hbs"
                        ]
                    }
                }
            },

            express: {
                custom: {
                    tasks: ['build'],
                    options: {
                        showStack: true,
                        port: config.server.port,
                        bases: [
                            path.join(__dirname, "public"),
                            path.join(__dirname, "modules")
                        ],
                        server: path.join(__dirname, "modules/server/reloader.js"),
                        livereload: true,
                        serverreload: false
                    }
                }
            },

            forever: {
                options: {
                    index: path.join(__dirname, './app.js'),
                    pidFile: path.join(__dirname, './tmp/forever.pid')
                }
            },

            // Configure a mochaTest task
            mochaTest: {
                test: {
                    options: {
                        reporter: 'spec'
                    },
                    src: ['tests/**/*Spec.js']
                }
            },

            jsdoc: {
                client: {
                    src: [
                        "./public/app/**/*.js"
                    ],
                    dest: "./public/doc/client/"
                },
                server: {
                    src: [
                        "./app.js",
                        "./modules/**/*.js"
                    ],
                    dest: "./public/doc/server/"
                }
            },

            jshint: {
                options: {
                    curly: true,
                    eqeqeq: true,
                    eqnull: true,
                    browser: true,
                    globals: {
                        jQuery: true,
                        next: true,
                        require: true
                    }
                },
                client: [
                    "public/client/**/*.js"
                ],
                grunt: [
                    "Gruntfile.js"
                ],
                server: [
                    "app.js",
                    "modules/**/*.js"
                ],
                tests: [
                    "tests/**/*.js"
                ]
            },

            sass: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: 'public/css',
                        src: ['*.scss'],
                        dest: 'public/css',
                        ext: '.css'
                    }]
                },

                'public/assets/microscratch.css': 'public/css/microscratch.scss'
            },

            watch: {
                sass: {
                    tasks: ['sass', 'cssmin'],
                    files: [
                        path.join(__dirname, "public/css/**/*.scss")
                    ]
                },

                templates: {
                    tasks: ['emberTemplates'],
                    files: [
                        path.join(__dirname, "public/**/*.hbs")
                    ]
                }
            }
        });

        // Boostrap necessary stuff
        grunt.registerTask('boostrap', [
            'npm-install',
            'bower:install'
        ]);

        // Preprocess task
        grunt.registerTask('preprocess', [

        ]);

        // Build all assets required for running the app
        grunt.registerTask('build', [
            'preprocess',
            'boostrap',
            'sass',
            'cssmin',
            'emberTemplates'
        ]);

        // Generate documentation
        grunt.registerTask('doc', [
            'jsdoc'
        ]);

        grunt.registerTask('server', [
            'clean',
            'build',
            'express',
            // 'express-keepalive',
            'watch'
        ]);

        // Default tasks.
        grunt.registerTask('default', [
            'clean',
            'build'
        ]);
    };

}(this));
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

(function () {
    'use strict';

    var define = require('amdefine')(module);

    /**
     * Array of modules this one depends on.
     * @type {Array}
     */
    var deps = [
        '../../../config',
        'deferred',
        'fs',
        'inflection',
        'node.extend',
        'passport',
        'path'
    ];

    define(deps, function (config, deferred, fs, inflection, merge, passport, path) {
        function Router(web) {
            this.web = web;
            this.app = web.app;
            this.lethe = web.lethe;

            this.routes = {};

            return this;
        }

        Router.generateRouteName = function(filename) {
            var routeName = filename.replace('.js', '');
            return inflection.camelize(routeName);
        }

        Router.prototype.init = function() {
            var d = deferred();
            var routesDir = path.join(__dirname, 'routes');

            var self = this;
            fs.readdir(routesDir, function(err, files) {
                if(err) {
                    return d.reject(err);
                }

                files.forEach(function(file) {
                    var routeFile = path.join(routesDir, file);
                    var Route = require(routeFile);
                    self.routes[Router.generateRouteName(routeFile)] = Route(self);
                });

                return d.resolve(self.initAuth());
            });

            return d.promise();
        };

        Router.prototype.initAuth = function () {
            var Facebook = require('../auth/facebook');
            var fb = new Facebook(this.web);

            var Github = require('../auth/github');
            var github = new Github(this.web);

            var Twitter = require('../auth/twitter');
            var twitter = new Twitter(this.web);

            return deferred(this);
        }

        module.exports = Router;
    });
}());
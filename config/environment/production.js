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
    var deps = [];
    define(deps, function(merge) {
        var appHostname = 'lethe.it';
        var appPort = 3000;

        var appName = process.env.NODE_HOST_LETHE_IT || (appHostname + ':' +  appPort);
        var rootUrl = process.env.ROOT_URL || 'https://' + appName + '/';

        var environment = process.env.NODE_ENV || 'production';

        var config = {
            appHostname: appHostname,
            appName: appName,
            appPort: appPort,
            rootUrl: rootUrl,
            environment: environment,

            server: {
                port: 3000,
                auth: {
                    //*
                    github: {
                        appId: 'ecc32a0a8a687670746d',
                        appSecret: '6278ab66e1546535b22815580227fb979ad9eb87',
                        redirectUri:  process.env.GITHUB_REDIRECTURI || rootUrl + 'auth/github/callback',
                        scope: [
                            'user',
                            'repo'
                        ]
                    },

                    twitter: {
                        apiKey: 'IsAyXNYEIQrqqXQdP5dksYdLS',
                        apiSecret: 'QKz3pqFceHRTyTKfPSoYRZd6QFWFGqo6M1X8z5grT1iZbdKa6z',
                        redirectUri:  process.env.TWITTER_REDIRECTURI || rootUrl + 'auth/twitter/callback'
                    }
                    //*/
                }
            },

            couchdb: {
                db: 'lethe-it-production'
            },

            mongo: {
                db: 'lethe-it-production'
            }
        };

        module.exports = config;
    });
}());

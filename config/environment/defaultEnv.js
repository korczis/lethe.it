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

    define(deps, function() {
        var appHostname = 'localhost';
        var appPort = 3000;

        var appName = process.env.NODE_HOST_LETHE_IT || (appHostname + ':' +  appPort);
        var rootUrl = process.env.ROOT_URL || 'http://' + appName + '/';

        var environment = process.env.NODE_ENV || 'development';

        var config = {
            appHostname: appHostname,
            appName: appName,
            appPort: appPort,
            rootUrl: rootUrl,
            environment: environment,

            server: {
                port: 80,
                auth: {
                    facebook: {
                        appId:        process.env.FACEBOOK_APPID || '778608158855551',
                        appSecret:    process.env.FACEBOOK_APPSECRET || '03fa4c0d237ceb18908a6e6226d7a1dd',
                        appNamespace: process.env.FACEBOOK_APPNAMESPACE || 'lethe-it',
                        redirectUri:  process.env.FACEBOOK_REDIRECTURI || rootUrl + 'auth/facebook/callback',
                        scope:        [
                            'email'
                        ]
                    },

                    github: {
                        appId:        process.env.GITHUB_APPID || '5dc2f2f8767347e7fc08',
                        appSecret:    process.env.GITHUB_APPSECRET || '935ea04ccdecf4a1f50a3d4263254195f35312f8',
                        redirectUri:  process.env.GITHUB_REDIRECTURI || rootUrl + 'auth/github/callback',
                        scope:        [
                            'user',
                            'repo'
                        ]
                    },

                    // https://apps.twitter.com/
                    twitter: {
                        apiKey:    process.env.TWITTER_KEY || 'IsAyXNYEIQrqqXQdP5dksYdLS',
                        apiSecret: process.env.TWITTER_SECRET || 'QKz3pqFceHRTyTKfPSoYRZd6QFWFGqo6M1X8z5grT1iZbdKa6z',
                        redirectUri:  process.env.TWITTER_REDIRECTURI || rootUrl + 'auth/twitter/callback',
                        scope: [
                        ]
                    }
                },
                session: {
                    secret: 'secret',
                    store: {
                        name: 'lethe-it-sessions'
                    }
                }
            },

            couchdb: {
                host: 'localhost',
                port: 5984,
                db: 'lethe-it',
                username: 'lethe.it',
                password: 'lethe.it'
            },

            mongo: {
                host: 'localhost',
                port: 27017,
                db: 'lethe-it',
                username: 'lethe.it',
                password: 'lethe.it'
            }
        };

        module.exports = config;
    });
}());

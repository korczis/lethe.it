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
        var config = {
            server: {
                port: 3000,
                auth: {
                    github: {
                        appId:       'ecc32a0a8a687670746d',
                        appSecret:   '6278ab66e1546535b22815580227fb979ad9eb87',
                        scope:        [
                            'user',
                            'repo'
                        ]
                    },

                    twitter: {
                        apiKey:    'ucNuJt3Dz2A6VuyBjp9pSFwL0',
                        apiSecret: 'p05x1yli4Rz3wxGJKHLq454eh2fvsyc3y2yYUc9Yb2XQr0akyE',
                        redirectUri: 'http://localhost:3000/auth/twitter/callback'
                    }
                }
            },

            couchdb: {
                db: 'lethe-it-development'
            },

            mongo: {
                db: 'lethe-it-development'
            }
        };

        module.exports = config;
    });
}());

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
        'fs',
        'node.extend',
        'passport',
        'passport-twitter',
        './shared'
    ];

    define(deps, function (config, fs, merge, passport, TwitterStrategy, Shared) {
        function AuthTwitter(web) {
            this.web = web;
            this.app = web.app;
            this.lethe = web.lethe;

            var User = this.lethe.persistence.models.User;
            var adapter = this.lethe.adapters.Twitter;

            passport.use(new TwitterStrategy.Strategy({
                    consumerKey: config.server.auth.twitter.apiKey,
                    consumerSecret: config.server.auth.twitter.apiSecret,
                    callbackURL: config.server.auth.twitter.redirectUri,
                    scope: config.server.auth.twitter.scope,
                    passReqToCallback : true
                },
                function (req, accessToken, tokenSecret, profile, done) {
                    var data = merge(true, {
                        name: profile.displayName,
                        twitter: profile._json
                    }, {
                        twitter: {
                            accessToken: accessToken,
                            tokenSecret: tokenSecret
                        }
                    });

                    Shared.updateUser(User, req.user, 'twitter', data, profile, adapter, done);
                }
            ));

            Shared.generateRoute(this.app, 'twitter');
        }

        module.exports = AuthTwitter;
    });
}());
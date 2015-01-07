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
        'passport',
        'passport-twitter'
    ];

    define(deps, function (config, fs, passport, TwitterStrategy) {
        function AuthTwitter(web) {
            this.web = web;
            this.app = web.app;

            passport.use(new TwitterStrategy.Strategy({
                    consumerKey: config.server.auth.twitter.apiKey,
                    consumerSecret: config.server.auth.twitter.apiSecret
                },
                function (token, tokenSecret, profile, done) {
                    var user = {
                        profile: profile,
                        token: token,
                        tokenSecret: tokenSecret
                    };

                    console.log(JSON.stringify(user, null, 4));

                    return done(null, user);
                }
            ));

            this.app.get('/auth/twitter/callback',
                passport.authenticate('github', {
                    successRedirect: '/#/',
                    failureRedirect: '/login'
                }));

            this.app.get('/auth/twitter', passport.authenticate('twitter'));
        }

        module.exports = AuthTwitter;
    });
}());
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
        'connect-auth',
        'passport',
        'passport-facebook'
    ];

    define(deps, function (config, fs, auth, passport, FacebookStrategy) {
        function AuthFacebook(web) {
            this.web = web;
            this.app = web.app;

            passport.use(new FacebookStrategy({
                    clientID: config.server.auth.facebook.appId,
                    clientSecret: config.server.auth.facebook.appSecret,
                    callbackURL: config.server.auth.facebook.redirectUri,
                    scope: config.server.auth.facebook.scope,
                    enableProof: false
                },

                function(accessToken, refreshToken, profile, done) {
                    var user = {
                        profile: profile,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    };

                    console.log(JSON.stringify(user, null, 4));

                    return done(null, user);
                }
            ));

            this.app.get('/auth/facebook/callback',
                passport.authenticate('facebook', {
                    successRedirect: '/#/',
                    failureRedirect: '/login'
                }));

            this.app.get('/auth/facebook', passport.authenticate('facebook'));
        }

        module.exports = AuthFacebook;
    });
}());
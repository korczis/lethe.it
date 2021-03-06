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
        'passport'
    ];

    define(deps, function (config, passport) {
        function MiddlewareAuthentication(web) {
            this.web = web;
            this.app = web.app;
            this.lethe = web.lethe;

            // Initialize passport
            this.app.use(passport.initialize());

            // Initialize passport session
            this.app.use(passport.session());

            // FIXME: See https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive

            var User = this.lethe.persistence.models.User;
            passport.serializeUser(function(user, done) {
                //*
                done(null, {id: user.id});
                //*/
            });

            passport.deserializeUser(function(serializedUser, done) {
                //*
                User.findOne({_id: serializedUser.id}, function(err, user) {
                    if(err) {
                        return done(err, null);
                    }

                    return done(null, user);
                })
                //*/
            });
        }

        module.exports = MiddlewareAuthentication;
    });
}());
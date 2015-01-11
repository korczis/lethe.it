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
        'passport'
    ];

    define(deps, function(passport) {
        var updateUser = function(User, user, userSection, data, profile, adapter, done) {
            var syncUser = function(user, adapter, done) {
                if(adapter) {
                    adapter.sync(user);
                }
                return done(null, user);
            };

            var saveUser = function(user, adapter, done) {
                user[userSection] = data[userSection];
                user.save(function(err, user) {
                    if(err) {
                        return done(err, null);
                    }

                    return syncUser(user, adapter, done);
                });
            };

            if(user) {
                saveUser(user, adapter, done);
            } else {
                var query = {};
                query[userSection + '.id'] = profile.id;
                User.findOne(query, function (err, user) {
                    if (err) {
                        return done(err, null);
                    }

                    if (user != null) {
                        saveUser(user, adapter, done);
                    } else {
                        User.create(data, function (err, user) {
                            if (err) {
                                return done(err, null);
                            }

                            return syncUser(user, adapter, done);
                        });
                    }
                });
            }
        };

        var generateRoute = function(app, adapterName) {
            var callbackUri = '/auth/' + adapterName + '/callback';
            app.get(callbackUri,
                passport.authenticate(adapterName, {
                    successRedirect: '/#/',
                    failureRedirect: '/#/'
                }));

            var authUri = '/auth/' + adapterName;
            app.get(authUri, passport.authenticate(adapterName));
        };

        module.exports = {
            generateRoute: generateRoute,
            updateUser: updateUser
        };
    });
}());
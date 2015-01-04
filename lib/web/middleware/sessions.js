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
        'express-session',
        'connect-couchdb'
    ];

    define(deps, function (config, session, ConnectCouch) {
        function MiddlewareSessions(web) {
            this.web = web;
            this.app = web.app;

            // Set URL encoded forms middleware
            // this.app.use(bodyParser.urlencoded());

            var ConnectCouchDB = ConnectCouch(session);

            this.sessionStore = new ConnectCouchDB({
                // Name of the database you would like to use for sessions.
                name: config.server.session.store.name,

                // Optional. Database connection details. See yacw documentation
                // for more informations
                host: config.couchdb.host,
                username: config.couchdb.username,
                password: config.couchdb.username,

                // Optional. How often expired sessions should be cleaned up.
                // Defaults to 600000 (10 minutes).
                reapInterval: 600000,

                // Optional. How often to run DB compaction against the session
                // database. Defaults to 300000 (5 minutes).
                // To disable compaction, set compactInterval to -1
                compactInterval: 300000,

                // Optional. How many time between two identical session store
                // Defaults to 60000 (1 minute)
                setThrottle: 60000
            });

            // Session setup
            this.app.use(session({
                secret: config.server.session.secret,
                resave: false,
                saveUninitialized: true,
                store: this.sessionStore
            }));
        }

        module.exports = MiddlewareSessions;
    });
}());
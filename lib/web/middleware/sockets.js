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
        'cookie',
        'socket.io'
    ];

    define(deps, function (config, cookie, Socket) {
        function MiddlewareSockets(web) {
            this.web = web;
            this.app = web.app;

            var io = Socket(web.server);
            var self = this;

            var COOKIE_NAME = 'connect.sid';
            io.use(function(socket, next) {
                try {
                    var data = socket.handshake || socket.request;

                    if (! data.headers.cookie) {
                        return next(new Error('Missing cookie headers'));
                    }

                    // console.log('cookie header ( %s )', JSON.stringify(data.headers.cookie));

                    var cookies = cookie.parse(data.headers.cookie);

                    // console.log('cookies parsed ( %s )', JSON.stringify(cookies));

                    if (! cookies[COOKIE_NAME]) {
                        return next(new Error('Missing cookie ' + COOKIE_NAME));
                    }

                    var sid = self.web.middleware.cookies.cookieParser.signedCookie(cookies[COOKIE_NAME], config.server.session.secret);

                    if (! sid) {
                        return next(new Error('Cookie signature is not valid'));
                    }

                    //console.log('session ID ( %s )', sid);

                    data.sid = sid;
                    self.web.middleware.sessions.sessionStore.get(sid, function(err, session) {
                        if (err) {
                            return next(err);
                        }

                        if (! session) {
                            return next(new Error('session not found'));
                        }

                        data.session = session;
                        next();
                    });
                } catch (err) {
                    console.error(err.stack);
                    next(new Error('Internal server error'));
                }
            });

            io.on('connection', function(socket){
                console.log('a user connected - ' + JSON.stringify(socket.handshake.session, null, 4));
                socket.on('disconnect', function(){
                    console.log('user disconnected - ' + JSON.stringify(socket.handshake.session, null, 4));
                });
            });
        }

        module.exports = MiddlewareSockets;
    });
}());
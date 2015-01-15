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
        '../../config',
        'csurf',
        'deferred',
        'express',
        'express-handlebars',
        'http',
        'path',
        'body-parser',
        'response-time',
        'spdy',
        './router'
    ];

    define(deps, function (config, csrf, deferred, express, handlebars, http, path, bodyParser, responseTime, spdy, Router) {
        function Web(lethe) {
            // Create express application
            this.app = express();

            this.lethe = lethe;

            this.router = new Web.Router(this);

            return this;
        }

        Web.Router = Router;

        Web.prototype.init = function() {
            // Construct root directory path
            this.rootDir = path.join(__dirname, '..', '..');

            // Construct temporary directory path
            this.tmpDir = path.join(this.rootDir, 'tmp');

            // Construct root data directory path
            this.publicDir = path.join(this.rootDir, 'public');

            // Construct views directory path
            this.viewsDir = path.join(this.publicDir, 'views');

            // set views dir
            this.app.set('views', this.viewsDir);

            // configure views engine
            this.app.engine('.hbs', handlebars({
                defaultLayout: 'main',
                extname: '.hbs',
                layoutsDir: path.join(this.viewsDir, 'layouts')
            }));

            // set views engine
            this.app.set('view engine', '.hbs');

            // Set JSON middleware
            this.app.use(bodyParser.json());

            // view engine setup

            this.middleware = {
                logger: new (require('./middleware/logger'))(this),
                errorHandler: new (require('./middleware/errorHandler'))(this),
                static: new (require('./middleware/static'))(this),
                sessions: new (require('./middleware/sessions'))(this),
                cookies: new (require('./middleware/cookies'))(this),
                auth: new (require('./middleware/auth'))(this),
                sockets: null, // Will be initialized after server.listen(),
                cache: new (require('./middleware/cache'))(this)
            };

            // Write response time headers
            this.app.use(responseTime());

            // Init CSRF middleware
            this.app.use(csrf());

            return this.router.init();
        };

        /**
         *  Run application
         */
        Web.prototype.run = function () {
            var spdyOptions = {
                plain: true,
                ssl: false
            };

            this.server = spdy.createServer(spdyOptions, this.app);
            this.server.listen(config.server.port);

            // Socket middleware needs to be initialized AFTER web server
            var SocketMiddleware = require('./middleware/sockets');
            this.middleware['sockets'] = new SocketMiddleware(this);

            return this;
        };

        module.exports = Web;
    });
}());
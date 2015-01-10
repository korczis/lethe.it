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
        'deferred',
        '../../config',
        '../connectors',
        '../logger',
        '../persistence',
        '../processor',
        '../web'
    ];

    define(deps, function (deferred, config, connectors, logger, Persistence, Processor, Web) {
        function App() {
            this.connectors = {};

            this.processor = new Processor(this);

            this.persistence = new Persistence.backends.MongoDb();

            this.web = null;

            return this;
        };

        App.prototype.init = function() {
            var self = this;
            return this.initConnectors().then(function() {
                return self.initTimers();
            }).then(function() {
                return self.initPersistence();
            }).then(function() {
                return self.initWeb();
            });

            //return this.initConnectors()
            //    .then(this.initTimers())
            //    .then(this.initPersistence())
            //    .then(this.initWeb());
        };

        App.prototype.initPersistence = function() {
            return this.persistence.init();
        };


        App.prototype.initTimers = function() {
            return deferred(this);
        };

        App.prototype.initConnectors = function() {
            for (var i in connectors) {
                var connector = connectors[i];

                var connectorName = connector.name;
                this.connectors[connectorName] = {
                    klass: connector,
                    instance: new connector(this)
                };
            }

            // logger.info(this.connectors);

            return deferred(this);
        };

        App.prototype.initWeb = function() {
            this.web = new Web(this);

            return deferred(this);
        };

        /**
         *  Run application
         */
        App.prototype.run = function () {
            console.log(JSON.stringify(config, null, 4));

            return this.web.run();
        };

        module.exports = App;
    });
}());
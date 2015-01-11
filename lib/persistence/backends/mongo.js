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
        'fs',
        'inflection',
        'mongoose',
        'path',
        '../../../config'
    ];

    define(deps, function (deferred, fs, inflection, mongoose, path, config) {
        function PersistenceMongoDb(lethe) {
            this.lethe = lethe;

            this.models = {};

            return this;
        };

        PersistenceMongoDb.prototype.init = function () {
            var d = deferred();

            var self = this;
            var uri = config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
            this.connection = mongoose.connect(uri, {
                    server: {
                        socketOptions: {
                            keepAlive: 1,
                            poolSize: 10
                        }
                    },
                    user: config.mongo.username,
                    pass: config.mongo.password
                },
                function (err) {
                    if (err) {
                        d.reject(err);
                        return;
                    }

                    d.resolve(self.loadModels());
                }
            );

            return d.promise();
        };

        PersistenceMongoDb.prototype.loadModels = function () {
            var d = deferred();

            var self = this;
            var baseDir = path.join(__dirname, '../models');
            fs.readdir(baseDir, function (err, files) {
                if (err) {
                    d.reject(err);
                    return;
                }

                var blacklist = ['index.js', 'shared.js'];
                files.forEach(function (file) {
                    if (blacklist.indexOf(file) >= 0) {
                        return;
                    }
                    var modelFile = path.join(baseDir, file);
                    var modelName = file.replace('.js', '');
                    self.models[PersistenceMongoDb.generateModelName(modelName)] = require(modelFile)(self);
                });

                d.resolve(self);
            });

            return d.promise();
        };

        PersistenceMongoDb.generateModelName = function(filename) {
            var modelName = filename.replace('.js', '');
            return inflection.camelize(modelName);
        }

        module.exports = PersistenceMongoDb;
    });
}());
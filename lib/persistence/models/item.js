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
        'mongoose',
        './shared'
    ];

    define(deps, function(mongoose, Shared) {
        module.exports = function(mongo) {
            var schema = new mongoose.Schema({
                owner: String,
                source: String,
                uri: String,
                title: String,
                description: String,
                raw: mongoose.Schema.Types.Mixed,
                sourceId: { type: String, unique: true, dropDups: true },
                sourceUri: String,
                imageUri: String
            });

            Shared.addTimestamps(schema);

            var self = this;
            schema.methods.toClientObject = function(user) {
                var res = {
                    id: this.id,
                    source: this.source,
                    sourceId: this.sourceId,
                    sourceUri: this.sourceUri,
                    imageUri: this.imageUri,
                    uri: this.uri,
                    title: this.title,
                    description: this.description
                    // raw: self.raw
                }

                // Add sensitive data
                if(user && this.id == user.id) {
                }

                return res;
            };

            return mongo.connection.model('Item', schema);
        };
    });
}());
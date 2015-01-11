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
        'fbgraph',
        'node.extend'
    ];

    define(deps, function (deferred, fbgraph, merge) {
        var FacebookAdapter = function(app) {
            this.lethe = app;

            return this;
        }

        FacebookAdapter.prototype.fetchData = function(user, uri) {
            var d = deferred();

            var Item = this.lethe.persistence.models.Item;

            var self = this;
            var uri = uri || '/me/feed';
            fbgraph.get(uri, {limit: 100, access_token: user.facebook.accessToken}, function(err, res) {
                if(err) {
                    return d.reject(err);
                };

                res.data.forEach(function(item){
                    var data = {
                        source: 'facebook',
                        owner: user.id,
                        raw: item,
                        createdAt: Date.parse(item.created_time),
                        updatedAt: Date.parse(item.updated_time)
                    };

                    data.title = item.title || item.title || item.message;
                    data.description = item.description;

                    if(data && data.title) {
                        Item.create(data);
                    }
                });

                if(res.paging && res.paging.next) {
                    return d.resolve(self.fetchData(user, res.paging.next));
                }

                return d.resolve(self);
            });

            return d.promise();
        }

        FacebookAdapter.prototype.sync = function(user) {
            var d = this.fetchData(user);

            return d;
        };

        module.exports = FacebookAdapter;
    });
}());
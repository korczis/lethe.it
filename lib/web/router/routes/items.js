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
    var deps = [];

    define(deps, function () {
        var ItemsRoute = function(router) {
            var Item = router.lethe.persistence.models.Item;
            router.app.get('/items/:id', function (req, res){
                return Item.findOne({_id: req.params.id, owner: req.user.id}, function (err, obj) {
                    if (!err) {
                        if(obj) {
                            return res.send({
                                item: obj.toClientObject(req.user)
                            });
                        } else {
                            res.status(404);
                            res.send();
                        }
                    } else {
                        throw err;
                    }
                });
            });

            router.app.get('/items', function (req, res){
                var items = Item.find({owner: req.user.id})
                    .sort({createdAt: -1})
                    .limit(100)
                    .exec(function (err, objs) {
                        if (!err) {
                            if(objs) {
                                return res.send({
                                    items: objs.map(function(obj) {
                                        return obj.toClientObject(req.user)
                                    })
                                });
                            } else {
                                res.status(404);
                                res.send();
                            }
                        } else {
                            throw err;
                        }
                    });
            });

            return this;
        }

        module.exports = ItemsRoute;
    });
}());
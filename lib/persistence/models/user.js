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
        'mongoose'
    ];

    define(deps, function(mongoose) {
        module.exports = function(mongo) {
            var schema = new mongoose.Schema({
                name: String,
                facebook: mongoose.Schema.Types.Mixed,
                github: mongoose.Schema.Types.Mixed,
                twitter: mongoose.Schema.Types.Mixed
            });

            schema.methods.toClientObject = function(user) {
                var res = {
                    id: this.id,
                    name: this.name
                }

                // Add sensitive data
                if(user && this.id == user.id) {
                    if(this.facebook) {
                        res['facebook'] = {
                            id: this.facebook.id,
                            accessToken: this.facebook.accessToken,
                            uri: this.facebook.link,
                            img:'https://graph.facebook.com/' + this.facebook.id + '/picture?type=large'
                        }
                    }

                    if(this.github) {
                        res['github'] = {
                            id: this.github.id,
                            accessToken: this.github.accessToken,
                            uri: this.github.html_url,
                            img: this.github.avatar_url
                        }
                    }

                    if(this.twitter) {
                        res['twitter'] = {
                            id: this.twitter.id,
                            accessToken: this.twitter.accessToken,
                            uri: 'https://twitter.com/' + this.twitter.screen_name,
                            img: this.twitter.profile_image_url
                        }
                    }
                }

                return res;
            };

            return mongo.connection.model('User', schema);
        };
    });
}());
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

(function (global) {

    var deps = [
        'ember',
        'app',
        'jquery'
    ];

    define(deps, function (Ember, App, $) {
        App.ApplicationRoute = Ember.Route.extend({
            model: function () {
                var self = this;
                return new Ember.RSVP.Promise(function(resolve, reject) {
                    $.ajax({
                        url: '/users/current',
                        error: function (xhr, status, error) {
                            reject(error);
                        },
                        success: function (data, status, xhr) {
                            if(data && data.user && data.user.id != 'guest') {
                                resolve(self.store.find('user', data.user.id));
                            }
                            resolve(null);
                        },
                        dataType: 'json'
                    });
                });
            },

            beforeModel: function() {
                // TODO: GET /user/current
                // this.transitionTo('login');
            },

            // The code below is the default behavior, so if this is all you
            // need, you do not need to provide a setupController implementation
            // at all.
            setupController: function(controller, model) {
                var applicationController = this.controllerFor('application');
                applicationController.set('user', model);
            }
        });

        return App.ApplicationRoute;
    });
})(this);

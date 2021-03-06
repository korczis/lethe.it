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

    var coreDeps = [
        // Core compatibility
        'plugins',

        // Core libraries
        'bootstrap'
    ];

    var appDeps = [
        // Application
        'app',
        'router',

        // REST API Adapter
        'api/adapter',
        'api/initializer',
        'api/store',

        // Ember Components
        'components/navItem',

        // Ember Extensions
        'extensions/linkView',

        // Socket.io
        'socket/initializer',

        // Models
        'models/item',
        'models/user',

        // Routes
        'routes/auth/authController',
        'routes/auth/authRoute',
        'routes/auth/authView',

        'routes/contact/contactRoute',
        'routes/contact/contactView',

        'routes/applicationController',
        'routes/applicationRoute',

        'routes/indexController',
        'routes/indexRoute',

        'routes/privacy/privacyRoute',
        'routes/privacy/privacyView',

        'routes/profile/profileController',
        'routes/profile/profileRoute',
        'routes/profile/profileView',

        'routes/stream/streamRoute',
        'routes/stream/streamView',

        'routes/tos/tosRoute',
        'routes/tos/tosView'
    ];

    var deps = [].concat(coreDeps, appDeps);

    define(deps, function () {
        return {
            coreDeps: coreDeps,
            appDeps: appDeps,
            allDeps: deps
        };
    });
})(this);

# lethe.it

lethe.it - your personal smart links archive, organizer, classifier and much more

## Online Application

To feel the experience visit [https://lethe.it](https://lethe.it)

## Status

[![Build Status](https://travis-ci.org/korczis/lethe.it.svg?branch=master)](https://travis-ci.org/korczis/lethe.it)

## Getting Started

```
# Clone repository
git clone https://github.com/korczis/lethe.it.git

# Enter directory with cloned sources
cd lethe.it

# Install required node packages
npm install

# Run build pipeline
gulp

# Run node application server
node app.js&

# Optionally watch for changes, run automatic build and reload page in browser.
# Live reload chrome extension is required for automatic page reload.
gulp watch
```

## Structure

- [config](https://github.com/korczis/lethe.it/tree/master/config) - Global config directory
- [lib](https://github.com/korczis/lethe.it/tree/master/lib) - Server side implementation
  
- [public](https://github.com/korczis/lethe.it/tree/master/public) - Client side stuff
  - [app](https://github.com/korczis/lethe.it/tree/master/public/app) - Application
  - [assets](https://github.com/korczis/lethe.it/tree/master/public/assets) - Compiled Assets
  - [css](https://github.com/korczis/lethe.it/tree/master/public/css) - Source CSS
  - [doc](https://github.com/korczis/lethe.it/tree/master/public/doc) - Generated Documentation
  - [handlebars](https://github.com/korczis/lethe.it/tree/master/public/handlebars) - Handlebars Convertors
  - [img](https://github.com/korczis/lethe.it/tree/master/public/img) - Public Images
  - [js](https://github.com/korczis/lethe.it/tree/master/public/js) - Public JavaScripts
  - [views](https://github.com/korczis/lethe.it/tree/master/public/views) - Server side views
- [tmp](https://github.com/korczis/lethe.it/tree/master/tmp) - Temporary director

#! /usr/bin/env bash

git pull && npm install && gulp && forever stop app.js && forever start app.js
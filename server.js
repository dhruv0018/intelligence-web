#!/usr/bin/env node

var PORT = 8000;

var port = process.env.PORT || PORT;

var fs = require('fs');
var path = require('path');
var spdy = require('spdy');
var push = require('spdy-push');
var keys = require('spdy-keys');
var express = require('express');

var app = express();

var base = 'public/intelligence/';
var root = path.join(__dirname, base);

app.use(express.static('public'));

app.use(function(request, response){

    response.sendFile('index.html', { root: root });

    if (request.isSpdy) {

        push(response).push('/intelligence/styles.css', {
            filename: base + 'styles.css',
        });

        push(response).push('/intelligence/scripts.js', {
            filename: base + 'scripts.js',
        });
    }
});

spdy.createServer(keys, app).listen(port);


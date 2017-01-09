#!/usr/bin/env node

var PORT = 8000;

var port = process.env.PORT || PORT;

var path = require('path');
var express = require('express');

var app = express();

var base = 'public/intelligence/';
var root = path.join(__dirname, base);

app.use(express.static('public'));

app.use(function(request, response){

    response.sendFile('index.html', { root: root });
});

app.listen(port);


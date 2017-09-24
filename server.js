var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var errorify = require('errorify');
var express = require("express");
var app = express();


var port = 3000;
var staticFolder = 'dist';
var source = 'app/js/main.js';
var dist = 'dist/js/lib.js';

var b = browserify({
  entries: [source],
  cache: {},
  packageCache: {},
  plugin: [watchify, errorify]
});

b.on('update', bundle);

function bundle() {
  b.bundle().pipe(fs.createWriteStream(dist));
}

app.use(express.static(staticFolder));
app.listen(port);
console.log("Listening post: " + port);
bundle();

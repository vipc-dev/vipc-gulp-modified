/**
 * Created by Black Tea on 2015/9/6.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var etag = require('etag');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

function getJson(target) {
  if (!fs.existsSync(target)) return {};

  try {
    var data = fs.readFileSync(target);
    return JSON.parse(data);
  } catch (err) {
    console.log(new PluginError('vipc-gulp-modified', 'failed to parse json: ' + target));
    return {};
  }
}

module.exports = function (basePath, target) {
  var json = getJson(target);

  return through.obj(function (file, enc, callback) {
    if (file.isNull()) return callback();

    if (file.isBuffer()) {
      var relative = path.relative(basePath, file.path).replace(/\\/g, '/');
      var expect = json[relative];
      var body = file.contents.toString();
      var result = etag(body);
      if (!expect || expect.etag !== result) {
        console.log('modified path:', relative);
        json[relative] = {etag: result, lastModified: new Date().toGMTString()}
      }
    } else {
      this.emit('error', new PluginError('vipc-gulp-modified', 'no buffer'));
    }

    callback();
  }, function (done) {
    this.push(new File({
      path: target,
      contents: new Buffer(JSON.stringify(json, null, 2))
    }));
    done();
  })
};

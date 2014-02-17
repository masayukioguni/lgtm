'use strict';
var path = require('path');
var modulePath = path.resolve(path.join('lib', 'config', 'config'));
var module = require(modulePath);

describe("config", function() {
    it("has parameter", function() {
        expect(module.app_host).toEqual('http://localhost:9000');
        expect(module.app_root).toEqual('app');
        expect(module.upload_dir).toEqual('images');
        expect(module.is_save_s3).toEqual(false);
        expect(module.image_width).toEqual(250);
        expect(module.font_size).toEqual(68);
    });
});
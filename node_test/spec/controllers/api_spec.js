'use strict';

var module = require('controllers/api');

describe("api", function() {
    it("getImageUrl", function() {
        expect(module.getImageUrl('test')).toEqual("https://s3-us-west-2.amazonaws.com/lgtmtest/test");
    });

    it("getImageSavePath", function() {
        expect(module.getImageSavePath('lgtm', 'test')).toEqual("app/images/lgtm/test");
    });

    it("getImageLoadPath", function() {
        expect(module.getImageLoadPath('lgtm', 'test')).toEqual("http://localhost:9000/images/lgtm/test");
    });
});
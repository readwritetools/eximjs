var expect = require('joezone').expect;
var Something = require('../somewhere.js').Something;
var fs = require('fs');
var BlueInstance = require('../processor/blue-instance.class.js');

module.exports.FileInterface = class FileInterface {
	constructor() {
	}
}

module.exports.FileInterfaceFactory = function FileInterfaceFactory {
	return new FileInterface();
}

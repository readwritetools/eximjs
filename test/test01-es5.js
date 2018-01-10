var expect = require('joezone').expect;
var Something = require('../somewhere.js').Something;
var fs = require('fs');
var BlueInstance = require('../processor/blue-instance.class.js');

module.exports = class FileInterface {
	
	constructor() {
		global.blueInstance = new BlueInstance();
		global.blueInstance.initialize();
	}
}

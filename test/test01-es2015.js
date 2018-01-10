import {expect}			from 'joezone';
import {Something}		from '../somewhere';
import fs				from 'fs';
import BlueInstance 	from '../processor/blue-instance.class';

export default class FileInterface {
	
	constructor() {
		global.blueInstance = new BlueInstance();
		global.blueInstance.initialize();
	}
}

import {expect}			from 'joezone';
import {Something}		from '../somewhere';
import fs				from 'fs';
import BlueInstance 	from '../processor/blue-instance.class';

export class FileInterface {
	constructor() {
	}
}

export function FileInterfaceFactory {
	return new FileInterface();
}

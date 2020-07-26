//=============================================================================
//
// File:         eximjs/src/eximjs.class.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2018
// License:      MIT
// Initial date: Jan 10, 2018
// Usage:        eximjs input output
//
//=============================================================================
var expect = require('joezone').expect;
var terminal = require('joezone').terminal;
var Pfile = require('joezone').Pfile;
var TextReader = require('joezone').TextReader;
var TextWriter = require('joezone').TextWriter;
var fs = require('fs');

module.exports = class Eximjs {

	constructor() {
		Object.seal(this);
	}

	execute() {
		// argv[0] node
		// argv[1] main.js
		// argv[2] input.js
	    // argv[3] output.js
		if (process.argv.length <= 3)
			return;

		var inputPfile = new Pfile(process.argv[2]);
		if (!inputPfile.exists()) {
			terminal.writeToConsoleOrStderr(green(this.inputPfile.name) + ' not found');
			return;
		}
		var outputPfile = new Pfile(process.argv[3]);
		
		try {
			this.process(inputPfile, outputPfile);
			return 0;
		}
		catch(err) {
			terminal.writeToConsoleOrStderr(err.message);
			return 1;
		}
	}
	
	process(inputPfile, outputPfile) {
		expect(inputPfile,  'Pfile');
		expect(outputPfile, 'Pfile');

		var tr = new TextReader();
		var tw = new TextWriter();
		
		tr.open(inputPfile.name);
		tw.open(outputPfile.name);
		
		var line = '';
		while ((line = tr.getline()) != null) {
			line = this.fixupImport(line);
			line = this.fixupExport(line);
			tw.putline(line);
		}

		tr.close();
		tw.close();
	}
	
    //> A string containing ES2015 import syntax
    //< A string containing ES5 require syntax
	// Convert from: import ToolBox from "../../path/to/tool-box.class";
	// Convert to:   var ToolBox = require('./tool-box.class.js');
	//
	//> a single line of JavaScript code
	//> filenameOnly is NOT a relative filename, but simply the filename with extension
    //> pathIn to filenameOnly
    //> pathOut to filenameOnly
	//> recursion depth
	fixupImport(line) {
		expect(line, 'String');
		
		// using this as the test line										// "import ToolBox from '../../joezone/src/tool-box.class';		// comment"
		
		// strip off any trailing c++ style comment
		var lineWithoutComment = line.split('//')[0];						// "import ToolBox from '../../joezone/src/tool-box.class';		"
		lineWithoutComment = lineWithoutComment.trim();						// import ToolBox from '../../joezone/src/tool-box.class';
		
		var regex = /import\s+(.*?)\s+from\s+(.*)/;
		var match = regex.exec(lineWithoutComment);
		if (match == null)
			return line;
	
		var varnameCapture  = match[1];										// ToolBox
		var fileCapture = match[2];											// '../../joezone/src/tool-box.class';

		// see if the varname is like ToolBox or like {ToolBox}
		var leftCurlyBrace = varnameCapture.indexOf('{');
		var rightCurlyBrace = varnameCapture.indexOf('}');
		var bCurlyBraceVarname;
		var varname;
		if (leftCurlyBrace != -1 && rightCurlyBrace != -1 && leftCurlyBrace < rightCurlyBrace) {
			bCurlyBraceVarname = true;
			varname = varnameCapture.substr(leftCurlyBrace+1, (rightCurlyBrace-leftCurlyBrace)-1).trim();
		}
		else {
			bCurlyBraceVarname = false;
			varname = varnameCapture.trim();
		}
		
		// remove any trailing semicolon
		if (fileCapture.charAt(fileCapture.length-1) == ';')
			fileCapture = fileCapture.substr(0, fileCapture.length-1);		// '../../joezone/src/tool-box.class'
		
		// remove possible surrounding quotes
		var char0 = fileCapture.charAt(0);
		var charN = fileCapture.charAt(fileCapture.length-1);
		if (char0 == charN && (char0 == '"' || char0 == "'"))
			fileCapture = fileCapture.substr(1, fileCapture.length-2);		// ../../joezone/src/tool-box.class
	
		// 'fs' | 'crypto' | 'http' | 'https' | url' | 'electron'
		var bRelativePath = (fileCapture.indexOf('./') == -1) ? false : true;	// not ./ or ../

		// four fixup possibilities:

		// 1: import {ToolBox} from '../tool-box.js' -->  var ToolBox = require('../tool-box.js').ToolBox;
		if (bCurlyBraceVarname == true && bRelativePath == true) {
			// append ".js"
			if (fileCapture.lastIndexOf('.js') != fileCapture.length - 3)		// ../tool-box.class.js
				fileCapture += '.js';
			var lineOut = `var ${varname} = require('${fileCapture}').${varname};`;
			return lineOut;
		}
		
		// 2: import {ToolBox} from 'libname'  -->  var ToolBox = require('libname').ToolBox;
		else if (bCurlyBraceVarname == true && bRelativePath == false) {
			var libname = fileCapture;
			var lineOut = `var ${varname} = require('${libname}').${varname};`;
			return lineOut;
		}
		
		// 3: import ToolBox from './tool-box.js'   -->  var ToolBox = require('./toolbox.js);
		//    import ToolBox from '../tool-box.js'  -->  var ToolBox = require('../toolbox.js);
		else if (bCurlyBraceVarname == false && bRelativePath == true) {
			// append ".js"
			if (fileCapture.lastIndexOf('.js') != fileCapture.length - 3)		// ../../joezone/src/tool-box.class.js
				fileCapture += '.js';
			var lineOut = `var ${varname} = require('${fileCapture}');`;
			return lineOut;
		}

		// 4: import fs from 'fs'  -->  var fs = require('fs');
		else { // if (bCurlyBraceVarname == false && bRelativePath == false)
			var filename = new Pfile(fileCapture).getFilename();			// fs
			var lineOut = `var ${varname} = require('${filename}');`;
			return lineOut;
		}

	}
	
    //> A string containing ES2015 export syntax
    //< A string containing ES5 module.exports syntax
	//Convert from: export default class ToolBox {
	//Convert to:   module.exports = class ToolBox {
	fixupExport(line) {
		expect(line, 'String');

		// pattern 1:
		line = line.replace('export default', 'module.exports =');		// export default class ToolBox {
																		// module.exports = class ToolBox {		
		// pattern 2:
		var regex = /export\s+(class|function)\s+(.*?)\s+\{/;			// export class ToolBox {
		var match = regex.exec(line);
		if (match == null)
			return line;

		var classOrFunction = match[1];									// class
		var varnameCapture  = match[2];									// ToolBox
		var lineOut = `module.exports.${varnameCapture} = ${classOrFunction} ${varnameCapture} {`;
		return lineOut;													// module.exports.ToolBox = class ToolBox {
	}
}

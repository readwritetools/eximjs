//=============================================================================
//
// File:         eximjs/src/cli.class.js
// Language:     ECMAScript 2015
// Copyright:    Joe Honton © 2018
// License:      CC-BY-NC-ND 4.0
// Initial date: Jan 10, 2018
// Contents:     Command line interface
//
//=============================================================================
var expect = require('joezone').expect;
var terminal = require('joezone').terminal;
var Pfile = require('joezone').Pfile;
var Eximjs = require('./eximjs.class.js');
var fs = require('fs');

module.exports = class CLI {
	
    constructor() {
		Object.seal(this);
    }
    
    //^ Check to see if all the necessary command line arguments are present and valid
	// argv[0] node
	// argv[1] main.js
	// argv[2] input.js | --version | --help
    // argv[3] output.js
    //< returns false to prevent actual execution
    validateOptions() {
    	
    	if (process.argv.length == 2)
    		this.usageAndExit();
    	
    	switch (process.argv[2]) {
	    	case '--version':
	    		this.exit(this.showVersion());
	    		return false;
	    		
	    	case '--help':
	    		this.exit(this.listHelp());
	    		return false;
    	}
    	
    	if (process.argv.length < 4)
    		this.usageAndExit();
    	
    	return true;
    }
    
    usageAndExit() {
		var s = [];
		s.push("usage: eximjs [input] [ouptut]");
		s.push("");
		s.push("options:");
		s.push("    --version");
		s.push("    --help");
		this.exit(s.join("\n"));
    }
    
    showVersion() {
    	try {
    		var packageFile = new Pfile(__dirname).addPath('../package.json').name;
	    	var contents = fs.readFileSync(packageFile, 'utf-8');
	    	var obj = JSON.parse(contents);
	    	return `version v${obj.version}`;
    	}
    	catch (err) {
    		return `version unknown ${err.message}`;
    	}
    }

    listHelp() {
		var s = [];
		s.push("");
		s.push("usage: eximjs [input] [output]");
		s.push("");
		s.push("import {NAME} from './path/to/file'");
		s.push("import NAME   from 'nodemodule'");
		s.push("import {NAME} from 'nodemodule'");
		s.push("");
		s.push("export default function FUNCTIONNAME {");
		s.push("export default class CLASSNAME {");
		s.push("");
		s.push("");
		return s.join("\n")
    }
    
    exit(message) {
		terminal.writeToConsoleOrStderr("\nEximjs converts JavaScript 2015 inport/export statements to ES5 require/module statements\n");
		terminal.writeToConsoleOrStderr(message + "\n");
		process.exit(0);
    
    }

    execute() {
	    var eximjs = new Eximjs();
	    var rc = eximjs.execute();
		process.exit(rc);
    }

}

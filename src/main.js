//=============================================================================
//
// File:         eximjs/src/main.js
// Language:     ECMAScript 2015
// Copyright:    Joe Honton © 2018
// License:      CC-BY-NC-ND 4.0
// Initial date: Jan 10, 2018
// Usage:        main entry point
//
//=============================================================================

var CLI = require('./cli.class.js');
var cli = new CLI();

// Read the command line and execute
if (cli.validateOptions())
	cli.execute();

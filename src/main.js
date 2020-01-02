//=============================================================================
//
// File:         eximjs/src/main.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2018
// License:      MIT
// Initial date: Jan 10, 2018
// Usage:        main entry point
//
//=============================================================================

var CLI = require('./cli.class.js');
var cli = new CLI();

// Read the command line and execute
if (cli.validateOptions())
	cli.execute();

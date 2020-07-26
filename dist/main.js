/* Copyright (c) 2020 Read Write Tools */
var CLI = require('./cli.class.js'), cli = new CLI();

cli.validateOptions() && cli.execute();
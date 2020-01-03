/* Copyright (c) 2018 Read Write Tools */
/* Copyright (c) 2019 Read Write Tools */
var expect = require('joezone').expect, terminal = require('joezone').terminal, Pfile = require('joezone').Pfile, Eximjs = require('./eximjs.class.js'), fs = require('fs');

module.exports = class CLI {
    constructor() {
        Object.seal(this);
    }
    validateOptions() {
        switch (2 == process.argv.length && this.usageAndExit(), process.argv[2]) {
          case '--version':
            return this.exit(this.showVersion()), !1;

          case '--help':
            return this.exit(this.listHelp()), !1;
        }
        return process.argv.length < 4 && this.usageAndExit(), !0;
    }
    usageAndExit() {
        var e = [];
        e.push('usage: eximjs [input] [ouptut]'), e.push(''), e.push('options:'), e.push('    --version'), 
        e.push('    --help'), this.exit(e.join('\n'));
    }
    showVersion() {
        try {
            var e = new Pfile(__dirname).addPath('../package.json').name, s = fs.readFileSync(e, 'utf-8');
            return `version v${JSON.parse(s).version}`;
        } catch (e) {
            return `version unknown ${e.message}`;
        }
    }
    listHelp() {
        var e = [];
        return e.push(''), e.push('usage: eximjs [input] [output]'), e.push(''), e.push('import {NAME} from \'./path/to/file\''), 
        e.push('import NAME   from \'nodemodule\''), e.push('import {NAME} from \'nodemodule\''), 
        e.push(''), e.push('export default function FUNCTIONNAME {'), e.push('export default class CLASSNAME {'), 
        e.push(''), e.push(''), e.join('\n');
    }
    exit(e) {
        terminal.writeToConsoleOrStderr('\nEximjs converts JavaScript 2015 inport/export statements to ES5 require/module statements\n'), 
        terminal.writeToConsoleOrStderr(e + '\n'), process.exit(0);
    }
    execute() {
        var e = new Eximjs().execute();
        process.exit(e);
    }
};
/* Copyright (c) 2020 Read Write Tools */
var expect = require('joezone').expect, terminal = require('joezone').terminal, Pfile = require('joezone').Pfile, TextReader = require('joezone').TextReader, TextWriter = require('joezone').TextWriter, fs = require('fs');

module.exports = class Eximjs {
    constructor() {
        Object.seal(this);
    }
    execute() {
        if (!(process.argv.length <= 3)) {
            var e = new Pfile(process.argv[2]);
            if (e.exists()) {
                var r = new Pfile(process.argv[3]);
                try {
                    return this.process(e, r), 0;
                } catch (e) {
                    return terminal.writeToConsoleOrStderr(e.message), 1;
                }
            } else terminal.writeToConsoleOrStderr(green(this.inputPfile.name) + ' not found');
        }
    }
    process(e, r) {
        expect(e, 'Pfile'), expect(r, 'Pfile');
        var t = new TextReader(), i = new TextWriter();
        t.open(e.name), i.open(r.name);
        for (var s = ''; null != (s = t.getline()); ) s = this.fixupImport(s), s = this.fixupExport(s), 
        i.putline(s);
        t.close(), i.close();
    }
    fixupImport(e) {
        expect(e, 'String');
        var r = e.split('//')[0];
        r = r.trim();
        var t = /import\s+(.*?)\s+from\s+(.*)/.exec(r);
        if (null == t) return e;
        var i, s, n = t[1], o = t[2], l = n.indexOf('{'), a = n.indexOf('}');
        -1 != l && -1 != a && l < a ? (i = !0, s = n.substr(l + 1, a - l - 1).trim()) : (i = !1, 
        s = n.trim()), ';' == o.charAt(o.length - 1) && (o = o.substr(0, o.length - 1));
        var u = o.charAt(0);
        u != o.charAt(o.length - 1) || '"' != u && '\'' != u || (o = o.substr(1, o.length - 2));
        var x = -1 != o.indexOf('./');
        return 1 == i && 1 == x ? (o.lastIndexOf('.js') != o.length - 3 && (o += '.js'), 
        `var ${s} = require('${o}').${s};`) : 1 == i && 0 == x ? `var ${s} = require('${o}').${s};` : 0 == i && 1 == x ? (o.lastIndexOf('.js') != o.length - 3 && (o += '.js'), 
        `var ${s} = require('${o}');`) : `var ${s} = require('${new Pfile(o).getFilename()}');`;
    }
    fixupExport(e) {
        expect(e, 'String'), e = e.replace('export default', 'module.exports =');
        var r = /export\s+(class|function)\s+(.*?)\s+\{/.exec(e);
        if (null == r) return e;
        var t = r[1], i = r[2];
        return `module.exports.${i} = ${t} ${i} {`;
    }
};
/* Copyright (c) 2019 Read Write Tools */
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
        for (var n = ''; null != (n = t.getline()); ) n = this.fixupImport(n), n = this.fixupExport(n), 
        i.putline(n);
        t.close(), i.close();
    }
    fixupImport(e) {
        expect(e, 'String');
        var r = e.split('//')[0];
        r = r.trim();
        var t = /import\s+(.*?)\s+from\s+(.*)/, i = t.exec(r);
        if (null == i) return e;
        var n, s, o = i[1], a = i[2], l = o.indexOf('{'), u = o.indexOf('}');
        -1 != l && -1 != u && l < u ? (n = !0, s = o.substr(l + 1, u - l - 1).trim()) : (n = !1, 
        s = o.trim()), ';' == a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1));
        var p = a.charAt(0), x = a.charAt(a.length - 1);
        p != x || '"' != p && '\'' != p || (a = a.substr(1, a.length - 2));
        var c = -1 != a.indexOf('./');
        if (1 == n && 1 == c) {
            a.search('.js') != a.length - 3 && (a += '.js');
            return `var ${s} = require('${a}').${s};`;
        }
        if (1 == n && 0 == c) {
            var f = a;
            return `var ${s} = require('${f}').${s};`;
        }
        if (0 == n && 1 == c) {
            a.search('.js') != a.length - 3 && (a += '.js');
            return `var ${s} = require('${a}');`;
        }
        var v = new Pfile(a).getFilename();
        return `var ${s} = require('${v}');`;
    }
    fixupExport(e) {
        expect(e, 'String'), e = e.replace('export default', 'module.exports =');
        var r = /export\s+(class|function)\s+(.*?)\s+\{/, t = r.exec(e);
        if (null == t) return e;
        var i = t[1], n = t[2], s = `module.exports.${n} = ${i} ${n} {`;
        return s;
    }
};
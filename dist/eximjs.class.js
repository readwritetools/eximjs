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
        var n, s, a = i[1], o = i[2], l = a.indexOf('{'), u = a.indexOf('}');
        -1 != l && -1 != u && l < u ? (n = !0, s = a.substr(l + 1, u - l - 1).trim()) : (n = !1, 
        s = a.trim()), ';' == o.charAt(o.length - 1) && (o = o.substr(0, o.length - 1));
        var p = o.charAt(0), x = o.charAt(o.length - 1);
        p != x || '"' != p && '\'' != p || (o = o.substr(1, o.length - 2));
        var c = -1 != o.indexOf('./');
        if (1 == n && 1 == c) {
            o.search('.js') != o.length - 3 && (o += '.js');
            return `var ${s} = require('${o}').${s};`;
        }
        if (1 == n && 0 == c) {
            var f = o;
            return `var ${s} = require('${f}').${s};`;
        }
        if (0 == n && 1 == c) {
            o.search('.js') != o.length - 3 && (o += '.js');
            return `var ${s} = require('${o}');`;
        }
        var m = new Pfile(o).getFilename();
        return `var ${s} = require('${m}');`;
    }
    fixupExport(e) {
        return expect(e, 'String'), e.replace('export default', 'module.exports =');
    }
};
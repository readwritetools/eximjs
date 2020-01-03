







<figure>
	<img src='/img/tasks/eximjs/eximjs-unsplash-chuttersnap.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

# Eximjs

## From ES Modules to CommonJS Modules


<address>
<img src='/img/rwtools.png' width=80 /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2016-10-19>Nov 19, 2016</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>eximjs</span> command line utility is used to convert ECMAScript module syntax to CommonJS module syntax.</td></tr>
</table>

### Motivation

In 2015, the ECMASCript TC39 standards committee finalized the syntax for
exporting and importing modules. Implementing the full standard has been
problematic, and there has been considerable delay. In the interim, developers
wishing to write forward-compatible code can use the new ES Module syntax and
transpile it back to the old CommonJS syntax. The <span>eximjs</span> command
line utility can be used to do that.

### Prerequisites and installation

The <span>eximjs</span> utility uses Node.js. Package installation is done via
NPM. These are the only two prerequisites.

To install the utility and make it available to your Bash shell, use this
command.

```bash
[user@host]# npm install -g eximjs
```

### Usage

The software is invoked from the command line with:

```bash
[user@host]# eximjs [source file] [destination file] 
```

The following conversions are performed:


<table>
	<tr><th>ECMAScript Modules</th> <th>CommonJS Modules</th></tr>
	<tr><td>import NAME from './path/to/file'</td> 	<td>var NAME = require('./path/to/file')</td></tr>
	<tr><td>import {NAME} from './path/to/file'</td> 	<td>var NAME = require('./path/to/file').NAME</td></tr>
	<tr><td>import NAME from 'nodemodule'</td> 		<td>var NAME = require('nodemodule')</td></tr>
	<tr><td>import {NAME} from 'nodemodule'</td> 		<td>var NAME = require('nodemodule').NAME</td></tr>
	<tr><td>export default</td>						<td>module.exports =</td></tr>
	<tr><td>export class NAME {</td>					<td>module.exports.NAME = class NAME {</td></tr>
	<tr><td>export function NAME () {</td>			<td>module.exports.NAME = function NAME () {</td></tr>
</table>

Note that absolute paths, those beginning with <kbd>/</kbd>, are not allowed.

Also, as of Dec 2019, the Node.js platform allows the filename extension to be
omitted, but the Chrome browser module system does not.

For the most efficient use of resources, this utility should be invoked by a
build tool that is sensitive to file modification timestamps, so that it is
triggered for each file in a nested hierarchy only when a source file is
changed. (The Read Write Tools `prorenata` builder has this capability.)

### License and availability

The <span>eximjs</span> command line utility is licensed under the MIT
License. It may be cloned from <a href='https://github.com/readwritetools/eximjs'>Github</a>
, or installed via <a href='https://www.npmjs.com/package/eximjs'>NPM</a>
.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>


# nfy

Convert AMD modules into a node.js compatible format.
This package was forked from [Nodefy](https://github.com/millermedeiros/nodefy/)
to improve circular reference resolution and to punt CLI globbing to the OS.

## How?

This tool uses [Esprima](http://esprima.org/) to parse Javascript and remove
`define` calls, replacing them with `require` calls.
If the AMD module returns an object literal, then each key becomes a key on the
`exports` object.
If the AMD module returns something else, then that return value gets assigned
to `module.exports`.
Any `define(function (require, exports, module) {...` wrappings map properly
too.

### Input

```
define(['foo', '../bar/baz'], function(foo, baz){

    var lorem = 'ipsum';

    return {
        log : function(){
            console.log(lorem);
        }
    };

});
```

### Output

```
    var foo = require('foo');
    var baz = require('../bar/baz');

    var lorem = 'ipsum';

    exports.log = function () {
        console.log(lorem);
    };
```

## CLI

You can use it as a CLI tool:

    npm install -g nfy
    shopt -s globstar
    nfy -o cjs src/**/*.js

This will convert all *.js*-suffixed files inside the *src* folder to Node
modules, and then put the results into the *cjs* folder.
For instance, *src/someFile.js* maps to a Node module at *cjs/src/someFile.js*.

The `--src-prefix` option will remove its path prefix from the targeted file
name.
For instance, `nfy -o cjs --src-prefix=src src/**/*.js` would map
*src/someFile.js* to *cjs/someFile.js*.


It also works with `stdin` and `stdout`:

    cat src/someFile.js | nodefy

For a list of available options run:

    nodefy -h

## Features, Goals & Limitations

The
[Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) is
very flexible, it supports
[plugins](https://github.com/amdjs/amdjs-api/wiki/Loader-Plugins), many
[configuration settings](https://github.com/amdjs/amdjs-api/wiki/Common-Config)
to define how modules should be loaded, and asynchronous module loading.

**This tool aims to convert basic modules**, plugins and advanced settings are
NOT going to be supported in the near future.
Use [uRequire](https://github.com/anodynos/uRequire) if you need something more
robust.

## Alternatives

 - [amdefine](https://github.com/jrburke/amdefine)
 - [UMD](https://github.com/umdjs/umd)
 - [r.js](https://github.com/jrburke/r.js)
 - [uRequire](https://github.com/anodynos/uRequire)

## License

Released under the MIT license

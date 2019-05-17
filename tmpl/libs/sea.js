//#snippet;
//#exclude=define;
(global => {
    let cachedMods = {};
    let isArray = Array.isArray;
    let getModule = id => cachedMods[id] || (cachedMods[id] = {});

    let DOT_RE = /\/\.\//g
    let DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//
    let DOUBLE_SLASH_RE = /([^:/])\/\//g
    let REMOVE_TAIL = /[^/]*$/;

    let realpath = path => {
        // /a/b/./c/./d ==> /a/b/c/d
        path = path.replace(DOT_RE, "/")

        // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, "/")
        }

        // a//b/c  ==>  a/b/c
        path = path.replace(DOUBLE_SLASH_RE, "$1/")

        return path
    };
    let require = id => {
        let mod = getModule(id)
        if (!mod['@{module#execed}']) {
            mod['@{module#execed}'] = 1;
            let factory = mod['@{module#factory}'];
            let r = d => {
                if (d.startsWith('.')) {
                    d = realpath(id.replace(REMOVE_TAIL, '') + '/' + d);
                }
                return require(d);
            };
            let epts = factory(r, mod.exports = {}, mod);
            if (epts !== void 0) {
                mod.exports = epts;
            }
            delete mod['@{module#factory}']
        }
        return mod.exports;
    }
    global.define = (id, deps, factory) => {
        if (!isArray(deps)) {
            factory = deps;
            deps = [];
        }
        let mod = getModule(id);
        mod['@{module#factory}'] = factory
    };
    global.require = require;
})(this);
//#snippet;
//#uncheck = jsThis,jsLoop;
//#exclude = loader,allProcessor;
/*!3.8.9 Licensed MIT*/
/*
author:kooboy_li@163.com
loader:cmd
enables:style,naked,updater,updaterVDOM

optionals:base,updaterDOM,updaterAsync,service,serviceCombine,router,tipRouter,tipLockUrlRouter,edgeRouter,forceEdgeRouter,urlRewriteRouter,updateTitleRouter,state,cnum,ceach,collectView,layerVframe,viewProtoMixins,viewSlot,share,defaultView,autoEndUpdate,linkage,viewInit,resource,configIni,nodeAttachVframe,mxViewAttr,viewMerge,keepHTML,eventEnterLeave,vdom
*/
define('magix', function (require) {
    if (typeof DEBUG == 'undefined')
        window.DEBUG = true;
    var G_Type = function (type) { return function (o) { return Object.prototype.toString.call(o).slice(8, -1) == type; }; };
    var G_IsObject = G_Type('Object');
    var G_IsArray = G_Type('Array');
    var G_COUNTER = 0;
    var G_EMPTY = '';
    var G_EMPTY_ARRAY = [];
    var G_COMMA = ',';
    var G_NULL = null;
    var G_WINDOW = window;
    var G_DOCUMENT = document;
    var Timeout = G_WINDOW.setTimeout;
    var G_CHANGED = 'changed';
    var G_CHANGE = 'change';
    var G_PAGE_UNLOAD = 'pageunload';
    var G_VALUE = 'value';
    var G_Tag_Key = 'mxs';
    var G_Tag_Attr_Key = 'mxa';
    var G_Tag_View_Key = 'mxv';
    var G_HashKey = '#';
    var G_NOOP = function () { };
    var JSONStringify = JSON.stringify;
    var G_DOCBODY; //initilize at vframe_root
    /*
        关于spliter
        出于安全考虑，使用不可见字符\u0000，然而，window手机上ie11有这样的一个问题：'\u0000'+"abc",结果却是一个空字符串，好奇特。
     */
    var G_SPLITER = '\x1e';
    var Magix_StrObject = 'object';
    var G_PROTOTYPE = 'prototype';
    var G_PARAMS = 'params';
    var G_PATH = 'path';
    var G_MX_VIEW = 'mx-view';
    // let Magix_PathRelativeReg = /\/\.(?:\/|$)|\/[^\/]+?\/\.{2}(?:\/|$)|\/\/+|\.{2}\//; // ./|/x/../|(b)///
    // let Magix_PathTrimFileReg = /\/[^\/]*$/;
    // let Magix_ProtocalReg = /^(?:https?:)?\/\//i;
    var Magix_PathTrimParamsReg = /[#?].*$/;
    var Magix_ParamsReg = /([^=&?\/#]+)=?([^&#?]*)/g;
    var Magix_IsParam = /(?!^)=|&/;
    var G_Id = function (prefix) { return (prefix || 'mx_') + G_COUNTER++; };
    var Magix_Cfg = {
        rootId: G_Id(),
        error: function (e) {
            throw e;
        }
    };
    var G_GetById = function (id) { return typeof id == Magix_StrObject ? id : G_DOCUMENT.getElementById(id); };
    var G_IsPrimitive = function (args) { return !args || typeof args != Magix_StrObject; };
    var G_Set = function (newData, oldData, keys) {
        var changed = 0, now, old, p;
        for (p in newData) {
            now = newData[p];
            old = oldData[p];
            if (!G_IsPrimitive(now) || old !== now) {
                keys[p] = 1;
                changed = 1;
            }
            oldData[p] = now;
        }
        return changed;
    };
    var G_NodeIn = function (a, b, r) {
        a = G_GetById(a);
        b = G_GetById(b);
        if (a && b) {
            r = a == b;
            if (!r) {
                try {
                    r = (b.compareDocumentPosition(a) & 16) == 16;
                }
                catch (e) { }
            }
        }
        return r;
    };
    var G_Assign = function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (G_Has(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    var G_Keys = function (obj, keys, p) {
        keys = [];
        for (p in obj) {
            if (G_Has(obj, p)) {
                keys.push(p);
            }
        }
        return keys;
    };
    var Magix_HasProp = Magix_Cfg.hasOwnProperty;
    var Header = document.head;
    var Temp = document.createElement('div');
    var View_ApplyStyle = function (key, css) {
        if (DEBUG && G_IsArray(key)) {
            for (var i = 0; i < key.length; i += 2) {
                View_ApplyStyle(key[i], key[i + 1]);
            }
            return;
        }
        if (css && !View_ApplyStyle[key]) {
            View_ApplyStyle[key] = 1;
            if (DEBUG) {
                Temp.innerHTML = "<style id=\"" + key + "\">" + css;
                Header.appendChild(Temp.firstChild);
            }
            else {
                Temp.innerHTML = "<style>" + css;
                Header.appendChild(Temp.firstChild);
            }
        }
    };
    var IdIt = function (n) { return n.id || (n.id = G_Id()); };
    var G_ToTry = function (fns, args, context, r, e) {
        args = args || G_EMPTY_ARRAY;
        if (!G_IsArray(fns))
            fns = [fns];
        if (!G_IsArray(args))
            args = [args];
        for (var _i = 0, fns_1 = fns; _i < fns_1.length; _i++) {
            e = fns_1[_i];
            try {
                r = e && e.apply(context, args);
            }
            catch (x) {
                Magix_Cfg.error(x);
            }
        }
        return r;
    };
    var G_Has = function (owner, prop) { return owner && Magix_HasProp.call(owner, prop); }; //false 0 G_NULL '' undefined
    var G_TranslateData = function (data, params, deep) {
        var p, val;
        if (!deep && G_IsPrimitive(params)) {
            p = params + G_EMPTY;
            if (p[0] == G_SPLITER) {
                params = data[p];
            }
        }
        else {
            for (p in params) {
                val = params[p];
                if (deep && !G_IsPrimitive(val)) {
                    G_TranslateData(data, val, deep);
                }
                if (p[0] == G_SPLITER) {
                    delete params[p];
                    p = data[p];
                }
                params[p] = (val + G_EMPTY)[0] == G_SPLITER ? data[val] : val;
            }
        }
        return params;
    };
    var Magix_CacheSort = function (a, b) { return b.f - a.f || b.t - a.t; };
    /**
     * Magix.Cache 类
     * @name Cache
     * @constructor
     * @param {Integer} [max] 缓存最大值，默认20
     * @param {Integer} [buffer] 缓冲区大小，默认5
     * @param {Function} [remove] 当缓存的元素被删除时调用
     * @example
     * let c = new Magix.cache(5,2);//创建一个可缓存5个，且缓存区为2个的缓存对象
     * c.set('key1',{});//缓存
     * c.get('key1');//获取
     * c.del('key1');//删除
     * c.has('key1');//判断
     * //注意：缓存通常配合其它方法使用，在Magix中，对路径的解析等使用了缓存。在使用缓存优化性能时，可以达到节省CPU和内存的双赢效果
     */
    var G_Cache = function (max, buffer, remove, me) {
        me = this;
        me.c = [];
        me.b = buffer || 5; //buffer先取整，如果为0则再默认5
        me.x = me.b + (max || 20);
        me.r = remove;
    };
    G_Assign(G_Cache[G_PROTOTYPE], {
        /**
         * @lends Cache#
         */
        /**
         * 获取缓存的值
         * @param  {String} key
         * @return {Object} 初始设置的缓存对象
         */
        get: function (key) {
            var me = this;
            var c = me.c;
            var r = c[G_SPLITER + key];
            if (r) {
                r.f++;
                r.t = G_COUNTER++;
                //console.log(r.f);
                r = r.v;
                //console.log('hit cache:'+key);
            }
            return r;
        },
        /**
         * 设置缓存
         * @param {String} key 缓存的key
         * @param {Object} value 缓存的对象
         */
        set: function (okey, value) {
            var me = this;
            var c = me.c;
            var key = G_SPLITER + okey;
            var r = c[key];
            var t = me.b, f;
            if (!r) {
                if (c.length >= me.x) {
                    c.sort(Magix_CacheSort);
                    while (t--) {
                        r = c.pop();
                        //为什么要判断r.f>0,考虑这样的情况：用户设置a,b，主动删除了a,重新设置a,数组中的a原来指向的对象残留在列表里，当排序删除时，如果不判断则会把新设置的删除，因为key都是a
                        //
                        if (r.f > 0)
                            me.del(r.o); //如果没有引用，则删除
                    }
                }
                r = {
                    o: okey
                };
                c.push(r);
                c[key] = r;
            }
            r.v = value;
            r.f = 1;
            r.t = G_COUNTER++;
        },
        /**
         * 删除缓存
         * @param  {String} key 缓存key
         */
        del: function (k) {
            k = G_SPLITER + k;
            var c = this.c;
            var r = c[k], m = this.r;
            if (r) {
                r.f = -1;
                r.v = G_EMPTY;
                delete c[k];
                if (m) {
                    G_ToTry(m, r.o);
                }
            }
        },
        /**
         * 检测缓存中是否有给定的key
         * @param  {String} key 缓存key
         * @return {Boolean}
         */
        has: function (k) {
            return G_Has(this.c, G_SPLITER + k);
        }
    });
    var G_Require = function (name, fn) {
        if (name) {
            var a_1 = [], n = void 0;
            if (G_WINDOW.seajs) {
                seajs.use(name, function () {
                    var g = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        g[_i] = arguments[_i];
                    }
                    for (var _a = 0, g_1 = g; _a < g_1.length; _a++) {
                        var m = g_1[_a];
                        a_1.push(m && m.__esModule && m["default"] || m);
                    }
                    if (fn)
                        fn.apply(void 0, a_1);
                });
            }
            else {
                if (!G_IsArray(name))
                    name = [name];
                for (var _i = 0, name_1 = name; _i < name_1.length; _i++) {
                    n = name_1[_i];
                    n = require(n);
                    a_1.push(n && n.__esModule && n["default"] || n);
                }
                if (fn)
                    fn.apply(void 0, a_1);
            }
        }
        else {
            fn();
        }
    };
    var T = function () { };
    var G_Extend = function (ctor, base, props, statics, cProto) {
        //bProto.constructor = base;
        T[G_PROTOTYPE] = base[G_PROTOTYPE];
        cProto = new T();
        G_Assign(cProto, props);
        G_Assign(ctor, statics);
        cProto.constructor = ctor;
        ctor[G_PROTOTYPE] = cProto;
        return ctor;
    };
    var $ = function (selector) { return G_DOCUMENT.querySelectorAll(selector); };
    var G_Trigger = function (element, type, data) {
        var e = G_DOCUMENT.createEvent('Events');
        e.initEvent(type, true, true);
        for (var p in data) {
            e[p] = data[p];
        }
        element.dispatchEvent(e);
    };
    var G_TargetMatchSelector = function (element, selector) {
        if (!selector || !element || element.nodeType !== 1)
            return 0;
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
            element.oMatchesSelector || element.matchesSelector;
        return matchesSelector.call(element, selector);
    };
    var G_MxId = function (e) { return e._mx || (e._mx = G_Id('e')); };
    var G_EventHandlers = {};
    var returnTrue = function () { return true; }, returnFalse = function () { return false; }, eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
    };
    var G_EventCompatible = function (e) {
        if (!e.isDefaultPrevented) {
            var _loop_1 = function (key) {
                var value = eventMethods[key];
                var src = e[key];
                e[key] = function () {
                    var a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        a[_i] = arguments[_i];
                    }
                    e[value] = returnTrue;
                    return src && src.apply(e, a);
                };
                e[value] = returnFalse;
            };
            for (var key in eventMethods) {
                _loop_1(key);
            }
            if (e.defaultPrevented !== undefined ? e.defaultPrevented :
                'returnValue' in e ? e.returnValue === false :
                    e.getPreventDefault && e.getPreventDefault())
                e.isDefaultPrevented = returnTrue;
        }
        return e;
    };
    var G_AddEvent = function (element, type, data, fn) {
        var id = G_MxId(element);
        var collections = G_EventHandlers[id] || (G_EventHandlers[id] = []);
        var h = {
            'a': data && data.i,
            'b': fn,
            'c': type,
            'd': function (e) {
                e = G_EventCompatible(e);
                if (e.isImmediatePropagationStopped())
                    return;
                fn.call(element, e, data);
            }
        };
        collections.push(h);
        element.addEventListener(type, h['d'], false);
    };
    var G_RemoveEvent = function (element, type, data, cb) {
        var id = G_MxId(element);
        var collections = G_EventHandlers[id];
        if (collections) {
            var found = void 0;
            for (var c = void 0, i = collections.length; i--;) {
                c = collections[i];
                if (c['c'] == type && c['b'] === cb) {
                    var cd = c['a'];
                    if (!data || (data && data.i == cd)) {
                        found = c;
                        collections.splice(i, 1);
                        break;
                    }
                }
            }
            if (found) {
                element.removeEventListener(type, found['d'], false);
            }
        }
    };
    var G_DOMGlobalProcessor = function (e, d) {
        //d = e.data;
        e.eventTarget = d.e;
        G_ToTry(d.f, e, d.v);
    };
    var G_DOMEventLibBind = function (node, type, cb, remove, scope) {
        if (remove) {
            G_RemoveEvent(node, type, scope, cb);
        }
        else {
            G_AddEvent(node, type, scope, cb);
        }
    };
    if (DEBUG) {
        var Safeguard;
        if (window.Proxy) {
            var ProxiesPool_1 = new Map();
            Safeguard = function (data, getter, setter) {
                if (G_IsPrimitive(data)) {
                    return data;
                }
                var build = function (prefix, o) {
                    var key = getter + '\x01' + setter;
                    var cached = ProxiesPool_1.get(o);
                    if (cached && cached.key == key) {
                        return cached.entity;
                    }
                    var entity = new Proxy(o, {
                        set: function (target, property, value) {
                            if (!setter && !prefix) {
                                throw new Error('avoid writeback,key: ' + prefix + property + ' value:' + value + ' more info: https://github.com/thx/magix/issues/38');
                            }
                            target[property] = value;
                            if (setter) {
                                setter(prefix + property, value);
                            }
                            return true;
                        },
                        get: function (target, property) {
                            var out = target[property];
                            if (!prefix && getter) {
                                getter(property);
                            }
                            if (G_Has(target, property) &&
                                (G_IsArray(out) || G_IsObject(out))) {
                                return build(prefix + property + '.', out);
                            }
                            return out;
                        }
                    });
                    ProxiesPool_1.set(o, {
                        key: key,
                        entity: entity
                    });
                    return entity;
                };
                return build('', data);
            };
        }
        else {
            Safeguard = function (data) { return data; };
        }
    }
    var Magix_PathToObjCache = new G_Cache();
    var Magix_Booted = 0;
    //let Magix_PathCache = new G_Cache();
    var Magix_ParamsObjectTemp;
    var Magix_ParamsFn = function (match, name, value) {
        try {
            value = decodeURIComponent(value);
        }
        catch (e) {
        }
        Magix_ParamsObjectTemp[name] = value;
    };
    /**
     * 路径
     * @param  {String} url  参考地址
     * @param  {String} part 相对参考地址的片断
     * @return {String}
     * @example
     * http://www.a.com/a/b.html?a=b#!/home?e=f   /   => http://www.a.com/
     * http://www.a.com/a/b.html?a=b#!/home?e=f   ./     =>http://www.a.com/a/
     * http://www.a.com/a/b.html?a=b#!/home?e=f   ../../    => http://www.a.com/
     * http://www.a.com/a/b.html?a=b#!/home?e=f   ./../  => http://www.a.com/
     * //g.cn/a.html
     */
    /*let G_Path = function(url, part) {
        let key = url + G_SPLITER + part;
        let result = Magix_PathCache.get(key),
            domain = G_EMPTY,
            idx;
        if (!Magix_PathCache.has(key)) { //有可能结果为空，url='' path='';
            let m = url.match(Magix_ProtocalReg);
            if (m) {
                idx = url.indexOf(Magix_SLASH, m[0].length);
                if (idx < 0) idx = url.length;
                domain = url.slice(0, idx);
                url = url.slice(idx);
            }
            url = url.replace(Magix_PathTrimParamsReg, G_EMPTY).replace(Magix_PathTrimFileReg, Magix_SLASH);
            if (!part.indexOf(Magix_SLASH)) {
                url = G_EMPTY;
            }
            result = url + part;
            console.log('url', url, 'part', part, 'result', result);
            while (Magix_PathRelativeReg.test(result)) {
                result = result.replace(Magix_PathRelativeReg, Magix_SLASH);
            }
            Magix_PathCache.set(key, result = domain + result);
        }
        return result;
    };*/
    /**
     * 把路径字符串转换成对象
     * @param  {String} path 路径字符串
     * @return {Object} 解析后的对象
     * @example
     * let obj = Magix.parseUri('/xxx/?a=b&c=d');
     * // obj = {path:'/xxx/',params:{a:'b',c:'d'}}
     */
    var G_ParseUri = function (path) {
        //把形如 /xxx/?a=b&c=d 转换成对象 {path:'/xxx/',params:{a:'b',c:'d'}}
        //1. /xxx/a.b.c.html?a=b&c=d  path /xxx/a.b.c.html
        //2. /xxx/?a=b&c=d  path /xxx/
        //3. /xxx/#?a=b => path /xxx/
        //4. /xxx/index.html# => path /xxx/index.html
        //5. /xxx/index.html  => path /xxx/index.html
        //6. /xxx/#           => path /xxx/
        //7. a=b&c=d          => path ''
        //8. /s?src=b#        => path /s params:{src:'b'}
        //9. a=YT3O0sPH1No=   => path '' params:{a:'YT3O0sPH1No='}
        //10.a=YT3O0sPH1No===&b=c => path '' params:{a:'YT3O0sPH1No===',b:'c'}
        //11. ab?a&b          => path ab  params:{a:'',b:''}
        //12. a=b&c           => path '' params:{a:'b',c:''}
        //13. =abc            => path '=abc'
        //14. ab=             => path '' params:{ab:''}
        //15. a&b             => path '' params:{a:'',b:''}
        var r = Magix_PathToObjCache.get(path), pathname;
        if (!r) {
            Magix_ParamsObjectTemp = {};
            pathname = path.replace(Magix_PathTrimParamsReg, G_EMPTY);
            if (path == pathname && Magix_IsParam.test(pathname))
                pathname = G_EMPTY; //考虑 YT3O0sPH1No= base64后的pathname
            path.replace(pathname, G_EMPTY).replace(Magix_ParamsReg, Magix_ParamsFn);
            Magix_PathToObjCache.set(path, r = {
                a: pathname,
                b: Magix_ParamsObjectTemp
            });
        }
        return {
            path: r.a,
            params: G_Assign({}, r.b)
        };
    };
    /**
     * 转换成字符串路径
     * @param  {String} path 路径
     * @param {Object} params 参数对象
     * @param {Object} [keo] 保留空白值的对象
     * @return {String} 字符串路径
     * @example
     * let str = Magix.toUri('/xxx/',{a:'b',c:'d'});
     * // str == /xxx/?a=b&c=d
     *
     * let str = Magix.toUri('/xxx/',{a:'',c:2});
     *
     * // str == /xxx/?a=&c=2
     *
     * let str = Magix.toUri('/xxx/',{a:'',c:2},{c:1});
     *
     * // str == /xxx/?c=2
     * let str = Magix.toUri('/xxx/',{a:'',c:2},{a:1,c:1});
     *
     * // str == /xxx/?a=&c=2
     */
    var G_ToUri = function (path, params, keo) {
        var arr = [], v, p, f;
        for (p in params) {
            v = params[p] + G_EMPTY;
            if (!keo || v || G_Has(keo, p)) {
                v = encodeURIComponent(v);
                arr.push(f = p + '=' + v);
            }
        }
        if (f) {
            path += (path && (~path.indexOf('?') ? '&' : '?')) + arr.join('&');
        }
        return path;
    };
    var G_ToMap = function (list, key) {
        var e, map = {}, l;
        if (list) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                e = list_1[_i];
                map[(key && e) ? e[key] : e] = key ? e : (map[e] | 0) + 1; //对于简单数组，采用累加的方式，以方便知道有多少个相同的元素
            }
        }
        return map;
    };
    var G_ParseCache = new G_Cache();
    var G_ParseExpr = function (expr, data, result) {
        if (G_ParseCache.has(expr)) {
            result = G_ParseCache.get(expr);
        }
        else {
            //jshint evil:true
            result = G_ToTry(Function("return " + expr));
            if (expr.indexOf(G_SPLITER) > -1) {
                G_TranslateData(data, result, 1);
            }
            else {
                G_ParseCache.set(expr, result);
            }
        }
        if (DEBUG) {
            result = Safeguard(result);
        }
        return result;
    };
    /**
     * Magix对象，提供常用方法
     * @name Magix
     * @namespace
     */
    var Magix = {
        /**
         * @lends Magix
         */
        /**
         * 设置或获取配置信息
         * @param  {Object} cfg 初始化配置参数对象
         * @param {String} cfg.defaultView 默认加载的view
         * @param {String} cfg.defaultPath 当无法从地址栏取到path时的默认值。比如使用hash保存路由信息，而初始进入时并没有hash,此时defaultPath会起作用
         * @param {Object} cfg.routes path与view映射关系表
         * @param {String} cfg.unmatchView 在routes里找不到匹配时使用的view，比如显示404
         * @param {String} cfg.rootId 根view的id
         * @param {Array} cfg.exts 需要加载的扩展
         * @param {Function} cfg.error 发布版以try catch执行一些用户重写的核心流程，当出错时，允许开发者通过该配置项进行捕获。注意：您不应该在该方法内再次抛出任何错误！
         * @example
         * Magix.config({
         *      rootId:'J_app_main',
         *      defaultView:'app/views/layouts/default',//默认加载的view
         *      defaultPath:'/home',
         *      routes:{
         *          "/home":"app/views/layouts/default"
         *      }
         * });
         *
         *
         * let config = Magix.config();
         *
         * console.log(config.rootId);
         *
         * // 可以多次调用该方法，除内置的配置项外，您也可以缓存一些数据，如
         * Magix.config({
         *     user:'彳刂'
         * });
         *
         * console.log(Magix.config('user'));
         */
        config: function (cfg, r) {
            r = Magix_Cfg;
            if (cfg) {
                if (G_IsObject(cfg)) {
                    r = G_Assign(r, cfg);
                }
                else {
                    r = r[cfg];
                }
            }
            return r;
        },
        /**
         * 应用初始化入口
         * @function
         * @param {Object} [cfg] 配置信息对象,更多信息请参考Magix.config方法
         * @return {Object} 配置信息对象
         * @example
         * Magix.boot({
         *      rootId:'J_app_main'
         * });
         *
         */
        boot: function (cfg) {
            G_Assign(Magix_Cfg, cfg);
            G_Require(Magix_Cfg.exts, function () {
                Vframe_Root().mountView(Magix_Cfg.defaultView);
            });
        },
        /**
         * 把列表转化成hash对象
         * @param  {Array} list 源数组
         * @param  {String} [key]  以数组中对象的哪个key的value做为hash的key
         * @return {Object}
         * @example
         * let map = Magix.toMap([1,2,3,5,6]);
         * //=> {1:1,2:1,3:1,4:1,5:1,6:1}
         *
         * let map = Magix.toMap([{id:20},{id:30},{id:40}],'id');
         * //=>{20:{id:20},30:{id:30},40:{id:40}}
         *
         * console.log(map['30']);//=> {id:30}
         * //转成对象后不需要每次都遍历数组查询
         */
        toMap: G_ToMap,
        /**
         * 以try cache方式执行方法，忽略掉任何异常
         * @function
         * @param  {Array} fns     函数数组
         * @param  {Array} [args]    参数数组
         * @param  {Object} [context] 在待执行的方法内部，this的指向
         * @return {Object} 返回执行的最后一个方法的返回值
         * @example
         * let result = Magix.toTry(function(){
         *     return true
         * });
         *
         * // result == true
         *
         * let result = Magix.toTry(function(){
         *     throw new Error('test');
         * });
         *
         * // result == undefined
         *
         * let result = Magix.toTry([function(){
         *     throw new Error('test');
         * },function(){
         *     return true;
         * }]);
         *
         * // result == true
         *
         * //异常的方法执行时，可以通过Magix.config中的error来捕获，如
         *
         * Magix.config({
         *     error:function(e){
         *         console.log(e);//在这里可以进行错误上报
         *     }
         * });
         *
         * let result = Magix.toTry(function(a1,a2){
         *     return a1 + a2;
         * },[1,2]);
         *
         * // result == 3
         * let o={
         *     title:'test'
         * };
         * let result = Magix.toTry(function(){
         *     return this.title;
         * },null,o);
         *
         * // result == 'test'
         */
        toTry: G_ToTry,
        /**
         * 转换成字符串路径
         * @function
         * @param  {String} path 路径
         * @param {Object} params 参数对象
         * @param {Object} [keo] 保留空白值的对象
         * @return {String} 字符串路径
         * @example
         * let str = Magix.toUrl('/xxx/',{a:'b',c:'d'});
         * // str == /xxx/?a=b&c=d
         *
         * let str = Magix.toUrl('/xxx/',{a:'',c:2});
         *
         * // str==/xxx/?a=&c=2
         *
         * let str = Magix.toUrl('/xxx/',{a:'',c:2},{c:1});
         *
         * // str == /xxx/?c=2
         * let str = Magix.toUrl('/xxx/',{a:'',c:2},{a:1,c:1});
         *
         * // str == /xxx/?a=&c=2
         */
        toUrl: G_ToUri,
        /**
         * 把路径字符串转换成对象
         * @function
         * @param  {String} path 路径字符串
         * @return {Object} 解析后的对象
         * @example
         * let obj = Magix.parseUrl('/xxx/?a=b&c=d');
         * // obj = {path:'/xxx/',params:{a:'b',c:'d'}}
         */
        parseUrl: G_ParseUri,
        /*
         * 路径
         * @function
         * @param  {String} url  参考地址
         * @param  {String} part 相对参考地址的片断
         * @return {String}
         * @example
         * http://www.a.com/a/b.html?a=b#!/home?e=f   /   => http://www.a.com/
         * http://www.a.com/a/b.html?a=b#!/home?e=f   ./     =>http://www.a.com/a/
         * http://www.a.com/a/b.html?a=b#!/home?e=f   ../../    => http://www.a.com/
         * http://www.a.com/a/b.html?a=b#!/home?e=f   ./../  => http://www.a.com/
         */
        //path: G_Path,
        /**
         * 把src对象的值混入到aim对象上
         * @function
         * @param  {Object} aim    要mix的目标对象
         * @param  {Object} src    mix的来源对象
         * @example
         * let o1={
         *     a:10
         * };
         * let o2={
         *     b:20,
         *     c:30
         * };
         *
         * Magix.mix(o1,o2);//{a:10,b:20,c:30}
         *
         *
         * @return {Object}
         */
        mix: G_Assign,
        /**
         * 检测某个对象是否拥有某个属性
         * @function
         * @param  {Object}  owner 检测对象
         * @param  {String}  prop  属性
         * @example
         * let obj={
         *     key1:undefined,
         *     key2:0
         * }
         *
         * Magix.has(obj,'key1');//true
         * Magix.has(obj,'key2');//true
         * Magix.has(obj,'key3');//false
         *
         *
         * @return {Boolean} 是否拥有prop属性
         */
        has: G_Has,
        /**
         * 获取对象的keys
         * @param {Object} object 获取key的对象
         * @type {Array}
         * @beta
         * @module linkage|router
         * @example
         * let o = {
         *     a:1,
         *     b:2,
         *     test:3
         * };
         * let keys = Magix.keys(o);
         *
         * // keys == ['a','b','test']
         * @return {Array}
         */
        keys: G_Keys,
        /**
         * 判断一个节点是否在另外一个节点内，如果比较的2个节点是同一个节点，也返回true
         * @function
         * @param {String|HTMLElement} node节点或节点id
         * @param {String|HTMLElement} container 容器
         * @example
         * let root = $('html');
         * let body = $('body');
         *
         * let r = Magix.inside(body[0],root[0]);
         *
         * // r == true
         *
         * let r = Magix.inside(root[0],body[0]);
         *
         * // r == false
         *
         * let r = Magix.inside(root[0],root[0]);
         *
         * // r == true
         *
         * @return {Boolean}
         */
        inside: G_NodeIn,
        /**
         * document.getElementById的简写
         * @param {String} id
         * @return {HTMLElement|Null}
         * @example
         * // html
         * // <div id="root"></div>
         *
         * let node = Magix.node('root');
         *
         * // node => div[id='root']
         *
         * // node是document.getElementById的简写
         */
        node: G_GetById,
        /**
         * 应用样式
         * @beta
         * @module style
         * @param {String} prefix 样式的名称前缀
         * @param {String} css 样式字符串
         * @example
         * // 该方法配合magix-combine工具使用
         * // 更多信息可参考magix-combine工具：https://github.com/thx/magix-combine
         * // 样式问题可查阅这里：https://github.com/thx/magix-combine/issues/6
         *
         */
        applyStyle: View_ApplyStyle,
        /**
         * 返回全局唯一ID
         * @function
         * @param {String} [prefix] 前缀
         * @return {String}
         * @example
         *
         * let id = Magix.guid('mx-');
         * // id maybe mx-7
         */
        guid: G_Id,
        use: G_Require,
        Cache: G_Cache,
        nodeId: IdIt
    };
    /**
 * 多播事件对象
 * @name Event
 * @namespace
 */
    var MEvent = {
        /**
         * @lends MEvent
         */
        /**
         * 触发事件
         * @param {String} name 事件名称
         * @param {Object} data 事件对象
         * @param {Boolean} [remove] 事件触发完成后是否移除这个事件的所有监听
         * @param {Boolean} [lastToFirst] 是否从后向前触发事件的监听列表
         */
        fire: function (name, data, remove, lastToFirst) {
            var key = G_SPLITER + name, me = this, list = me[key], end, len, idx, t;
            if (!data)
                data = {};
            if (!data.type)
                data.type = name;
            if (list) {
                end = list.length;
                len = end - 1;
                while (end--) {
                    idx = lastToFirst ? end : len - end;
                    t = list[idx];
                    if (t.f) {
                        t.x = 1;
                        G_ToTry(t.f, data, me);
                        t.x = G_EMPTY;
                    }
                    else if (!t.x) {
                        list.splice(idx, 1);
                        len--;
                    }
                }
            }
            list = me["on" + name];
            if (list)
                G_ToTry(list, data, me);
            if (remove)
                me.off(name);
        },
        /**
         * 绑定事件
         * @param {String} name 事件名称
         * @param {Function} fn 事件处理函数
         * @example
         * let T = Magix.mix({},Magix.Event);
         * T.on('done',function(e){
         *     alert(1);
         * });
         * T.on('done',function(e){
         *     alert(2);
         *     T.off('done',arguments.callee);
         * });
    
         * T.fire('done',{data:'test'});
         * T.fire('done',{data:'test2'});
         */
        on: function (name, f) {
            var me = this;
            var key = G_SPLITER + name;
            var list = me[key] || (me[key] = []);
            list.push({
                f: f
            });
        },
        /**
         * 解除事件绑定
         * @param {String} name 事件名称
         * @param {Function} [fn] 事件处理函数
         */
        off: function (name, fn) {
            var key = G_SPLITER + name, me = this, list = me[key], t;
            if (fn) {
                if (list) {
                    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                        t = list_2[_i];
                        if (t.f == fn) {
                            t.f = G_EMPTY;
                            break;
                        }
                    }
                }
            }
            else {
                delete me[key];
                delete me["on" + name];
            }
        }
    };
    Magix.Event = MEvent;
    var Vframe_RootVframe;
    var Vframe_GlobalAlter;
    var Vframe_Vframes = {};
    var Vframe_NotifyCreated = function (vframe) {
        if (!vframe['$a'] && !vframe['$b'] && vframe['$cc'] == vframe['$rc']) { //childrenCount === readyCount
            if (!vframe['$cr']) { //childrenCreated
                vframe['$cr'] = 1; //childrenCreated
                vframe['$ca'] = 0; //childrenAlter
                vframe.fire('created'); //不在view上派发事件，如果view需要绑定，则绑定到owner上，view一般不用该事件，如果需要这样处理：this.owner.oncreated=function(){};this.ondestroy=function(){this.owner.off('created')}
            }
            var p = void 0, id = vframe.id, pId = vframe.pId;
            p = Vframe_Vframes[pId];
            if (p && !G_Has(p['$d'], id)) { //readyChildren
                p['$d'][id] = 1; //readyChildren
                p['$rc']++; //readyCount
                Vframe_NotifyCreated(p);
            }
        }
    };
    var Vframe_NotifyAlter = function (vframe, e) {
        if (!vframe['$ca'] && vframe['$cr']) { //childrenAlter childrenCreated 当前vframe触发过created才可以触发alter事件
            vframe['$cr'] = 0; //childrenCreated
            vframe['$ca'] = 1; //childreAleter
            vframe.fire('alter', e);
            var p = void 0, id = vframe.id, pId = vframe.pId;
            //let vom = vframe.owner;
            p = Vframe_Vframes[pId];
            if (p && G_Has(p['$d'], id)) { //readyMap
                p['$rc']--; //readyCount
                delete p['$d'][id]; //readyMap
                Vframe_NotifyAlter(p, e);
            }
        }
    };
    var Vframe_TranslateQuery = function (pId, src, params, pVf) {
        pVf = Vframe_Vframes[pId];
        pVf = pVf && pVf['$v'];
        pVf = pVf ? pVf['$a']['$a'] : {};
        if (src.indexOf(G_SPLITER) > 0) {
            G_TranslateData(pVf, params);
        }
        return pVf;
    };
    /**
     * 获取根vframe;
     * @return {Vframe}
     * @private
     */
    var Vframe_Root = function (rootId, e) {
        if (!Vframe_RootVframe) {
            /*
                尽可能的延迟配置，防止被依赖时，配置信息不正确
            */
            G_DOCBODY = G_DOCUMENT.body;
            rootId = Magix_Cfg.rootId;
            e = G_GetById(rootId);
            if (!e) {
                G_DOCBODY.id = rootId;
            }
            Vframe_RootVframe = new Vframe(rootId);
        }
        return Vframe_RootVframe;
    };
    var Vframe_AddVframe = function (id, vframe) {
        if (!G_Has(Vframe_Vframes, id)) {
            Vframe_Vframes[id] = vframe;
            Vframe.fire('add', {
                vframe: vframe
            });
        }
    };
    var Vframe_Cache = [];
    var Vframe_RemoveVframe = function (id, fcc, vframe) {
        vframe = Vframe_Vframes[id];
        if (vframe) {
            delete Vframe_Vframes[id];
            Vframe.fire('remove', {
                vframe: vframe,
                fcc: fcc //fireChildrenCreated
            });
            id = G_GetById(id);
            if (id) {
                id['$a'] = 0;
            }
        }
    };
    /**
     * Vframe类
     * @name Vframe
     * @class
     * @constructor
     * @borrows Event.on as on
     * @borrows Event.fire as fire
     * @borrows Event.off as off
     * @borrows Event.on as #on
     * @borrows Event.fire as #fire
     * @borrows Event.off as #off
     * @param {String} id vframe id
     * @property {String} id vframe id
     * @property {String} path 当前view的路径名，包括参数
     * @property {String} pId 父vframe的id，如果是根节点则为undefined
     */
    var Vframe = function (id, pId, me) {
        me = this;
        me.id = id;
        if (DEBUG) {
            setTimeout(function () {
                if (me.id && me.pId) {
                    var parent = Vframe_Vframes[me.pId];
                    if (me.id != Magix_Cfg.rootId && (!parent || !parent['$c'][me.id])) {
                        console.error('beware! Avoid use new Magix.Vframe() outside');
                    }
                }
            }, 0);
        }
        //me.vId=id+'_v';
        me['$c'] = {}; //childrenMap
        me['$cc'] = 0; //childrenCount
        me['$rc'] = 0; //readyCount
        me['$e'] = 1; //signature
        me['$d'] = {}; //readyMap
        me.pId = pId;
        Vframe_AddVframe(id, me);
    };
    G_Assign(Vframe, {
        /**
         * @lends Vframe
         */
        /**
         * 获取所有的vframe对象
         * @return {Object}
         */
        all: function () {
            return Vframe_Vframes;
        },
        /**
         * 根据vframe的id获取vframe对象
         * @param {String} id vframe的id
         * @return {Vframe|undefined} vframe对象
         */
        get: function (id) {
            return Vframe_Vframes[id];
        }
        /**
         * 注册vframe对象时触发
         * @name Vframe.add
         * @event
         * @param {Object} e
         * @param {Vframe} e.vframe
         */
        /**
         * 删除vframe对象时触发
         * @name Vframe.remove
         * @event
         * @param {Object} e
         * @param {Vframe} e.vframe
         * @param {Boolean} e.fcc 是否派发过created事件
         */
    }, MEvent);
    G_Assign(Vframe[G_PROTOTYPE], MEvent, {
        /**
         * @lends Vframe#
         */
        /**
         * 加载对应的view
         * @param {String} viewPath 形如:app/views/home?type=1&page=2 这样的view路径
         * @param {Object|Null} [viewInitParams] 调用view的init方法时传递的参数
         */
        mountView: function (viewPath, viewInitParams /*,keepPreHTML*/) {
            var me = this;
            var id = me.id, pId = me.pId, s = me["$e"];
            var node = G_GetById(id), po, sign, view, params, parentVf;
            if (!me['$f'] && node) { //alter
                me['$f'] = 1;
                me['$g'] = node.innerHTML; //.replace(ScriptsReg, ''); template
            }
            me.unmountView( /*keepPreHTML*/);
            me['$a'] = 0; //destroyed 详见unmountView
            if (node && viewPath) {
                me[G_PATH] = viewPath;
                po = G_ParseUri(viewPath);
                view = po[G_PATH];
                sign = ++s;
                params = po[G_PARAMS];
                parentVf = Vframe_TranslateQuery(pId, viewPath, params);
                me['$h'] = po[G_PATH];
                G_Assign(params, viewInitParams);
                G_Require(view, function (TView) {
                    if (sign == me['$e']) { //有可能在view载入后，vframe已经卸载了
                        if (!TView) {
                            return Magix_Cfg.error(Error("id:" + id + " cannot load:" + view));
                        }
                        View_Prepare(TView);
                        view = new TView(id, me, params);
                        if (DEBUG) {
                            var viewProto_1 = TView.prototype;
                            var importantProps_1 = {
                                id: 1,
                                updater: 1,
                                owner: 1,
                                '$l': 1,
                                '$r': 1,
                                '$b': 1,
                                '$a': 1
                            };
                            for (var p in view) {
                                if (G_Has(view, p) && viewProto_1[p]) {
                                    throw new Error("avoid write " + p + " at file " + viewPath + "!");
                                }
                            }
                            view = Safeguard(view, null, function (key, value) {
                                if (G_Has(viewProto_1, key) ||
                                    (G_Has(importantProps_1, key) &&
                                        (key != '$b' || !isFinite(value)) &&
                                        (key != 'owner' || value !== 0))) {
                                    throw new Error("avoid write " + key + " at file " + viewPath + "!");
                                }
                            });
                        }
                        me['$v'] = view;
                        View_DelegateEvents(view);
                        view['$d']();
                    }
                });
            }
        },
        /**
         * 销毁对应的view
         */
        unmountView: function ( /*keepPreHTML*/) {
            var me = this;
            var v = me["$v"], id = me.id, node, reset;
            if (v) {
                if (!Vframe_GlobalAlter) {
                    reset = 1;
                    Vframe_GlobalAlter = {
                        id: id
                    };
                }
                me['$a'] = 1; //用于标记当前vframe处于$v销毁状态，在当前vframe上再调用unmountZone时不派发created事件
                me.unmountZone(0, 1);
                Vframe_NotifyAlter(me, Vframe_GlobalAlter);
                me['$v'] = 0; //unmountView时，尽可能早的删除vframe上的$v对象，防止$v销毁时，再调用该 vfrmae的类似unmountZone方法引起的多次created
                if (v['$b'] > 0) {
                    v['$b'] = 0;
                    delete Body_RangeEvents[id];
                    delete Body_RangeVframes[id];
                    v.fire('destroy', 0, 1, 1);
                    View_DelegateEvents(v, 1);
                    v.owner = 0;
                }
                v['$b']--;
                node = G_GetById(id);
                if (node && me['$f'] /*&&!keepPreHTML*/) { //如果$v本身是没有模板的，也需要把节点恢复到之前的状态上：只有保留模板且$v有模板的情况下，这条if才不执行，否则均需要恢复节点的html，即$v安装前什么样，销毁后把节点恢复到安装前的情况
                    node.innerHTML = me['$g'];
                }
                if (reset)
                    Vframe_GlobalAlter = 0;
            }
            me['$e']++; //增加signature，阻止相应的回调，见mountView
        },
        /**
         * 加载vframe
         * @param  {String} id             节点id
         * @param  {String} viewPath       view路径
         * @param  {Object} [viewInitParams] 传递给view init方法的参数
         * @return {Vframe} vframe对象
         * @example
         * // html
         * // &lt;div id="magix_vf_defer"&gt;&lt;/div&gt;
         *
         *
         * //js
         * view.owner.mountVframe('magix_vf_defer','app/views/list',{page:2})
         * //注意：动态向某个节点渲染view时，该节点无须是vframe标签
         */
        mountVframe: function (vfId, viewPath, viewInitParams /*, keepPreHTML*/) {
            var me = this, vf, id = me.id, c = me['$c'];
            Vframe_NotifyAlter(me, {
                id: vfId
            }); //如果在就绪的vframe上渲染新的vframe，则通知有变化
            //let vom = me.owner;
            vf = Vframe_Vframes[vfId];
            if (!vf) {
                if (!G_Has(c, vfId)) { //childrenMap,当前子vframe不包含这个id
                    me['$cc']++; //childrenCount ，增加子节点
                }
                c[vfId] = vfId; //map
                //
                vf = Vframe_Cache.pop();
                if (vf) {
                    Vframe.call(vf, vfId, id);
                }
                else {
                    vf = new Vframe(vfId, id);
                }
                //vf = Vframe_GetVf(id, me.id);// new Vframe(id, me.id);
            }
            vf.mountView(viewPath, viewInitParams /*,keepPreHTML*/);
            return vf;
        },
        /**
         * 加载某个区域下的view
         * @param {HTMLElement|String} zoneId 节点对象或id
         * @example
         * // html
         * // &lt;div id="zone"&gt;
         * //   &lt;div mx-view="path/to/v1"&gt;&lt;/div&gt;
         * // &lt;/div&gt;
         *
         * view.onwer.mountZone('zone');//即可完成zone节点下的view渲染
         */
        mountZone: function (zoneId, inner /*,keepPreHTML*/) {
            var me = this;
            var vf, id, vfs = [];
            zoneId = zoneId || me.id;
            var vframes = $("" + G_HashKey + zoneId + " [" + G_MX_VIEW + "]");
            /*
                body(#mx-root)
                    div(mx-vframe=true,mx-view='xx')
                        div(mx-vframe=true,mx-view=yy)
                这种结构，自动构建父子关系，
                根结点渲染，获取到子列表[div(mx-view=xx)]
                    子列表渲染，获取子子列表的子列表
                        加入到忽略标识里
                会导致过多的dom查询
    
                现在使用的这种，无法处理这样的情况，考虑到项目中几乎没出现过这种情况，先采用高效的写法
                上述情况一般出现在展现型页面，dom结构已经存在，只是附加上js行为
                不过就展现来讲，一般是不会出现嵌套的情况，出现的话，把里面有层级的vframe都挂到body上也未尝不可，比如brix2.0
             */
            me['$b'] = 1; //hold fire creted
            //me.unmountZone(zoneId, 1); 不去清理，详情见：https://github.com/thx/magix/issues/27
            for (var _i = 0, vframes_1 = vframes; _i < vframes_1.length; _i++) {
                vf = vframes_1[_i];
                if (!vf['$a']) { //防止嵌套的情况下深层的view被反复实例化
                    id = IdIt(vf);
                    vf['$a'] = 1;
                    vfs.push([id, vf.getAttribute(G_MX_VIEW)]);
                }
            }
            for (var _a = 0, vfs_1 = vfs; _a < vfs_1.length; _a++) {
                _b = vfs_1[_a], id = _b[0], vf = _b[1];
                if (DEBUG && document.querySelectorAll("#" + id).length > 1) {
                    Magix_Cfg.error(Error("dom id:\"" + id + "\" duplicate"));
                }
                if (DEBUG) {
                    if (vfs[id]) {
                        Magix_Cfg.error(Error("vf.id duplicate:" + id + " at " + me[G_PATH]));
                    }
                    else {
                        me.mountVframe(vfs[id] = id, vf);
                    }
                }
                else {
                    me.mountVframe(id, vf);
                }
            }
            me['$b'] = 0;
            if (!inner) {
                Vframe_NotifyCreated(me);
            }
            var _b;
        },
        /**
         * 销毁vframe
         * @param  {String} [id]      节点id
         */
        unmountVframe: function (id /*,keepPreHTML*/, inner) {
            var me = this, vf;
            id = id ? me['$c'][id] : me.id;
            //let vom = me.owner;
            vf = Vframe_Vframes[id];
            if (vf) {
                var cr = vf["$cr"], pId = vf.pId;
                vf.unmountView( /*keepPreHTML*/);
                Vframe_RemoveVframe(id, cr);
                vf.id = vf.pId = vf['$c'] = vf['$d'] = 0; //清除引用,防止被移除的view内部通过setTimeout之类的异步操作有关的界面，影响真正渲染的view
                vf.off('alter');
                vf.off('created');
                //if (Vframe_Cache.length < 10) {
                Vframe_Cache.push(vf);
                //}
                vf = Vframe_Vframes[pId];
                if (vf && G_Has(vf['$c'], id)) { //childrenMap
                    delete vf['$c'][id]; //childrenMap
                    vf['$cc']--; //cildrenCount
                    if (!inner)
                        Vframe_NotifyCreated(vf); //移除后通知完成事件
                }
            }
        },
        /**
         * 销毁某个区域下面的所有子vframes
         * @param {HTMLElement|String} [zoneId] 节点对象或id
         */
        unmountZone: function (zoneId, inner) {
            var me = this;
            var p;
            for (p in me['$c']) {
                if (!zoneId || (p != zoneId && G_NodeIn(p, zoneId))) {
                    me.unmountVframe(p /*,keepPreHTML,*/, 1);
                }
            }
            if (!inner)
                Vframe_NotifyCreated(me);
        }
        /**
         * 子孙view修改时触发
         * @name Vframe#alter
         * @event
         * @param {Object} e
         */
        /**
         * 子孙view创建完成时触发
         * @name Vframe#created
         * @event
         * @param {Object} e
         */
    });
    Magix.Vframe = Vframe;
    /**
     * Vframe 中的2条线
     * 一：
     *     渲染
     *     每个Vframe有$cc(childrenCount)属性和$c(childrenItems)属性
     *
     * 二：
     *     修改与创建完成
     *     每个Vframe有rC(readyCount)属性和$r(readyMap)属性
     *
     *      fca firstChildrenAlter  fcc firstChildrenCreated
     */
    /*
    dom event处理思路

    性能和低资源占用高于一切，在不特别影响编程体验的情况下，向性能和资源妥协

    1.所有事件代理到body上
    2.优先使用原生冒泡事件，使用mouseover+Magix.inside代替mouseenter
        'over<mouseover>':function(e){
            if(!Magix.inside(e.relatedTarget,e.eventTarget)){
                //enter
            }
        }
    3.事件支持嵌套，向上冒泡
    4.如果同一节点上同时绑定了mx-event和选择器事件，如
        <div data-menu="true" mx-click="clickMenu()"></div>

        'clickMenu<click>'(e){
            console.log('direct',e);
        },
        '$div[data-menu="true"]<click>'(e){
            console.log('selector',e);
        }

        那么先派发选择器绑定的事件再派发mx-event绑定的事件


    5.在当前view根节点上绑定事件，目前只能使用选择器绑定，如
        '$<click>'(e){
            console.log('view root click',e);
        }
    
    range:{
        app:{
            20:{
                mouseover:1,
                mousemove:1
            }
        }
    }
    view:{
        linkage:{
            40:1
        }
    }
 */
    var Body_EvtInfoCache = new G_Cache(30, 10);
    var Body_EvtInfoReg = /(?:([\w\-]+)\x1e)?([^(]+)\(([\s\S]*)?\)/;
    var Body_RootEvents = {};
    var Body_SearchSelectorEvents = {};
    var Body_RangeEvents = {};
    var Body_RangeVframes = {};
    var Body_Guid = 0;
    var Body_FindVframeInfo = function (current, eventType) {
        var vf, tempId, selectorObject, eventSelector, eventInfos = [], begin = current, info = current.getAttribute("mx-" + eventType), match, view, vfs = [], selectorVfId = G_HashKey, backtrace = 0;
        if (info) {
            match = Body_EvtInfoCache.get(info);
            if (!match) {
                match = info.match(Body_EvtInfoReg) || G_EMPTY_ARRAY;
                match = {
                    v: match[1],
                    n: match[2],
                    i: match[3]
                };
                Body_EvtInfoCache.set(info, match);
            }
            match = G_Assign({}, match, { r: info });
        }
        //如果有匹配但没有处理的vframe或者事件在要搜索的选择器事件里
        if ((match && !match.v) || Body_SearchSelectorEvents[eventType]) {
            if ((selectorObject = Body_RangeVframes[tempId = begin['$b']])
                && selectorObject[begin['$d']] == 1) {
                view = 1;
                selectorVfId = tempId; //如果节点有缓存，则使用缓存
            }
            if (!view) { //先找最近的vframe
                vfs.push(begin);
                while (begin != G_DOCBODY && (begin = begin.parentNode)) { //找最近的vframe,且节点上没有mx-autonomy属性
                    if (Vframe_Vframes[tempId = begin.id] ||
                        ((selectorObject = Body_RangeVframes[tempId = begin['$b']]) &&
                            selectorObject[begin['$d']] == 1)) {
                        selectorVfId = tempId;
                        break;
                    }
                    vfs.push(begin);
                }
                for (var _i = 0, vfs_2 = vfs; _i < vfs_2.length; _i++) {
                    info = vfs_2[_i];
                    if (!(tempId = Body_RangeVframes[selectorVfId])) {
                        tempId = Body_RangeVframes[selectorVfId] = {};
                    }
                    selectorObject = info['$d'] || (info['$d'] = ++Body_Guid);
                    tempId[selectorObject] = 1;
                    info['$b'] = selectorVfId;
                }
            }
            if (selectorVfId != G_HashKey) { //从最近的vframe向上查找带有选择器事件的view
                begin = current.id;
                if (Vframe_Vframes[begin]) {
                    /*
                        如果当前节点是vframe的根节点，则把当前的vf置为该vframe
                        该处主要处理这样的边界情况
                        <mx-vrame src="./test" mx-click="parent()"/>
                        //.test.js
                        export default Magix.View.extend({
                            '$<click>'(){
                                console.log('test clicked');
                            }
                        });
    
                        当click事件发生在mx-vframe节点上时，要先派发内部通过选择器绑定在根节点上的事件，然后再派发外部的事件
                    */
                    backtrace = selectorVfId = begin;
                }
                do {
                    vf = Vframe_Vframes[selectorVfId];
                    if (vf && (view = vf['$v'])) {
                        selectorObject = view['$so'];
                        eventSelector = selectorObject[eventType];
                        for (tempId in eventSelector) {
                            selectorObject = {
                                r: tempId,
                                v: selectorVfId,
                                n: tempId
                            };
                            if (tempId) {
                                /*
                                    事件发生时，做为临界的根节点只能触发`$`绑定的事件，其它事件不能触发
                                */
                                if (!backtrace &&
                                    G_TargetMatchSelector(current, tempId)) {
                                    eventInfos.push(selectorObject);
                                }
                            }
                            else if (backtrace) {
                                eventInfos.unshift(selectorObject);
                            }
                        }
                        //防止跨view选中，到带模板的view时就中止或未指定
                        if (view['$e'] && !backtrace) {
                            if (match && !match.v)
                                match.v = selectorVfId;
                            break; //带界面的中止
                        }
                        backtrace = 0;
                    }
                } while (vf && (selectorVfId = vf.pId));
            }
        }
        if (match) {
            eventInfos.push(match);
        }
        return eventInfos;
    };
    var Body_DOMEventProcessor = function (domEvent) {
        var target = domEvent.target, type = domEvent.type;
        var eventInfos;
        var ignore;
        var vframe, view, eventName, fn;
        var lastVfId;
        var params, arr = [];
        while (target != G_DOCBODY) {
            eventInfos = Body_FindVframeInfo(target, type);
            if (eventInfos.length) {
                arr = [];
                for (var _i = 0, eventInfos_1 = eventInfos; _i < eventInfos_1.length; _i++) {
                    var _a = eventInfos_1[_i], v = _a.v, r = _a.r, n = _a.n, i = _a.i;
                    if (!v && DEBUG) {
                        return Magix_Cfg.error(Error("bad " + type + ":" + r));
                    }
                    if (lastVfId != v) {
                        if (lastVfId && domEvent.isPropagationStopped()) {
                            break;
                        }
                        lastVfId = v;
                    }
                    vframe = Vframe_Vframes[v];
                    view = vframe && vframe['$v'];
                    if (view) {
                        eventName = n + G_SPLITER + type;
                        fn = view[eventName];
                        if (fn) {
                            domEvent.eventTarget = target;
                            params = i ? G_ParseExpr(i, view['$a']['$a']) : {};
                            domEvent[G_PARAMS] = params;
                            G_ToTry(fn, domEvent, view);
                            //没发现实际的用途
                            /*if (domEvent.isImmediatePropagationStopped()) {
                                break;
                            }*/
                        }
                        if (DEBUG) {
                            if (!fn) { //检测为什么找不到处理函数
                                if (eventName[0] == '\u001f') {
                                    console.error('use view.wrapEvent wrap your html');
                                }
                                else {
                                    console.error('can not find event processor:' + n + '<' + type + '> from view:' + vframe.path);
                                }
                            }
                        }
                    }
                    else { //如果处于删除中的事件触发，则停止事件的传播
                        domEvent.stopPropagation();
                    }
                    if (DEBUG) {
                        if (!view && view !== 0) { //销毁
                            console.error('can not find vframe:' + v);
                        }
                    }
                }
            }
            /*|| e.mxStop */
            if (((ignore = Body_RangeEvents[fn = target['$b']]) &&
                (ignore = ignore[target['$d']]) &&
                ignore[type]) ||
                domEvent.isPropagationStopped()) { //避免使用停止事件冒泡，比如别处有一个下拉框，弹开，点击到阻止冒泡的元素上，弹出框不隐藏
                if (arr.length) {
                    arr.push(fn);
                }
                break;
            }
            else {
                arr.push(target);
                lastVfId = target.id;
                if (Vframe_Vframes[lastVfId]) {
                    arr.push(lastVfId);
                }
            }
            target = target.parentNode || G_DOCBODY;
        }
        if ((fn = arr.length)) {
            ignore = G_HashKey;
            for (; fn--;) {
                view = arr[fn];
                if (view.nodeType) {
                    if (!(eventInfos = Body_RangeEvents[ignore])) {
                        eventInfos = Body_RangeEvents[ignore] = {};
                    }
                    lastVfId = view['$d'] || (view['$d'] = ++Body_Guid);
                    if (!(params = eventInfos[lastVfId])) {
                        params = eventInfos[lastVfId] = {};
                        view['$b'] = ignore;
                    }
                    params[type] = 1;
                }
                else {
                    ignore = view;
                }
            }
        }
    };
    var Body_DOMEventBind = function (type, searchSelector, remove) {
        var counter = Body_RootEvents[type] | 0;
        var offset = (remove ? -1 : 1);
        if (!counter || remove === counter) { // remove=1  counter=1
            G_DOMEventLibBind(G_DOCBODY, type, Body_DOMEventProcessor, remove);
        }
        Body_RootEvents[type] = counter + offset;
        if (searchSelector) { //记录需要搜索选择器的事件
            Body_SearchSelectorEvents[type] = (Body_SearchSelectorEvents[type] | 0) + offset;
        }
    };
    var TO_VDOM_SELF_CLOSE = {
        input: 1,
        br: 1,
        hr: 1,
        img: 1,
        embed: 1,
        source: 1,
        area: 1,
        param: 1,
        col: 1,
        track: 1,
        wbr: 1
    };
    var TO_VDOM_SPECIAL_PROPS = {
        input: [G_VALUE, 'checked'],
        textarea: [G_VALUE],
        option: ['selected']
    };
    var TO_VDOM_TEXT_NODE = G_COUNTER;
    if (DEBUG) {
        TO_VDOM_TEXT_NODE = '#text';
    }
    var TO_VDOM_OpenReg = /^<([a-z\d]+)((?:\s+[-A-Za-z\d_]+(?:="[^"]*")?)*)\s*(\/?)>/, TO_VDOM_AttrReg = /([-A-Za-z\d_]+)(?:="([^"]*)")?/g, TO_VDOM_CloseReg = /^<\/[a-z\d]+>/;
    var TO_VDOM_UnescapeMap = {};
    var TO_VDOM_UnescapeReg = /&#?[^\W]+;?/g;
    var TO_VDOM_Temp = G_DOCUMENT.createElement('div');
    var TO_VDOM_UnescapeCallback = function (m) {
        if (!G_Has(TO_VDOM_UnescapeMap, m)) {
            TO_VDOM_Temp.innerHTML = m;
            TO_VDOM_UnescapeMap[m] = TO_VDOM_Temp.innerText;
        }
        return TO_VDOM_UnescapeMap[m];
    };
    var TO_VDOM_Unescape = function (str) { return str.replace(TO_VDOM_UnescapeReg, TO_VDOM_UnescapeCallback); };
    var TO_VDOM = function (input) {
        var count = input.length, current = 0, last = 0, chars, currentParent = {
            'a': {},
            'b': [],
            'c': input
        }, index, html = input, match, tag, attrs, stack = [currentParent], moveLength, em, amap, text, unary, compareKey; //新旧vnode的比较key
        while (current < count) {
            chars = 1;
            if (html[0] == '<') {
                if (html[1] == '/') {
                    match = html.match(TO_VDOM_CloseReg);
                    if (match) {
                        em = stack.pop();
                        attrs = input.substring(em['d'], current);
                        if (em['e'] == 'textarea') {
                            em['f'].push({
                                'g': G_VALUE,
                                'h': attrs
                            });
                            em['i'][G_VALUE] = attrs;
                            em['b'] = G_EMPTY_ARRAY;
                        }
                        else {
                            em['c'] = attrs;
                        }
                        currentParent = stack[stack.length - 1];
                        current += moveLength = match[0].length;
                        em['j'] = input.substring(em['k'], current);
                        chars = 0;
                    }
                }
                else {
                    match = html.match(TO_VDOM_OpenReg);
                    if (match) {
                        tag = match[1];
                        chars = match[0];
                        attrs = [];
                        amap = {};
                        compareKey = G_EMPTY;
                        match[2].replace(TO_VDOM_AttrReg, function (m, key, value) {
                            value = value || G_EMPTY;
                            if (key == 'id') { //如果有id优先使用
                                compareKey = value;
                            }
                            else if (key == G_MX_VIEW && value && !compareKey) {
                                //否则如果是组件,则使用组件的路径做为key
                                compareKey = G_ParseUri(value)[G_PATH];
                            }
                            else if (key == G_Tag_Key && !compareKey) {
                                compareKey = value;
                            }
                            attrs.push({
                                'g': key,
                                'h': value
                            });
                            amap[key] = value;
                        });
                        unary = match[3] || G_Has(TO_VDOM_SELF_CLOSE, tag);
                        if (DEBUG) {
                            if (TO_VDOM_SELF_CLOSE[tag] && !match[3]) {
                                console.error('avoid use tag:' + tag + ' without self close slash. near:' + match[0]);
                            }
                        }
                        em = {
                            'j': chars,
                            'l': compareKey,
                            'e': tag,
                            'f': attrs,
                            'i': amap,
                            'b': [],
                            'a': {},
                            'k': current,
                            'd': current += moveLength = chars.length
                        };
                        if (compareKey) {
                            currentParent['a'][compareKey] = 1;
                        }
                        currentParent['b'].push(em);
                        if (unary) {
                            em['m'] = 1;
                        }
                        else {
                            stack.push(em);
                            if (DEBUG) {
                                stack[stack.length - 1]['n'] = current - match[0].length;
                            }
                            currentParent = em;
                        }
                        chars = 0;
                    }
                }
            }
            if (chars) {
                index = html.indexOf('<');
                if (index < 0) {
                    text = html;
                }
                else {
                    text = html.substring(0, index);
                }
                current += moveLength = text.length;
                em = {
                    'e': TO_VDOM_TEXT_NODE,
                    'c': text,
                    'j': text
                };
                currentParent['b'].push(em);
            }
            if (last == current) {
                if (DEBUG) {
                    throw new Error('bad input:' + html);
                }
                break;
            }
            //substring is fater than slice . lower gc
            html = html.substring(moveLength);
            last = current;
        }
        if (DEBUG && stack.length > 1) {
            throw new Error('parsing failure:' + input);
        }
        return currentParent;
    };
    var V_UnmountVframs = function (vf, n) {
        var id = IdIt(n);
        if (vf['$c'][id]) {
            vf.unmountVframe(id, 1);
        }
        else {
            vf.unmountZone(id, 1);
        }
    };
    var V_SVGNS = 'http://www.w3.org/2000/svg';
    var V_SetAttributes = function (oldNode, lastVDOM, newVDOM, ref) {
        var c, key, value, nMap = newVDOM['i'];
        if (lastVDOM) {
            for (var _i = 0, _a = lastVDOM['f']; _i < _a.length; _i++) {
                c = _a[_i];
                key = c['g'];
                if (!G_Has(nMap, key)) { //如果旧有新木有
                    if (key == 'id') {
                        ref.d.push([oldNode, G_EMPTY]);
                    }
                    else {
                        ref.c = 1;
                        oldNode.removeAttribute(key);
                    }
                }
            }
        }
        for (var _b = 0, _c = newVDOM['f']; _b < _c.length; _b++) {
            c = _c[_b];
            key = c['g'];
            value = c['h'];
            //旧值与新值不相等
            if (!lastVDOM || lastVDOM['i'][key] !== value) {
                value = TO_VDOM_Unescape(value);
                if (key == 'id') {
                    ref.d.push([oldNode, value]);
                }
                else {
                    ref.c = 1;
                    oldNode.setAttribute(key, value);
                }
            }
        }
    };
    var V_SpecialDiff = function (oldNode, lastVDOM, newVDOM) {
        var tag = lastVDOM['e'], c, now;
        var specials = TO_VDOM_SPECIAL_PROPS[tag];
        var nMap = newVDOM['i'];
        var result = 0;
        if (specials) {
            for (var _i = 0, specials_1 = specials; _i < specials_1.length; _i++) {
                c = specials_1[_i];
                now = G_Has(nMap, c) ? c != G_VALUE || nMap[c] : c == G_VALUE && G_EMPTY;
                if (oldNode[c] != now) {
                    result = 1;
                    oldNode[c] = now;
                }
            }
        }
        return result;
    };
    var V_CreateNode = function (vnode, owner, ref, c, tag) {
        tag = vnode['e'];
        if (tag == TO_VDOM_TEXT_NODE) {
            return G_DOCUMENT.createTextNode(vnode['c']);
        }
        c = G_DOCUMENT.createElementNS(tag == 'svg' ? V_SVGNS : owner.namespaceURI, tag);
        V_SetAttributes(c, 0, vnode, ref);
        if (vnode['c']) {
            c.innerHTML = vnode['c'];
        }
        return c;
    };
    var V_GenKeyedNodes = function (vnodes, nodes, start, end) {
        var keyed = {}, i = end, v, key;
        for (; i >= start; i--) {
            v = vnodes[i];
            key = v['l'];
            if (key) {
                key = keyed[key] || (keyed[key] = []);
                key.push({
                    'o': nodes[i],
                    'p': v
                });
            }
        }
        return keyed;
    };
    var V_SetChildNodes = function (realNode, lastVDOM, newVDOM, ref, vframe, data, keys) {
        if (lastVDOM) { //view首次初始化，通过innerHTML快速更新
            var i = void 0, oi = 0, oldChildren = lastVDOM['b'], newChildren = newVDOM['b'], oc = void 0, nc = void 0, oldCount = oldChildren.length, newCount = newChildren.length, reused = newVDOM['a'], nodes = realNode.childNodes, compareKey = void 0, orn = void 0, ovn = void 0, keyedNodes = {};
            for (i = oldCount; i--;) {
                oc = oldChildren[i];
                compareKey = oc['l'];
                if (compareKey) {
                    compareKey = keyedNodes[compareKey] || (keyedNodes[compareKey] = []);
                    compareKey.push({
                        'o': nodes[i],
                        'p': oc
                    });
                }
            }
            /* let oldStartIdx = 0,
                 oldEndIdx = oldCount - 1,
                 newStartIdx = 0,
                 newEndIdx = newCount - 1,
                 oldStartVNode = oldChildren[oldStartIdx],
                 oldEndVNode = oldChildren[oldEndIdx],
                 newStartVNode = newChildren[newStartIdx],
                 newEndVNode = newChildren[newEndIdx];
     
             while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                 if (newStartVNode['l'] == oldStartVNode['l']) {
                     V_SetNode(nodes[newStartIdx], realNode, oldStartVNode, newStartVNode, ref, vframe, data);
                     newStartVNode = newChildren[++newStartIdx];
                     oldStartVNode = oldChildren[++oldStartIdx];
                 } else if (newEndVNode['l'] == oldEndVNode['l']) {
                     V_SetNode(nodes[newEndIdx], realNode, oldEndVNode, newEndVNode, ref, vframe, data);
                     newEndVNode = newChildren[--newEndIdx];
                     oldEndVNode = oldChildren[--oldEndIdx];
                 } else {
                     if (!keyedNodes) keyedNodes = V_GenKeyedNodes(oldChildren, nodes, oldStartIdx, oldEndIdx);
     
                 }
             }
             if (newStartIdx > newEndIdx) {
                 for (i = oldStartIdx; i <= oldEndIdx; i++) {
                     oi = nodes[oldStartIdx];//删除多余的旧节点
                     V_UnmountVframs(vframe, oi);
                     realNode.removeChild(oi);
                     ref.c = 1;
                 }
             }*/
            for (i = 0; i < newCount; i++) {
                do {
                    oc = oldChildren[oi++];
                } while (oc && oc['q']);
                nc = newChildren[i];
                compareKey = keyedNodes[nc['l']];
                if (compareKey && (compareKey = compareKey.pop())) {
                    orn = compareKey['o'];
                    ovn = compareKey['p'];
                    if (orn != nodes[i]) { //如果找到的节点和当前不同，则移动
                        // oldChildren.splice(i, 0, oc = ovn);//移动虚拟dom
                        // for (j = oldChildren.length; j--;) {//从后向前清理虚拟dom
                        //     if (oldChildren[j] == ovn) {
                        //         oldChildren.splice(j, 1);
                        //         break;
                        //     }
                        // }
                        ovn['q'] = 1;
                        oc = ovn;
                        realNode.insertBefore(orn, nodes[i]);
                    }
                    V_SetNode(nodes[i], realNode, oc, nc, ref, vframe, data, keys);
                }
                else if (oc) { //有旧节点，则更新
                    if (keyedNodes[oc['l']] &&
                        reused[oc['l']]) {
                        //oldChildren.splice(i, 0, nc);//插入一个占位符，在接下来的比较中才能一一对应
                        oldCount++;
                        oi--;
                        ref.c = 1;
                        realNode.insertBefore(V_CreateNode(nc, realNode, ref), nodes[i]);
                    }
                    else {
                        V_SetNode(nodes[i], realNode, oc, nc, ref, vframe, data, keys);
                        //ref.c = 1;
                    }
                }
                else { //添加新的节点
                    realNode.appendChild(V_CreateNode(nc, realNode, ref));
                    ref.c = 1;
                }
            }
            for (i = newCount; i < oldCount; i++) {
                oi = nodes[newCount]; //删除多余的旧节点
                V_UnmountVframs(vframe, oi);
                realNode.removeChild(oi);
                ref.c = 1;
            }
        }
        else {
            ref.c = 1;
            realNode.innerHTML = newVDOM['c'];
        }
    };
    var V_SetNode = function (realNode, oldParent, lastVDOM, newVDOM, ref, vframe, data, keys) {
        if (DEBUG) {
            if (oldParent.nodeName == 'TEMPLATE') {
                console.error('unsupport template tag');
            }
            if ((realNode.nodeName == '#text' && lastVDOM['e'] != '#text') || (realNode.nodeName != '#text' && realNode.nodeName.toLowerCase() != lastVDOM['e'])) {
                console.error('Your code is not match the DOM tree generated by the browser. near:' + lastVDOM['c'] + '. Is that you lost some tags or modified the DOM tree?');
            }
        }
        var lastAMap = lastVDOM['i'], newAMap = newVDOM['i'];
        if (V_SpecialDiff(realNode, lastVDOM, newVDOM) ||
            G_Has(lastAMap, 'mxv') ||
            lastVDOM['j'] != newVDOM['j']) {
            if (lastVDOM['e'] == newVDOM['e']) {
                if (lastVDOM['e'] == TO_VDOM_TEXT_NODE) {
                    if (lastVDOM['c'] != newVDOM['c']) {
                        ref.c = 1;
                        realNode.nodeValue = TO_VDOM_Unescape(newVDOM['c']);
                    }
                }
                else if (!lastAMap[G_Tag_Key] || lastAMap[G_Tag_Key] != newAMap[G_Tag_Key]) {
                    var newMxView = newAMap[G_MX_VIEW], newHTML = newVDOM['c'];
                    var updateAttribute = !newAMap[G_Tag_Attr_Key] || lastAMap[G_Tag_Attr_Key] != newAMap[G_Tag_Attr_Key], updateChildren = void 0, unmountOld = void 0, oldVf = Vframe_Vframes[realNode.id], assign = void 0, view = void 0, uri = newMxView && G_ParseUri(newMxView), params = void 0, htmlChanged = void 0, paramsChanged = void 0 /*,
                    oldDataStringify, newDataStringify,dataChanged*/;
                    /*
                        如果存在新旧view，则考虑路径一致，避免渲染的问题
                     */
                    /*
                        只检测是否有参数控制view而不检测数据是否变化的原因：
                        例：view内有一input接收传递的参数，且该input也能被用户输入
                        var d1='xl';
                        var d2='xl';
                        当传递第一份数据时，input显示值xl，这时候用户修改了input的值且使用第二份数据重新渲染这个view，问input该如何显示？
                    */
                    //旧节点有view,新节点有view,且是同类型的view
                    if (newMxView && oldVf &&
                        oldVf['$h'] == uri[G_PATH] &&
                        (view = oldVf['$v'])) {
                        htmlChanged = newHTML != lastVDOM['c'];
                        paramsChanged = newMxView != oldVf[G_PATH];
                        assign = lastAMap[G_Tag_View_Key];
                        if (!htmlChanged && !paramsChanged && assign) {
                            params = assign.split(G_COMMA);
                            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                                assign = params_1[_i];
                                if (G_Has(keys, assign)) {
                                    paramsChanged = 1;
                                    break;
                                }
                            }
                        }
                        if (paramsChanged || htmlChanged) {
                            assign = view['$f'];
                            //如果有assign方法,且有参数或html变化
                            if (assign) {
                                params = uri[G_PARAMS];
                                //处理引用赋值
                                Vframe_TranslateQuery(oldVf.pId, newMxView, params);
                                //oldVf['$g'] = newHTML;
                                //oldVf['$i'] = newDataStringify;
                                oldVf[G_PATH] = newMxView; //update ref
                                //如果需要更新，则进行更新的操作
                                uri = {
                                    node: newVDOM,
                                    html: newHTML,
                                    deep: !view['$e'],
                                    inner: htmlChanged,
                                    query: paramsChanged
                                };
                                updateAttribute = 1;
                                if (G_ToTry(assign, [params, uri], view)) {
                                    ref.v.push(view);
                                }
                                //默认当一个组件有assign方法时，由该方法及该view上的render方法完成当前区域内的节点更新
                                //而对于不渲染界面的控制类型的组件来讲，它本身更新后，有可能需要继续由magix更新内部的子节点，此时通过deep参数控制
                                updateChildren = uri.deep;
                            }
                            else {
                                unmountOld = 1;
                                updateChildren = 1;
                            }
                        }
                        else {
                            updateAttribute = 1;
                        }
                    }
                    else {
                        updateChildren = 1;
                        unmountOld = oldVf;
                    }
                    if (unmountOld) {
                        ref.c = 1;
                        oldVf.unmountVframe(0, 1);
                    }
                    if (updateAttribute) {
                        V_SetAttributes(realNode, lastVDOM, newVDOM, ref);
                    }
                    // Update all children (and subchildren).
                    //自闭合标签不再检测子节点
                    if (updateChildren &&
                        !(newVDOM['m'] &&
                            lastVDOM['m'])) {
                        //ref.c = 1;
                        V_SetChildNodes(realNode, lastVDOM, newVDOM, ref, vframe, data, keys);
                    }
                }
            }
            else {
                V_UnmountVframs(vframe, realNode);
                oldParent.replaceChild(V_CreateNode(newVDOM, oldParent, ref), realNode);
                ref.c = 1;
            }
        }
    };
    var Updater_Digest = function (updater, digesting) {
        var keys = updater['$k'], changed = updater['$c'], selfId = updater['$b'], vf = Vframe_Vframes[selfId], view = vf && vf['$v'], ref = { d: [], v: [] }, node = G_GetById(selfId), tmpl, vdom, data = updater['$a'], redigest = function (trigger) {
            if (digesting.i < digesting.length) {
                Updater_Digest(updater, digesting);
            }
            else {
                ref = digesting.slice();
                digesting.i = digesting.length = 0;
                if (trigger) {
                    view.fire('domready');
                }
                G_ToTry(ref);
            }
        };
        digesting.i = digesting.length;
        updater['$c'] = 0;
        updater['$k'] = {};
        if (changed &&
            view &&
            view['$b'] > 0 &&
            (tmpl = view['$e'])) {
            delete Body_RangeEvents[selfId];
            delete Body_RangeVframes[selfId];
            console.time('[updater time:' + selfId + ']');
            vdom = TO_VDOM(tmpl(data, selfId));
            V_SetChildNodes(node, updater['$d'], vdom, ref, vf, keys);
            updater['$d'] = vdom;
            for (var _i = 0, _a = ref.d; _i < _a.length; _i++) {
                vdom = _a[_i];
                vdom[0].id = vdom[1];
            }
            for (var _b = 0, _c = ref.v; _b < _c.length; _b++) {
                vdom = _c[_b];
                vdom['$d']();
            }
            if (ref.c || !view['$g']) {
                view.endUpdate(selfId);
            }
            if (ref.c) {
                G_Trigger(G_DOCUMENT, 'htmlchanged', {
                    vId: selfId
                });
            }
            console.timeEnd('[updater time:' + selfId + ']');
            redigest(1);
        }
        else {
            redigest();
        }
    };
    /**
     * 使用mx-keys进行局部刷新的类
     * @constructor
     * @name Updater
     * @class
     * @beta
     * @module updater
     * @param {String} viewId Magix.View对象Id
     */
    var Updater = function (viewId) {
        var me = this;
        me['$b'] = viewId;
        me['$c'] = 1;
        me['$a'] = (_a = {
                vId: viewId
            },
            _a[G_SPLITER] = 1,
            _a);
        me['$e'] = [];
        me['$k'] = {};
        var _a;
    };
    G_Assign(Updater[G_PROTOTYPE], {
        /**
         * @lends Updater#
         */
        /**
         * 获取放入的数据
         * @param  {String} [key] key
         * @return {Object} 返回对应的数据，当key未传递时，返回整个数据对象
         * @example
         * render: function() {
         *     this.updater.set({
         *         a: 10,
         *         b: 20
         *     });
         * },
         * 'read&lt;click&gt;': function() {
         *     console.log(this.updater.get('a'));
         * }
         */
        get: function (key, result) {
            result = this['$a'];
            if (key) {
                result = result[key];
            }
            return result;
        },
        /**
         * 通过path获取值
         * @param  {String} path 点分割的路径
         * @return {Object}
         */
        /*gain: function (path) {
            let result = this.$d;
            let ps = path.split('.'),
                temp;
            while (result && ps.length) {
                temp = ps.shift();
                result = result[temp];
            }
            return result;
        },*/
        /**
         * 获取放入的数据
         * @param  {Object} obj 待放入的数据
         * @return {Updater} 返回updater
         * @example
         * render: function() {
         *     this.updater.set({
         *         a: 10,
         *         b: 20
         *     });
         * },
         * 'read&lt;click&gt;': function() {
         *     console.log(this.updater.get('a'));
         * }
         */
        set: function (obj) {
            var me = this;
            me['$c'] = G_Set(obj, me['$a'], me['$k']) || me['$c'];
            return me;
        },
        /**
         * 检测数据变化，更新界面，放入数据后需要显式调用该方法才可以把数据更新到界面
         * @example
         * render: function() {
         *     this.updater.set({
         *         a: 10,
         *         b: 20
         *     }).digest();
         * }
         */
        digest: function (data, resolve) {
            var me = this.set(data), digesting = me['$e'];
            /*
                view:
                <div>
                    <mx-dropdown mx-focusout="rerender()"/>
                <div>
    
                view.digest=>dropdown.focusout=>view.redigest=>view.redigest.end=>view.digest.end
    
                view.digest中嵌套了view.redigest，view.redigest可能操作了view.digest中引用的dom,这样会导致view.redigest.end后续的view.digest中出错
    
                expect
                view.digest=>dropdown.focusout=>view.digest.end=>view.redigest=>view.redigest.end
    
                如果在digest的过程中，多次调用自身的digest，则后续的进行排队。前面的执行完成后，排队中的一次执行完毕
            */
            digesting.push(resolve);
            if (!digesting.i) {
                Updater_Digest(me, digesting);
            }
            else if (DEBUG) {
                console.warn('Avoid redigest while updater is digesting');
            }
        },
        /**
         * 获取当前数据状态的快照，配合altered方法可获得数据是否有变化
         * @return {Updater} 返回updater
         * @example
         * render: function() {
         *     this.updater.set({
         *         a: 20,
         *         b: 30
         *     }).digest().snapshot(); //更新完界面后保存快照
         * },
         * 'save&lt;click&gt;': function() {
         *     //save to server
         *     console.log(this.updater.altered()); //false
         *     this.updater.set({
         *         a: 20,
         *         b: 40
         *     });
         *     console.log(this.updater.altered()); //true
         *     this.updater.snapshot(); //再保存一次快照
         *     console.log(this.updater.altered()); //false
         * }
         */
        snapshot: function () {
            var me = this;
            me['$f'] = JSONStringify(me['$a']);
            return me;
        },
        /**
         * 检测数据是否有变动
         * @return {Boolean} 是否变动
         * @example
         * render: function() {
         *     this.updater.set({
         *         a: 20,
         *         b: 30
         *     }).digest().snapshot(); //更新完界面后保存快照
         * },
         * 'save&lt;click&gt;': function() {
         *     //save to server
         *     console.log(this.updater.altered()); //false
         *     this.updater.set({
         *         a: 20,
         *         b: 40
         *     });
         *     console.log(this.updater.altered()); //true
         *     this.updater.snapshot(); //再保存一次快照
         *     console.log(this.updater.altered()); //false
         * }
         */
        altered: function () {
            var me = this;
            if (me['$f']) {
                return me['$f'] != JSONStringify(me['$a']);
            }
        },
        /**
         * 翻译带@占位符的数据
         * @param {string} origin 源字符串
         */
        translate: function (data) {
            return G_TranslateData(this['$a'], data, 1);
        },
        /**
         * 翻译带@占位符的数据
         * @param {string} origin 源字符串
         */
        parse: function (origin) {
            return G_ParseExpr(origin, this['$a']);
        }
    });
    var View_EvtMethodReg = /^(\$?)([^<]*)<([^>]+)>$/;
    //let View_MxEvt = /\smx-(?!view|vframe)[a-z]+\s*=\s*"/g;
    var View_WrapMethod = function (prop, fName, short, fn, me) {
        fn = prop[fName];
        prop[fName] = prop[short] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            me = this;
            if (me['$b'] > 0) { //signature
                me['$b']++;
                me.fire('rendercall');
                G_ToTry(fn, args, me);
            }
        };
    };
    var View_DelegateEvents = function (me, destroy) {
        var e, eo = me["$eo"], so = me["$so"], el = me["$el"], id = me.id; //eventsObject
        for (e in eo) {
            Body_DOMEventBind(e, so[e], destroy);
        }
        for (var _i = 0, el_1 = el; _i < el_1.length; _i++) {
            e = el_1[_i];
            G_DOMEventLibBind(e.e, e.n, G_DOMGlobalProcessor, destroy, {
                i: id,
                v: me,
                f: e.f,
                e: e.e
            });
        }
    };
    var View_Globals = {
        win: G_WINDOW,
        doc: G_DOCUMENT
    };
    /**
     * 预处理view
     * @param  {View} oView view子类
     * @param  {Vom} vom vom
     */
    var View_Prepare = function (oView) {
        if (!oView[G_SPLITER]) { //只处理一次
            oView[G_SPLITER] = 1;
            var prop = oView[G_PROTOTYPE], currentFn = void 0, matches = void 0, selectorOrCallback = void 0, events = void 0, eventsObject = {}, eventsList = [], selectorObject = {}, node = void 0, isSelector = void 0, p = void 0, item = void 0, mask = void 0;
            for (p in prop) {
                currentFn = prop[p];
                matches = p.match(View_EvtMethodReg);
                if (matches) {
                    isSelector = matches[1], selectorOrCallback = matches[2], events = matches[3];
                    events = events.split(G_COMMA);
                    for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                        item = events_1[_i];
                        node = View_Globals[selectorOrCallback];
                        mask = 1;
                        if (isSelector) {
                            if (node) {
                                eventsList.push({
                                    f: currentFn,
                                    e: node,
                                    n: item
                                });
                                continue;
                            }
                            mask = 2;
                            node = selectorObject[item];
                            if (!node) {
                                node = selectorObject[item] = {};
                            }
                            node[selectorOrCallback] = 1;
                        }
                        eventsObject[item] = eventsObject[item] | mask;
                        item = selectorOrCallback + G_SPLITER + item;
                        node = prop[item];
                        if (!node) {
                            prop[item] = currentFn;
                        }
                    }
                }
            }
            //console.log(prop);
            View_WrapMethod(prop, 'render', '$d');
            prop['$eo'] = eventsObject;
            prop['$el'] = eventsList;
            prop['$so'] = selectorObject;
            prop['$e'] = prop.tmpl;
            prop['$f'] = prop.assign;
        }
    };
    /**
     * View类
     * @name View
     * @class
     * @constructor
     * @borrows Event.on as #on
     * @borrows Event.fire as #fire
     * @borrows Event.off as #off
     * @param {Object} ops 创建view时，需要附加到view对象上的其它属性
     * @property {String} id 当前view与页面vframe节点对应的id
     * @property {Vframe} owner 拥有当前view的vframe对象
     * @example
     * // 关于事件:
     * // html写法：
     *
     * //  &lt;input type="button" mx-click="test({id:100,name:'xinglie'})" value="test" /&gt;
     * //  &lt;a href="http://etao.com" mx-click="test({com:'etao.com'})"&gt;http://etao.com&lt;/a&gt;
     *
     * // js写法：
     *
     *     'test&lt;click&gt;':function(e){
     *          e.preventDefault();
     *          //e.current 处理事件的dom节点(即带有mx-click属性的节点)
     *          //e.target 触发事件的dom节点(即鼠标点中的节点，在current里包含其它节点时，current与target有可能不一样)
     *          //e.params  传递的参数
     *          //e.params.com,e.params.id,e.params.name
     *      },
     *      'test&lt;mousedown&gt;':function(e){
     *
     *       }
     *
     *  //上述示例对test方法标注了click与mousedown事件，也可以合写成：
     *  'test&lt;click,mousedown&gt;':function(e){
     *      alert(e.type);//可通过type识别是哪种事件类型
     *  }
     */
    var View = function (id, owner, ops, me) {
        me = this;
        me.owner = owner;
        me.id = id;
        me['$b'] = 1; //标识view是否刷新过，对于托管的函数资源，在回调这个函数时，不但要确保view没有销毁，而且要确保view没有刷新过，如果刷新过则不回调
        me.updater = me['$a'] = new Updater(me.id);
    };
    var ViewProto = View[G_PROTOTYPE];
    G_Assign(View, {
        /**
         * @lends View
         */
        /**
         * 扩展View
         * @param  {Object} props 扩展到原型上的方法
         * @example
         * define('app/tview',function(require){
         *     let Magix = require('magix');
         *     Magix.View.merge({
         *         ctor:function(){
         *             this.$attr='test';
         *         },
         *         test:function(){
         *             alert(this.$attr);
         *         }
         *     });
         * });
         * //加入Magix.config的exts中
         *
         *  Magix.config({
         *      //...
         *      exts:['app/tview']
         *
         *  });
         *
         * //这样完成后，所有的view对象都会有一个$attr属性和test方法
         * //当然上述功能也可以用继承实现，但继承层次太多时，可以考虑使用扩展来消除多层次的继承
         * //同时当项目进行中发现所有view要实现某个功能时，该方式比继承更快捷有效
         *
         *
         */
        /**
         * 继承
         * @param  {Object} [props] 原型链上的方法或属性对象
         * @param {Function} [props.ctor] 类似constructor，但不是constructor，当我们继承时，你无需显示调用上一层级的ctor方法，magix会自动帮你调用
         * @param {Array} [props.mixins] mix到当前原型链上的方法对象，该对象可以有一个ctor方法用于初始化
         * @param  {Object} [statics] 静态对象或方法
         * @example
         * let Magix = require('magix');
         * let Sortable = {
         *     ctor: function() {
         *         console.log('sortable ctor');
         *         //this==当前mix Sortable的view对象
         *         this.on('destroy', function() {
         *             console.log('dispose')
         *         });
         *     },
         *     sort: function() {
         *         console.log('sort');
         *     }
         * };
         * module.exports = Magix.View.extend({
         *     mixins: [Sortable],
         *     ctor: function() {
         *         console.log('view ctor');
         *     },
         *     render: function() {
         *         this.sort();
         *     }
         * });
         */
        extend: function (props, statics) {
            var me = this;
            props = props || {};
            var ctor = props.ctor;
            var NView = function (d, a, b) {
                me.call(this, d, a, b);
                if (ctor)
                    ctor.call(this, b);
            };
            NView.extend = me.extend;
            return G_Extend(NView, me, props, statics);
        }
    });
    G_Assign(ViewProto, MEvent, {
        /**
         * @lends View#
         */
        /*
         * 包装mx-event事件，比如把mx-click="test<prevent>({key:'field'})" 包装成 mx-click="magix_vf_root^test<prevent>({key:'field})"，以方便识别交由哪个view处理
         * @function
         * @param {String} html 处理的代码片断
         * @param {Boolean} [onlyAddPrefix] 是否只添加前缀
         * @return {String} 处理后的字符串
         * @example
         * View.extend({
         *     'del&lt;click&gt;':function(e){
         *         S.one(G_HashKey+e.currentId).remove();
         *     },
         *     'addNode&lt;click&gt;':function(e){
         *         let tmpl='&lt;div mx-click="del"&gt;delete&lt;/div&gt;';
         *         //因为tmpl中有mx-click，因此需要下面这行代码进行处理一次
         *         tmpl=this.wrapEvent(tmpl);
         *         S.one(G_HashKey+e.currentId).append(tmpl);
         *     }
         * });
         */
        /**
         * 通知当前view即将开始进行html的更新
         * @param {String} [id] 哪块区域需要更新，默认整个view
         */
        beginUpdate: function (id, me) {
            me = this;
            if (me['$b'] > 0 && me['$g']) {
                me.owner.unmountZone(id, 1);
                /*me.fire('prerender', {
                    id: id
                });*/
            }
        },
        /**
         * 通知当前view结束html的更新
         * @param {String} [id] 哪块区域结束更新，默认整个view
         */
        endUpdate: function (id, inner, me) {
            me = this;
            if (me['$b'] > 0) {
                id = id || me.id;
                /*me.fire('rendered', {
                    id
                });*/
                if (inner) {
                    f = inner;
                }
                else {
                    me['$g'] = 1;
                }
                me.owner.mountZone(id, inner);
            }
        },
        /**
         * 包装异步回调
         * @param  {Function} fn 异步回调的function
         * @return {Function}
         * @example
         * render:function(){
         *     setTimeout(this.wrapAsync(function(){
         *         //codes
         *     }),50000);
         * }
         * // 为什么要包装一次？
         * // 在单页应用的情况下，可能异步回调执行时，当前view已经被销毁。
         * // 比如上例中的setTimeout，50s后执行回调，如果你的回调中去操作了DOM，
         * // 则会出错，为了避免这种情况的出现，可以调用view的wrapAsync包装一次。
         * // (该示例中最好的做法是在view销毁时清除setTimeout，
         * // 但有时候你很难控制回调的执行，比如JSONP，所以最好包装一次)
         */
        wrapAsync: function (fn, context) {
            var me = this;
            var sign = me['$b'];
            return function () {
                var a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    a[_i] = arguments[_i];
                }
                if (sign > 0 && sign == me['$b']) {
                    return fn.apply(context || me, a);
                }
            };
        },
        /**
         * 设置view的html内容
         * @param {String} id 更新节点的id
         * @param {Strig} html html字符串
         * @example
         * render:function(){
         *     this.setHTML(this.id,this.tmpl);//渲染界面，当界面复杂时，请考虑用其它方案进行更新
         * }
         */
        /*
            Q:为什么删除setHTML?
            A:统一使用updater更新界面。
            关于api的分级，高层api更内聚，一个api完成很多功能。方便开发者，但不灵活。
            底层api职责更单一，一个api只完成一个功能，灵活，但不方便开发者
            更新界面来讲，updater是一个高层api，但是有些功能却无法完成，如把view当成壳子或容器渲染第三方的组件，组件什么时间加载完成、渲染、更新了dom、如何通知magix等，这些问题在updater中是无解的，而setHTML这个api又不够底层，同样也无法完成一些功能，所以这个api食之无味，故删除
         */
        /*setHTML(id, html) {
            let me = this,
                n, i = me.id;
            me.beginUpdate(id);
            if (me['$b'] > 0) {
                n = G_GetById(id);
                if (n) G_HTML(n, View_SetEventOwner(html, i), i);
            }
            me.endUpdate(id);
            me.fire('domready');
        }*/
        /**
         * 渲染view，供最终view开发者覆盖
         * @function
         */
        render: G_NOOP
        /**
         * 当前view的dom就绪后触发
         * @name View#domready
         * @event
         * @param {Object} e view 完成渲染后触发
         */
        /**
         * view销毁时触发
         * @name View#destroy
         * @event
         * @param {Object} e
         */
        /**
         * 异步更新ui的方法(render)被调用前触发
         * @name View#rendercall
         * @event
         * @param {Object} e
         */
    });
    Magix.View = View;
    Magix.trgger = G_Trigger;
    Magix["default"] = Magix;
    return Magix;
});

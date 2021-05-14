(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('@ngx-meta/core', ['exports', '@angular/core', 'rxjs', '@angular/platform-browser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ngx-meta'] = global['ngx-meta'] || {}, global['ngx-meta'].core = {}), global.ng.core, global.rxjs, global.ng.platformBrowser));
}(this, (function (exports, i0, rxjs, i2) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i2__namespace = /*#__PURE__*/_interopNamespace(i2);

    exports.PageTitlePositioning = void 0;
    (function (PageTitlePositioning) {
        /**
         * append page title after application name
         */
        PageTitlePositioning[PageTitlePositioning["AppendPageTitle"] = 0] = "AppendPageTitle";
        /**
         * prepend page title before application name
         */
        PageTitlePositioning[PageTitlePositioning["PrependPageTitle"] = 10] = "PrependPageTitle";
    })(exports.PageTitlePositioning || (exports.PageTitlePositioning = {}));

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var isPromise = function (obj) { return !!obj && typeof obj.then === 'function'; };
    var isObservable = function (obj) { return !!obj && typeof obj.subscribe === 'function'; };

    var MetaLoader = /** @class */ (function () {
        function MetaLoader() {
        }
        return MetaLoader;
    }());
    var MetaStaticLoader = /** @class */ (function () {
        function MetaStaticLoader(providedSettings) {
            if (providedSettings === void 0) { providedSettings = {
                pageTitlePositioning: exports.PageTitlePositioning.PrependPageTitle,
                defaults: {}
            }; }
            this.providedSettings = providedSettings;
        }
        Object.defineProperty(MetaStaticLoader.prototype, "settings", {
            get: function () {
                return this.providedSettings;
            },
            enumerable: false,
            configurable: true
        });
        return MetaStaticLoader;
    }());

    var MetaService = /** @class */ (function () {
        function MetaService(loader, title, meta) {
            this.loader = loader;
            this.title = title;
            this.meta = meta;
            this.settings = loader.settings;
            this.isMetaTagSet = {};
        }
        MetaService.prototype.setTitle = function (title, override) {
            var _this = this;
            if (override === void 0) { override = false; }
            var title$ = title ? this.callback(title) : rxjs.of('');
            title$.subscribe(function (res) {
                var _a;
                var fullTitle = '';
                if (!res) {
                    var defaultTitle$ = ((_a = _this.settings.defaults) === null || _a === void 0 ? void 0 : _a.title) ? _this.callback(_this.settings.defaults.title) : rxjs.of('');
                    defaultTitle$.subscribe(function (defaultTitle) {
                        if (!override && _this.settings.pageTitleSeparator && _this.settings.applicationName) {
                            _this.callback(_this.settings.applicationName).subscribe(function (applicationName) {
                                fullTitle = applicationName ? _this.getTitleWithPositioning(defaultTitle, applicationName) : defaultTitle;
                                _this.updateTitle(fullTitle);
                            });
                        }
                        else {
                            _this.updateTitle(defaultTitle);
                        }
                    });
                }
                else if (!override && _this.settings.pageTitleSeparator && _this.settings.applicationName) {
                    _this.callback(_this.settings.applicationName).subscribe(function (applicationName) {
                        fullTitle = applicationName ? _this.getTitleWithPositioning(res, applicationName) : res;
                        _this.updateTitle(fullTitle);
                    });
                }
                else {
                    _this.updateTitle(res);
                }
            });
        };
        MetaService.prototype.setTag = function (key, value) {
            var _this = this;
            var _a;
            if (key === 'title') {
                throw new Error("Attempt to set " + key + " through \"setTag\": \"title\" is a reserved tag name. " + 'Please use `MetaService.setTitle` instead.');
            }
            var cur = value || ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a[key]) || '';
            var value$ = key !== 'og:locale' && key !== 'og:locale:alternate' ? this.callback(cur) : rxjs.of(cur);
            value$.subscribe(function (res) {
                _this.updateTag(key, res);
            });
        };
        MetaService.prototype.update = function (currentUrl, metaSettings) {
            var _this = this;
            var _a;
            if (!metaSettings) {
                var fallbackTitle = ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a.title) || this.settings.applicationName || '';
                this.setTitle(fallbackTitle, true);
            }
            else {
                if (metaSettings.disabled) {
                    this.update(currentUrl);
                    return;
                }
                this.setTitle(metaSettings.title, metaSettings.override);
                Object.keys(metaSettings).forEach(function (key) {
                    var value = metaSettings[key];
                    if (key === 'title' || key === 'override') {
                        return;
                    }
                    else if (key === 'og:locale') {
                        value = value.replace(/-/g, '_');
                    }
                    else if (key === 'og:locale:alternate') {
                        var currentLocale = metaSettings['og:locale'];
                        _this.updateLocales(currentLocale, metaSettings[key]);
                        return;
                    }
                    _this.setTag(key, value);
                });
            }
            if (this.settings.defaults) {
                Object.entries(this.settings.defaults).forEach(function (_e) {
                    var _f = __read(_e, 2), key = _f[0], value = _f[1];
                    if ((metaSettings && (key in _this.isMetaTagSet || key in metaSettings)) || key === 'title' || key === 'override' || !value) {
                        return;
                    }
                    else if (key === 'og:locale') {
                        value = value.replace(/-/g, '_');
                    }
                    else if (key === 'og:locale:alternate') {
                        var currentLocale = metaSettings ? metaSettings['og:locale'] : undefined;
                        _this.updateLocales(currentLocale, value);
                        return;
                    }
                    _this.setTag(key, value);
                });
            }
            var baseUrl = this.settings.applicationUrl || '/';
            var url = ("" + baseUrl + currentUrl).replace(/(https?:\/\/)|(\/)+/g, '$1$2').replace(/\/$/g, '');
            this.setTag('og:url', url || '/');
        };
        MetaService.prototype.removeTag = function (key) {
            this.meta.removeTag(key);
        };
        MetaService.prototype.callback = function (value) {
            if (this.settings.callback) {
                var value$ = this.settings.callback(value);
                if (!isObservable(value$)) {
                    return isPromise(value$) ? rxjs.from(value$) : rxjs.of(value$);
                }
                return value$;
            }
            return rxjs.of(value);
        };
        MetaService.prototype.getTitleWithPositioning = function (title, applicationName) {
            switch (this.settings.pageTitlePositioning) {
                case exports.PageTitlePositioning.AppendPageTitle:
                    return applicationName + String(this.settings.pageTitleSeparator) + title;
                case exports.PageTitlePositioning.PrependPageTitle:
                    return title + String(this.settings.pageTitleSeparator) + applicationName;
                default:
                    return title;
            }
        };
        MetaService.prototype.updateTitle = function (title) {
            this.title.setTitle(title);
            this.meta.updateTag({
                property: 'og:title',
                content: title,
            });
        };
        MetaService.prototype.updateLocales = function (currentLocale, availableLocales) {
            var _this = this;
            var _a;
            var cur = currentLocale || ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a['og:locale']) || '';
            if (cur && this.settings.defaults) {
                this.settings.defaults['og:locale'] = cur.replace(/_/g, '-');
            }
            // TODO: set HTML lang attribute - https://github.com/ngx-meta/core/issues/32
            // const html = this.document.querySelector('html');
            // html.setAttribute('lang', cur);
            var elements = this.meta.getTags('property="og:locale:alternate"');
            elements.forEach(function (element) {
                _this.meta.removeTagElement(element);
            });
            if (cur && availableLocales) {
                availableLocales.split(',').forEach(function (locale) {
                    if (cur.replace(/-/g, '_') !== locale.replace(/-/g, '_')) {
                        _this.meta.addTag({
                            property: 'og:locale:alternate',
                            content: locale.replace(/-/g, '_'),
                        });
                    }
                });
            }
        };
        MetaService.prototype.updateTag = function (key, value) {
            var _a, _b, _c, _d;
            if (key.lastIndexOf('og:', 0) === 0) {
                this.meta.updateTag({
                    property: key,
                    content: key === 'og:locale' ? value.replace(/-/g, '_') : value,
                });
            }
            else {
                this.meta.updateTag({
                    name: key,
                    content: value,
                });
            }
            this.isMetaTagSet[key] = true;
            if (key === 'description') {
                this.meta.updateTag({
                    property: 'og:description',
                    content: value,
                });
            }
            else if (key === 'author') {
                this.meta.updateTag({
                    property: 'og:author',
                    content: value,
                });
            }
            else if (key === 'publisher') {
                this.meta.updateTag({
                    property: 'og:publisher',
                    content: value,
                });
            }
            else if (key === 'og:locale') {
                var availableLocales = (_b = (_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a['og:locale:alternate']) !== null && _b !== void 0 ? _b : '';
                this.updateLocales(value, availableLocales);
                this.isMetaTagSet['og:locale:alternate'] = true;
            }
            else if (key === 'og:locale:alternate') {
                var currentLocale = (_d = (_c = this.meta.getTag('property="og:locale"')) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : '';
                this.updateLocales(currentLocale, value);
                this.isMetaTagSet['og:locale'] = true;
            }
        };
        return MetaService;
    }());
    MetaService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaService, deps: [{ token: MetaLoader }, { token: i2__namespace.Title }, { token: i2__namespace.Meta }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    MetaService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaService });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaService, decorators: [{
                type: i0.Injectable
            }], ctorParameters: function () { return [{ type: MetaLoader }, { type: i2__namespace.Title }, { type: i2__namespace.Meta }]; } });

    var MetaGuard = /** @class */ (function () {
        function MetaGuard(meta) {
            this.meta = meta;
        }
        MetaGuard.prototype.canActivate = function (route, state) {
            var url = state.url;
            var metaSettings = route.hasOwnProperty('data') ? route.data.meta : undefined;
            this.meta.update(url, metaSettings);
            return true;
        };
        MetaGuard.prototype.canActivateChild = function (route, state) {
            return this.canActivate(route, state);
        };
        return MetaGuard;
    }());
    MetaGuard.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaGuard, deps: [{ token: MetaService }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    MetaGuard.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaGuard });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaGuard, decorators: [{
                type: i0.Injectable
            }], ctorParameters: function () { return [{ type: MetaService }]; } });

    var metaFactory = function () { return new MetaStaticLoader(); };
    var MetaModule = /** @class */ (function () {
        function MetaModule(parentModule) {
            if (parentModule) {
                throw new Error('MetaModule already loaded; import in root module only.');
            }
        }
        MetaModule.forRoot = function (configuredProvider) {
            if (configuredProvider === void 0) { configuredProvider = {
                provide: MetaLoader,
                useFactory: metaFactory
            }; }
            return {
                ngModule: MetaModule,
                providers: [configuredProvider, MetaGuard, MetaService]
            };
        };
        return MetaModule;
    }());
    MetaModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaModule, deps: [{ token: MetaModule, optional: true, skipSelf: true }], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    MetaModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaModule });
    MetaModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaModule });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0__namespace, type: MetaModule, decorators: [{
                type: i0.NgModule
            }], ctorParameters: function () {
            return [{ type: MetaModule, decorators: [{
                            type: i0.Optional
                        }, {
                            type: i0.SkipSelf
                        }] }];
        } });

    /*
     * Public API Surface of core
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MetaGuard = MetaGuard;
    exports.MetaLoader = MetaLoader;
    exports.MetaModule = MetaModule;
    exports.MetaService = MetaService;
    exports.MetaStaticLoader = MetaStaticLoader;
    exports.metaFactory = metaFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-meta-core.umd.js.map
